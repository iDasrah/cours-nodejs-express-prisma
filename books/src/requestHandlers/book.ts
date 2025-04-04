import {prisma} from "../db";
import { Prisma } from "@prisma/client";
import {Request, Response} from "express";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {BookCreationData, BookUpdateData, QueryString} from "../validation/book";
import {assert} from "superstruct";

export const getAllBooks = async(req: Request, res: Response) => {
    const filter: Prisma.BookWhereInput = {};
    const assoc: Prisma.BookInclude = {};
    const pagination: Prisma.BookFindManyArgs = {};
    assert(req.query, QueryString);

    // filters
    if (req.query.title) {
        filter.title = {
            contains: String(req.query.title)
        };
    }

    // assoc
    if (req.query.include) {
        assoc.author = {
            select: {
                id: true,
                firstName: true,
                lastName: true
            }
        };
    }

    // pagination
    if (req.query.take) {
        pagination.take = parseInt(req.query.take as string);
    }

    if (req.query.skip) {
        pagination.skip = parseInt(req.query.skip as string);
    }

    const books = await prisma.book.findMany({
        where: filter,
        orderBy: {
            title: 'asc'
        },
        include: assoc,
        ...pagination
    });

    res.set('X-Total-Count', books.length.toString()).status(200).json(books);
}

export const getOneBook = async(req: Request, res: Response) => {
    const {id} = req.params;

    const book = await prisma.book.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            author: {
                select: {
                    firstName: true,
                    lastName: true
                }
            }
        }
    });

    if (book) res.status(200).json(book);
    else res.status(404).json({error: 'Book Not Found'});
}

export const getBooksByAuthor = async(req: Request, res: Response) => {
    const {id} = req.params;
    const filter: Prisma.BookWhereInput = {};
    const pagination: Prisma.BookFindManyArgs = {};

    assert(req.query, QueryString);

    // filters
    if (req.query.title) {
        filter.title = {
            contains: String(req.query.title)
        };
    }

    // pagination
    if (req.query.take) {
        pagination.take = parseInt(req.query.take as string);
    }

    if (req.query.skip) {
        pagination.skip = parseInt(req.query.skip as string);
    }

    const author = await prisma.author.findUnique({
        where: {
            id: parseInt(id),
        },
        include: {
            books: {
                    where: filter,
                    orderBy: {
                        title: 'asc'
                    },
                    ...pagination
                }
        },
    });

    if (author) res.set('X-Total-Count', author.books.length.toString()).status(200).json(author.books);
    else res.status(404).json({error: 'Author Not Found'});
}

export const createBook = async(req: Request, res: Response) => {
    const {id} = req.params;
    const book = req.body;
    assert(book, BookCreationData);

    const createdBook = await prisma.book.create({
        data: {
            ...book,
            author: {
                connect: {
                    id: parseInt(id)
                }
            }
        }
    });

    console.log("createdBook", createdBook);
    res.status(201).json(createdBook);
}

export const updateBook = async(req: Request, res: Response) => {
    const {id} = req.params;
    const book = req.body;
    assert(book, BookUpdateData);

    try {
        const updatedBook = await prisma.book.update({
            where: {
                id: parseInt(id)
            },
            data: {
                ...book
            }
        });

        res.status(201).json(updatedBook);
    } catch (err: unknown) {
        if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
            res.status(404).json({error: 'Book Not Found'});
        }
    }
}

export const deleteBook = async(req: Request, res: Response) => {
    const {id} = req.params;

    try {
        const deletedBook = await prisma.book.delete({
            where: {
                id: parseInt(id)
            }
        });

        res.status(204).json(deletedBook);
    } catch (err: unknown) {
        if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
            res.status(404).json({error: 'Book Not Found'});
        }
    }
}