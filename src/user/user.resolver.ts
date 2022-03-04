import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {StudentInfo, UserService} from "./user.service";

@Resolver()
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Mutation(()=>Boolean)
    importStudents(@Args('students', {type: () => [StudentInfo]}) students: [StudentInfo]) {
        return this.userService.importUsers(students);
    }
}
