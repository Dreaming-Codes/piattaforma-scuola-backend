import { Injectable } from '@nestjs/common';
import {GoogleUserInterface} from "../google/googleUser.interface";
import {InjectModel, Prop} from "@nestjs/mongoose";
import {Role, User, UserDocument} from "./user.entity";
import {Model, Types} from "mongoose";
import {Field, InputType, Int, ObjectType, OmitType} from "@nestjs/graphql";
import {ClassService, Teacher} from "../class/class.service";
import {Class} from "../class/class.entity";

@InputType()
export class StudentInfo {
    @Field()
    division: string;
    @Field()
    class: number;
    @Field()
    name: string;
    @Field()
    surname: string;
    @Field()
    fiscalCode: string;
    @Field(() => [String])
    disorders: [string];
}

@ObjectType()
export class StudentData {
    @Field(()=>String)
    _id: Types.ObjectId;

    @Field(()=>String)
    name: string;

    @Field(()=>String)
    surname: string;

    @Field(()=>String, {nullable: true})
    fiscalCode: string;

    @Field(()=>String, {nullable: true})
    avatar: string;

    @Field(()=>Boolean)
    manual: boolean;

    @Field(()=>[String])
    disorders: string[];

    @Field(()=>Int, {nullable: true})
    class: number;

    @Field(()=>String, {nullable: true})
    division: string;
}

@ObjectType()
export class StudentsList {
    @Field(()=>Int)
    count: number;
    @Field(()=>[StudentData])
    students: StudentData[];
}

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>, private ClassService: ClassService) {}

    studentsCount(){
        return this.UserModel.countDocuments({role: Role.Student}).exec();
    }

    async getStudents(limit: number, sortBy: string, sortType: number): Promise<StudentsList>{
        return await this.UserModel.aggregate([
            {
                $match: {}
            }, {
                $lookup: {
                    from: Class.name,
                    localField: '_id',
                    foreignField: 'students',
                    as: 'classArray'
                }
            }, {
                $addFields: {
                    class: {
                        $first: '$classArray.class'
                    },
                    division: {
                        $first: '$classArray.division'
                    }
                }
            }, {
                $match: {
                    class: 3,
                    division: 'CIA'
                }
            }, {
                $project: {
                    _id: 1,
                    disorders: 1,
                    manual: 1,
                    surname: 1,
                    name: 1,
                    avatar: 1,
                    class: 1,
                    division: 1,
                    fiscalCode: 1
                }
            }, {
                $sort: {
                    name: 1
                }
            }, {
                $facet: {
                    count: [
                        {
                            $count: 'count'
                        }
                    ],
                    data: [
                        {
                            $limit: 10
                        }
                    ]
                }
            }, {
                $addFields: {
                    count: {
                        $first: '$count.count'
                    }
                }
            }
        ]).exec()[0];
    }

    async importStudents(students: [StudentInfo]){
        try{
            await this.UserModel.deleteMany({role: Role.Student, manual: false}).exec();
            const insertedUsers = await this.UserModel.insertMany(students.map(student => {
                return {
                    role: Role.Student,
                    manual: false,
                    class: student.class,
                    division: student.division,
                    name: student.name,
                    surname: student.surname,
                    fiscalCode: student.fiscalCode,
                    disorders: student.disorders
                }
            }));

            await this.ClassService.setClassesForNewUsers(insertedUsers, students);
            return insertedUsers;
        }catch (e) {
            console.error(e);
            return false;
        }
    }

    async importTeachers(teachers: Teacher[]){
        await this.UserModel.deleteMany({role: Role.Teacher, manual: false}).exec();
        return await this.UserModel.insertMany(teachers.map(teacher => {
            return {
                name: teacher.name,
                surname: teacher.surname,
                role: Role.Teacher
            }
        }));
    }

    async processUser(user: GoogleUserInterface){
        const dbUser = await this.UserModel.findOne({name: user.name, surname: user.surname}, {}, {collation: {locale: "it", strength: 1}}).exec();
        if(dbUser.email && dbUser.email !== user.email){
            throw new Error("Email non corrispondente");
        }else if(!dbUser.email){
            dbUser.email = user.email;
            dbUser.avatar = user.avatar;
            await dbUser.save();
        }else if(dbUser.avatar !== user.avatar){
            dbUser.avatar = user.avatar;
            await dbUser.save();
        }

        return dbUser || await new this.UserModel(user).save();
    }
}
