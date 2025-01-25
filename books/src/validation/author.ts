import {object, string, size, optional} from 'superstruct';

export const AuthorCreationData = object({
    firstName: size(string(), 1, 50),
    lastName: size(string(), 1, 50),
});

export const AuthorUpdateData = object({
    firstName: optional(size(string(), 1, 50)),
    lastName: optional(size(string(), 1, 50)),
});