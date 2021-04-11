"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const validateRegister = (input) => {
    if (!input.email.includes('@')) {
        return [
            {
                field: 'email',
                message: 'Invalid e-mail.'
            },
        ];
    }
    if (input.username.length <= 2) {
        return [
            {
                field: 'username',
                message: 'Username must be longer than 2 letters/numbers.'
            },
        ];
    }
    if (input.username.includes("@")) {
        return [
            {
                field: 'username',
                message: 'Invalid username.'
            },
        ];
    }
    if (input.password.length <= 4) {
        return [
            {
                field: 'password',
                message: 'Weak password. Please provide a stronger password.'
            },
        ];
    }
    return null;
};
exports.validateRegister = validateRegister;
//# sourceMappingURL=validateRegister.js.map