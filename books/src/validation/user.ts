import {object, refine, size, string} from "superstruct";
import {isEmail} from "validator";

export const CreateUserData = object({
    email: refine(string(), 'email', (value) => isEmail(value)),
    password: size(string(), 8, 18),
    username: size(string(), 1, 18)
});

export const LoginUserData = object({
    email: refine(string(), 'email', (value) => isEmail(value)),
    password: size(string(), 8, 18)
});