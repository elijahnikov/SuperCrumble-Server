import { Field, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./post";
import { Upvote } from "./upvote";

//User table in db
@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({unique: true})
  username!: string;

  @Field({nullable: true})
  @Column({nullable: true})
  displayName: string;

  @Field()
  @Column({unique: true})
  email!: string;

  @Column()
  password!: string;
  
  @Field({nullable: true})
  @Column({nullable: true})
  avatar: string;

  @Field({nullable: true})
  @Column({nullable: true})
  bio: string;

  @Field({nullable: true})
  @Column({nullable: true})
  bioLink: string;

  @Field({nullable: true})
  @Column({nullable: true, type: 'int'})
  totalFilmsWatched: number

  @Field({nullable: true})
  @Column({nullable: true, type: 'int'})
  totalHoursWatched: number

  @OneToMany(() => Post, post => post.creator)
  posts: Post[];

  @OneToMany(() => Upvote, (upvote) => upvote.user)
  upvotes: Upvote[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => String, {nullable: true})
  @Column({nullable: true})
  usernameChangeDate: Date;
}