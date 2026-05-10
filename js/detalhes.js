document.addEventListener('DOMContentLoaded', () => {
    initDetails();
});

const gameDetailsContainer = document.getElementById('gameDetailsContainer');
const detailsBackground = document.getElementById('detailsBackground');
const errorAlert = document.getElementById('errorAlert');

async function initDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (!gameId) {
        showError("Nenhum ID de jogo fornecido.");
        return;
    }

    try {
        const [game, screenshots] = await Promise.all([
            fetchGameDetails(gameId),
            fetchGameScreenshots(gameId)
        ]);

        if (!game) {
            showError("Jogo não encontrado.");
            return;
        }

        renderGameDetails(game, screenshots);
        setupScrollReveal();

    } catch (error) {
        console.error("Erro na carga de detalhes:", error);
        showError("Ocorreu um erro ao carregar os detalhes do jogo.");
    }
}

function renderGameDetails(game, screenshots) {
    const genres = game.genres ? game.genres.map(g => g.name).join(', ') : '-';
    const platforms = game.platforms ? game.platforms.map(p => p.platform.name).join(', ') : '-';
    const publishers = game.publishers ? game.publishers.map(p => p.name).join(', ') : '-';
    const developers = game.developers ? game.developers.map(d => d.name).join(', ') : '-';
    const image = game.background_image || 'https://via.placeholder.com/1920x1080?text=Sem+Imagem';
    
    // Background Cinematográfico Embaçado
    if (detailsBackground) {
        detailsBackground.style.backgroundImage = `url('${image}')`;
    }

    let screenshotsHTML = '';
    if (screenshots && screenshots.length > 0) {
        screenshots.slice(0, 6).forEach((shot, index) => {
            const delay = (index % 3) * 0.1;
            screenshotsHTML += `
                <div class="col-12 col-md-6 col-lg-4 mb-3 reveal" style="transition-delay: ${delay}s;">
                    <img src="${shot.image}" class="img-fluid w-100 screenshot-img" alt="Screenshot" loading="lazy">
                </div>
            `;
        });
    } else {
        screenshotsHTML = '<p class="text-light">Nenhuma screenshot disponível.</p>';
    }

    const html = `
        <div class="container reveal mt-3">
            <div class="game-banner mb-5 position-relative">
                <div class="banner-overlay position-absolute w-100 h-100"></div>
                <img src="${image}" alt="${game.name}" class="w-100 banner-img">
                <div class="banner-content position-absolute bottom-0 start-0 p-4 p-md-5 text-light w-100" style="z-index: 2;">
                    <h1 class="display-3 fw-bold mb-2 text-shadow" style="text-shadow: 0 4px 15px rgba(0,0,0,0.9);">${game.name}</h1>
                </div>
            </div>
        </div>

        <div class="container mb-5">
            <div class="row">
                <div class="col-lg-8 mb-4 reveal" style="transition-delay: 0.1s;">
                    <div class="content-box p-4 h-100 text-light">
                        <h3 class="fw-bold mb-4 border-bottom border-secondary pb-2">Sobre o Jogo</h3>
                        <p style="line-height: 1.8; font-size: 1.05rem; opacity: 0.9;">${game.description_raw || 'Descrição não disponível.'}</p>
                    </div>
                </div>
                <div class="col-lg-4 mb-4 reveal" style="transition-delay: 0.2s;">
                    <div class="content-box p-4 h-100 text-light">
                        <h3 class="fw-bold mb-4 border-bottom border-secondary pb-2">Informações</h3>
                        <ul class="list-unstyled">
                            <li class="mb-3 d-flex justify-content-between align-items-center">
                                <strong>Metascore:</strong>
                                <span class="metascore-badge ms-2">${game.metacritic || 'N/A'}</span>
                            </li>
                            <li class="mb-3">
                                <strong>Lançamento:</strong><br>
                                <span style="opacity: 0.8;">${game.released || 'N/A'}</span>
                            </li>
                            <li class="mb-3">
                                <strong>Gêneros:</strong><br>
                                <span class="genre-text mt-1 d-inline-block">${genres}</span>
                            </li>
                            <li class="mb-3">
                                <strong>Plataformas:</strong><br>
                                <span style="opacity: 0.8;">${platforms}</span>
                            </li>
                            <li class="mb-3">
                                <strong>Publisher:</strong><br>
                                <span style="opacity: 0.8;">${publishers}</span>
                            </li>
                            <li class="mb-3">
                                <strong>Developer:</strong><br>
                                <span style="opacity: 0.8;">${developers}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="row mt-5">
                <div class="col-12 reveal">
                    <h3 class="text-light fw-bold mb-4 border-bottom border-secondary pb-2">Galeria</h3>
                    <div class="row g-3 screenshots-gallery">
                        ${screenshotsHTML}
                    </div>
                </div>
            </div>
        </div>
    `;

    gameDetailsContainer.innerHTML = html;
}

function showError(message) {
    if (errorAlert) {
        errorAlert.classList.remove('d-none');
        errorAlert.innerHTML = `<strong>Erro!</strong> ${message}`;
        gameDetailsContainer.innerHTML = '';
    }
}

function setupScrollReveal() {
    setTimeout(() => {
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        reveals.forEach(reveal => observer.observe(reveal));
        
        // Immediate check
        reveals.forEach(reveal => {
            if(reveal.getBoundingClientRect().top < window.innerHeight) {
                reveal.classList.add('active');
            }
        });
    }, 100);
}
