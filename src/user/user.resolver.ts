import {Args, Int, Mutation, Query, Resolver, Subscription} from '@nestjs/graphql';
import {StudentInfo, UserService} from "./user.service";
import {PubSub} from "graphql-subscriptions";
import {User} from "./user.entity";
import {strict} from "assert";

@Resolver()
export class UserResolver {
    private pubSub: PubSub;
    private studentsNumber;

    constructor(private readonly userService: UserService) {
        this.pubSub = new PubSub();
    }

    @Mutation(()=>Boolean)
    //Should trigger subscriptions
    async importStudents(@Args('students', {type: () => [StudentInfo]}) students: [StudentInfo]) {
        const importStudents = await this.userService.importStudents(students);

        if(importStudents){
            const newStudentsCount = await this.userService.studentsCount();
            if(this.studentsNumber !== newStudentsCount){
                this.studentsNumber = newStudentsCount;
                this.pubSub.publish('studentsCount', {studentsCount: this.studentsNumber});
            }
        }

        return Boolean(importStudents);
    }

    @Query(()=>[User])
    async getStudents(@Args("limit", {type: () => Int}) limit: number, @Args("sortBy") sortBy: string, @Args("sortType") sortType: number){
        if(limit > 30){
            limit = 30;
        }
        return await this.userService.getStudents(limit, sortBy, sortType);
    }

    @Query(()=> Int)
    async getStudentsCount() {
        if(!this.studentsNumber){
            this.studentsNumber = await this.userService.studentsCount();
        }
        return this.studentsNumber;
    }

    @Subscription(() => Int)
    studentsCount() {
        return this.pubSub.asyncIterator('studentsCount');
    }
}
