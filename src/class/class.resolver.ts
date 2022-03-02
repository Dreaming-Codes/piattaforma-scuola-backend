import {Args, Mutation, Resolver} from '@nestjs/graphql';
import {ClassService, dataTimetable} from "./class.service";



@Resolver()
export class ClassResolver {
    constructor(private readonly classService: ClassService) {
    }

    @Mutation(()=>Boolean)
    importTimetable(@Args('data', {type: ()=> dataTimetable}) data) {
        return this.classService.importTimetable(data);
    }
}
