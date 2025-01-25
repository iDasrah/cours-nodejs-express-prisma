import express, { Request, Response, NextFunction } from 'express';
import {HttpError} from "./error";
import {createAuthor, deleteAuthor, getAllAuthors, getOneAuthor, updateAuthor} from "./requestHandlers/author";
import {createBook, deleteBook, getAllBooks, getBooksByAuthor, getOneBook, updateBook} from "./requestHandlers/book";

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

app.route('/authors')
    .get(getAllAuthors)
    .post(createAuthor);

app.route('/authors/:id')
    .get(getOneAuthor)
    .patch(updateAuthor)
    .delete(deleteAuthor);

// BOOKS
app.get('/books', getAllBooks);

app.route('/books/:id')
    .get(getOneBook)
    .patch(updateBook)
    .delete(deleteBook);

app.route('/authors/:id/books')
    .get(getBooksByAuthor)
    .post(createBook);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});