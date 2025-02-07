import {object, string, size, integer, optional} from 'superstruct';

export const BookCreationData = object({
    title: size(string(), 1, 50),
    publication_year: integer(),
});

export const BookUpdateData = object({
    title: optional(size(string(), 1, 50)),
    publication_year: optional(integer()),
});

export const QueryString = object({
    title: optional(size(string(), 1, 50)),
    include: optional(size(string(), 1, 50)),
    take: optional(size(string(), 1, 50)),
    skip: optional(size(string(), 1, 50)),
});