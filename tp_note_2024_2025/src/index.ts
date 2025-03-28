import express, { Request, Response, NextFunction } from 'express';

import { assert, object, optional, refine, string, StructError } from 'superstruct';
import { isInt } from 'validator';

import { HttpError } from './error';

// TODO: import des fonctions de gestion depuis le dossier "requestHandlers"
import * as product from './requestHandlers/produit';
import * as client from './requestHandlers/client';
import * as vente from './requestHandlers/vente';

const app = express();
const port = 3000;

const ReqParams = object({
  // TODO: validation des paramètres des requêtes paramétrées
});
const validateParams = (req: Request, res: Response, next: NextFunction) => {
  assert(req.params, ReqParams);
  next();
}

app.use(express.json());

// TODO: déclaration des routes de l'API
app.route("/produits")
    .get(product.getAllProducts)
    .post(product.addProduct);

app.route("/produits/:id")
    .get(product.getOneProduct)
    .patch(product.updateProduct)
    .delete(product.deleteProduct);

app.route("/clients")
    .get(client.getAllClients)
    .post(client.addClient);

app.route("/clients/:id")
    .get(client.getOneClient)
    .patch(client.updateClient)
    .delete(client.deleteClient);

app.route("/clients/:id/ventes")
    .get(vente.getClientVentes);

app.route("/clients/:client_id/ventes/:produit_id")
    .post(vente.addClientVente);

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof StructError) {
    err.status = 400;
    err.message = `Bad value for field ${err.key}`;
  }
  res.status(err.status ?? 500).send(err.message);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
