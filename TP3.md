# Many-to-many

## Ajout d'une nouvelle entité

Ajouter la définition d'une nouvelle entité `Tag` qui contient :
- un champ `name` qui est une chaîne de caractères _unique_

(https://www.prisma.io/docs/orm/prisma-schema/data-model/models#defining-a-unique-field)

Associer cette nouvelle entité avec l'entité `Book` de sorte que :
- un `Book` est associé à _plusieurs_ `Tag`
- un `Tag` est associé à _plusieurs_ `Book`

La relation entre `Book` et `Tag` est une relation `n:n` ou Many-to-many (un livre peut avoir plusieurs tags, un tag peut être associé à plusieurs livres).

La documentation de `Prisma` sur les relations Many-to-many se trouve ici : https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/many-to-many-relations.

> Mettre en place une relation Many-to-many _implicite_ entre `Book` et `Tag` (la table d'association est générée automatiquement par `Prisma`).

> Générer la migration (regarder le script SQL généré par curiosité).

Afin d'avoir des données de test, mettre à jour le script de `seeding` pour créer des `Tags`.
Le plus simple est de commencer par créer un ensemble de `Tags`.
Puis, lors de la création des `Authors` avec leurs `Books`, d'associer un ou plusieurs `Tag` à chaque `Book`.

La documentation relative à la connexion d'entités existantes lors de la création d'une entité : https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#connect-multiple-records.

Comme les identifiants des `Tag` sont générés automatiquement, et qu'on ne les connaît pas, on ne peut pas les utiliser pour les associer aux `Book`.
Heureusement, Prisma permet d'utiliser n'importe quel champ `unique` pour identifier une entité à connecter à une autre (et le `name` des `Tags` est déclaré comme étant `unique`).

> Si vous voulez avoir vos données de `seeding` dans la base de données, il faut la réinitialiser avec la commande `npx prisma migrate reset`.

## Nouvelles routes

Ajouter les routes suivantes :
- `GET /tags` : retourne la liste des tags
- `GET /tags/:tag_id` : retourne le tag dont l'identifiant est `:tag_id`
- `GET /books/:book_id/tags` : retourne la liste des tags associés au livre dont l'identifiant est `:book_id`
- `POST /tags` : crée un nouveau tag
- `PATCH /tags/:tag_id` : met à jour le tag dont l'identifiant est `:tag_id`
- `DELETE /tags/:tag_id` : supprime le tag dont l'identifiant est `:tag_id`
- `POST /books/:book_id/tags/:tag_id` : associe le tag dont l'identifiant est `:tag_id` au livre dont l'identifiant est `:book_id`
- `DELETE /books/:book_id/tags/:tag_id` : supprime l'association entre le tag dont l'identifiant est `:tag_id` et le livre dont l'identifiant est `:book_id`

> Comme pour les routes précédentes, on écrira les fonctions de gestion des requêtes dans un fichier dédié.

Pour les routes `POST /books/:book_id/tags/:tag_id` et `DELETE /books/:book_id/tags/:tag_id`, on pourra utiliser les fonctionnalités `connect` (https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#connect-a-single-record) et `disconnect` (https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#disconnect-a-related-record).

Pour la gestion des erreurs, vous pouvez inspecter le code d'erreur `Prisma` généré selon les cas (par exemple en logant la valeur de `err.code`) et retourner des messages d'erreur adaptés.

> Lors de la création et de la mise à jour d'un `Tag`, comme le champ `name` a été déclaré comme étant `unique`, `Prisma` va `throw` une erreur dans le cas d'une tentative de création ou de modification d'un `Tag` avec un `name` déjà existant. Il faut donc traiter ces cas avec des codes et messages adaptés, en plus des cas de non-existence des entités visées lors de la modification / suppression d'un `Tag` et de la création / suppression d'une association `Book`-`Tag`.

# Filtrage et tri

`Prisma` permet d'exprimer facilement des filtres et du tri sur les requêtes de récupération d'entités.
La documentation relative à ces fonctionnalités se trouve ici : https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting.

On peut par exemple filtrer les `Author` selon que leur `lastname` contient la chaîne de caractères donnée, et trier les `Author` selon leur `lastname` de manière croissante :
```typescript
const authors = await prisma.author.findMany({
  where: {
    lastname: { contains: "bla" }
  },
  orderBy: {
    lastname: 'asc'
  }
});
```

Il faut un moyen de permettre au client de spécifier les filtres qu'il souhaite appliquer sur les requêtes de récupération d'entités.
Pour cela, on peut par exemple exploiter la `query string` de l'URL.
Une requête de la forme `GET /authors?lastname=bla` permet alors de récupérer les auteurs dont le `lastname` contient `bla`.

Dans `express`, on a accès à la `query string` de l'URL via la propriété `query` de l'objet `Request` (https://expressjs.com/en/5x/api.html#req.query).

> Mettre en place le filtrage par `lastname` pour la route `GET /authors` et par `title` pour les routes `GET /books` et `GET /authors/:author_id/books`.
>
> Trier systématiquement les résultats par ordre croissant de `lastname` ou `title`.

Pour satisfaire la vérification des types par TypeScript, vous pourrez avoir besoin de récupérer le type des objets que l'on peut affecter à la propriété `where` de la fonction `findMany` (les détails à ce sujet se trouvent ici : https://www.prisma.io/docs/orm/prisma-client/type-safety).
Pour le modèle `Author` par exemple, ce type est récupérable et utilisable de la façon suivante :
```typescript
import { Prisma } from '@prisma/client';
// on peut initialiser un objet de ce type vide
const filter: Prisma.AuthorWhereInput = {};
// puis en fonction des paramètres de la requête, ajouter des filtres
if (/* ... */) {
  filter.lastname = { contains: String(...) } // là aussi, on type clairement la valeur en type String
};
```

On peut aussi filtrer les entités selon l'existence d'autres entités associées (https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#filter-on-presence-of-related-records).

> Par exemple, ajouter un filtre qui permet la récupération des `Author` qui ont au moins un `Book` associé. On pourra tester la présence d'un champ `hasBooks=true` dans la `query string` de la requête.

Plus de détails et d'exemples sur les _filtre de relation_ `some`, `none`, `every` : https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#relation-filters.

# Données associées

`Prisma` permet de récupérer tout ou partie des entités associées à une entité donnée lors de la récupération de cette entité (https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#nested-reads).

Par exemple, on peut récupérer les `Book` (ici, uniquement leur propriété `title`) associés à un `Author` lors de la récupération de cet `Author` :
```typescript
const author = await prisma.author.findUnique({
  where: { id: 1 },
  include: { books: {
    select: { title: true }
  } }
});
```

> Ajouter le support d'une option `include` dans la `query string` des routes `GET /authors` et `GET /books` qui permet de récupérer les `(id, title)` (triés dans l'ordre croissant des `title`) des `Book` associés aux `Author` et les `(id, firstname, lastname)` de l'`Author` associé aux `Book`.

Là aussi, on peut récupérer le type des objets que l'on peut affecter à la propriété `include` de la fonction `findMany`.
Par exemple pour le modèle `Author` :
```typescript
import { Prisma } from '@prisma/client';
const assoc: Prisma.AuthorInclude = {};
```

# Pagination

Quand le nombre de résultats d'une requête est important, il est nécessaire de mettre en place un système de pagination pour éviter de surcharger le client avec un volume de données trop important.
La documentation de `Prisma` sur la pagination se trouve ici : https://www.prisma.io/docs/orm/prisma-client/queries/pagination.

Parmi les 2 méthodes de pagination proposées par `Prisma`, on va utiliser la méthode `offset`.

> Ajouter le support d'options `skip` et `take` dans la `query string` des routes `GET /authors`, `GET /books` et `GET /authors/:author_id/books` qui permettent de paginer les résultats de la requête.

> Afin de donner des informations au client sur le nombre total de résultats potentiels (et ainsi lui permettre de calculer le nombre de pages en fonction du nombre d'éléments par page), ajouter à la réponse un en-tête `X-Total-Count` qui contient le nombre total de résultats de la requête.

La documentation de `Prisma` sur la récupération du nombre total de résultats d'une requête se trouve ici, avec l'ensemble des fonctionnalités liées à l'aggrégation de données : https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing#count.
Notamment, vous trouverez qu'il est possible de filtrer le résultat d'un comptage en fonction de critères de filtre, ce qu'il est très important de faire ici pour que le total annoncé corresponde bien à la requête.
Attention notamment pour la route `GET /authors/:author_id/books` où il faut bien compter uniquement les `Book` correspondant au filtres utilisé **et** associés à l'`Author` donné.

En ce qui concerne l'ajout d'un en-tête à la réponse avec `express`, on peut utiliser la fonction `set` (aussi disponible sous l'alias `header`) de l'objet `Response` (https://expressjs.com/en/5x/api.html#res.set).

# Validation des paramètres de la query string

On a pour le moment utilisé les paramètres de la `query string` sans les valider.
Comme pour le reste (paramètres des routes, données du corps de la requête), il est important de valider les paramètres de la `query string` pour s'assurer qu'ils sont bien conformes à ce que l'on attend.

> Écrire des schémas de validation `superstruct` pour les paramètres de la `query string` des routes `GET /authors`, `GET /books` et `GET /authors/:author_id/books` et les utiliser pour valider ces paramètres.

Tous ces champs sont *optionnels*, donc il faut les déclarer comme tels dans les schémas de validation.

Pour les champs qui n'acceptent qu'une seule valeur possible (comme par exemple `include=authors` pour la route `GET /books`), on peut utiliser un type `enums` (https://docs.superstructjs.org/api-reference/types#enums).
