import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {ClassService, dataTimetable} from "./class.service";



@Resolver()
export class ClassResolver {
    constructor(private readonly classService: ClassService) {
    }

    @Mutation(()=>Boolean)
    async importTimetable(@Args('data', {type: ()=> dataTimetable}) data) {
        return await this.classService.importTimetable(data);
    }
}
