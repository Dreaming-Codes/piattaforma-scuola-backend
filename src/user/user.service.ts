import { Injectable } from '@nestjs/common';
import {GoogleUserInterface} from "../google/googleUser.interface";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./user.entity";
import {Model} from "mongoose";

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

    async processUser(user: GoogleUserInterface){
        const dbUser = await this.UserModel.findOne({email: user.email}).exec();

        return dbUser || await new this.UserModel(user).save();
    }
}
