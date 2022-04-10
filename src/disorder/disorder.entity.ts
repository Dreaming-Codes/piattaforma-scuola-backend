import {Field, InputType, ObjectType, OmitType} from "@nestjs/graphql";
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
export class field {
    @Field(()=>String)
    _id: Types.ObjectId;

    @Field(()=>String)
    type: string;

    @Field(()=>Boolean)
    availableToRepresentative: boolean;
}

@InputType()
export class InputField extends OmitType(field, ["_id"], InputType) {}


@ObjectType()
@Schema()
export class Disorder {
    @Field(()=>String, {nullable: true})
    _id: Types.ObjectId;

    @Field(()=>String)
    @Prop({required: true, unique: true})
    name: string;

    @Field(()=>String)
    @Prop({required: true})
    description: string;

    @Prop({required: false})
    pdf: Buffer;

    @Field(()=>[field])
    @Prop({required: true})
    fields: field[]
}

@InputType()
export class InputDisorder extends OmitType(Disorder, ["fields", "_id"], InputType) {
    @Field(()=>[InputField])
    fields: field[]
}

export type DisorderDocument = Disorder & Document;
export const DisorderSchema = SchemaFactory.createForClass(Disorder);
