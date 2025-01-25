# Associations

Ajouter la définition d'une nouvelle entité `Book` qui contient, en plus de son identifiant :
- `title` : titre du livre - _chaîne de caractères_ - _non nul_

Associer cette nouvelle entité avec l'entité `Author` de sorte que :
- un `Book` est associé à _son_ `Author`
- un `Author` dispose de _plusieurs_ `Book`

La relation entre `Author` et `Book` est une relation `1:n` ou One-to-many (un auteur peut avoir plusieurs livres, un livre n'a qu'un seul auteur).
On souhaite que le lien d'un `Book` vers son `Author` soit obligatoire (un livre doit avoir un auteur).

La documentation de `Prisma` sur les relations se trouve ici : https://www.prisma.io/docs/orm/prisma-schema/data-model/relations.

Par défaut, quand la référence est obligatoire, `Prisma` interdit la suppression d'un enregistrement qui est référencé par un autre enregistrement (équivalent en SQL de `ON DELETE RESTRICT`).
Dans notre cas, cela signifie que l'on ne peut pas supprimer un `Author` tant qu'il a des `Book` associés.
Si on souhaite autoriser la suppression d'un `Author` même s'il a des `Book` associés, et que cette suppression entraîne alors celle de tous ses `Book`, il faut ajouter l'attribut `onDelete` à la déclaration de la relation, avec la valeur `Cascade`.

Ces actions déclenchées sur des entités associées sont appelées `Referential actions` dans `Prisma`, et leur documentation se trouve ici : https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/referential-actions.

> Une fois le modèle déclaré, synchroniser le schéma avec la base de données.

# Nouvelles routes

Déclarer, écrire et tester les routes suivantes :
- `GET /books` : retourne la liste des livres
- `GET /books/:book_id` : retourne le livre dont l'identifiant est `:book_id`
- `GET /authors/:author_id/books` : retourne la liste des livres associés à l'auteur dont l'identifiant est `:author_id`
- `POST /authors/:author_id/books` : crée un nouveau livre associé à l'auteur dont l'identifiant est `:author_id`
- `PATCH /books/:book_id` : met à jour le livre dont l'identifiant est `:book_id`
- `DELETE /books/:book_id` : supprime le livre dont l'identifiant est `:book_id`

