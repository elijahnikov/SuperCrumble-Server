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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostCommentResolver = void 0;
const postComment_1 = require("../entities/postComment");
const type_graphql_1 = require("type-graphql");
const user_1 = require("../entities/user");
const isAuth_1 = require("src/middleware/isAuth");
const PostCommentInput_1 = require("./inputs/PostCommentInput");
const typeorm_1 = require("typeorm");
let PaginatedPostComments = class PaginatedPostComments {
};
__decorate([
    type_graphql_1.Field(() => [postComment_1.PostComment]),
    __metadata("design:type", Array)
], PaginatedPostComments.prototype, "postComments", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], PaginatedPostComments.prototype, "hasMore", void 0);
PaginatedPostComments = __decorate([
    type_graphql_1.ObjectType()
], PaginatedPostComments);
let PostCommentResolver = class PostCommentResolver {
    creator(postComment, { userLoader }) {
        return userLoader.load(postComment.creatorId);
    }
    createPostComment(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId) {
                return null;
            }
            return postComment_1.PostComment.create({
                text: input.text,
                postId: input.postId,
                parentId: input.parentId,
                creatorId: req.session.userId
            }).save();
        });
    }
    postComments(limit, cursor, postId, order) {
        return __awaiter(this, void 0, void 0, function* () {
            const maxLimit = Math.min(50, limit);
            const maxLimitPlusOne = maxLimit + 1;
            const replacements = [maxLimitPlusOne];
            if (cursor) {
                replacements.push(new Date(parseInt(cursor)));
            }
            const qb = typeorm_1.getConnection()
                .getRepository(postComment_1.PostComment)
                .createQueryBuilder('cmt')
                .orderBy('cmt."createdAt"', order)
                .take(maxLimitPlusOne)
                .where('cmt."postId" = :post', { post: postId });
            if (cursor) {
                qb.andWhere('cmt. "createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) });
            }
            const postComments = yield qb.getMany();
            return {
                postComments: postComments.slice(0, maxLimit),
                hasMore: postComments.length === maxLimitPlusOne
            };
        });
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => user_1.User),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [postComment_1.PostComment, Object]),
    __metadata("design:returntype", void 0)
], PostCommentResolver.prototype, "creator", null);
__decorate([
    type_graphql_1.Mutation(() => postComment_1.PostComment),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PostCommentInput_1.PostCommentInput, Object]),
    __metadata("design:returntype", Promise)
], PostCommentResolver.prototype, "createPostComment", null);
__decorate([
    type_graphql_1.Query(() => PaginatedPostComments),
    __param(0, type_graphql_1.Arg('limit', () => type_graphql_1.Int, { nullable: true })),
    __param(1, type_graphql_1.Arg('cursor', () => String, { nullable: true })),
    __param(2, type_graphql_1.Arg('postId', () => type_graphql_1.Int)),
    __param(3, type_graphql_1.Arg('order', () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Number, Object]),
    __metadata("design:returntype", Promise)
], PostCommentResolver.prototype, "postComments", null);
PostCommentResolver = __decorate([
    type_graphql_1.Resolver(postComment_1.PostComment)
], PostCommentResolver);
exports.PostCommentResolver = PostCommentResolver;
//# sourceMappingURL=postComment.js.map