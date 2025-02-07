import {prisma} from "../db";
import {Request, Response} from "express";
import {assert} from "superstruct";
import {CreateUserData, LoginUserData} from "../validation/user";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";

export const createUser = async(req: Request, res: Response) => {
    const {user} = req.body;
    assert(user, CreateUserData);

    try {
        const createdUser = await prisma.user.create({
            data: {
                ...user
            }
        });

        res.status(201).json(createdUser);
    } catch (err: unknown) {
        if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
            res.status(409).json({error: 'User Already Exists'});
        }
    }

}

export const loginUser = async(req: Request, res: Response) => {
    const { user } = req.body;
    assert(user, LoginUserData);

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