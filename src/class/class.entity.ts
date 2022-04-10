import {Field, Int, ObjectType} from "@nestjs/graphql";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import {User} from "../user/user.entity";


@ObjectType()
class Teachers {
    @Field(() => [String])
    @Prop({required: true})
    subjects: string[];

    @Field(()=>[User])
    @Prop({type: [Types.ObjectId], required: true, index: true})
    teachers: Types.ObjectId[];

}

@ObjectType()
@Schema({})
export class Class {
    @Field(()=>String)
    _id: Types.ObjectId;

    @Field(()=>Int)
    @Prop({required: true})
    class: number;

    @Field(()=>String)
    @Prop({required: true})
    division: string;

    @Field(()=>[User])
    @Prop({type: [Types.ObjectId], ref: User.name})
    students: User[];

    @Field(()=>[Teachers])
    @Prop()
    teachers: Teachers[];
}

export type ClassDocument = Class & Document;
export const ClassSchema = SchemaFactory.createForClass(Class);

//TODO: Handle locale from envs
//strength is needed for case insensitive index
ClassSchema.index({class: 1, division: 1}, {unique: true, collation: {locale: "it", strength: 1}});
