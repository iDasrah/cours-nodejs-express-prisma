import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const authors = [
    {
        firstname: 'J. R. R.',
        lastname: 'Tolkien'
    },
    {
        firstname: 'H. P.',
        lastname: 'Lovecraft'
    }
];

async function main() {
    for (const author of authors) {
        await prisma.author.create({
            data: {
                firstName: author.firstname,
                lastName: author.lastname
            }
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