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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const user_1 = require("../entities/user");
const type_graphql_1 = require("type-graphql");
const argon2_1 = __importDefault(require("argon2"));
const constants_1 = require("../constants");
const UsernamePasswordInput_1 = require("./inputs/UsernamePasswordInput");
const validateRegister_1 = require("../utils/validateRegister");
const sendEmail_1 = require("../utils/sendEmail");
const uuid_1 = require("uuid");
const typeorm_1 = require("typeorm");
const NewUsernameInput_1 = require("./inputs/NewUsernameInput");
const validateNewUsername_1 = require("../utils/validateNewUsername");
const UserDetailsInput_1 = require("./inputs/UserDetailsInput");
const isAuth_1 = require("../middleware/isAuth");
const validateUserDetails_1 = require("../utils/validateUserDetails");
let FieldError = class FieldError {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
FieldError = __decorate([
    type_graphql_1.ObjectType()
], FieldError);
let UserResponse = class UserResponse {
};
__decorate([
    type_graphql_1.Field(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => user_1.User, { nullable: true }),
    __metadata("design:type", user_1.User)
], UserResponse.prototype, "user", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
let UserResolver = class UserResolver {
    email(user, { req }) {
        if (req.session.userId === user.id) {
            return user.email;
        }
        return '';
    }
    me({ req }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.session.userId) {
                return null;
            }
            return user_1.User.findOne(req.session.userId);
        });
    }
    getUser(id) {
        return user_1.User.findOne(id, { relations: ["posts"] });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.User.findOne({ where: { username }, relations: ['posts'] });
            return user;
        });
    }
    forgotPassword(email, { redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.User.findOne({ where: { email } });
            if (!user) {
                return true;
            }
            const token = uuid_1.v4();
            yield redis.set(constants_1.FORGOT_PASS + token, user.id, 'ex', 1000 * 60 * 60 * 24);
            yield sendEmail_1.sendEmail(email, `<a href="http://localhost:3000/change-password/${token}">reset password</a>`);
            return true;
        });
    }
    changePassword(token, newPassword, { redis }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newPassword.length <= 4) {
                return {
                    errors: [
                        {
                            field: 'newPassword',
                            message: 'Weak password. Please provide a stronger password.'
                        },
                    ]
                };
            }
            const key = constants_1.FORGOT_PASS + token;
            const userId = yield redis.get(key);
            if (!userId) {
                return {
                    errors: [
                        {
                            field: 'token',
                            message: 'Expired token'
                        },
                    ]
                };
            }
            const userIdNum = parseInt(userId);
            const user = yield user_1.User.findOne(userIdNum);
            if (!user) {
                return {
                    errors: [
                        {
                            field: 'token',
                            message: 'User not found'
                        },
                    ]
                };
            }
            yield user_1.User.update({ id: userIdNum }, { password: yield argon2_1.default.hash(newPassword) });
            yield redis.del(key);
            return {
                user
            };
        });
    }
    settingsChangePassword(currentPassword, settingsNewPassword, username) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUser = yield user_1.User.findOne({ where: { username: username } });
            if (!findUser) {
                return null;
            }
            const valid = yield argon2_1.default.verify(findUser.password, currentPassword);
            if (!valid) {
                return {
                    errors: [
                        {
                            field: "currentPassword",
                            message: "Details entered are incorrect",
                        },
                    ],
                };
            }
            const checkIfSame = yield argon2_1.default.verify(findUser.password, settingsNewPassword);
            if (checkIfSame) {
                return {
                    errors: [
                        {
                            field: 'newPassword',
                            message: 'New password cannot be same as current password.'
                        }
                    ]
                };
            }
            const hashedPassword = yield argon2_1.default.hash(settingsNewPassword);
            let user;
            try {
                const result = yield typeorm_1.getConnection()
                    .createQueryBuilder()
                    .update(user_1.User)
                    .set({ password: hashedPassword })
                    .where("id = :id", { id: findUser.id })
                    .returning('*')
                    .execute();
                user = result.raw[0];
            }
            catch (err) {
                console.log(err);
            }
            return {
                user
            };
        });
    }
    editUserDetails(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = validateUserDetails_1.validateUserDetails(input);
            if (errors) {
                return { errors };
            }
            let user;
            const { userId } = req.session;
            try {
                const result = yield typeorm_1.getConnection()
                    .createQueryBuilder()
                    .update(user_1.User)
                    .set({
                    bio: input.bio,
                    bioLink: input.bioLink,
                    displayName: input.displayName
                })
                    .where("id = :id", { id: userId })
                    .returning('*')
                    .execute();
                user = result.raw[0];
            }
            catch (err) {
                console.log(err);
            }
            return {
                user
            };
        });
    }
    changeUsername(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = validateNewUsername_1.validateNewUsername(input);
            if (errors) {
                return { errors };
            }
            let user;
            const userId = yield user_1.User.findOne(req.session.userId);
            try {
                const result = yield typeorm_1.getConnection()
                    .createQueryBuilder()
                    .update(user_1.User)
                    .set({ username: input.newUsername })
                    .where("id = :id", { id: userId === null || userId === void 0 ? void 0 : userId.id })
                    .returning('*')
                    .execute();
                user = result.raw[0];
            }
            catch (err) {
                if (err.detail.includes(`(username)=(${input.newUsername}) already exists`)) {
                    return {
                        errors: [
                            {
                                field: 'newUsername',
                                message: 'Username already exists.'
                            }
                        ]
                    };
                }
            }
            return {
                user
            };
        });
    }
    register(input, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = validateRegister_1.validateRegister(input);
            if (errors) {
                return { errors };
            }
            const tempUsername = input.username.toLowerCase();
            const hashedPassword = yield argon2_1.default.hash(input.password);
            let user;
            try {
                const result = yield typeorm_1.getConnection().createQueryBuilder().insert().into(user_1.User).values({
                    username: tempUsername,
                    email: input.email,
                    password: hashedPassword
                }).returning('*').execute();
                user = result.raw[0];
            }
            catch (err) {
                console.log(err);
                if (err.detail.includes(`(username)=(${tempUsername}) already exists`)) {
                    return {
                        errors: [
                            {
                                field: "username",
                                message: "Username already exists."
                            }
                        ]
                    };
                }
                if (err.detail.includes(`(email)=(${input.email}) already exists`)) {
                    return {
                        errors: [
                            {
                                field: 'email',
                                message: 'E-mail has already been taken.'
                            }
                        ]
                    };
                }
            }
            req.session.userId = user.id;
            return {
                user
            };
        });
    }
    login(usernameOrEmail, password, { req }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.User.findOne(usernameOrEmail.includes('@')
                ? { where: { email: usernameOrEmail } }
                : { where: { username: usernameOrEmail } });
            if (!user) {
                return {
                    errors: [
                        {
                            field: "usernameOrEmail",
                            message: "Details entered are incorrect",
                        },
                    ],
                };
            }
            const valid = yield argon2_1.default.verify(user.password, password);
            if (!valid) {
                return {
                    errors: [
                        {
                            field: "password",
                            message: "Details entered are incorrect",
                        },
                    ],
                };
            }
            req.session.userId = user.id;
            return {
                user,
            };
        });
    }
    logout({ req, res }) {
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie(constants_1.COOKIE_NAME);
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            resolve(true);
        }));
    }
};
__decorate([
    type_graphql_1.FieldResolver(() => String),
    __param(0, type_graphql_1.Root()),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User, Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "email", null);
__decorate([
    type_graphql_1.Query(() => user_1.User, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "me", null);
__decorate([
    type_graphql_1.Query(() => user_1.User, { nullable: true }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUser", null);
__decorate([
    type_graphql_1.Query(() => user_1.User, { nullable: true }),
    __param(0, type_graphql_1.Arg('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUserByUsername", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("email")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "forgotPassword", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('token')),
    __param(1, type_graphql_1.Arg('newPassword')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changePassword", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('currentPassword')),
    __param(1, type_graphql_1.Arg('settingsNewPassword')),
    __param(2, type_graphql_1.Arg('username')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "settingsChangePassword", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UserDetailsInput_1.UserDetailsInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "editUserDetails", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse, { nullable: true }),
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NewUsernameInput_1.NewUsernameInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "changeUsername", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('input')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput_1.UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('usernameOrEmail')),
    __param(1, type_graphql_1.Arg('password')),
    __param(2, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    type_graphql_1.Resolver(user_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.js.map