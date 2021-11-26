import {Field, InputType, ObjectType, registerEnumType} from "@nestjs/graphql";

@InputType()
export class CreateUserInput {
    @Field()
    email: string;

    @Field()
    password: string;
}
