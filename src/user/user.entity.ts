import {Prop, Schema, SchemaFactory}  from "@nestjs/mongoose";
import {Field, ObjectType, registerEnumType} from "@nestjs/graphql";
import {Document, Types} from "mongoose";

export enum Role {
    Admin = 'Admin',
    Headmaster = 'Headmaster',
    Secretariat = 'Secretariat',
    Teacher = "Teacher",
    Student = "Student"
}

registerEnumType(Role, {
    name: 'Roles',
    description: 'Roles of the user',
});

@ObjectType()
@Schema({
    autoIndex: true,
})
export class User {
    @Field(()=>String)
    _id: Types.ObjectId;

    @Field(()=>String)
    @Prop({required: true, es_indexed: true})
    name: string;

    @Field(()=>String)
    @Prop({required: true, es_indexed: true})
    surname: string;

    //TODO: add validation on name and surname
    @Field(()=>String, {nullable: true})
    @Prop({es_indexed: false})
    fiscalCode: string;

    @Field(()=>String)
    @Prop({es_indexed: false})
    avatar: string;

    @Field(()=>String, {defaultValue: Role.Student, nullable: true})
    @Prop({required: true, default: Role.Student, index: true, es_indexed: false})
    role: string;

    @Field(()=>String)
    @Prop({unique: false, required: false, es_indexed: false})
    email: string;

    @Field(()=>Boolean)
    @Prop({required: true, default: false, es_indexed: false})
    manual: boolean;

    @Field(()=>[String], {defaultValue: []})
    @Prop({default: [], es_indexed: false})
    disorders: string[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

//This is mandatory for permitting import after and then login with email
//TODO: Handle locale from envs
//strength is needed for case insensitive index
UserSchema.index({name: 1, surname: 1}, {unique: true, collation: {locale: "it", strength: 1}});
UserSchema.index({email: 1}, {unique:true, sparse: true, collation: {locale: "it", strength: 1}});
