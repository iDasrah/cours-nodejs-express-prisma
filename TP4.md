# User, Comment, Note & authentification

Ajouter la définition des nouvelles entités suivantes :
- `User` : utilisateur de l'application
  - `email` : adresse email - _chaîne de caractères_ - _unique_ - _non nul_
  - `password` : mot de passe - _chaîne de caractères_ - _non nul_
  - `username` : nom d'utilisateur - _chaîne de caractères_ - _unique_
- `Comment` : commentaire sur un livre
  - `content` : contenu du commentaire - _chaîne de caractères_ - _non nul_
  - `createdAt` : date de création du commentaire - _date_ - _non nul_
  - `updatedAt` : date de dernière mise à jour du commentaire - _date_ - _non nul_
- `Rating` : note attribuée à un livre par un utilisateur
  - `value` : valeur de la note - _entier_ - _non nul_

> Pour le champ `createdAt` et `updatedAt`, utiliser le type `DateTime` de `Prisma`.
> Voir également la fonction `now()` et l'attribut `@updatedAt` :
> - `now()` : https://www.prisma.io/docs/orm/reference/prisma-schema-reference#now
> - `@updatedAt` : https://www.prisma.io/docs/orm/reference/prisma-schema-reference#updatedat

Ces entités sont associées de la manière suivante :
- un `User` peut écrire plusieurs `Comment`
- un `Comment` est écrit par un seul `User`
- un `Comment` est associé à un seul `Book`
- un `Book` peut avoir plusieurs `Comment`
- un `User` peut attribuer plusieurs `Rating`
- un `Rating` est attribuée par un seul `User`
- un `Rating` est attribuée à un seul `Book`
- un `Book` peut avoir plusieurs `Rating`

_Attention_: faire en sorte qu'un `User` ne puisse pas donner plusieurs `Rating` à un même `Book` (voir la documentation à ce sujet ici : https://www.prisma.io/docs/orm/prisma-schema/data-model/models#defining-a-unique-field).

Les `Comment` et les `Rating` sont supprimés si le `User` ou le `Book` associé est supprimé.

> Générer la migration.

Vous pouvez mettre à jour le script de `seeding` pour créer des `User` avec des `Comment` et des `Rating`.

Le champ `password` de `User` tel que nous le stockerons dans la base de données sera le résultat du hash avec la fonction `bcrypt` du mot de passe fourni par l'utilisateur.
Afin de générer des valeurs pour ce champ dans votre script de `seeding`, vous pouvez utiliser le service en ligne suivant : https://bcrypt-generator.com/.

## Nouvelles routes

> **Atention**: des détails concernant la gestion de ces différentes routes sont donnés progressivement dans les sections suivantes.

