import {Prop, Schema, SchemaFactory}  from "@nestjs/mongoose";
import {Field, ObjectType, registerEnumType} from "@nestjs/graphql";
import {Document, Types} from "mongoose";

enum Roles {
    Admin = 'Admin',
    Headmaster = 'Headmaster',
    Secretariat = 'Secretariat',
    Teacher = "Teacher",
    Student = "Student"
}

registerEnumType(Roles, {
    name: 'Roles',
    description: 'Roles of the user',
});

@ObjectType()
@Schema()
export class User {
    @Field(()=>String)
    _id: Types.ObjectId;

    @Field(()=>String)
    @Prop({required: true})
    name: string;

    @Field(()=>String)
    @Prop()
    avatar: string;

    @Field(()=>String, {defaultValue: Roles.Student, nullable: true})
    @Prop({required: true, default: Roles.Student})
    role: string;

    @Field(()=>String)
    @Prop({unique: true, required: true})
    email: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
