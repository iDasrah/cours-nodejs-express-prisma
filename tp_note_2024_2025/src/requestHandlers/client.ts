// fonctions de gestion des clients
import { Request, Response } from 'express';
import { prisma } from "../db";
import {assert} from "superstruct";
import {ClientCreationData, ClientUpdateData} from "../validation/client";

export const getAllClients = async (req: Request, res: Response) => {
    const clients = await prisma.client.findMany();
    res.json(clients).status(200);
}

export const addClient = async (req: Request, res: Response) => {
    const client = req.body;
    assert(client, ClientCreationData);

    const createdClient = await prisma.client.create({
        data: client
    });

    res.status(201).json(createdClient);
}

export const getOneClient = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const client = await prisma.client.findUnique({
        where: { id }
    });

    if (!client) {
        return res.status(404).json({ message: "Client non trouvé" });
    }

    res.json(client).status(200);
}

export const updateClient = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const client = req.body;
    assert(client, ClientUpdateData);

    const updatedClient = await prisma.client.update({
        where: { id },
        data: client
    });

    res.json(updatedClient).status(200);
}

export const deleteClient = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    await prisma.client.delete({
        where: { id }
    });

    res.status(204).send();
}

