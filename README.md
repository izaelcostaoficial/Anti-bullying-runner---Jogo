[Anti-Bullying Runner Ultra.md](https://github.com/user-attachments/files/31285647/Anti-Bullying.Runner.Ultra.md)

# Anti-Bullying Runner Ultra

**Anti-Bullying Runner Ultra** é um endless runner educativo em HTML5, CSS e JavaScript, criado para abordar empatia, respeito, inclusão, segurança e prevenção ao bullying de forma interativa.

## Estrutura

```text
Anti-Bullying-Runner/
├── index.html
├── style.css
├── script.js
└── README.md
```

O projeto é estático e não depende de servidor próprio, banco de dados ou build. Os dados do jogador são armazenados no `LocalStorage` do navegador, permitindo uso direto em hospedagens como GitHub Pages.

## Funcionalidades

A versão atual preserva o menu, o runner em três pistas, obstáculos, colisões, coleta de moedas e gemas, power-ups, vidas, pontuação, XP, níveis, dilemas educativos, loja, ranking, configurações, pausa, game over, reinício, áudio e persistência local.

A velocidade começa baixa e aumenta gradualmente durante a corrida. A progressão é baseada no tempo, com limite máximo para manter o jogo jogável: os primeiros 30 segundos são tranquilos, entre 30 e 60 segundos o ritmo aumenta, entre 1 e 2 minutos a dificuldade fica média e, depois disso, o desafio cresce de forma controlada.

A interface possui modo claro e modo escuro, além dos temas Arcade, Floresta, Oceano e Pôr do Sol. O modo visual, tema, idioma, nome, volume, moedas, gemas, XP, compras e ranking são persistidos localmente.

## Controles

| Ação | Teclado | Celular |
|---|---|---|
| Trocar de pista para a esquerda | `A` ou `←` | Deslizar para a esquerda |
| Trocar de pista para a direita | `D` ou `→` | Deslizar para a direita |
| Pular | `W` ou `↑` | Deslizar para cima |
| Deslizar | `S` ou `↓` | Deslizar para baixo |
| Pausar | `P` ou `Esc` | Botão de pausa |
| Escudo | `Espaço` | Botão 🛡️ |
| Velocidade | `Q` | Botão ⚡ |
| Ímã | `E` | Botão 🧲 |
| Lentidão | `R` | Botão 🌀 |
| Jetpack | `F` | Botão 🚀 |

## Execução local

Abra `index.html` diretamente no navegador ou sirva a pasta com qualquer servidor estático. Para uma execução local simples:

```bash
python3 -m http.server 4173
```

Em seguida, acesse `http://localhost:4173`.

## Publicação no GitHub Pages

Crie um repositório, mantenha `index.html`, `style.css`, `script.js` e `README.md` na raiz e publique a branch escolhida em **Settings → Pages**. Como o projeto usa apenas caminhos relativos e APIs do navegador, ele é compatível com uma hospedagem estática sem ajustes de backend.

## Áudio e privacidade

Os efeitos sonoros e a música são sintetizados pela Web Audio API e podem exigir a primeira interação do usuário devido às políticas de autoplay dos navegadores. Nenhuma conta ou dado pessoal é enviado para um servidor; o nome e o progresso permanecem no dispositivo, no armazenamento local do navegador.

## Testes realizados

Foi verificado o carregamento inicial, a transição para o menu, o cadastro local do nome, o início da corrida, renderização do canvas, HUD, pausa, configurações, modo claro/escuro, idioma, loja, abas de power-ups e temas, ranking vazio e navegação de retorno. A sintaxe do `script.js` também foi validada com `node --check`.
