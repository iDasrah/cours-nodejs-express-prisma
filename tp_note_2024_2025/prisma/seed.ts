import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// TODO : compléter avec d'éventuelles données de seeding
const products = [
    {
        intitule: 'Produit A',
        prix: 10.99,
        stock: 100,
    },
    {
        intitule: 'Produit B',
        prix: 15.49,
        stock: 50,
    },
    {
        intitule: 'Produit C',
        prix: 7.99,
        stock: 200,
    },
];

const clients = [
    {
        prenom: 'Jean',
        nom: 'Dupont',
    },
    {
        prenom: 'Marie',
        nom: 'Durand',
    },
    {
        prenom: 'Pierre',
        nom: 'Martin',
    },
]

const ventes = [
    {
        date: new Date('2024-01-01'),
        prix: 10.99,
        quantite: 2,
        produit: {
            connect: {
                id: 1,
            },
        },
        client: {
            connect: {
                id: 1,
            },
        },
    },
    {
        date: new Date('2024-01-02'),
        prix: 15.49,
        quantite: 1,
        produit: {
            connect: {
                id: 2,
            },
        },
        client: {
            connect: {
                id: 2,
            },
        },
    },
    {
        date: new Date('2024-01-03'),
        prix: 7.99,
        quantite: 3,
        produit: {
            connect: {
                id: 3,
            },
        },
        client: {
            connect: {
                id: 3,
            },
        },
    },
]

async function main() {
    for (const product of products) {
        await prisma.produit.create({
            data: product,
        });
    }

    for (const client of clients) {
        await prisma.client.create({
            data: client,
        });
    }

    for (const vente of ventes) {
        await prisma.vente.create({
            data: vente,
        });
    }
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