**Indications** :
- pour récupérer les livres associés à un auteur, si on utilise `findMany` sur l'entité `Book` en filtrant selon l'identifiant de l'auteur, alors dans le cas où l'auteur n'existe pas, on obtiendra une liste vide, alors qu'une erreur `404` indiquant que l'auteur n'existe pas est plus appropriée. Le plus simple est alors de faire un appel à `findUnique` sur l'entité `Author`, en incluant ses livres associés : https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#include-a-relation. Comme dans le cas de la simple récupération d'un auteur, s'il n'existe pas, alors `findUnique` renverra `null`, et on pourra renvoyer une erreur `404`.
- lors de la création d'un livre, on l'associe obligatoirement à un auteur qui existe et dont l'identifiant est donné dans le chemin de la route. Pour cela, on utilise la propriété `connect` tel qu'indiqué dans la documentation (ici dans le cas d'un update) : https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#connect-a-single-record. Là aussi, si l'auteur correspondant n'existe pas, on doit renvoyer une erreur `404`. Afin de capturer ce cas de figure, on intègre l'appel à `create` dans un bloc `try`/`catch` et on gère l'erreur obtenue exactement comme dans le cas de l'update ou de la suppression (c'est également un code `P2025` que l'on aura si l'auteur n'existe pas).

> Dans ces 2 cas, on aurait pu faire une première requête pour récupérer l'auteur, puis une seconde pour récupérer les livres associés, ou pour créer un livre associé, mais cela aurait nécessité 2 requêtes à la base de données au lieu d'une seule. C'est pourquoi on préfère ici utiliser les fonctionnalités de `Prisma` qui permettent de gérer les données associées en une seule requête.

# Rangement de code

Afin de ne pas surcharger le fichier `index.js`, on va déplacer le code des `middlewares` de gestion des requêtes et le regrouper par entité concernée dans des modules séparés.

On aura besoin de l'instance de `PrismaClient` dans chacun de ces modules.
Cependant, il ne faut pas créer plusieurs instances de `PrismaClient` car cela peut entraîner une surcharge de connexions à la base de données (chaque instance de client gère un pool de connexions à la base de données) et des problèmes de synchronisation des données.
Il faut donc centraliser la création de l'instance de `PrismaClient` dans un module et l'importer dans les modules qui en ont besoin.

Créer un fichier `src/db.ts` qui contient le code suivant :
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
prisma.$connect();

export { prisma };
```

L'appel à la fonction `$connect` n'est pas nécessaire (car réalisé implicitement par `PrismaClient` lors du premier appel à une fonction qui a besoin de joindre la base de données), mais il permet d'anticiper l'établissement de la connexion et de ne pas ralentir la première requête qui en a besoin.

Commencer par créer un dossier `src/requestHandlers`.
Dans ce dossier, créer les fichiers `author.ts` et `book.ts` puis y déplacer le code des `middlewares` de gestion des requêtes correspondant respectivement aux entités `Author` et `Book`.

Chaque fonction doit être exportée individuellement, de la manière suivante :
```typescript
export async function get_all(req: Request, res: Response) {
  const authors = await prisma.author.findMany();
  res.json(authors);
};
```

Une manière de nommer ces fonctions peut être de suivre les conventions suivantes : `get_all`, `get_one`, `create_one`, `update_one`, `delete_one`. Pour la récupération et la création d'un livre associé à un auteur, on pourra utiliser les noms `get_all_of_author` et `create_one_of_author`.

Une fois cela fait, on peut importer ces fonctions dans le fichier `index.ts` et les utiliser dans les déclarations de routes correspondantes.
Afin de récupérer d'un coup l'ensemble des fonctions exportées par un fichier, on peut utiliser la syntaxe suivante, qui récupère l'ensemble des symboles exportés par le fichier `author.ts` au sein d'un objet nommé `author` :
```typescript
import * as author from './requestHandlers/author';
```

On peut ensuite utiliser les fonctions exportées de la manière suivante (notez bien que l'on fourni ici à `get` la propriété `get_all` issue du module `author`, qui est bien une variable de type `function`) :
```typescript
app.get('/authors', author.get_all);
```

Comme on définit des routes qui partagent un même chemin (par exemple, `GET /authors/:author_id`, `PATCH /authors/:author_id`, et `DELETE /authors/:author_id`), on peut utiliser la fonction `route` d'`express` pour regrouper ces déclarations sans avoir à répéter le chemin à chaque fois.
Par exemple, pour le chemin `/authors/:author_id`, on peut écrire :
```typescript
app.route('/authors/:author_id')
  .get(author.get_one)
  .patch(author.update_one)
  .delete(author.delete_one);
```

# Mise à jour du seeding

Avec cette nouvelle entité en place, on peut mettre à jour la procédure de `seeding` pour créer des livres associés à des auteurs.

`Prisma` permet de créer directement des entités associées lors de la création d'une entité.
La documentation liée à cette fonctionnalité se trouve ici : https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#nested-writes.

> Mettre à jour votre script de `seeding` pour créer des livres associés à des auteurs lors de leur création.

# Migrations

Les migrations permettent de gérer les évolutions du schéma d'une base de données de manière incrémentale, en créant des scripts qui décrivent les changements à apporter au schéma.
Cela permet de garder une trace de l'historique des changements, de les ajouter dans le dépôt du projet, et de pouvoir les appliquer sur une base de données existante.
C'est particulièrement utile dans le cadre d'un travail collaboratif, où plusieurs développeurs travaillent sur le même projet, mais aussi pour gérer l'évolution d'un schéma dans plusieurs environnements (développement, test, production).

`Prisma` permet de gérer les migrations avec la commande `Prisma Migrate`.
La documentation de `Prisma` sur les migrations se trouve ici : https://www.prisma.io/docs/orm/prisma-migrate/getting-started.

Créer la première migration avec la commande suivante (le nom `"init"` est arbitraire et peut être remplacé par un autre nom, mais il indique bien qu'il s'agit de la première migration) :
```bash
npx prisma migrate dev --name init
```

La commande `migrate dev` calcule les changements à apporter au schéma de la base de données en comparant le schéma actuellement déclaré dans le fichier `schema.prisma` avec le schéma de la base de données depuis la dernière migration.
Selon les cas, il se peut que les données actuellement présentes dans la base ne puissent pas être conservées, et qu'il faille les supprimer.
C'est le cas notamment si on a poussé des changements de schéma directement dans la base avec la commande `db push` comme nous l'avons fait précédemment.

Si `Prisma` a besoin de réinitialiser (`reset`) les données, une confirmation est demandée avant de créer et d'exécuter la migration puis le script de `seeding` est automatiquement exécuté afin de recréer les données initiales.

> Regarder le contenu du dossier `prisma/migrations` pour voir le script de migration créé.

> À partir de ce moment-là, on ne devrait plus modifier directement la base de données avec la commande `db push`, mais uniquement à l'aide de migrations.

## Modification du schéma

Modifier le schéma en ajoutant un champ `publication_year` de type `Int` à l'entité `Book`.

Créer une nouvelle migration :
```bash
npx prisma migrate dev --name add_book_publication_year
```

> Que se passe-t-il ?

`Prisma` nous informe qu'il ne peut pas appliquer directement les changements de schéma à la base de données. En effet, la table `Book` contient déjà des enregistrements, et l'ajout d'une colonne obligatoire (non `NULL`) sans valeur par défaut connue n'est donc pas possible.

> Rendre le champ `publication_year` optionnel (nullable) et créer la migration.

> Regarder le script de migration.
> 
> Vérifier que le champ `publication_year` est bien présent dans la table `Book` de la base de données, et qu'on peut bien le renseigner dans des requêtes de création ou de modification de livres.
> 
> Modifier le script de `seeding` pour ajouter des valeurs pour ce champ.

Si on ne souhaite pas ajouter au dépôt tout un ensemble de petites migrations que l'on a créées au fil d'une session de développement, on peut les fusionner en une seule migration (https://www.prisma.io/docs/orm/prisma-migrate/workflows/squashing-migrations#how-to-migrate-cleanly-from-a-development-environment).

Cela consiste simplement à remettre le dossier `prisma/migrations` dans l'état correspondant au début de la session de développement, puis à créer une nouvelle migration qui contiendra alors la description de l'ensemble des modifications effectués.

## Restauration/Réinitialisation de la base de données

Si on souhaite remettre la base de données dans l'état correspondant à la dernière migration de l'historique, on peut utiliser la commande `migrate reset` :
```bash
npx prisma migrate reset
```

Cette commande supprime toutes les tables de la base de données, les recrée en appliquant toutes les migrations, puis exécute le script de `seeding`.

Si on est en train de mettre en place un nouvel environnement de développement pour un projet existant contenant déjà un ensemble de migrations, on peut simplement exécuter la commande `migrate dev` :
```bash
npx prisma migrate dev
```

Cette commande va créer la base de données, exécuter toutes les migrations et exécuter le script de `seeding`.

Une description de ces commandes est accessible ici : https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production.

# Validation de données

Un certain nombre de contraintes sur les données sont déjà exprimées dans le schéma `Prisma` (champs obligatoires, types de données, etc.).

Cependant, il est possible de définir et vérifier des contraintes supplémentaires sur les données, qui ne sont pas directement exprimées dans le schéma, en utilisant des outils de validation de plus haut niveau.

Par exemple, `Prisma` va autoriser la création (ou la modification) d'un `Author` avec un `firstname` ou un `lastname` vide (vide est différent de nul), ou encore d'un `Book` dont le `title` est vide, alors qu'on ne le souhaite pas.

On va utiliser la bibliothèque `superstruct` (https://docs.superstructjs.org/) pour définir des schémas de validation pour les données utilisables pour la création ou la modification d'une entité, et les utiliser dans les `middlewares` de gestion des requêtes pour valider les données avant de solliciter les fonctions de `Prisma`.

Installer la bibliothèque `superstruct` avec la commande :
```bash
npm install superstruct
```

> Créer un dossier `src/validation` et un premier module `author.ts` dans ce dossier.

Par exemple, pour l'entité `Author`, on peut définir un schéma de validation des données nécessaires à la création de la manière suivante :
```ts
import { object, string, size } from 'superstruct';

export const AuthorCreationData = object({
  firstname: size(string(), 1, 50),
  lastname: size(string(), 1, 50),
});
```

Cette définition indique que les champs `firstname` et `lastname` doivent être des chaînes de caractères de taille comprise entre 1 et 50 caractères.

On peut ensuite utiliser ce schéma dans le `middleware` de création d'un auteur pour valider les données reçues :
```ts
import { assert } from 'superstruct';
import { AuthorCreationData } from '../validation/author';

export async function create_one(req: Request, res: Response) {
  assert(req.body, AuthorCreationData);
  // ...
}
```

La fonction `assert` de `superstruct` vérifie que les données passées en premier argument correspondent bien au schéma passé en deuxième argument, et `throw` un objet de type `StructError` avec notamment un message précisant la raison de l'échec de la validation si ce n'est pas le cas.

> En plus de cette vérification, `superstruct` permet à TypeScript de préciser le type des données validées (survolez les données extraites de `req.body` avec ou sans l'appel préalable à `assert`), ce qui permet de bénéficier de la vérification de types de TypeScript pour les données validées.

Dans notre `middleware` de gestion d'erreur global, on peut vérifier que l'objet `err` reçu correspond à un objet de ce type, et si c'est le cas, configurer un status code de `400` (Bad Request) pour la réponse.
Si on le souhaite, on peut aussi modifier le message d'erreur pour donner plus de détails sur la cause de l'erreur en utilisant par exemple la propriété `key` de l'objet `err` qui indique le champ qui a échoué à la validation (https://docs.superstructjs.org/api-reference/errors).

```ts
import { StructError } from 'superstruct';

// ...
  if (err instanceof StructError) {
    err.status = 400;
    err.message = `Bad value for field ${err.key}`;
  }
// ...
```

> Créer un schéma de validation pour `Author` à utiliser pour la modification d'un auteur (`AuthorUpdateData`), et l'utiliser dans le `middleware` de mise à jour.
> 
> Créer et utiliser de la même manière les schémas de validation pour l'entité `Book`.

# Validation des paramètres des chemins

Pour le moment, on a utilisé les les segments variables des chemins des routes directement dans les `middlewares` de gestion des requêtes sans les valider.

Ainsi, rien n'empêche un client de faire une requête `GET /authors/abc` alors que dans notre code, l'identifiant de l'auteur est normalement attendu sous la forme d'un nombre entier.

Pour vérifier par exemple que le champ `author_id` est bien une chaîne de caractères qui contient l'expression d'un entier valide, on peut utiliser la bibliothèque `validator` qui fournit de nombreuses fonctions permettant de vérifier qu'une chaîne de caractères correspond à un certain format (https://github.com/validatorjs/validator.js?tab=readme-ov-file#validators).
```bash
npm install validator
npm install -D @types/validator
```

`superstruct` permet d'appeler la fonction de vérification que l'on souhaite dans ce qu'ils appellent des `Custom Refinements` : https://docs.superstructjs.org/api-reference/refinements#custom-refinements.

Dans notre module principal `src/index.ts`, on va créer un schéma de validation pour l'ensemble des paramètres possibles de nos routes (pour le moment, `author_id` et `book_id`) :
```ts
import { object, optional, refine, string } from 'superstruct';
import { isInt } from 'validator';

export const ReqParams = object({
  author_id: optional(refine(string(), 'int', (value) => isInt(value))),
  book_id: optional(refine(string(), 'int', (value) => isInt(value)))
});
```

> Ces propriétés sont déclarées ici comme optionnelles. Cela veut dire que si elles sont présentes, alors elles devront respecter les contraintes définies, mais si elles ne sont pas présentes, cela ne posera pas de problème. Ainsi, on peut utiliser ce schéma pour valider les paramètres de requête de n'importe quelle route, même si ces paramètres ne sont pas utilisés dans le `middleware` de gestion des requêtes.

On peut maintenant créer un `middleware` intermédiaire de validation de ces paramètres :
```typescript
const validateParams = (req: Request, res: Response, next: NextFunction) => {
  assert(req.params, ReqParams);
  next();
};
```

Puis, le brancher sur toutes les routes qui utilisent des paramètres de chemin, comme par exemple :
```typescript
app.route('/authors/:author_id')
  .all(validateParams)
  .get(author.get_one)
  .patch(author.update_one)
  .delete(author.delete_one);
```

> Faire de même pour toutes les requêtes qui utilisent des paramètres de chemin.

> On continuera ce principe de validation des paramètres de requête pour toutes les routes qu'on ajoutera par la suite.
