import { Request, Response } from 'express';
import { prisma } from '../db';

export const getBookComments = async(req: Request, res: Response) => {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            comments: true
        }
    });

    res.status(200).json(book?.comments);
}

export const createBookComment = async(req: Request, res: Response) => {
    const { id } = req.params;
    const { comment } = req.body;

    const createdComment = await prisma.comment.create({
        data: {
            ...comment,
            book: {
                connect: {
                    id: parseInt(id)
                }
            }
        }
    });

    res.status(201).json(createdComment);
}

export const updateBookComment = async(req: Request, res: Response) => {
    const { id } = req.params;
    const { comment } = req.body;

    const updatedComment = await prisma.comment.update({
        where: {
            id: parseInt(id)
        },
        data: {
            ...comment
        }
    });

    res.status(201).json(updatedComment);
}

export const deleteBookComment = async(req: Request, res: Response) => {
    const { id } = req.params;

    const deletedComment = await prisma.comment.delete({
        where: {
            id: parseInt(id)
        }
    });

    res.status(204).json(deletedComment);
}