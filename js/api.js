/**
 * Gerenciamento das chamadas à API da RAWG
 */
const API_KEY = "03fca8110ead4ba193fa59a2acad1ecc";
const RAWG_URL = "https://api.rawg.io/api";
const TIMEOUT_MS = 60000;

function getProxiedUrl(url) {
    return `https://corsproxy.io/?${encodeURIComponent(url)}`;
}

// Wrapper avançado com Timeout, Error Diferenciado e Cache Local Dinâmico
async function fetchWithTimeoutAndCache(url, cacheKey) {
    // Verifica cache localStorage
    if (cacheKey) {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
            try {
                return JSON.parse(cached);
            } catch(e) {
                localStorage.removeItem(cacheKey);
            }
        }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch(getProxiedUrl(url), { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw { type: 'http', status: response.status, message: `Erro HTTP ${response.status}: Limite da API ou bloqueio.` };
        }
        
        const data = await response.json();
        
        // Salva com segurança no localStorage se válido
        if (cacheKey && data) {
            try {
                localStorage.setItem(cacheKey, JSON.stringify(data));
            } catch(e) {
                console.warn("Storage cheio ou inacessível.");
            }
        }
        return data;

    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw { type: 'timeout', message: 'A conexão demorou mais que o esperado. Verifique sua rede.' };
        } else if (error.type === 'http') {
            throw error; // Repassa erro capturado por nós
        } else {
            throw { type: 'network', message: 'Falha de rede. Não foi possível conectar ao servidor.' };
        }
    }
}

/**
 * Busca a lista de jogos populares
 */
async function fetchPopularGames() {
    try {
        const url = `${RAWG_URL}/games?key=${API_KEY}&page_size=20`;
        const data = await fetchWithTimeoutAndCache(url, 'cache_popular_games');
        return data.results;
    } catch (error) {
        console.error("Erro ao buscar jogos populares:", error);
        throw error;
    }
}

/**
 * Busca jogos por termo de pesquisa
 */
async function searchGames(query) {
    try {
        const cacheKey = `cache_search_${query.toLowerCase().trim()}`;
        const url = `${RAWG_URL}/games?key=${API_KEY}&search=${query}&page_size=20`;
        const data = await fetchWithTimeoutAndCache(url, cacheKey);
        return data.results;
    } catch (error) {
        console.error("Erro ao buscar jogos com a query:", error);
        throw error;
    }
}

/**
 * Busca detalhes de um jogo específico
 */
async function fetchGameDetails(gameId) {
    try {
        const url = `${RAWG_URL}/games/${gameId}?key=${API_KEY}`;
        const data = await fetchWithTimeoutAndCache(url, `cache_details_${gameId}`);
        return data;
    } catch (error) {
        console.error("Erro ao buscar detalhes do jogo:", error);
        throw error;
    }
}

/**
 * Busca screenshots de um jogo específico
 */
async function fetchGameScreenshots(gameId) {
    try {
        const url = `${RAWG_URL}/games/${gameId}/screenshots?key=${API_KEY}`;
        const data = await fetchWithTimeoutAndCache(url, `cache_screenshots_${gameId}`);
        return data.results;
    } catch (error) {
        console.error("Erro ao buscar screenshots:", error);
        return [];
    }
}
