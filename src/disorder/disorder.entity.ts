import {Field, ObjectType} from "@nestjs/graphql";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";

@ObjectType()
@Schema()
export class Disorder {
    @Field(()=>String)
    _id: Types.ObjectId;

    @Field(()=>String)
    @Prop({required: true})
    name: string;

    @Field(()=>String)
    @Prop({required: true})
    description: string;

    @Field(()=>Types.Buffer)
    @Prop({required: true})
    pdf: Types.Buffer;

}

export type DisorderDocument = Disorder & Document;
export const DisorderSchema = SchemaFactory.createForClass(Disorder);
