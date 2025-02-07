export const tags = [
    {
        name: 'Fantasy'
    },
    {
        name: 'Horror'
    },
    {
        name: 'Sci-Fi'
    },
    {
        name: 'Mystery'
    },
    {
        name: 'Thriller'
    },
    {
        name: 'Romance'
    },
    {
        name: 'Non-Fiction'
    },
    {
        name: 'Historical Fiction'
    },
];

export const authors = [
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
    },
    {
        firstName: 'Stephen',
        lastName: 'King',
        books: {
            create: [
                {
                    title: 'Carrie',
                    publication_year: 1974,
                    tags: {
                        connect: {
                            name: 'Horror'
                        }
                    }
                },
                {
                    title: 'The Shining',
                    publication_year: 1977,
                    tags: {
                        connect: {
                            name: 'Horror'
                        }
                    }
                }
            ]
        }
    },
    {
        firstName: 'George R. R.',
        lastName: 'Martin',
        books: {
            create: [
                {
                    title: 'A Game of Thrones',
                    publication_year: 1996,
                    tags: {
                        connect: {
                            name: 'Fantasy'
                        }
                    }
                },
                {
                    title: 'A Clash of Kings',
                    publication_year: 1998,
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
        firstName: 'Terry',
        lastName: 'Pratchett',
        books: {
            create: [
                {
                    title: 'The Colour of Magic',
                    publication_year: 1983,
                    tags: {
                        connect: {
                            name: 'Fantasy'
                        }
                    }
                },
                {
                    title: 'Mort',
                    publication_year: 1987,
                    tags: {
                        connect: {
                            name: 'Fantasy'
                        }
                    }
                }
            ]
        }
    },
];

export const users = [
    {
        email: 'admin@books.fr',
        password: '$2a$12$6e5GiCksRAi/NP44u0EJ.Ord2Rvvl.HQHEmeE8FcqESWppRxv4en.',
        username: 'admin',
        ratings: {
            create: [
                {
                    value: 5,
                    book: {
                        connect: {
                            id: 1
                        }
                    }
                },
                {
                    value: 4,
                    book: {
                        connect: {
                            id: 2
                        }
                    }
                },
                {
                    value: 3,
                    book: {
                        connect: {
                            id: 3
                        }
                    }
                },
                {
                    value: 3,
                    book: {
                        connect: {
                            id: 5
                        }
                        }
                    },
            ]
        },
        comments: {
            create: [
                {
                    content: 'Great book!',
                    book: {
                        connect: {
                            id: 1
                        }
                    }
                },
                {
                    content: 'I loved it!',
                    book: {
                        connect: {
                            id: 2
                        }
                    }
                },
                {
                    content: 'Scary!',
                    book: {
                        connect: {
                            id: 3
                        }
                    }
                },
                {
                    content: 'Very scary!',
                    book: {
                        connect: {
                            id: 5
                        }
                    }
                },
            ]
        }
    }
];