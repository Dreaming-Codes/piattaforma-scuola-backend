import {Injectable} from '@nestjs/common';
import {Field, InputType} from "@nestjs/graphql";
import {InjectModel} from "@nestjs/mongoose";
import {Role, User, UserDocument} from "../user/user.entity";
import {Model} from "mongoose";
import {ClassDocument} from "./class.entity";

//TODO: RENDER CONDIVISI CON FRONTEND #1

@InputType()
export class Teacher {
    @Field()
    name: string;
    @Field()
    surname: string;
}

@InputType()
export class classTeacher {
    @Field(() => [Number])
    id: number[]
    @Field(() => [String])
    subjects: string[]
}

@InputType()
export class Class {
    @Field()
    class: number;
    @Field()
    division: string;
    @Field(() => [classTeacher])
    teachers: classTeacher[];
}

@InputType()
export class dataTimetable {
    @Field(() => [Class])
    classes: Class[]
    @Field(() => [Teacher])
    teachers: Teacher[]
}


@Injectable()
export class ClassService {
    constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>,
                @InjectModel(Class.name) private ClassModel: Model<ClassDocument>) {
    }

    async importTimetable({classes, teachers}: dataTimetable): Promise<boolean> {
        try {
            await this.UserModel.deleteMany({role: 'teacher', manual: false}).exec();
            const insertedTeachers = await this.UserModel.insertMany(teachers.map(teacher => {
                return {
                    name: teacher.name,
                    surname: teacher.surname,
                    role: Role.Teacher
                }
            }));

            await this.ClassModel.deleteMany({}).exec();
            await this.ClassModel.insertMany(classes.map(classe => {
                const teachers = [];
                classe.teachers.forEach(teacher => {
                    const teachersId = [];
                    teacher.id.forEach(id => {
                        teachersId.push(insertedTeachers[id]._id);
                    });
                    teachers.push({
                        subjects: teacher.subjects,
                        teachers: teachersId
                    })
                });

                return {
                    class: classe.class,
                    division: classe.division,
                    teachers: teachers
                }
            }));

            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}
