import {Field, InputType, ObjectType} from "@nestjs/graphql";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";

@ObjectType()
export class DisorderData {
    @Field(()=>String)
    _id: Types.ObjectId;

    @Field(()=>String)
    name: string;

    @Field(()=>String)
    description: string;
}

@ObjectType()
@Schema()
@InputType()
export class Disorder {
    @Field(()=>String, {nullable: true})
    _id: Types.ObjectId;

    @Field(()=>String)
    @Prop({required: true, unique: true})
    name: string;

    @Field(()=>String)
    @Prop({required: true})
    description: string;

    //TODO: replace base64 with something else
    @Field(()=>String, {nullable: true})
    @Prop({required: false})
    pdf: Types.Buffer;

}

export type DisorderDocument = Disorder & Document;
export const DisorderSchema = SchemaFactory.createForClass(Disorder);
