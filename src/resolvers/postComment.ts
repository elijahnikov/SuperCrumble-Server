import { PostComment } from "../entities/postComment";
import { Arg, Ctx, Field, FieldResolver, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { MyContext } from "src/types";
import { User } from "../entities/user";
import { isAuth } from "src/middleware/isAuth";
import { PostCommentInput } from "./inputs/PostCommentInput";
import { getConnection } from "typeorm";

@ObjectType()
class PaginatedPostComments {
    @Field(() => [PostComment])
    postComments: PostComment[]

    @Field()
    hasMore: boolean;
}

@Resolver(PostComment)
export class PostCommentResolver {

    @FieldResolver(() => User)
    creator(
        @Root() postComment: PostComment,
        @Ctx() {userLoader}: MyContext
    ){
        return userLoader.load(postComment.creatorId)
    }

    @Mutation(() => PostComment)
    @UseMiddleware(isAuth)
    async createPostComment(
        @Arg('input') input: PostCommentInput,
        @Ctx() {req}: MyContext
    ): Promise<PostComment | null>{
        if (!req.session.userId){
            return null
        }

        return PostComment.create({
            text: input.text,
            postId: input.postId,
            parentId: input.parentId,
            creatorId: req.session.userId
        }).save();
    }

    @Query(() => PaginatedPostComments)
    async postComments(
        @Arg('limit', () => Int, {nullable: true}) limit: number,
        @Arg('cursor', () => String, {nullable: true}) cursor: string | null,
        @Arg('postId', () => Int) postId: number,
        @Arg('order', () => String, {nullable: true}) order: 'ASC' | 'DESC' | undefined
    ): Promise<PaginatedPostComments>{
        const maxLimit = Math.min(50, limit);
        const maxLimitPlusOne = maxLimit + 1;

        const replacements: any[] = [maxLimitPlusOne];
        if(cursor){
            replacements.push(new Date(parseInt(cursor)))
        }

        const qb = getConnection()
            .getRepository(PostComment)
            .createQueryBuilder('cmt')
            .orderBy('cmt."createdAt"', order)
            .take(maxLimitPlusOne)
            .where('cmt."postId" = :post', {post: postId})
        if(cursor){
            qb.andWhere('cmt. "createdAt" < :cursor', {cursor: new Date(parseInt(cursor))})
        }

        const postComments = await qb.getMany()
        return { 
            postComments: postComments.slice(0, maxLimit), 
            hasMore: postComments.length === maxLimitPlusOne
        }
    }

}