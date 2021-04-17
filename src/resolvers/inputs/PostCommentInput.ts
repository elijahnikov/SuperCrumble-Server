import { Field, InputType } from "type-graphql";

@InputType()
export class PostCommentInput {
    @Field()
    postId: number
    
    @Field()
    parentId: number

    @Field()
    text: string
}