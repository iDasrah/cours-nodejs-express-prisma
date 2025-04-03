// fonctions de gestion des produits
import { Request, Response } from 'express';
import { prisma } from "../db";
import {ProductCreationData, ProductUpdateData} from "../validation/produit";
import {assert} from "superstruct";

export const getAllProducts = async (req: Request, res: Response) => {
    const products = await prisma.produit.findMany();
    res.json(products).status(200);
}

export const addProduct = async (req: Request, res: Response) => {
    const product = req.body;
    assert(product, ProductCreationData);

    const createdProduct = await prisma.produit.create({
        data: product
    });

    res.status(201).json(createdProduct);
}

export const getOneProduct = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const product = await prisma.produit.findUnique({
        where: { id },
        include: {
            Vente: {
                where: {
                    date: {
                        gte: today
                    }
                },
                include: {
                    produit: true
                }
            }
        }
    });

    if (!product) {
        return res.status(404);
    }

    res.json(product).status(200);
}

export const updateProduct = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const product = req.body;
    assert(product, ProductUpdateData);

    const updatedProduct = await prisma.produit.update({
        where: { id },
        data: product
    });

    res.json(updatedProduct).status(200);
}

export const deleteProduct = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    await prisma.produit.delete({
        where: { id }
    });

    res.status(204).send();
}