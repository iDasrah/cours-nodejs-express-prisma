import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
const port = 3000;

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
    res.json(author);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});