import { Field, InputType } from "type-graphql";

//input object for register/login
@InputType()
export class NewUsernameInput {
    @Field()
    newUsername: string;
}
