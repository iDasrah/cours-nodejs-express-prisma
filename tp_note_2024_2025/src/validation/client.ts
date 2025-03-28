// déclarations pour la validation des clients

import {object, optional, size, string} from "superstruct";

export const ClientCreationData = object({
    nom: size(string(), 1, 50),
    prenom: size(string(), 1, 50),
});

export const ClientUpdateData = object({
    nom: optional(size(string(), 1, 50),),
    prenom: optional(size(string(), 1, 50),),
});