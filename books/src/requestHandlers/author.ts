import {Request, Response} from "express";
import {prisma} from "../db";
import { Prisma } from "@prisma/client";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {NotFoundError} from "../error";
import {assert} from "superstruct";
import {AuthorCreationData, AuthorUpdateData} from "../validation/author";

export const getAllAuthors = async(req: Request, res: Response) => {
    const filter: Prisma.AuthorWhereInput = {};
    const assoc: Prisma.AuthorInclude = {};
    const pagination: Prisma.AuthorFindManyArgs = {};

    // filters
    if (req.query.lastName) {
        filter.lastName = {
            contains: String(req.query.lastName)
        };
    }

    if (req.query.hasBooks) {
        filter.books = {
            some: {}
        };
    }

    // associations
    if (req.query.include) {
        assoc.books = {
            select: {
                id: true,
                title: true,
            }
        }
    }

    // pagination
    if (req.query.take) {
        pagination.take = parseInt(req.query.take as string);
    }

    if (req.query.skip) {
        pagination.skip = parseInt(req.query.skip as string);
    }

    const authors = await prisma.author.findMany({
        where: filter,
        orderBy: {
            lastName: 'asc'
        },
        include: assoc,
        ...pagination
    });

    res.status(200).json(authors);
}

export const getOneAuthor = async(req: Request, res: Response) => {
    const {id} = req.params;
    const author = await prisma.author.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (author) res.json(author);
    else res.status(404).json({error: 'Author Not Found'});
}

export const createAuthor = async(req: Request, res: Response) => {
    const { author } = req.body;
    assert(author, AuthorCreationData);

    const createdAuthor = await prisma.author.create(
        {
            data: author
        }
    );

    res.status(201).json(createdAuthor);
}

export const updateAuthor = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { author } = req.body;
    assert(author, AuthorUpdateData);

    try {
        const updatedAuthor = await prisma.author.update({
            where: {
                id: parseInt(id)
            },
            data: author
        });
        res.status(201).json(updatedAuthor);
    } catch (err: unknown) {
        if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
            throw new NotFoundError('Author Not Found');
        }
    }
}

export const deleteAuthor = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedAuthor = await prisma.author.delete({
            where: {
                id: parseInt(id)
            }
        });

        res.status(204).json(deletedAuthor);
    } catch (err: unknown) {
        if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
            throw new NotFoundError('Author Not Found');
        }
        throw err;
    }
}