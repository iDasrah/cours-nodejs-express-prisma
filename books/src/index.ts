import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import {HttpError, NotFoundError} from "./error";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {createAuthor, deleteAuthor, getAllAuthors, getOneAuthor, updateAuthor} from "./requestHandlers/author";
import {createBook, deleteBook, getAllBooks, getBooksByAuthor, getOneBook, updateBook} from "./requestHandlers/book";

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

// AUTHORS

app.get('/authors', async (req: Request, res: Response) => {
    await getAllAuthors(req, res);
});

app.get('/authors/:id', async (req: Request, res: Response) => {
    await getOneAuthor(req, res);
});

app.post('/authors', async (req: Request, res: Response) => {
    await createAuthor(req, res);
});

app.patch('/authors/:id', async (req: Request, res: Response) => {
    await updateAuthor(req, res);
});

app.delete('/authors/:id', async (req: Request, res: Response) => {
    await deleteAuthor(req, res);
});

// BOOKS

app.get('/books', async (req: Request, res: Response) => {
    await getAllBooks(req, res);
});

app.get('/books/:id', async (req: Request, res: Response)=> {
    await getOneBook(req, res);
});

app.get('/authors/:id/books', async (req: Request, res: Response) => {
    await getBooksByAuthor(req, res);
});

app.post('/authors/:id/books', async (req: Request, res: Response) => {
    await createBook(req, res);
});

app.patch('/books/:id', async (req: Request, res: Response) => {
    await updateBook(req, res);
});

app.delete('/books/:id', async (req: Request, res: Response) => {
    await deleteBook(req, res);
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});