import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Post } from "./post";
import { User } from "./user";

//Upvote table in db
@Entity()
export class Upvote extends BaseEntity{
    @Column({type: 'int', nullable: true})
    value: number

    @PrimaryColumn()
    userId: number;

    @ManyToOne(() => User, (user) => user.upvotes)
    user: User;

    @PrimaryColumn()
    postId: number;

    @ManyToOne(() => Post, (post) => post.upvotes, {
        onDelete: 'CASCADE',
    })
    post: Post;
}