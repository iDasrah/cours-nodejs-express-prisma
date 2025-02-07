import { Request, Response} from "express";
import { prisma } from "../db";
import {assert} from "superstruct";
import {RatingData} from "../validation/rating";

export const getBookRatings = async(req: Request, res: Response) => {
    const book = await prisma.book.findUnique({
        where: {
            id: parseInt(req.params.id)
        },
        include: {
            ratings: true
        }
    });

    res.status(200).json(book?.ratings);
}

export const createBookRating = async(req: Request, res: Response) => {
    const { id } = req.params;
    const {rating} = req.body;
    assert(rating, RatingData);

    const createdRating = await prisma.rating.create({
        data: {
            ...rating,
            book: {
                connect: {
                    id: parseInt(id)
                }
            }
        }
    });

    res.status(201).json(createdRating);
}

export const updateBookRating = async(req: Request, res: Response) => {
    const {id} = req.params;
    const {rating} = req.body;
    assert(rating, RatingData);

    const updatedRating = await prisma.rating.update({
        where: {
            id: parseInt(id)
        },
        data: {
            ...rating
        }
    });

    res.status(201).json(updatedRating);
}

export const deleteBookRating = async(req: Request, res: Response) => {
    const {id} = req.params;

    const deletedRating = await prisma.rating.delete({
        where: {
            id: parseInt(id)
        }
    });

    res.status(204).json(deletedRating);
}

export const getAverageBookRating = async(req: Request, res: Response) => {
    const {id} = req.params;

    const average = await prisma.rating.aggregate({
        where: {
            bookId: parseInt(id)
        },
        _avg: {
            value: true
        }
    });

    res.status(200).json(average);
}