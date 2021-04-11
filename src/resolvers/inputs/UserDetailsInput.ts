import { Field, InputType } from "type-graphql";

//input object for register/login
@InputType()
export class UserDetailsInput {
    @Field()
    bio: string;

    @Field()
    bioLink: string;

    @Field()
    displayName: string;
}
