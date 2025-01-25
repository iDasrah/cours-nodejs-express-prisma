import express, { Request, Response, NextFunction } from 'express';
import {HttpError} from "./error";
import {assert, object, optional, refine, string, StructError} from "superstruct";
import {createAuthor, deleteAuthor, getAllAuthors, getOneAuthor, updateAuthor} from "./requestHandlers/author";
import {createBook, deleteBook, getAllBooks, getBooksByAuthor, getOneBook, updateBook} from "./requestHandlers/book";
import {isInt} from "validator";

export const ReqParams = object({
    id: optional(refine(string(), 'int', (value) => isInt(value)))
})

const validateParams = (req: Request, res: Response, next: NextFunction) => {
    assert(req.params, ReqParams);
    next();
}

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
    .all(validateParams)
    .get(getOneAuthor)
    .patch(updateAuthor)
    .delete(deleteAuthor);

// BOOKS
app.get('/books', getAllBooks);

app.route('/books/:id')
    .all(validateParams)
    .get(getOneBook)
    .patch(updateBook)
    .delete(deleteBook);

app.route('/authors/:id/books')
    .all(validateParams)
    .get(getBooksByAuthor)
    .post(createBook);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});