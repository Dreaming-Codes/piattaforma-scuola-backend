import {Field, ObjectType} from "@nestjs/graphql";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import {User} from "../user/user.entity";


@ObjectType()
class Teacher {
    @Field(()=>User)
    user: User;

    @Field(()=>[String])
    teachedSubjects: [string];
}

@ObjectType()
@Schema()
export class Class {
    @Field(()=>String)
    _id: Types.ObjectId;

    @Field(()=>Number)
    @Prop({required: true})
    class: number;

    @Field(()=>String)
    @Prop({required: true})
    division: string;

    @Field(()=>[User])
    @Prop({type: [Types.ObjectId], ref: User.name})
    students: User[];

    @Field(()=>[User])
    @Prop({type: [Types.ObjectId], ref: User.name})
    teachers: Teacher[];

    @Field(()=>User)
    @Prop({type: Types.ObjectId, ref: User.name})
    coordinator: User;

}

export type ClassDocument = Class & Document;
export const ClassSchema = SchemaFactory.createForClass(Class);
