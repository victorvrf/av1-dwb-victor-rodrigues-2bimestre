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
            showError("Jogo não encontrado.", true);
            return;
        }

        renderGameDetails(game, screenshots);
        setupScrollReveal();

    } catch (error) {
        console.error("Erro na carga de detalhes:", error);
        const msg = error.message || "A conexão demorou muito ou falhou. Tente novamente em alguns segundos.";
        showError(msg, true);
    }
}

function getProxiedImage(url, width = 800) {
    if (!url) return '';
    return `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=${width}&output=webp&q=80`;
}

function renderGameDetails(game, screenshots) {
    const genres = game.genres ? game.genres.map(g => g.name).join(', ') : '-';
    const platforms = game.platforms ? game.platforms.map(p => p.platform.name).join(', ') : '-';
    const publishers = game.publishers ? game.publishers.map(p => p.name).join(', ') : '-';
    const developers = game.developers ? game.developers.map(d => d.name).join(', ') : '-';
    const image = game.background_image ? getProxiedImage(game.background_image, 1920) : 'https://via.placeholder.com/1920x1080?text=Sem+Imagem';
    
    // Background Cinematográfico Embaçado
    if (detailsBackground) {
        detailsBackground.style.backgroundImage = `url('${image}')`;
    }

    let screenshotsHTML = '';
    if (screenshots && screenshots.length > 0) {
        // Guarda URLs em alta qualidade para o Lightbox
        currentScreenshots = screenshots.slice(0, 6).map(shot => getProxiedImage(shot.image, 1920));
        
        screenshots.slice(0, 6).forEach((shot, index) => {
            const delay = (index % 3) * 0.1;
            screenshotsHTML += `
                <div class="col-12 col-md-6 col-lg-4 mb-3 reveal" style="transition-delay: ${delay}s;">
                    <img src="${getProxiedImage(shot.image, 800)}" class="img-fluid w-100 screenshot-img" style="cursor: zoom-in;" alt="Screenshot" loading="lazy" onclick="openLightbox(${index})">
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

function showError(message, retry = false) {
    if (errorAlert) {
        errorAlert.classList.remove('d-none');
        let retryBtn = retry ? `<button class="btn btn-outline-danger btn-sm mt-3 d-block w-100" onclick="initDetails()"><i class="bi bi-arrow-clockwise"></i> Tentar novamente</button>` : '';
        errorAlert.innerHTML = `<strong>Aviso:</strong> ${message} ${retryBtn}`;
        gameDetailsContainer.innerHTML = '';
        if (detailsBackground) detailsBackground.style.backgroundImage = 'none';
        detailsBackground.style.backgroundColor = 'var(--darker-bg)';
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

// ---- Lightbox Functionality ----

function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    if (lightbox && lightboxImg && currentScreenshots.length > 0) {
        lightboxImg.src = currentScreenshots[currentLightboxIndex];
        lightbox.classList.remove('d-none');
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.add('d-none');
    }
}

function changeLightbox(direction) {
    if (currentScreenshots.length === 0) return;
    
    currentLightboxIndex += direction;
    if (currentLightboxIndex >= currentScreenshots.length) {
        currentLightboxIndex = 0;
    } else if (currentLightboxIndex < 0) {
        currentLightboxIndex = currentScreenshots.length - 1;
    }
    
    const lightboxImg = document.getElementById('lightboxImg');
    if (lightboxImg) {
        // Remove a classe de animação e força um reflow para reiniciar a animação
        lightboxImg.classList.remove('animating-photo');
        void lightboxImg.offsetWidth; 
        
        // Troca a imagem e adiciona a animação de volta
        lightboxImg.src = currentScreenshots[currentLightboxIndex];
        lightboxImg.classList.add('animating-photo');
    }
}

// Fechar lightbox no esc e navegar com as setas
document.addEventListener('keydown', function(event) {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && !lightbox.classList.contains('d-none')) {
        if (event.key === "Escape") {
            closeLightbox();
        } else if (event.key === "ArrowRight") {
            changeLightbox(1);
        } else if (event.key === "ArrowLeft") {
            changeLightbox(-1);
        }
    }
});
