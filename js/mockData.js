/**
 * Dados de fallback para usar caso a API esteja fora do ar ou o limite seja atingido.
 */
const mockGamesData = {
    results: [
        {
            id: 3498,
            name: "Grand Theft Auto V",
            background_image: "https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg",
            metacritic: 92,
            released: "2013-09-17",
            genres: [{ name: "Action" }, { name: "Adventure" }]
        },
        {
            id: 3328,
            name: "The Witcher 3: Wild Hunt",
            background_image: "https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg",
            metacritic: 92,
            released: "2015-05-18",
            genres: [{ name: "Action" }, { name: "RPG" }]
        },
        {
            id: 4200,
            name: "Portal 2",
            background_image: "https://media.rawg.io/media/games/2ba/2bac0e87cf45e5b508f227d281c9252a.jpg",
            metacritic: 95,
            released: "2011-04-18",
            genres: [{ name: "Shooter" }, { name: "Puzzle" }]
        }
    ]
};

const mockGameDetails = {
    3498: {
        id: 3498,
        name: "Grand Theft Auto V",
        description_raw: "Grand Theft Auto V is an action-adventure game played from either a third-person or first-person perspective...",
        background_image: "https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg",
        metacritic: 92,
        released: "2013-09-17",
        genres: [{ name: "Action" }, { name: "Adventure" }],
        platforms: [{ platform: { name: "PC" } }, { platform: { name: "PlayStation 5" } }],
        publishers: [{ name: "Rockstar Games" }],
        developers: [{ name: "Rockstar North" }]
    }
};

const mockScreenshots = {
    3498: {
        results: [
            { image: "https://media.rawg.io/media/games/20a/20aa03a10cda45239fe22d035c0ebe64.jpg" }
        ]
    }
};