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
        name: 'Romance'
    },
    {
        name: 'Non-Fiction'
    },
    {
        name: 'Historical Fiction'
    },
    {
        name: 'Adventure'
    },
    {
        name: 'Classic'
    },
    {
        name: 'Dystopian'
    },
    {
        name: 'Biography'
    },
    {
        name: 'Self-Help'
    },
    {
        name: 'Young Adult'
    },
    {
        name: 'Children\'s'
    },
    {
        name: 'Poetry'
    },
    {
        name: 'Graphic Novel'
    },
    {
        name: 'Cookbook'
    },
    {
        name: 'Travel'
    },
    {
        name: 'Science'
    },
    {
        name: 'History'
    },
    {
        name: 'Religion'
    },
    {
        name: 'Philosophy'
    },
    {
        name: 'Psychology'
    },
    {
        name: 'Business'
    },
    {
        name: 'Technology'
    },
    {
        name: 'Health'
    },
    {
        name: 'Fitness'
    },
    {
        name: 'Parenting'
    },
    {
        name: 'Memoir'
    },
    {
        name: 'True Crime'
    },
    {
        name: 'Humor'
    },
    {
        name: 'Drama'
    },
    {
        name: 'Thriller'
    },
    {
        name: 'Suspense'
    },
    {
        name: 'Western'
    },
    {
        name: 'War'
    },
    {
        name: 'Sports'
    },
    {
        name: 'Music'
    },
    {
        name: 'Art'
    },
    {
        name: 'Photography'
    },
    {
        name: 'Fashion'
    },
    {
        name: 'Design'
    },
    {
        name: 'Architecture'
    },
    {
        name: 'Film'
    },
    {
        name: 'Theater'
    },
    {
        name: 'Dance'
    },
    {
        name: 'Comics'
    },
    {
        name: 'Anime'
    },
    {
        name: 'Manga'
    },
    {
        name: 'Webtoons'
    },
    {
        name: 'Light Novel'
    },
    {
        name: 'Fanfiction'
    },
    {
        name: 'Short Stories'
    },
    {
        name: 'Anthology'
    },
    {
        name: 'Novella'
    },
    {
        name: 'Graphic Memoir'
    },
    {
        name: 'Literary Fiction'
    },
    {
        name: 'Experimental Fiction'
    },
    {
        name: 'Magical Realism'
    },
    {
        name: 'Slipstream'
    },
    {
        name: 'Cyberpunk'
    },
    {
        name: 'Steampunk'
    },
    {
        name: 'Biopunk'
    },
    {
        name: 'Space Opera'
    },
    {
        name: 'Time Travel'
    },
    {
        name: 'Alternate History'
    },
    {
        name: 'Post-Apocalyptic'
    },
    {
        name: 'Urban Fantasy'
    },
    {
        name: 'Dark Fantasy'
    },
    {
        name: 'Sword and Sorcery'
    },
    {
        name: 'High Fantasy'
    },
    {
        name: 'Low Fantasy'
    },
    {
        name: 'Epic Fantasy'
    },
    {
        name: 'Historical Fantasy'
    },
    {
        name: 'Romantic Fantasy'
    },
    {
        name: 'Paranormal Romance'
    },
    {
        name: 'Contemporary Romance'
    },
    {
        name: 'Chick Lit'
    },
    {
        name: 'New Adult'
    },
    {
        name: 'Young Adult Fiction'
    }
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
                        connect: [
                            {
                                name: 'Fantasy'
                            },
                            {
                                name: 'Adventure'
                            }
                        ]
                    }
                },
                {
                    title: 'The Lord of the Rings',
                    publication_year: 1954,
                    tags: {
                        connect: [
                            {
                                name: 'Fantasy'
                            },
                            {
                                name: 'Adventure'
                            }
                        ]
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
                        connect: [
                            {
                                name: 'Horror'
                            },
                            {
                                name: 'Fantasy'
                            }
                        ]
                    }
                },
                {
                    title: 'At the Mountains of Madness',
                    publication_year: 1936,
                    tags: {
                        connect: [
                            {
                                name: 'Horror'
                            },
                            {
                                name: 'Fantasy'
                            }
                        ]
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
                        connect: [
                            {
                                name: 'Horror'
                            },
                            {
                                name: 'Thriller'
                            }
                        ]
                    }
                },
                {
                    title: 'The Shining',
                    publication_year: 1977,
                    tags: {
                        connect: [
                            {
                                name: 'Horror'
                            },
                            {
                                name: 'Thriller'
                            }
                        ]
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
                        connect: [
                            {
                                name: 'Fantasy'
                            },
                            {
                                name: 'Adventure'
                            }
                        ]
                    }
                },
                {
                    title: 'A Clash of Kings',
                    publication_year: 1998,
                    tags: {
                        connect: [
                            {
                                name: 'Fantasy'
                            },
                            {
                                name: 'Adventure'
                            }
                        ]
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
                        connect: [
                            {
                                name: 'Fantasy'
                            },
                            {
                                name: 'Humor'
                            }
                        ]
                    }
                },
                {
                    title: 'Mort',
                    publication_year: 1987,
                    tags: {
                        connect: [
                            {
                                name: 'Fantasy'
                            },
                            {
                                name: 'Humor'
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        firstName: 'Isaac',
        lastName: 'Asimov',
        books: {
            create: [
                {
                    title: 'Foundation',
                    publication_year: 1951,
                    tags: {
                        connect: [
                            {
                                name: 'Sci-Fi'
                            },
                            {
                                name: 'Dystopian'
                            }
                        ]
                    }
                },
                {
                    title: 'I, Robot',
                    publication_year: 1950,
                    tags: {
                        connect: [
                            {
                                name: 'Sci-Fi'
                            },
                            {
                                name: 'Dystopian'
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        firstName: 'Arthur C.',
        lastName: 'Clarke',
        books: {
            create: [
                {
                    title: '2001: A Space Odyssey',
                    publication_year: 1968,
                    tags: {
                        connect: [
                            {
                                name: 'Sci-Fi'
                            },
                            {
                                name: 'Adventure'
                            }
                        ]
                    }
                },
                {
                    title: 'Rendezvous with Rama',
                    publication_year: 1973,
                    tags: {
                        connect: [
                            {
                                name: 'Sci-Fi'
                            },
                            {
                                name: 'Adventure'
                            }
                        ]
                    }
                }
            ]
        }
    },
        {
            firstName: 'Agatha',
            lastName: 'Christie',
            books: {
                create: [
                    {
                        title: 'Murder on the Orient Express',
                        publication_year: 1934,
                        tags: {
                            connect: [
                                {
                                    name: 'Mystery'
                                }
                            ]
                        }
                    },
                    {
                        title: 'And Then There Were None',
                        publication_year: 1939,
                        tags: {
                            connect: [

                            ]
                        }
                    }
                ]
            }
        },
        {
            firstName: 'J.K.',
            lastName: 'Rowling',
            books: {
                create: [
                    {
                        title: 'Harry Potter and the Philosopher\'s Stone',
                        publication_year: 1997,
                        tags: {
                            connect: [

                            ]
                        }
                    },
                    {
                        title: 'Harry Potter and the Chamber of Secrets',
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
            firstName: 'Dan',
            lastName: 'Brown',
            books: {
                create: [
                    {
                        title: 'The Da Vinci Code',
                        publication_year: 2003,
                        tags: {
                            connect: {
                                name: 'Thriller'
                            }
                        }
                    },
                    {
                        title: 'Angels & Demons',
                        publication_year: 2000,
                        tags: {
                            connect: {
                                name: 'Thriller'
                            }
                        }
                    }
                ]
            }
        },
        {
            firstName: 'Jane',
            lastName: 'Austen',
            books: {
                create: [
                    {
                        title: 'Pride and Prejudice',
                        publication_year: 1813,
                        tags: {
                            connect: {
                                name: 'Romance'
                            }
                        }
                    },
                    {
                        title: 'Sense and Sensibility',
                        publication_year: 1811,
                        tags: {
                            connect: {
                                name: 'Romance'
                            }
                        }
                    }
                ]
            }
        },
        {
            firstName: 'Mark',
            lastName: 'Twain',
            books: {
                create: [
                    {
                        title: 'The Adventures of Tom Sawyer',
                        publication_year: 1876,
                        tags: {
                            connect: {
                                name: 'Historical Fiction'
                            }
                        }
                    },
                    {
                        title: 'Adventures of Huckleberry Finn',
                        publication_year: 1884,
                        tags: {
                            connect: {
                                name: 'Historical Fiction'
                            }
                        }
                    }
                ]
            }
        },
    {
            firstName: 'Ernest',
            lastName: 'Hemingway',
            books: {
                create: [
                    {
                        title: 'The Old Man and the Sea',
                        publication_year: 1952,
                        tags: {
                            connect: {
                                name: 'Non-Fiction'
                            }
                        }
                    },
                    {
                        title: 'A Farewell to Arms',
                        publication_year: 1929,
                        tags: {
                            connect: {
                                name: 'Historical Fiction'
                            }
                        }
                    }
                ]
            }
        },
        {
            firstName: 'F. Scott',
            lastName: 'Fitzgerald',
            books: {
                create: [
                    {
                        title: 'The Great Gatsby',
                        publication_year: 1925,
                        tags: {
                            connect: {
                                name: 'Historical Fiction'
                            }
                        }
                    },
                    {
                        title: 'Tender Is the Night',
                        publication_year: 1934,
                        tags: {
                            connect: {
                                name: 'Historical Fiction'
                            }
                        }
                    }
                ]
            }
        },
        {
            firstName: 'Charles',
            lastName: 'Dickens',
            books: {
                create: [
                    {
                        title: 'A Tale of Two Cities',
                        publication_year: 1859,
                        tags: {
                            connect: {
                                name: 'Historical Fiction'
                            }
                        }
                    },
                    {
                        title: 'Great Expectations',
                        publication_year: 1861,
                        tags: {
                            connect: {
                                name: 'Historical Fiction'
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
        password: '$2a$12$J/BVgO5UudzNHlE.FxDiquXSIk55CjJRtLxFRX4Vba7k5NMqNzfcq',
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