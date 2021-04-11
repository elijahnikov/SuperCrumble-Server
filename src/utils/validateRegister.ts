import { UsernamePasswordInput } from "../resolvers/inputs/UsernamePasswordInput";

//validation for register input
export const validateRegister = (input: UsernamePasswordInput) => {
    if (!input.email.includes('@')){
        //username must be longer than 2 letters/numbers
        return [
            {
                field: 'email',
                message: 'Invalid e-mail.'
            },
        ];
    }
    if (input.username.length <= 2){
        //username must be longer than 2 letters/numbers
        return [
            {
                field: 'username',
                message: 'Username must be longer than 2 letters/numbers.'
            },
        ];
    }
    if (input.username.includes("@")){
        //username must be longer than 2 letters/numbers
        return [
            {
                field: 'username',
                message: 'Invalid username.'
            },
        ];
    }
    if (input.password.length <= 4){
        //password must be longer than 4 letters/numbers
        return  [
            {
                field: 'password',
                message: 'Weak password. Please provide a stronger password.'
            },
        ];
    }

    return null;
}