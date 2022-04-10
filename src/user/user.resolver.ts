import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {StudentInfo, UserData, UserList, UserService} from "./user.service";
import {Types} from "mongoose";
import {UseGuards, Request} from "@nestjs/common";
import {JwtGuard} from "../google/jwt.guard";
import {JwtGraphqlGuard} from "../google/jwt.graphql.guard";
import {CurrentUser} from "../google/jwt.decorator";
import {User} from "./user.entity";
import {GraphQLError} from "graphql";

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) {
    }

    @Mutation(() => Boolean)
    async importStudents(@Args('students', {type: () => [StudentInfo]}) students: [StudentInfo]) {
        return Boolean(await this.userService.importStudents(students));
    }

    @Query(() => UserList)
    async getUsersByName(@Args("limit", {type: () => Int, defaultValue: 10}) limit: number,
                            @Args("from", {type: () => Int, defaultValue: 0}) from: number,
                            @Args("nameSearch", {defaultValue: ""}) nameSearch: string) {
        if (limit > 20) {
            limit = 20;
        }
        return await this.userService.getUsersByName(limit, from, nameSearch);
    }

    @Query(() => [UserData])
    //TODO: Use teacher guard instead of generic one
    @UseGuards(JwtGraphqlGuard)
    async getMyStudents(@CurrentUser() user: any) {
        return await this.userService.getStudentsByTeacherId(new Types.ObjectId(user._id))
    }

    @Query(() => User)
    // TODO: Use teacher guard instead of generic one;
    @UseGuards(JwtGraphqlGuard)
    async getStudent(@CurrentUser() user: any, @Args("id", {type: () => String}) id: string) {
        const student =  await this.userService.getStudentById(new Types.ObjectId(id));
        if(student.class.teachers.map(t => t.teachers).flat().find(t => t.toString() === user._id)) {
            return student;
        }else{
            return new GraphQLError("You are not authorized to view this student");
        }

    }

}
