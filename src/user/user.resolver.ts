import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {User} from "./user.entity";
import {UserService} from "./user.service";
import {CreateUserInput} from "./user-inputs.dto";

@Resolver(() => User)
export class UserResolver {
    constructor(private readonly userService: UserService) {
    }

    @Mutation(() => User)
    async createUser(
        @Args('createUserInput') createUserInput: CreateUserInput
    ) {
        try {
            return await this.userService.createUser(createUserInput);
        } catch (err) {
            console.error(err);
        }
    }

    @Mutation(() => String)
    async login(
        @Args('email') email: string,
        @Args('password') password: string,
    ) {
        try {
            return await this.userService.login(email, password);
        } catch (err) {
            console.error(err);
        }
    }

    @Query(()=> [User])
    async findAllUsers() {
        try {
            return await this.userService.findAllUsers();
        } catch (err) {
            console.error(err);
        }
    }
}
