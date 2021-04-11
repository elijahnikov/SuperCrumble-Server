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
exports.MovieIDResolver = void 0;
const movieID_1 = require("../entities/movieID");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
let PaginatedFilms = class PaginatedFilms {
};
__decorate([
    type_graphql_1.Field(() => [movieID_1.MovieID]),
    __metadata("design:type", Array)
], PaginatedFilms.prototype, "movieids", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Boolean)
], PaginatedFilms.prototype, "hasMore", void 0);
PaginatedFilms = __decorate([
    type_graphql_1.ObjectType()
], PaginatedFilms);
let MovieIDResolver = class MovieIDResolver {
    getMovieIDByTitle(title, limit, cursor) {
        return __awaiter(this, void 0, void 0, function* () {
            const maxLimit = Math.min(50, limit);
            const maxLimitPlusOne = maxLimit + 1;
            const qb = typeorm_1.getConnection()
                .getRepository(movieID_1.MovieID)
                .createQueryBuilder('mid')
                .orderBy('mid.popularity', 'DESC')
                .where('LOWER(mid.original_title) like LOWER(:givenTitle)', { givenTitle: `%${title}%` })
                .take(maxLimitPlusOne);
            if (cursor) {
                qb.andWhere('mid.popularity < :cursor', { cursor: parseFloat(cursor) });
            }
            qb.andWhere('mid.original_title is not null');
            const movies = yield qb.getMany();
            return { movieids: movies.slice(0, maxLimit), hasMore: movies.length === maxLimitPlusOne };
        });
    }
};
__decorate([
    type_graphql_1.Query(() => PaginatedFilms),
    __param(0, type_graphql_1.Arg('title')),
    __param(1, type_graphql_1.Arg('limit', () => type_graphql_1.Int)),
    __param(2, type_graphql_1.Arg('cursor', () => String, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object]),
    __metadata("design:returntype", Promise)
], MovieIDResolver.prototype, "getMovieIDByTitle", null);
MovieIDResolver = __decorate([
    type_graphql_1.Resolver(movieID_1.MovieID)
], MovieIDResolver);
exports.MovieIDResolver = MovieIDResolver;
//# sourceMappingURL=movieId.js.map