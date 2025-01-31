import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tags = [
    {
        name: 'Fantasy'
    },
    {
        name: 'Horror'
    }
];

const authors = [
    {
        firstName: 'J. R. R.',
        lastName: 'Tolkien',
        books: {
            create: [
                {
                    title: 'The Hobbit',
                    publication_year: 1937,
                    tags: {
                        connect: {
                            name: 'Fantasy'
                        }
                    }
                },
                {
                    title: 'The Lord of the Rings',
                    publication_year: 1954,
                    tags: {
                        connect: {
                            name: 'Fantasy'
                        }
                    }
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
                    title: 'The Call of Cthulhu',
                    publication_year: 1928,
                    tags: {
                        connect: {
                            name: 'Horror'
                        }
                    }
                },
                {
                    title: 'At the Mountains of Madness',
                    publication_year: 1936,
                    tags: {
                        connect: {
                            name: 'Horror'
                        }
                    }
                }
            ]
        }
    }
];

async function main() {
    for (const tag of tags) {
        await prisma.tag.create({
            data: tag,
        });
    }
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