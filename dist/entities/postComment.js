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
exports.PostComment = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const post_1 = require("./post");
const user_1 = require("./user");
let PostComment = class PostComment extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], PostComment.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], PostComment.prototype, "parentId", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], PostComment.prototype, "creatorId", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], PostComment.prototype, "postId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => user_1.User, user => user.postComments),
    __metadata("design:type", user_1.User)
], PostComment.prototype, "creator", void 0);
__decorate([
    typeorm_1.ManyToOne(() => post_1.Post, post => post.postComments),
    __metadata("design:type", post_1.Post)
], PostComment.prototype, "post", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], PostComment.prototype, "text", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], PostComment.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], PostComment.prototype, "updatedAt", void 0);
PostComment = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], PostComment);
exports.PostComment = PostComment;
//# sourceMappingURL=postComment.js.map