import { Field, InputType } from "type-graphql";

//input object for register/login
@InputType()
export class UsernamePasswordInput {
    @Field()
    email: string;

    @Field()
    username: string;

    @Field()
    password: string;
}
