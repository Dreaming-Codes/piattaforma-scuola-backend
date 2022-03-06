import {Field, ObjectType} from "@nestjs/graphql";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import {User} from "../user/user.entity";


@ObjectType()
class Teacher {
    @Field(()=>User)
    @Prop({ref: User.name, type: [Types.ObjectId]})
    user: User[];

    @Field(()=>[String])
    taughtSubjects: [string];

    @Field(()=>Boolean, {defaultValue: false})
    isCoordinator: boolean;
}

@ObjectType()
@Schema({
    autoIndex: true,
})
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
    @Prop()
    teachers: Teacher[];
}

export type ClassDocument = Class & Document;
export const ClassSchema = SchemaFactory.createForClass(Class);

//TODO: Handle locale from envs
//strength is needed for case insensitive index
ClassSchema.index({class: 1, division: 1}, {unique: true, collation: {locale: "it", strength: 1}});
