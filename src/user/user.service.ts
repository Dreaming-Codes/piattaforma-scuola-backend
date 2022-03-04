import { Injectable } from '@nestjs/common';
import {GoogleUserInterface} from "../google/googleUser.interface";
import {InjectModel} from "@nestjs/mongoose";
import {Role, User, UserDocument} from "./user.entity";
import {Model} from "mongoose";
import {Field, InputType} from "@nestjs/graphql";

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
    @Field()
    disorder: string;
}

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

    async importUsers(students: [StudentInfo]){
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
                disorder: student.disorder
            }
        }));

        await this.UserModel.bulkWrite(insertedUsers.map((user, index) => {
            return {
                classes: {
                    filter: {class: students[index].class, division: students[index].division},
                    update: {
                        push: {
                            students: user._id
                        }
                    }
                }
            }
        }));

        return true;
    }

    async processUser(user: GoogleUserInterface){
        const dbUser = await this.UserModel.findOne({email: user.email}).exec();

        return dbUser || await new this.UserModel(user).save();
    }
}
