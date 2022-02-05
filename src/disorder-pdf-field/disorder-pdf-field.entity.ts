import {Field, ObjectType} from "@nestjs/graphql";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";


enum FieldType {
    boolean = "boolean",
    string = "string",
    number = "number",
    date = "date",
    gps = "gps",
    multipleChoice = "multipleChoice",
    singleChoice = "singleChoice",
    signature = "signature",
}


@ObjectType()
@Schema()
export class DisorderPdfField {
    @Field(()=>String)
    _id: Types.ObjectId;

    @Field(()=>String)
    @Prop({required: true})
    name: string;

    @Field(()=>String)
    @Prop({required: true})
    description: string;
}

export type DisorderPdfFieldDocument = DisorderPdfField & Document;
export const DisorderPdfFieldSchema = SchemaFactory.createForClass(DisorderPdfField);
