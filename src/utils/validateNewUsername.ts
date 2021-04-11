import { NewUsernameInput } from "../resolvers/inputs/NewUsernameInput";

//validation for username input
export const validateNewUsername = (input: NewUsernameInput) => {
    if (input.newUsername.length <= 2){
        //username must be longer than 2 letters/numbers
        return [
            {
                field: 'newUsername',
                message: 'Username must be longer than 2 letters/numbers.'
            },
        ];
    }
    if (!input.newUsername.match(/^[a-z0-9]+$/i)){
        //username provided must be alphanumeric
        return [
            {
                field: 'newUsername',
                message: 'Invalid username.'
            }
        ]
    }
    return null;
}