# Central Gamer - Catálogo de Jogos 🎮

Projeto escolar moderno e responsivo desenvolvido com HTML5, CSS3, Bootstrap 5 e JavaScript Vanilla, consumindo a RAWG Video Games Database API.

## Funcionalidades
- Listagem dos jogos mais populares.
- Barra de pesquisa integrada à API para buscar qualquer título.
- Página de detalhes de um jogo selecionado.
- Exibição de informações como nota (metacritic), gêneros, plataformas, descrição e screenshots.
- Fallback local (mock data) caso a API esteja indisponível.
- Interface escura (Dark Mode) com efeitos de Glassmorphism e Glow.

## Tecnologias Utilizadas
- **HTML5**: Estrutura semântica.
- **CSS3 / Bootstrap 5**: Estilização, responsividade e layout (Flexbox/Grid). Componentes visuais.
- **JavaScript Puro**: Lógica do projeto sem frameworks.
- **Fetch API / Async & Await**: Consumo assíncrono de dados externos.
- **URLSearchParams**: Passagem de parâmetros entre páginas.
- **RAWG API**: Fonte de dados de videogames.

## Estrutura de Arquivos
```text
av1-dwb-victor-rodrigues-2bimestre/
│
├── index.html        # Página inicial
├── detalhes.html     # Página de detalhes
│
├── css/
│   └── style.css     # Estilizações customizadas
│
├── js/
│   ├── script.js     # Lógica da página inicial (Home)
│   ├── detalhes.js   # Lógica da página de detalhes
│   ├── api.js        # Centralização das requisições Fetch
│   └── mockData.js   # Dados de fallback em caso de erro na API
│
└── README.md         # Documentação
```

## Como Executar
1. Clone ou faça o download deste repositório.
2. Abra a pasta `av1-dwb-victor-rodrigues-2bimestre` no terminal ou gerenciador de arquivos.
3. Para uma experiência completa de requisições, recomenda-se iniciar um servidor local (ex: usando a extensão *Live Server* do VSCode ou executando `python -m http.server` / `npx serve`).
4. Abra o `index.html` no navegador.

## Explicação da API
A integração é feita através da [RAWG API](https://rawg.io/apidocs).
A autenticação acontece fornecendo a `API_KEY` na string de requisição (query params). 
Três rotas principais são consumidas com Promises e fetch:
1. `GET /api/games?key={Key}&page_size=20` (Página inicial)
2. `GET /api/games/{id}?key={Key}` (Página de detalhes)
3. `GET /api/games/{id}/screenshots?key={Key}` (Imagens secundárias)

A página de detalhes utiliza `Promise.all()` para aguardar as chamadas de detalhes e screenshots simultaneamente.

## Autor
Victor Rodrigues - Trabalho 2º Bimestre.