Ajouter les routes suivantes :
- `POST /signup` : crée un nouvel utilisateur
- `POST /signin` : vérifie les informations d'identification d'un utilisateur et retourne un token d'authentification
- `GET /books/:book_id/comments` : retourne la liste des commentaires associés au livre dont l'identifiant est `:book_id`
- `POST /books/:book_id/comments` : crée un nouveau commentaire associé au livre dont l'identifiant est `:book_id`. Le propriétaire du commentaire est le `User` à l'origine de la requête (_cette route nécessite un token d'authentification_)
- `PATCH /comments/:comment_id` : met à jour le commentaire dont l'identifiant est `:comment_id`. Vérifie que le propriétaire du commentaire est bien le `User` à l'origine de la requête (_cette route nécessite un token d'authentification_)
- `DELETE /comments/:comment_id` : supprime le commentaire dont l'identifiant est `:comment_id`. Vérifie que le propriétaire du commentaire est bien le `User` à l'origine de la requête (_cette route nécessite un token d'authentification_)
- `GET /books/:book_id/ratings` : retourne la liste des notes associées au livre dont l'identifiant est `:book_id`
- `POST /books/:book_id/ratings` : crée une nouvelle note associée au livre dont l'identifiant est `:book_id`. Le propriétaire de la note est le `User` à l'origine de la requête (_cette route nécessite un token d'authentification_)
- `PATCH /ratings/:rating_id` : met à jour la note dont l'identifiant est `:rating_id`. Vérifie que le propriétaire de la note est bien le `User` à l'origine de la requête (_cette route nécessite un token d'authentification_)
- `DELETE /ratings/:rating_id` : supprime le commentaire dont l'identifiant est `:rating_id`. Vérifie que le propriétaire de la note est bien le `User` à l'origine de la requête (_cette route nécessite un token d'authentification_)
- `GET /books/:book_id/ratings/average` : retourne la moyenne des notes associées au livre dont l'identifiant est `:book_id`

Comme pour les routes précédentes, on écrira les fonctions de gestion des requêtes dans des fichiers dédiés pour chaque entité (`User`, `Comment`, `Rating`).

Pour le calcul de la moyenne, lire la documentation associée au requêtes d'aggrégation de données (notamment la fonction `groupBy`) : https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing.

### Validation

Comme on l'a déjà vu, un certain nombre de contraintes sont déjà validées par `Prisma` lors de la création ou de la mise à jour d'une entité.
Il s'agit de toutes les contraintes qui sont exprimées au niveau du schéma, notamment les contraintes de non nullité, d'unicité et d'association.
Par exemple, `Prisma` ne nous laissera pas créer un `User` sans `email` ou avec un `email` qui existe déjà dans la base de données.

En revanche, on ne peut pas exprimer directement des contraintes de validation de plus haut niveau, comme par exemple la longueur minimale d'un champ ou le fait qu'une chaîne de caractère corresponde à un format particulier.

> Dans la validation des données fournies par l'utilisateur dans la fonction `signup`, valider que le champ `email` est bien une adresse email valide et que le champ `password` fait au moins 8 caractères.

Pour la validation de l'adresse email, utiliser le module `validator`.

> Récupérer l'erreur générée par `Prisma` lors d'une tentative de création d'un `User` avec un `email` déjà existant (contrainte d'unicité) et retourner un message d'erreur explicite.

Pour les entités `Rating`, valider que la propriété `value` est bien comprise entre 0 et 5.

### Hachage

Le mot de passe fourni par l'utilisateur doit être haché avant d'être stocké dans la base de données.
Pour cela, dans la fonction `signup`, utiliser la fonction `hash` du module `bcryptjs` :
```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

Dans la fonction `signin`, on doit comparer le mot de passe fourni par l'utilisateur avec le mot de passe haché stocké dans la base de données.
Pour cela, utiliser la fonction `compare` du module `bcryptjs`.

### JWT

Une fois que l'on a vérifié que le couple `email`/`password` fourni par l'utilisateur est correct, on va générer un token d'authentification qui sera utilisé ensuite pour authentifier l'utilisateur lors des requêtes suivantes.

Pour cela, on va utiliser le module `jsonwebtoken` :
```bash
npm install jsonwebtoken
```

À l'aide de la fonction `sign` de ce module, générer un token d'authentification qui contient l'identifiant de l'utilisateur.
La chaîne de caractères secrète utilisée pour générer le token peut être stockée dans le fichier `.env`, par exemple sous le nom `JWT_SECRET`, et sa valeur peut être récupérée dans le code avec `process.env.JWT_SECRET`.

> La route `/signin` retourne à la fois l'entité `User` et le token d'authentification.

### Filtrer les champs retournés

Les routes `/signup` et `/signin` retournent une entité `User`.
Le champ `password`, même haché, ne doit pas être retourné par ces routes.

> Faire en sorte que le champ `password` ne soit pas retourné par les routes `/signup` et `/signin`.

### Authentification

Plusieurs routes (dont par exemple `POST /books/:book_id/comments` et `POST /books/:book_id/ratings`) nécessitent de connaître l'identifiant de l'utilisateur qui est à l'origine de la requête.
Pour cela, on va utiliser le token d'authentification fourni par le client.

Le module `express-jwt` fournit un `middleware` qui permet de vérifier la présence et la validité d'un token d'authentification et de récupérer les données qu'il renferme :
```bash
npm install express-jwt
```

Les routes pour lesquelles on a besoin de s'assurer que l'utilisateur est authentifié peuvent alors utiliser le couple de `middleware` suivant, qui peut être également exporté par le module `user.ts` :
```typescript
import { Request, Response, NextFunction } from 'express';
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
```

Le premier `middleware` vérifie la présence et la validité du token d'authentification.
En cas d'absence ou d'invalidité du token, il `throw` avec un message d'erreur (et on entre alors dans le `middleware` de gestion d'erreur).
En cas de succès, il ajoute à l'objet `Request` une propriété `auth` qui contient les données déchiffrées du token d'authentification.

Le type de l'objet `Request` augmenté de la propriété `auth` est fourni par le module `express-jwt` et est nommé `Request`.
Afin de ne pas entrer en collision avec le type `Request` fourni par `express`, on le renomme ici en `AuthRequest` lors de l'import.

Le second `middleware` utilise l'identifiant de l'utilisateur contenu dans les données issues du token d'authentification pour récupérer l'entité `User` correspondante depuis la base de données.
Si l'entité `User` existe, on ajoute cette entité à l'objet `Request` et on appelle le `middleware` suivant, qui pourra accéder à l'entité `User` via la propriété `auth` de l'objet `AuthRequest`.
Sinon, on renvoie une erreur 401.

### Test depuis Postman

Dans Postman, afin d'envoyer un token d'authentification dans une requête, aller dans l'onglet `Auth` de la requête, sélectionner le type `Bearer Token` et coller le token dans le champ `Token`.
