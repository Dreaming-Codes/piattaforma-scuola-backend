import {forwardRef, Inject, Injectable} from '@nestjs/common';
import {Field, InputType} from "@nestjs/graphql";
import {InjectModel} from "@nestjs/mongoose";
import {UserDocument} from "../user/user.entity";
import {Model, Types} from "mongoose";
import {Class, ClassDocument} from "./class.entity";
import {StudentInfo, UserService} from "../user/user.service";

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
export class ClassInput {
    @Field()
    class: number;
    @Field()
    division: string;
    @Field(() => [classTeacher])
    teachers: classTeacher[];
}

@InputType()
export class dataTimetable {
    @Field(() => [ClassInput])
    classes: ClassInput[]
    @Field(() => [Teacher])
    teachers: Teacher[]
}


@Injectable()
export class ClassService {
    constructor(@InjectModel(Class.name) private ClassModel: Model<ClassDocument>, @Inject(forwardRef(()=>UserService))private UserService: UserService) {}

    removeUsers(id: Types.ObjectId[]) {
        return Promise.all([
            this.ClassModel.updateMany({students: {$in: id}}, {$pull: {students: {$in: id}}}, {multi: true}),
            this.ClassModel.updateMany({teachers: {$in: id}}, {$pull: {teachers: {$in: id}}}, {multi: true})
        ])
    }

    async setClassesForNewUsers(newUsers: (UserDocument & {_id: any})[], studentsInfo: [StudentInfo]){
        const bulkOperator = this.ClassModel.collection.initializeUnorderedBulkOp();
        newUsers.forEach((user, index) => {
            bulkOperator.find({class: studentsInfo[index].class, division: studentsInfo[index].division}).updateOne({$push: {students: user._id}});
        });

        await bulkOperator.execute();
    }

    getClass(id: Types.ObjectId) {
        return this.ClassModel.findById(id);
    }

    async importTimetable({classes, teachers}: dataTimetable): Promise<boolean> {

        try {
            const insertedTeachers = await this.UserService.importTeachers(teachers);

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
