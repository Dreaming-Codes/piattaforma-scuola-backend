import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, Types} from "mongoose";
import {User, UserDocument} from "./user.entity";
import {CreateUserInput} from "./user-inputs.dto";
import { JwtService } from '@nestjs/jwt';
import {GraphQLError } from "graphql";

@Injectable()
export class UserService {
    constructor(
        private jwtService: JwtService,
        @InjectModel(User.name) private UserModel: Model<UserDocument>
    ) {}

    async createUser(createUserInput: CreateUserInput) {
        try {
            const isUser = await this.UserModel.findOne({email: createUserInput.email});

            if(isUser){
                return new GraphQLError('User already exists');
            }else{
                return await new this.UserModel(createUserInput).save()
            }
        } catch (err) {
            console.log(err)
        }
    }

    async login(email: string, password: string) {
        try {
            const user = await this.UserModel.findOne({email: email});

            if(user){
                if(user.password === password) {
                    return await this.jwtService.signAsync({email: user.email, id: user._id});
                }else{
                    return new GraphQLError('Invalid password');
                }
            }else{
                return new GraphQLError('User does not exist');
            }
        } catch (err) {
            console.log(err)
        }
    }

    async findAllUsers() {
        try {
            return await this.UserModel.find().exec();
        } catch (err) {
            console.log(err)
        }
    }
}
