// déclarations pour la validation des ventes

import {date, integer, object} from "superstruct";

export const VenteCreationData = object({
    date: date(),
    prix: integer(),
    quantite: integer()
});