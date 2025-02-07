import {prisma} from "../db";
import {Request, Response} from "express";

export const createUser = async(req: Request, res: Response) => {
    const {user} = req.body;

    const createdUser = await prisma.user.create({
        data: {
            ...user
        }
    });

    res.status(201).json(createdUser);
}

export const loginUser = async(req: Request, res: Response) => {
    const { user } = req.body;

    const foundUser = await prisma.user.findUnique({
        where: {
            email: user.email
        }
    });

    if (foundUser == null) {
        res.status(404).json({error: 'User Not Found'});
        return;
    }

    if (foundUser.password !== user.password) {
        res.status(401).json({error: 'Invalid Password'});
        return;
    }

    res.status(200).json(foundUser);
}