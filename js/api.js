/**
 * Gerenciamento das chamadas à API da RAWG
 */
const API_KEY = "f2aa094c00c844d39cc29a364d508b43";
const BASE_URL = "https://api.rawg.io/api";

/**
 * Busca a lista de jogos populares
 */
async function fetchPopularGames() {
    try {
        const response = await fetch(`${BASE_URL}/games?key=${API_KEY}&page_size=20`);
        if (!response.ok) throw new Error("Erro na rede ou limite da API atingido.");
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Erro ao buscar jogos populares:", error);
        console.warn("Utilizando dados de fallback...");
        return typeof mockGamesData !== 'undefined' ? mockGamesData.results : [];
    }
}

/**
 * Busca jogos por termo de pesquisa
 */
async function searchGames(query) {
    try {
        const response = await fetch(`${BASE_URL}/games?key=${API_KEY}&search=${query}&page_size=20`);
        if (!response.ok) throw new Error("Erro na rede ou limite da API atingido.");
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Erro ao buscar jogos com a query:", error);
        return [];
    }
}

/**
 * Busca detalhes de um jogo específico
 */
async function fetchGameDetails(gameId) {
    try {
        const response = await fetch(`${BASE_URL}/games/${gameId}?key=${API_KEY}`);
        if (!response.ok) throw new Error("Erro na rede ou limite da API atingido.");
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar detalhes do jogo:", error);
        console.warn("Utilizando dados de fallback...");
        return typeof mockGameDetails !== 'undefined' ? mockGameDetails[gameId] : null;
    }
}

/**
 * Busca screenshots de um jogo específico
 */
async function fetchGameScreenshots(gameId) {
    try {
        const response = await fetch(`${BASE_URL}/games/${gameId}/screenshots?key=${API_KEY}`);
        if (!response.ok) throw new Error("Erro na rede ou limite da API atingido.");
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Erro ao buscar screenshots:", error);
        console.warn("Utilizando dados de fallback...");
        return typeof mockScreenshots !== 'undefined' && mockScreenshots[gameId] ? mockScreenshots[gameId].results : [];
    }
}