import { object, string, size } from 'superstruct';

export const AuthorCreationData = object({
    firstName: size(string(), 1, 50),
    lastName: size(string(), 1, 50),
});