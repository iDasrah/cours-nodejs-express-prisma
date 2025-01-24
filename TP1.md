# Introduction

On va écrire un serveur HTTP qui expose des routes (une API) permettant à des clients de manipuler, au travers de requêtes HTTP, des données stockées dans une base de données.
L'objectif de l'application développée est de gérer une communauté dédiée à la lecture de livres.

L'environnement de développement utilisé est [Node.js](https://nodejs.org/) avec le langage [TypeScript](https://www.typescriptlang.org/).

Les bibliothèques principales que nous allons utiliser sont :
- [`express`](https://expressjs.com/) pour créer le serveur HTTP, déclarer et définir ses routes
- [`Prisma`](https://www.prisma.io/) pour gérer les données en lien avec la base de données

# Initialisation du projet Node.js

Commencer par créer le dossier dans lequel on va travailler et se placer dedans :
```sh
mkdir books
cd books
```

Initialiser un projet Node.js :
```sh
npm init -y
```
Cette commande crée un fichier `package.json` qui contiendra les informations relatives au projet et à ses dépendances.

Créer un fichier `.gitignore` et y ajouter la ligne suivante, afin d'éviter de versionner les dépendances de votre projet :
```
node_modules
```

# Mise en place de TypeScript

Pour pouvoir utiliser le langage TypeScript, installer les dépendances de développement suivantes (le fichier `package.json` est mis à jour au passage) :
```sh
npm install -D typescript tsx @types/node
```

Puis, initialiser la configuration TypeScript :
```sh
npx tsc --init
```
Cette commande crée le fichier `tsconfig.json` qui contient la configuration pour le compilateur TypeScript.

# Mise en place du serveur HTTP

Installer les dépendances suivantes (le fichier `package.json` est mis à jour au passage) :
```sh
npm install express@next
npm install -D @types/express
```

Écrire un serveur HTTP minimal dans un nouveau fichier `src/index.ts` (légèrement différent de celui proposé ici https://expressjs.com/en/starter/hello-world.html) :
```ts
import express, { Request, Response, NextFunction } from 'express';

const app = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
```

Dans le fichier `package.json`, ajouter les commandes suivantes dans la section `scripts` :
```json
"start": "tsx src/index.ts"
"dev": "tsx watch src/index.ts"
```

- la commande `npm run start` permet de lancer le programme `src/index.ts`.
- la commande `npm run dev` permet de lancer ce même programme en mode développement : à chaque modification du code source, le programme est relancé.

Lancer le serveur HTTP en mode développement :
```sh
npm run dev
```

> S'assurer que le serveur HTTP fonctionne en ouvrant un navigateur et en allant à l'adresse http://localhost:3000.

# Mise en place de Prisma

`Prisma`, comme de nombreux autres ORM, est conçu pour fonctionner avec différents types de bases de données (MySQL, PostgreSQL, SQLite, ...).
Dans le cadre de ces TP, nous allons utiliser une base de données SQLite pour stocker les données de l'application.

Un outil utile pour inspecter et manipuler le contenu d'un fichier SQLite : `DB Browser for SQLite` https://sqlitebrowser.org/.

Installer la CLI de `Prisma` :
```sh
npm install -D prisma
```

S'en servir pour initialiser un nouveau projet `Prisma` :
```sh
npx prisma init --datasource-provider sqlite
```

Cette commande crée 2 choses :
- un fichier `prisma/schema.prisma` qui contiendra une description du modèle de données
- un fichier `.env` qui contient des déclarations de variables d'environnement, notamment utiles pour la connexion à la base de données (chemin, éventuels identifiants, ...) : ici la valeur `DATABASE_URL` contient le chemin vers le fichier SQLite (`./dev.db` par défaut) qui sera créé plus tard dans le dossier `prisma`.

Cette commande crée également un fichier `.gitignore` pour ignorer le fichier `.env`, afin que d'éventuels identifiants de connexion à la base de données ne risquent pas d'être partagés publiquement. Si un fichier `.gitignore` existe déjà (ce qui est le cas pour nous), un message d'avertissement est affiché afin de penser à y ajouter ce fichier `.env`.

Vous pouvez configurer votre éditeur de code pour qu'il puisse faire de la coloration syntaxique et de l'auto-complétion de PSL (Prisma Schema Language) : https://www.prisma.io/docs/orm/more/development-environment/editor-setup.

Je vous conseille également d'activer la fonctionnalité de formatage automatique de votre éditeur de code.

# Première entité

Liens vers de la documentation sur le site web de `Prisma`:
- documentation relative à la définition du modèle de données ici : https://www.prisma.io/docs/orm/prisma-schema/data-model
- référence complète des champs, types, modifieurs et attributs utilisables pour décrire un schéma ici : https://www.prisma.io/docs/orm/reference/prisma-schema-reference

Dans le fichier `prisma/schema.prisma`, ajouter la définition d'une première entité `Author` qui va représenter un auteur de livres.
Ses champs seront les suivants :
- `id` : identifiant unique de l'auteur - _entier_ - _clé primaire auto-incrémentée_
- `firstname` : prénom de l'auteur - _chaîne de caractères_ - _non nul_
- `lastname` : nom de l'auteur - _chaîne de caractères_ - _non nul_

Une fois le `model` défini, synchroniser ce modèle avec la base de données en exécutant la commande suivante :
```sh
npx prisma db push
```

Cette commande a 2 effets :
- synchroniser le schéma de la base de données avec le modèle défini dans le fichier `prisma/schema.prisma` (comme c'est la première fois, le fichier SQLite qui contient les données est également créé)
- générer tous les types _spécifiques_ à notre modèle qui vont nous permettre d'interagir avec la base de données (comme c'est la première fois, la dépendance `@prisma/client` est également installée). Le code généré est placé dans le dossier `node_modules/.prisma/client`.

# Créer des données initiales

Insérer des données initiales au sein d'une base de données est une opération communément appelée `seeding` (https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding).

Dans le fichier `package.json`, ajouter la section `prisma` suivante :
```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

Créer le fichier `prisma/seed.ts` et y ajouter le code suivant :
```ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.author.create({
    data: {
      firstname: 'J. R. R.',
      lastname: 'Tolkien'
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

Dans ce programme, on instancie un objet `PrismaClient`.
Cet objet contient une propriété pour chaque entité définie dans le modèle de données.
Dans notre cas, il contient notamment une propriété `author` qui est un objet contenant des fonctions permettant d'interagir avec la table `Author` de la base de données.

Au sein de la fonction `main`, on utilise cet objet pour créer un nouvel auteur en base de données.
Pour cela, on utilise la fonction `create` de l'objet `author` en lui passant en paramètre un objet contenant dans sa propriété `data` les valeurs des champs à insérer.

La fonction `create` renvoie une `Promise` (comme toutes les fonctions générées par `Prisma`). On utilise ici le mot-clé `await` pour attendre que la `Promise` soit résolue avant de passer à la suite du programme. Toute fonction qui utilise le mot-clé `await` pour attendre la résolution d'une `Promise` doit être déclarée comme `async`, et renverra alors à son tour implicitement une `Promise`.

Afin de lancer le _seeding_ de la base de données, exécuter la commande suivante :
```sh
npx prisma db seed
```

> Vérifier que les données ont bien été insérées dans la base de données en lançant Prisma Studio : `npx prisma studio` (vous pouvez garder cette commande lancée et l'onglet ouvert dans votre navigateur pour suivre l'évolution des données).

Pour ajouter plusieurs entités, on peut par exemple commencer par déclarer un tableau d'objets contenant les données à insérer :
```ts
const authors = [
  {
    firstname: 'J. R. R.',
    lastname: 'Tolkien'
  },
  {
    firstname: 'H. P.',
    lastname: 'Lovecraft'
  }
];
```

Puis, dans la fonction `main`, on va alors appeler la fonction `create` pour chaque élément du tableau :
```ts
for (const author of authors) {
  await prisma.author.create({
    data: author
  });
}
```

Si on exécute à nouveau le script de _seeding_, on va se retrouver avec 2 enregistrements de `Tolkien` dans la table `Author`.
À ce stade, on peut réinitialiser complètement la base de données avant de réexécuter le _seeding_ en exécutant les commandes suivantes :
```sh
npx prisma db push --force-reset
npx prisma db seed
```

Par la suite, une fois que l'on aura mis en place une première _migration_, on aura une autre commande plus simple à disposition pour réinitialiser les données si on le souhaite.

# Premières routes HTTP

Dans l'application `express`, déclarer et écrire les route HTTP suivantes :
 - `GET /authors` : renvoie l'ensemble des auteurs sous la forme d'un tableau d'objets en JSON
 - `GET /authors/:author_id` : renvoie l'auteur d'identifiant `author_id` sous la forme d'un objet en JSON

Pour renvoyer une réponse au format JSON, utiliser la méthode `json` de l'objet `Response` (https://expressjs.com/en/5x/api.html#res.json).

La documentation de `Prisma` relative à l'ensemble des opérations CRUD est disponible ici : https://www.prisma.io/docs/orm/prisma-client/queries/crud.
Pour les 2 routes à écrire, voir les fonctions `findMany` et `findUnique`.

Attention, comme ces fonctions renvoient des `Promise` dont on va devoir attendre la résolution avec le mot clé `await`, nos `middlewares` de gestion des requêtes seront asynchrones. Il faut alors les déclarer comme `async`.

Installer l'application Postman (https://www.postman.com/downloads/).
Afin de pouvoir gérer des `Collections`, il faut créer un compte (gratuit).

Créer une `Collection` nommée `Books` pour y sauvegarder les requêtes HTTP que vous allez créer pour tester votre application.
Dans les propriétés de la `Collection`, définir les variables suivantes :
- `base_url` : `http://localhost:3000`
- `author_id` : `1`

Créer et tester ensuite les 2 premières requêtes `GET` suivantes :
- `authors` : avec l'URL `{{base_url}}/authors`
- `authors/:author_id` : avec l'URL `{{base_url}}/authors/{{author_id}}`

## Gestion d'erreurs

Essayez de faire une requête pour récupérer un auteur dont l'identifiant ne correspond à aucun auteur en base de données.
Que se passe-t-il ?

Plutôt que de renvoyer un code de succès (200) avec une valeur `null` dans le corps de la réponse, il est préférable d'utiliser les codes prévus à cet effet dans le protocole HTTP et de renvoyer un code d'erreur (404 dans le cas d'une ressource non trouvée) avec un message d'erreur dans le corps de la réponse.

Dans notre cas, selon la valeur obtenue à la résolution de l'appel à la fonction `findUnique`, on renverra soit :
- une réponse avec un code de succès (200) et l'objet correspondant au format JSON.
- une réponse avec un code d'erreur (404) et un message d'erreur dans le corps de la réponse. Pour cela, utiliser les méthodes `status` et `send` de l'objet `Response`.

### Détails supplémentaires

Si une `Promise` attendue au sein d'un `RequestHandler` d'`express`est rejetée (ce qui peut arriver au sein de l'appel à une fonction `Prisma`) ou qu'une valeur y est explicitement `throw`, cette valeur est alors automatiquement transmise au prochain `middleware` de gestion d'erreur configuré dans notre application `express`.

Pour le moment, nous n'en avons pas déclaré, et `express` en fournit un par défaut.
Ce dernier renvoie une réponse avec un code d'erreur 500 et un document HTML contenant un message d'erreur dans le corps de la réponse.

Vous pouvez tester différents cas de ce comportement assez simplement.
Par exemple :
- à la route `/`, `throw` manuellement une nouvelle `Error` avec un message d'erreur de votre choix
- supprimer le fichier `prisma/dev.db` et relancer le serveur : lors d'une requête aux routes `/authors` ou `/authors/:author_id`, comme la base de données n'est pas accessible, une erreur est `throw` par les fonctions `findUnique` ou `findMany` de `Prisma`.

Si on veut simplifier et maîtriser la réponse (on ne souhaite pas forcément retourner un document HTML), on peut définir notre propre `middleware` de gestion d'erreur dans l'application `express` (après les `middleware` de gestion des routes) :
```ts
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send(err.message);
});
```

### Objet Error personnalisé

Pour renvoyer des réponses avec des codes d'erreur différents selon le type d'erreur, on peut définir un nouveau type `HttpError` qui étend la classe `Error` (cette définition de `class` peut être exportée depuis un nouveau module `error.ts` et importée dans les modules où on en a besoin) :
```ts
export class HttpError extends Error {
  status?: number; // optionnel, afin de rester compatible avec le type Error standard

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
```

Maintenant, dans nos `middlewares` de gestion des requêtes, quand le cas se présente comme ici dans la route `/authors/:author_id` quand aucun enregistrement ne correspond à l'identifiant reçu, on peut `throw` une `HttpError` avec un message et code d'erreur spécifique. Par exemple :
```ts
throw new HttpError('Author not found', 404);
```

Enfin, dans notre `middleware` de gestion d'erreur, on peut utiliser le code potentiellement présent dans l'objet `err` pour renvoyer une réponse avec le code d'erreur spécifié (ou 500 si le champ `status` n'est pas présent dans l'objet) :
```ts
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status ?? 500).send(err.message);
});
```

Si on le souhaite, on peut facilement se créer des classes d'erreur spécifiques pour différents types d'erreurs.
Par exemple, on pourrait définir une classe `NotFoundError` qui étend `HttpError` et qui a un code d'erreur 404 par défaut :
```ts
export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(message, 404);
  }
}
```

## Réception de données

Pour récupérer les données fournies par le client avec la requête HTTP au format JSON, il faut tout d'abord déclarer un `middleware` spécifique, fourni en standard par `express` :
```ts
app.use(express.json());
```

Ce `middleware` (à déclarer avant les `middleware` de gestion des routes) va analyser la requête en cours de traitement. Si elle contient des données au format JSON (selon ce qui est déclaré dans l'en-tête `Content-Type`), ces dernières seront parsées et le résultat ajouté à l'objet `Request` sous la propriété `body`.

Déclarer et écrire les route HTTP suivantes :
 - `POST /authors` : ajoute un nouvel auteur en base de données directement à partir des données fournies par le client avec la requête au format JSON, puis retourne l'entité créée au format JSON (avec le code de retour de succès 201 (Created))
 - `PATCH /authors/:author_id` : modifie l'auteur d'identifiant `author_id` à partir des données fournies au format JSON

Vous pouvez continuer à lire la documentation des opérations CRUD de `Prisma` pour trouver les fonctions à utiliser pour ajouter et mettre à jour des enregistrements en base de données : https://www.prisma.io/docs/orm/prisma-client/queries/crud.

> Tester ces routes en créant de nouvelles requêtes dans votre `Collection` Postman en envoyant des données au format JSON dans le corps de la requête (onglet `Body` -> `raw` -> `JSON`).
> Observer le comportement de l'application si les données fournies ne sont pas du JSON valide, ou que des champs manquent, ou qu'on fournit des données inattendues, etc.

Déclarer, écrire et tester la route HTTP suivante :
 - `DELETE /authors/:author_id` : supprime l'auteur d'identifiant `author_id` (avec le code de retour de succès 204 (No Content))

### Gestion d'erreurs spécifique pour `update` et `delete`

Dans le cas des fonctions `update` et `delete`, si l'entité à mettre à jour ou à supprimer n'existe pas, une erreur est `throw` par `Prisma` (contrairement à un appel à `findUnique` qui renvoie `null` dans ce cas).
Ces informations sont bien précisées dans la partie `Reference` de la documentation, que l'on peut atteindre par exemple en suivant le lien présenté sur les noms de fonctions correspondants dans la documentation générale des opérations CRUD.

Si on ne fait rien de particulier, ces erreurs seront transmises directement jusqu'au `middleware` de gestion d'erreur qui renverra une réponse générique avec un code d'erreur 500 et le message d'erreur dans le corps de la réponse.

> Afin de renvoyer un code d'erreur 404 dans ce cas, il faut alors intercepter cette erreur (en écrivant les appels à `update` et `delete` dans un bloc `try`/`catch`) et en cas de récupération d'une erreur, `throw` une `NotFoundError` avec le message `Author not found`.

Si on effectue simplement cela, on a alors un autre problème : le fait que l'entité ciblée par l'identifiant fourni n'existe pas n'est pas l'unique raison pour laquelle une erreur pourrait être `throw` par `Prisma`.
En effet, comme vous l'avez normalement déjà remarqué, dans le cas de l'opération `update` par exemple, si on fournit des données invalides (par exemple, un champ ayant un nom inconnu), une erreur est également `throw` par `Prisma`.
Dans ce cas, il ne serait pas cohérent (et même une fausse information donnée au client) de retourner un code d'erreur 404 indiquant que l'entité n'existe pas, alors que cela n'a rien à voir avec le problème sous-jacent.

> Il faut donc analyser l'erreur récupérée dans le bloc `catch` pour déterminer si elle est due à une entité non trouvée, et dans ce cas, `throw` une `NotFoundError`, ou à une autre raison, et dans ce cas, simplement `throw` à nouveau l'erreur telle quelle.

En TypeScript, les variables d'erreur récupérées dans un bloc `catch` sont de type `unknown`. C'est le type le plus large de TypeScript. N'importe quelle valeur peut être assignée à une variable de type `unknown`, mais on ne peut rien en faire tant qu'on n'a pas "réduit" (_narrowed_) son type à un type plus spécifique.

Dans notre cas, on veut tester si l'erreur que l'on vient de récupérer est une instance de la classe `PrismaClientKnownRequestError` (qui est la classe de base pour toutes les erreurs connues de `Prisma`) : https://www.prisma.io/docs/orm/reference/error-reference.
Si c'est le cas, on peut alors accéder à la propriété `code` de l'objet d'erreur pour déterminer si l'erreur est due à une entité non trouvée.
En cherchant un peu parmi les codes d'erreur, on trouve que c'est le code `P2025` qui correspond à une entité non trouvée.

On peut donc finalement écrire quelque chose comme cela :
```typescript
try {
  // ...
} catch (err: unknown) {
  if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
    throw new NotFoundError('Author not found');
  }
  throw err;
}
```

> Tester que tout se déroule comme prévu.

Les erreurs liées à la validation des données fournies par le client seront traitées par la suite avec une bibliothèque spécifique.
