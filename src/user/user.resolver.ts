import {Args, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {StudentInfo, UserData, UserList, UserService} from "./user.service";

@Resolver()
export class UserResolver {
    private studentsNumber;

    constructor(private readonly userService: UserService) {
    }

    @Mutation(() => Boolean)
    //Should trigger subscriptions
    async importStudents(@Args('students', {type: () => [StudentInfo]}) students: [StudentInfo]) {
        console.log(await this.userService.getUsersByName(20, 0, "MARIO1 ROSSI1"))
        return true;

        return Boolean(await this.userService.importStudents(students));
    }

    @Query(() => [UserData])
    async getUsersByName(@Args("limit", {type: () => Int, defaultValue: 10}) limit: number,
                            @Args("from", {type: () => Int, nullable: true, defaultValue: 0}) from: number,
                            @Args("nameSearch", {nullable: true}) nameSearch: string,) {
        if (limit > 20) {
            limit = 20;
        }

        return await this.userService.getUsersByName(limit, from, nameSearch);
    }

}
