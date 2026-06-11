document.addEventListener('DOMContentLoaded', () => {
    initHome();
    setupScrollReveal();
});

const gamesList = document.getElementById('gamesList');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const dynamicHero = document.getElementById('dynamicHero');
const heroTitle = document.getElementById('heroTitle');
const destaqueContainer = document.getElementById('destaqueContainer');

function getProxiedImage(url, width = 800) {
    if (!url) return '';
    // Utiliza uma CDN rodando no Cloudflare e comprime imagens direto no servidor
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp&q=80`;
}

function renderError(message, retryAction = 'initHome()') {
    gamesList.innerHTML = `
        <div class="col-12 text-center text-light mt-5 mb-5 reveal active">
            <div class="p-4" style="background: rgba(255,0,0,0.1); border: 1px solid rgba(255,0,0,0.2); border-radius: 12px; display: inline-block;">
                <i class="bi bi-exclamation-triangle-fill text-danger fs-1 mb-3"></i>
                <h4 class="fw-bold mb-2">Não foi possível carregar os dados.</h4>
                <p style="color: #cbd5e1;" class="mb-4">${message}</p>
                <button class="btn btn-outline-light px-4 py-2" onclick="${retryAction}">
                    <i class="bi bi-arrow-clockwise me-2"></i> Tentar novamente
                </button>
            </div>
        </div>
    `;
    destaqueContainer.innerHTML = '';
}

async function initHome() {
    renderSkeletons(12);

    try {
        let games = await fetchPopularGames();
        
        if (games && games.length > 0) {
            // Embaralha o array de jogos para aleatoriedade
            games = games.sort(() => Math.random() - 0.5);
            
            // Configura a Hero Section (tamanho maior de imagem)
            setHeroBackground(games[0]);
            // Configura o Destaque da Semana
            renderDestaque(games[1]);
            // Renderiza o resto na grid estilo Netflix
            renderGames(games.slice(2));
        } else {
            gamesList.innerHTML = `<div class="col-12 text-center text-light mt-5"><h3>Nenhum jogo encontrado.</h3></div>`;
        }
    } catch (e) {
        let errorMsg = e.message || 'Erro desconhecido. Tente novamente em alguns segundos.';
        renderError(errorMsg, 'initHome()');
    }

    // Busca
    if (searchForm && !searchForm.hasAttribute('data-bound')) {
        searchForm.setAttribute('data-bound', 'true');
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                renderSkeletons(8);
                try {
                    const searchResults = await searchGames(query);
                    renderGames(searchResults);
                    document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
                } catch(err) {
                    renderError(err.message || 'Erro ao pesquisar. Confira sua conexão.', `document.getElementById('searchForm').dispatchEvent(new Event('submit'))`);
                }
            }
        });
    }
}

function setHeroBackground(game) {
    if (!game || !game.background_image) return;
    
    // Na imagem de herói pedimos resolução maior via proxy width=1920
    dynamicHero.style.backgroundImage = `url('${getProxiedImage(game.background_image, 1920)}')`;
    heroTitle.innerText = `O mundo de ${game.name}`;
}

function renderDestaque(game) {
    if(!game) return;

    const genres = game.genres ? game.genres.map(g => g.name).join(' • ') : 'N/A';
    const image = game.background_image ? getProxiedImage(game.background_image, 1200) : 'https://via.placeholder.com/1200x600';

    const destaqueHTML = `
        <div class="featured-game mt-5 mb-5" style="background-image: url('${image}');">
            <div class="featured-overlay">
                <div class="featured-content text-light">
                    <span class="badge bg-danger mb-3 fw-bold"><i class="bi bi-fire"></i> Destaque da Semana</span>
                    <h2 class="display-5 fw-bold mb-3">${game.name}</h2>
                    <p class="genre-text mb-3" style="color: #cbd5e1;">${genres}</p>
                    <div class="mb-4">
                        <span class="metascore-badge me-2">Metascore: ${game.metacritic || 'N/A'}</span>
                        <span><i class="bi bi-calendar-event"></i> ${game.released || 'N/A'}</span>
                    </div>
                    <a href="detalhes.html?id=${game.id}" class="btn btn-primary btn-lg btn-glow px-4 py-2">
                        <i class="bi bi-info-circle me-2"></i> Explorar Jogo
                    </a>
                </div>
            </div>
        </div>
    `;
    destaqueContainer.innerHTML = destaqueHTML;
}

function renderSkeletons(count) {
    gamesList.innerHTML = '';
    for(let i=0; i<count; i++){
        gamesList.innerHTML += `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                <div class="skeleton skeleton-card"></div>
            </div>
        `;
    }
}

function renderGames(games) {
    gamesList.innerHTML = ''; 

    if (games.length === 0) {
        gamesList.innerHTML = `<div class="col-12 text-center text-light mt-5"><h3>Nenhum resultado.</h3></div>`;
        return;
    }

    games.forEach((game, index) => {
        const genres = game.genres ? game.genres.map(g => g.name).join(', ') : '';
        const image = game.background_image ? getProxiedImage(game.background_image, 600) : 'https://via.placeholder.com/600x400?text=Sem+Imagem';
        
        // Efeito stagger manual na animação reveal
        const delay = (index % 4) * 0.1;

        const cardHTML = `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 reveal active" style="transition-delay: ${delay}s;">
                <div class="netflix-card shadow" onclick="window.location.href='detalhes.html?id=${game.id}'">
                    <img src="${image}" class="game-img" alt="${game.name}" loading="lazy">
                    <div class="netflix-card-overlay">
                        <h5 class="card-title text-light">${game.name}</h5>
                        <p class="genre-text mb-2">${genres}</p>
                        <div class="d-flex justify-content-between align-items-center mt-2">
                            <span class="metascore-badge">${game.metacritic || '-'}</span>
                            <span class="text-light small"><i class="bi bi-play-circle-fill fs-4 text-primary"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        gamesList.innerHTML += cardHTML;
    });
}

function setupScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(reveal => {
        observer.observe(reveal);
    });

    // Run once to check immediate elements
    setTimeout(() => {
        reveals.forEach(reveal => {
            if(reveal.getBoundingClientRect().top < window.innerHeight) {
                reveal.classList.add('active');
            }
        });
    }, 100);
}
