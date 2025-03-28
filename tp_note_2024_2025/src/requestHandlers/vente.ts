// fonctions de gestion des ventes

import {Request, Response} from "express";
import {prisma} from "../db";
import {assert} from "superstruct";
import {VenteCreationData} from "../validation/vente";

export const getClientVentes = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ventes = await prisma.vente.findMany({
        where: {
            clientId: id,
            date: {
                gte: today
            }
        },
        include: {
            produit: true
        }
    });

    res.json(ventes).status(200);
}

export const addClientVente = async (req: Request, res: Response) => {
    const clientId = parseInt(req.params.client_id);
    const produitId = parseInt(req.params.produit_id);
    const vente = req.body;
    assert(vente, VenteCreationData);

    const newVente = await prisma.vente.create({
        data: {
            ...vente,
            client: {
                connect: { id: clientId }
            },
            produit: {
                connect: { id: produitId }
            }
        }
    });

    res.status(201).json(newVente);
}