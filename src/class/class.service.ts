import {Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {ArgsType, Field, InputType} from "@nestjs/graphql";

//TODO: RENDER CONDIVISI CON FRONTEND #1

@InputType()
export class Teacher {
    @Field()
    name: string;
    @Field()
    surname: string;
}

@InputType()
export class classTeacher{
    @Field(()=>[Number])
    id: number[]
    @Field(()=>[String])
    subjects: string[]
}

@InputType()
export class Class {
    @Field()
    division: number;
    @Field()
    section: string;
    @Field(() => [classTeacher])
    teachers: classTeacher[];
}

@InputType()
export class dataTimetable {
    @Field(()=>[Class])
    classes: Class[]
    @Field(()=>[Teacher])
    teachers: Teacher[]
}

@Injectable()
export class ClassService {
    constructor(private readonly userService: UserService) {
    }

    importTimetable({classes, teachers}: dataTimetable): Promise<boolean> {
        console.log(classes, teachers)
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }
}
