import { Request, Response } from 'express';
import { prisma } from "../db";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {HttpError, NotFoundError} from "../error";
import {assert} from "superstruct";
import {TagCreationData, TagUpdateData} from "../validation/tag";

export const getAllTags = async (req: Request, res: Response) => {
    const tags = await prisma.tag.findMany();

    res.json(tags).status(200);
}

export const getOneTag = async (req: Request, res: Response) => {
    const {id} = req.params;

    const tag = await prisma.tag.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    res.json(tag).status(200);
}

export const getTagsByBook = async (req: Request, res: Response) => {
    const {id} = req.params;

    const tags = await prisma.tag.findMany({
        where: {
            books: {
                some: {
                    id: parseInt(id)
                }
            }
        }
    });

    res.json(tags).status(200);
}

export const createTag = async (req: Request, res: Response) => {
    const { tag } = req.body;
    assert(tag, TagCreationData);

    try {
        const createdTag = await prisma.tag.create({
            data: tag
        });

        res.json(createdTag).status(201);
    } catch (err: unknown) {
        if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
            throw new HttpError("Tag Already Exists", 409);
        }
    }
}

export const updateTag = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { tag } = req.body;
    assert(tag, TagUpdateData);

    try {
        const updatedTag = await prisma.tag.update({
            where: {
                id: parseInt(id)
            },
            data: tag
        });

        res.json(updatedTag).status(200);
    } catch (err: unknown) {
        if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
            throw new NotFoundError('Tag Not Found');
        } else if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
            throw new HttpError("Tag Already Exists", 409);
        }
    }
}

export const deleteTag = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedTag = await prisma.tag.delete({
            where: {
                id: parseInt(id)
            }
        });

        res.status(204).json(deletedTag);
    } catch (err: unknown) {
        if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
            throw new NotFoundError('Tag Not Found');
        }
        throw err;
    }
}

export const addTagToBook = async (req: Request, res: Response) => {
    const {book_id, tag_id} = req.params;

    try {
        const book = await prisma.book.update({
            where: {
                id: parseInt(book_id)
            },
            data: {
                tags: {
                    connect: {
                        id: parseInt(tag_id)
                    }
                }
            }
        })

        res.json(book).status(200);
    } catch (err: unknown) {
        if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
            throw new NotFoundError('Book Not Found');
        }
    }
}

export const removeTagFromBook = async (req: Request, res: Response) => {
    const {book_id, tag_id} = req.params;

    try {
        const book = await prisma.book.update({
            where: {
                id: parseInt(book_id)
            },
            data: {
                tags: {
                    disconnect: {
                        id: parseInt(tag_id)
                    }
                }
            }
        })

        res.json(book).status(200);
    } catch (err: unknown) {
        if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
            throw new NotFoundError('Book Not Found');
        }
    }
}