import { Post } from "../entities/post";
import { Arg, Ctx, Field, FieldResolver, InputType, Int, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { MyContext } from "src/types";
import { isAuth } from "../middleware/isAuth";
import { getConnection } from "typeorm";
import { Upvote } from "../entities/upvote";
import { User } from "../entities/user";

@InputType()
class PostInput {
    @Field()
    movieId: number

    @Field()
    text: string

    @Field()
    movie_poster: string

    @Field()
    movie_title: string

    @Field()
    movie_release_year: number

    @Field()
    ratingGiven: number
}

//detect whether there is no more data to paginate through
@ObjectType()
class PaginatedPosts {
    @Field(() => [Post])
    posts: Post[]

    @Field()
    hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
    @FieldResolver(() => String)
    textSnippet(
        @Root() root: Post
    ) {
        return root.text.slice(0, 250);
    }

    @FieldResolver(() => User)
    creator(
        @Root() post: Post,
        @Ctx() {userLoader}: MyContext
    ){
        return userLoader.load(post.creatorId); 
    }

    @FieldResolver(() => Int, {nullable: true})
    async voteStatus(
        @Root() post: Post,
        @Ctx() {upvoteLoader, req}: MyContext
    ){     

        if(!req.session.userId){
            return null
        }

        const upvote = await upvoteLoader.load({postId: post.id, userId: req.session.userId })

        return upvote ? upvote.value : null;
    }

    //upvote mutation
    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async vote(
        @Arg('postId', () => Int) postId: number,
        @Arg('value', () => Int) value: number,
        @Ctx() {req}: MyContext
    ) {
        // const isUpvote = value !== -1;
        // const finalValue = isUpvote ? 1 : -1;
        const {userId} = req.session

        //check if user has already voted on a post
        const upvote = await Upvote.findOne({where: {postId, userId}})

        //if user has voted on a post
        //and changing their vote
        if (upvote){
            await getConnection().transaction(async (tm) => {
                await tm.query(`
                    delete from upvote 
                    where "postId" = $1 and "userId" = $2
                `, [postId, userId]
                );

                await tm.query(`
                    update post
                    set score = score - 1
                    where id = $1;
                `, [postId]);
            });
        } else if (!upvote) {  //they have not voted yet
            //transaction manager, to rollback if there is an error in transaction
            await getConnection().transaction(async (tm) => {
                await tm.query(`
                    insert into upvote ("userId", "postId", value)
                    values ($1, $2, $3);
                `, [userId, postId, value]);

                await tm.query(`
                    update post
                    set score = score + 1
                    where id = $1;
                `, [postId])
            })

        }
        return true;
    }

    //get all posts
    @Query(() => PaginatedPosts)
    async posts(
        @Arg('limit', () => Int, {nullable: true}) limit: number,
        @Arg('cursor', () => String, {nullable: true}) cursor: string | null,
    ): Promise<PaginatedPosts> { 
        const maxLimit = Math.min(50, limit);
        //+1 to see if there are more posts to return after the initial call to get 
        //certain amount of posts
        const maxLimitPlusOne = maxLimit + 1
        
        const replacements: any[] = [maxLimitPlusOne];

        //if cursor input is supplied add to replacements[] to use as parameter for get query
        if (cursor) {
            replacements.push(new Date(parseInt(cursor)));
        }

        // const posts = await getConnection().query(`
        //     select p.*
        //     from post p
        //     ${cursor ? `where p."createdAt" < $2` : ''}
        //     order by p."createdAt" DESC 
        //     limit $1
        // `, replacements)

        const qb = getConnection()
            .getRepository(Post)
            .createQueryBuilder('pst')
            .orderBy('pst."createdAt"', 'DESC')
            .take(maxLimitPlusOne)
        if (cursor){
            qb.where('pst. "createdAt" < :cursor', {cursor: new Date(parseInt(cursor))})
        }
           // qb.andWhere('pst. "createdAt" < :start_at', { start_at: '2020-04-05  10:41:30.746877' })

        const posts = await qb.getMany();
        return { posts: posts.slice(0, maxLimit), hasMore: posts.length === maxLimitPlusOne };
    }
    
    //CRUD
    //get specific post
    @Query(() => Post, {nullable: true})
    post(@Arg('id', () => String) id: string): Promise<Post | undefined> { 
        return Post.findOne({where: {referenceId: id}});
    }

    //create post
    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg("input") input: PostInput,
        @Ctx() {req}: MyContext
    ): Promise<Post | null> {
        //if user is not logged in return null
        if (!req.session.userId){
            return null
        } 
        
        return Post.create({
            movieId: input.movieId,
            creatorId: req.session.userId,
            text: input.text,
            movie_poster: input.movie_poster,
            movie_title: input.movie_title,
            movie_release_year: input.movie_release_year,
            ratingGiven: input.ratingGiven
        }).save();
    }

    //update post (title)
    @Mutation(() => Post, {nullable: true})
    @UseMiddleware(isAuth)
    async updatePost(
        @Arg('referenceId', () => String) referenceId: string,
        @Arg('text') text: string,
        @Ctx() {req}: MyContext
    ): Promise<Post | null> { 
        const result = await getConnection()
        .createQueryBuilder()
        .update(Post)
        .set({text})
        .where('referenceId = :referenceId and "creatorId" = :creatorId', {referenceId, creatorId: req.session.userId})
        .returning('*')
        .execute();

        return result.raw[0];
    }

    //delete post
    @Mutation(() => Boolean) 
    @UseMiddleware(isAuth)
    async deletePost(
        @Arg('id', () => Int) id: number, 
        @Ctx() {req}: MyContext
    ): Promise<boolean> { 
        //delete posts corresponding votes from vote table
        //delete post from Post table by user Id to ensure only owner can delete

        // non cascade way
        // const post = await Post.findOne(id);
        // if (!post){
        //     return false
        // }
        // if (post.creatorId !== req.session.userId){ 
        //     throw new Error('Not authorized')
        // }
        // await Upvote.delete({postId: id});
        // await Post.delete({id});
        // return true;

        //cascade way
        //there is object in upvote entity in post relationship eg; onDelete: 'CASCADE'
        await Post.delete({id, creatorId: req.session.userId})
        return true;
    }
}