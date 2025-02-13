import {prisma} from "../db";
import {Request, Response, NextFunction} from "express";
import {assert} from "superstruct";
import {CreateUserData, LoginUserData} from "../validation/user";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {compare, hash} from "bcryptjs";
import jwt from "jsonwebtoken";
import { expressjwt, Request as AuthRequest } from 'express-jwt';

export const auth_client = [
    expressjwt({
        secret: process.env.JWT_SECRET as string,
        algorithms: ['HS256'],
    }),
    async (req: AuthRequest, res: Response, next: NextFunction) => {
        const user = await prisma.user.findUnique({
            where: { id: Number(req.auth?.id) }
        });
        if (user) {
            req.auth = user;
            next();
        } else {
            res.status(401).send('Invalid token');
        }
    }
];

export const createUser = async(req: Request, res: Response) => {
    const {user} = req.body;
    assert(user, CreateUserData);

    user.password = await hash(user.password, 10);

    try {
        const createdUser = await prisma.user.create({
            data: {
                ...user
            }
        });

        const newUser : {id: number, email: string, username: string} = {
            id: createdUser.id,
            email: createdUser.email,
            username: createdUser.username
        }

        res.status(201).json(newUser);
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

    if (!await compare(user.password, foundUser.password)) {
        res.status(401).json({error: 'Invalid Password'});
        return;
    }

    const loggedUser : {id: number, email: string, username: string} = {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username
    }

    const token = jwt.sign(loggedUser, process.env.JWT_SECRET as string);

    res.status(200).json({token, loggedUser});
}