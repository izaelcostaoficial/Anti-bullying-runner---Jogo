
Action: file_editor create /app/standalone/README.md --file-text "# Anti-Bullying Runner — Versão Standalone (HTML + CSS + JS)

Jogo educacional anti-bullying em arquivo único 100% portátil. Funciona em qualquer
servidor estático: GitHub Pages, Netlify, Vercel, ou abrindo `index.html` direto no navegador.

## Arquivos
```
standalone/
├── index.html      Marcação (menu, jogo, login, settings, ranking, modais)
├── styles.css      Tema, layout responsivo, animações, paletas
├── game.js         Engine canvas, i18n, áudio, auth, perguntas
└── README.md       Este arquivo
```

## Como executar
### Opção 1 — Abrir direto
Clique 2x em `index.html`. Tudo funciona em modo local (perguntas, jogo, recorde em
`localStorage`). **Login/ranking global ficam desabilitados** porque exigem servidor.

### Opção 2 — Servidor estático (recomendado)
```bash
cd standalone
python3 -m http.server 8000
# acesse http://localhost:8000
```
ou:
```bash
npx serve standalone
```

### Opção 3 — Com backend (login + ranking global)
Edite a primeira linha de `game.js`:
```js
const API_BASE = \"https://seu-backend.com\"; // sem barra no final
```
O backend FastAPI completo está em `/app/backend/server.py` e expõe:

| Método | Rota                       | Descrição                                |
|--------|----------------------------|------------------------------------------|
| POST   | /api/auth/register         | Cadastro email/senha → JWT               |
| POST   | /api/auth/login            | Login → JWT                              |
| POST   | /api/auth/google/session   | Troca `session_id` do Emergent           |
| GET    | /api/auth/me               | Dados do usuário                         |
| POST   | /api/auth/logout           | Fim de sessão                            |
| POST   | /api/scores                | Salva pontuação                          |
| GET    | /api/scores/leaderboard    | Top 10                                   |
| GET    | /api/scores/me             | Recorde pessoal                          |

## Features
- ✅ **Personagem RPG (cavaleiro pixel-art)** correndo na pista com animação 4 frames
- ✅ **3 faixas com perspectiva 2.5D** + linhas pontilhadas em movimento
- ✅ **3 vidas** (errar pergunta = perde vida, bater em obstáculo = perde vida)
- ✅ **6 perguntas anti-bullying aleatórias** por partida (banco de 36 questões em PT/EN/ES)
- ✅ **Música de vitória** (Web Audio API, melodia em Dó maior) ao quebrar o recorde
- ✅ **SFX**: pulo, click, batida, pergunta, acerto/erro
- ✅ **3 idiomas**: Português, English, Español
- ✅ **4 temas de cor**: Arcade, Forest, Ocean, Sunset
- ✅ **3 modos de correção de cor (daltônico)**: deuteranopia, protanopia, tritanopia (filtro SVG)
- ✅ **Login na nuvem**:
  - Email/Senha (JWT)
  - Google (Emergent Managed OAuth — `https://auth.emergentagent.com`)
- ✅ **Ranking global Top 10** (com backend) ou local (sem backend)
- ✅ **Controles**: Teclado (←/→ ou A/D, ↑/W/Espaço para pular, P/Esc para pausa) + Touch swipe + botões mobile
- ✅ **Persistência**: idioma, tema, modo daltônico e recorde local salvos em `localStorage`

## Controles
| Ação           | Teclado            | Mobile            |
|----------------|-------------------|-------------------|
| Esquerda       | ← ou A            | Swipe ← / Botão ← |
| Direita        | → ou D            | Swipe → / Botão → |
| Pular          | ↑, W ou Espaço    | Swipe ↑ / Botão ↑ |
| Pausa          | Esc ou P          | Botão ⏸           |

## Personalização
Edite as constantes no topo de `game.js`:
- `THEMES` — paletas de cor (você pode criar a sua)
- `QUESTIONS` — adicione/edite perguntas por idioma
- `I18N` — adicione um novo idioma (copie um bloco e traduza)

## Compatibilidade
- Chrome / Edge / Firefox / Safari (desktop e mobile)
- Web Audio API (todos os navegadores modernos)
- Funciona offline após o primeiro carregamento (basta empacotar como PWA se quiser).

## Licença
MIT — © 2026 Anti-Bullying Runner
"
Observation: Create successful: /app/standalone/README.md
