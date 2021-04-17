import { InputType, Field } from "type-graphql"

@InputType()
export class PostInput {
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
