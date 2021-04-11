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
exports.Movie = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const post_1 = require("./post");
let Movie = class Movie extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryColumn(),
    __metadata("design:type", Number)
], Movie.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'text' }),
    __metadata("design:type", String)
], Movie.prototype, "original_title", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: 'decimal' }),
    __metadata("design:type", Number)
], Movie.prototype, "popularity", void 0);
__decorate([
    typeorm_1.OneToMany(() => post_1.Post, post => post.movie),
    __metadata("design:type", Array)
], Movie.prototype, "posts", void 0);
Movie = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], Movie);
exports.Movie = Movie;
//# sourceMappingURL=movieID.js.map