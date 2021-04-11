"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserDetails = void 0;
const validateUserDetails = (input) => {
    if (input.bio.length > 300) {
        return [
            {
                field: 'bio',
                message: 'Bio is too long.'
            },
        ];
    }
    if (input.bioLink.includes("@")) {
        return [
            {
                field: 'username',
                message: 'Invalid link.'
            },
        ];
    }
    return null;
};
exports.validateUserDetails = validateUserDetails;
//# sourceMappingURL=validateUserDetails.js.map