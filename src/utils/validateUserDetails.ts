import { UserDetailsInput } from "../resolvers/inputs/UserDetailsInput";

//validation for register input
export const validateUserDetails = (input: UserDetailsInput) => {
    if (input.bio.length > 300){
        //username must be longer than 2 letters/numbers
        return [
            {
                field: 'bio',
                message: 'Bio is too long.'
            },
        ];
    }
    if (input.bioLink.includes("@")){
        //username must be longer than 2 letters/numbers
        return [
            {
                field: 'username',
                message: 'Invalid link.'
            },
        ];
    }
    return null;
}