import { Injectable } from '@nestjs/common';
import {GoogleUserInterface} from "../google/googleUser.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Role, User, UserDocument} from "./user.entity";
import {Model} from "mongoose";
import {Field, InputType} from "@nestjs/graphql";
import {ClassService, Teacher} from "../class/class.service";

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

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>, private ClassService: ClassService) {}

    async importStudents(students: [StudentInfo]){
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

        return true;
    }

    importTeachers(teachers: Teacher[]){
        return this.UserModel.insertMany(teachers.map(teacher => {
            return {
                name: teacher.name,
                surname: teacher.surname,
                role: Role.Teacher
            }
        }));
    }

    async processUser(user: GoogleUserInterface){
        const dbUser = await this.UserModel.findOne({email: user.email}).exec();

        return dbUser || await new this.UserModel(user).save();
    }
}
