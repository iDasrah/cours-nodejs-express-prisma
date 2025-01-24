import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import {HttpError, NotFoundError} from "./error";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

const app = express();
const port = 3000;

app.use(express.json());

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status ?? 500).send(err.message);
});

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.get('/authors', async (req: Request, res: Response) => {
    const authors = await prisma.author.findMany();
    res.json(authors);
});

app.get('/authors/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const author = await prisma.author.findUnique({
        where: {
            id: parseInt(id)
        }
    });

    if (author) {
        res.status(200).send(author);
    } else {
        throw new NotFoundError('Author not found');
    }
});

app.post('/authors', async (req: Request, res: Response) => {
    const { author } = req.body;
    await prisma.author.create(
        {
            data: author
        }
    );

    res.status(201).json(author);
});

app.patch('/authors/:id', async (req: Request, res: Response) => {
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
});

app.delete('/authors/:id', async (req: Request, res: Response) => {
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
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});