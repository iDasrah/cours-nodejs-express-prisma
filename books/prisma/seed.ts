import { PrismaClient } from '@prisma/client';
import { tags, authors } from './data';

const prisma = new PrismaClient();

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