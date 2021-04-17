import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./post";
import { User } from "./user";

//Post table in db
@ObjectType()
@Entity()
export class PostComment extends BaseEntity{
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({nullable: true})
  parentId: number;

  @Field()
  @Column()
  creatorId: number;
  
  @Field()
  @Column()
  postId: number;

  @ManyToOne(() => User, user => user.postComments)
  creator: User;

  @ManyToOne(() => Post, post => post.postComments)
  post: Post;

  @Field()
  @Column()
  text!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

}