import {Request, Response} from "express";
import {prisma} from "../db";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {NotFoundError} from "../error";

export const getAllAuthors = async(req: Request, res: Response) => {
    const authors = await prisma.author.findMany();
    res.json(authors);
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

    const deletedAuthor = await prisma.author.delete({
        where: {
            id: parseInt(id)
        }
    });

    res.status(204).json(deletedAuthor);
}