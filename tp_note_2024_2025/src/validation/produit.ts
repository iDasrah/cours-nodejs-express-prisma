// déclarations pour la validation des produits

import {integer, object, optional, size, string} from "superstruct";

export const ProductCreationData = object({
    intitule: size(string(), 1, 50),
    prix: integer(),
    stock: integer(),
});

export const ProductUpdateData = object({
    intitule: optional(size(string(), 1, 50),),
    prix: optional(integer()),
    stock: optional(integer()),
});