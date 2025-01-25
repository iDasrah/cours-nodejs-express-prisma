import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const authors = [
    {
        firstName: 'J. R. R.',
        lastName: 'Tolkien',
        books: {
            create: [
                {
                    title: 'The Hobbit',
                    publication_year: 1937,
                },
                {
                    title: 'The Lord of the Rings',
                    publication_year: 1954,
                }
            ]
        }
    },
    {
        firstName: 'H. P.',
        lastName: 'Lovecraft',
        books: {
            create: [
                {
                    title: 'At the Mountains of Madness',
                    publication_year: 1936,
                },
                {
                    title: 'The Call of Cthulhu',
                    publication_year: 1928,
                }
            ]
        }
    }
];

async function main() {
    for (const author of authors) {
        await prisma.author.create({
            data: author,
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