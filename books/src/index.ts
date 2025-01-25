import express, { Request, Response, NextFunction } from 'express';
import {HttpError} from "./error";
import {StructError} from "superstruct";
import {createAuthor, deleteAuthor, getAllAuthors, getOneAuthor, updateAuthor} from "./requestHandlers/author";
import {createBook, deleteBook, getAllBooks, getBooksByAuthor, getOneBook, updateBook} from "./requestHandlers/book";

const app = express();
const port = 3000;

app.use(express.json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof HttpError) {
        if (err.status != null) {
            res.status(err.status).json({error: err.message});
        }
    } else if (err instanceof StructError) {
        err.status = 400;
        err.message = `Bad value for field ${err.key}`;
    } else {
        res.status(500).json({error: 'Internal Server Error'});
}});

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