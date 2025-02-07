import {object, string, size, optional} from 'superstruct';

export const AuthorCreationData = object({
    firstName: size(string(), 1, 50),
    lastName: size(string(), 1, 50),
});

export const AuthorUpdateData = object({
    firstName: optional(size(string(), 1, 50)),
    lastName: optional(size(string(), 1, 50)),
});

export const QueryString = object({
    lastName: optional(size(string(), 1, 50)),
    hasBooks: optional(size(string(), 1, 50)),
    include: optional(size(string(), 1, 50)),
    take: optional(size(string(), 1, 50)),
    skip: optional(size(string(), 1, 50)),
});
