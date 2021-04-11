"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNewUsername = void 0;
const validateNewUsername = (input) => {
    if (input.newUsername.length <= 2) {
        return [
            {
                field: 'newUsername',
                message: 'Username must be longer than 2 letters/numbers.'
            },
        ];
    }
    if (!input.newUsername.match(/^[a-z0-9]+$/i)) {
        return [
            {
                field: 'newUsername',
                message: 'Invalid username.'
            }
        ];
    }
    return null;
};
exports.validateNewUsername = validateNewUsername;
//# sourceMappingURL=validateNewUsername.js.map