"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const upvote_1 = require("./upvote");
const user_1 = require("./user");
const nanoid_1 = require("nanoid");
const postComment_1 = require("./postComment");
let Post = class Post extends typeorm_1.BaseEntity {
    setId() {
        this.referenceId = nanoid_1.nanoid(10);
    }
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Post.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'varchar' }),
    __metadata("design:type", String)
], Post.prototype, "referenceId", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Post.prototype, "setId", null);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'int' }),
    __metadata("design:type", Number)
], Post.prototype, "movieId", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Post.prototype, "creatorId", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.ManyToOne(() => user_1.User, (user) => user.posts),
    __metadata("design:type", user_1.User)
], Post.prototype, "creator", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Post.prototype, "text", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Post.prototype, "movie_poster", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'text' }),
    __metadata("design:type", String)
], Post.prototype, "movie_title", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'int' }),
    __metadata("design:type", Number)
], Post.prototype, "movie_release_year", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Post.prototype, "ratingGiven", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], Post.prototype, "score", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Object)
], Post.prototype, "voteStatus", void 0);
__decorate([
    typeorm_1.OneToMany(() => upvote_1.Upvote, (upvote) => upvote.post),
    __metadata("design:type", Array)
], Post.prototype, "upvotes", void 0);
__decorate([
    typeorm_1.OneToMany(() => postComment_1.PostComment, postComment => postComment.post),
    __metadata("design:type", Array)
], Post.prototype, "postComments", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Post.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Post.prototype, "updatedAt", void 0);
Post = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], Post);
exports.Post = Post;
//# sourceMappingURL=post.js.map