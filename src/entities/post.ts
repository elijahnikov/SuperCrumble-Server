import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Upvote } from "./upvote";
import { User } from "./user";
import { nanoid } from 'nanoid'
import { PostComment } from "./postComment";

//Post table in db
@ObjectType()
@Entity()
export class Post extends BaseEntity{
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({type: 'varchar'})
  referenceId!: string;

  @BeforeInsert()
  setId(){
    this.referenceId = nanoid(10);
  }

  @Field()
  @Column({type: 'int'})
  movieId: number;

  @Field()
  @Column()
  creatorId: number;

  @Field()
  @ManyToOne(() => User, (user) => user.posts)
  creator: User;

  @Field()
  @Column()
  text!: string;

  @Field()
  @Column({nullable: true})
  movie_poster: string;

  @Field()
  @Column({type: 'text'})
  movie_title: string;

  @Field()
  @Column({type: 'int'})
  movie_release_year: number;

  @Field()
  @Column()
  ratingGiven: number;

  @Field()
  @Column({type: "int", default: 0})
  score!: number;

  @Field(() => Int, {nullable: true})
  voteStatus: number | null;//1 or -1 or null

  @OneToMany(() => Upvote, (upvote) => upvote.post)
  upvotes: Upvote[];

  @OneToMany(() => PostComment, postComment => postComment.post)
  postComments: PostComment[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

}