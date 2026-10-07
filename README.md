# Lulaverso — A Jornada do Companheiro

Jogo 2D de plataforma, em formato de *newsgame*, apresentado como sátira política sobre
episódios públicos da trajetória de Lula. Cada fase termina com um painel de contexto
que separa fato, alegação, defesa, desfecho jurídico e encenação.

> **Protótipo local.** Sem deploy, backend, cadastro, analytics ou conteúdo eleitoral.
> As fontes do roteiro ainda estão **pendentes de revisão** no repositório (ver `docs/editorial-review.md`).

O briefing completo está em [`docs/BRIEFING.md`](docs/BRIEFING.md).

## Requisitos

- Node.js 22.12 ou mais recente (testado com 22.22)
- npm 10

## Comandos

```sh
npm install            # instala as dependências
npm run dev            # servidor de desenvolvimento: http://localhost:5173
npm run build          # checagem de tipos + build de produção em dist/
npm run preview        # serve o build de produção: http://localhost:4173
npm test               # testes automatizados (Vitest)
npm run typecheck      # só a checagem de tipos
npm run check:content  # só a validação do conteúdo editorial
npm run check          # tipos + testes
```

Para abrir no celular, na mesma rede: `npm run dev -- --host` e use o endereço “Network”.

### Conteúdo pendente: desenvolvimento × build

- `npm run dev` mostra **tudo**, com resumos e afirmações não revisados marcados como
  *pendente* e as notas internas do que falta conferir.
- `npm run build` **esconde** todo resumo, desfecho e fonte que dependa de fonte
  `pending`: na fase aparece “Notícia em revisão” / “Decisão em revisão”, e o painel
  mostra só as falas do jogo e a nota sobre o que é encenação.
- Para gerar um build de revisão interna com as pendências visíveis:
  `VITE_SHOW_PENDING=true npm run build`.

Um build que passa **não** é aprovação editorial para publicação.

## O que está jogável

- Abertura com o aviso de sátira → menu → seleção de fase → premissa da fase → jogo com
  notícia, crítica e contexto em cena → resultado → notícias e fontes → próxima fase.
- Menu: Jogar, Selecionar fase, Como jogar, Contexto e fontes, Sobre o projeto, Configurações.
- **Fase 1 — “Tríplex: Subindo na Vida”** (roteiro do briefing v2, seção 6), seis
  missões em ordem:
  1. **Empreiteiro da OAS** (personagem fictício) no tapume: abre o escritório.
  2. **Contrato da Petrobras** na mesa (ilustração): uma linha “Tese da acusação” liga a
     pasta à obra e a passagem para os andaimes aparece.
  3. **Planta da reforma** em três peças (cozinha, escada, elevador): a cozinha e a escada
     aparecem montadas e o elevador ganha acabamento privativo.
  4. **Mala** com o rótulo “METÁFORA DA ACUSAÇÃO” no próprio objeto: libera o elevador.
  5. **Elevador privativo**, que sobe até o andar privativo, com checkpoint no desembarque.
  6. **Defesa de Lula** no balcão do terraço: libera a saída.
  - Cada interação mostra uma **faixa de notícia** com a fala do jogo (ficção), o resumo
    atribuído (“Relato de Léo Pinheiro • UOL • 20/04/2017”), a categoria (Notícia,
    Acusação, Defesa, Decisão ou Metáfora) e o botão **Fonte** (tecla F), que abre o
    cartão completo e pausa o jogo. O botão 🗂 abre o arquivo da fase.
  - Final com quatro carimbos: 2017 houve condenação → 2021 condenações anuladas → 2021
    juiz considerado parcial → 2022 caso arquivado. Os desfechos se repetem na tela de
    resultado, com Rejogar, Ver notícias e Próxima fase.
- Fases 2 a 7 aparecem no mapa como **Planejadas**, com o ano das fases históricas.
- Pausa (congela física, animações e cronômetro), reinício que zera o roteiro, volume,
  mudo, “reduzir movimento” e controles de toque. Quedas preservam as missões cumpridas.
- Progresso e preferências no `localStorage`, com versão do formato; dados corrompidos ou
  do formato antigo voltam ao padrão sem quebrar o jogo.

### Controles

| Ação | Teclado | Celular |
| --- | --- | --- |
| Mover | A/D ou setas | ◀ ▶ |
| Pular (segure para ir mais alto) | Espaço, W ou ↑ | ⤒ |
| Interagir | E | ✋ |
| Abrir a fonte da notícia | F | Botão “Fonte” |
| Pausar | Esc ou P | ❚❚ |

No celular, o jogo sugere a tela na horizontal, mas dá para jogar em pé (“Jogar mesmo assim”):
os botões ficam abaixo da área do jogo. Dá para segurar ◀/▶ e pular ao mesmo tempo.

## Estrutura

```text
src/
  app/                 # telas React e fluxo (App.tsx, screens/)
  components/          # painel de contexto, configurações, toque, selos
  content/             # conteúdo editorial, separado do motor
    levels/            #   definições das sete fases
    sources/           #   registro de fontes e estado da checagem
    validate.ts        #   checagem de consistência (IDs, verified sem base etc.)
    visibility.ts      #   o que aparece em desenvolvimento × build
  game/                # motor (Phaser 4)
    scenes/            #   TriplexScene (Fase 1)
    entities/          #   Player
    systems/           #   input, regras da partida, checkpoints, progresso, áudio
    levels/            #   dados do mapa da Fase 1
    textures.ts        #   pixel art provisória gerada em código
    bridge.ts          #   eventos entre a cena Phaser e o React
  styles/
docs/
  BRIEFING.md          # briefing original
  editorial-review.md  # o que falta verificar, fonte por fonte
  asset-licenses.md    # inventário de assets
```

React cuida de menus, painéis e acessibilidade. O Phaser cuida só do mundo jogável e é
criado e destruído junto com a tela de jogo (inclusive no StrictMode do desenvolvimento).

### Como adicionar uma fase

1. Conteúdo: preencha a fase em `src/content/levels/` (afirmações com `sourceIds`,
   fontes em `src/content/sources/`).
2. Mapa: crie os dados em `src/game/levels/` e uma cena em `src/game/scenes/`.
3. Registre a cena em `LEVEL_SCENES` (`src/game/createGame.ts`) e mude
   `implementationStatus` para `playable`.
4. `npm run check`: a validação recusa fase jogável sem contexto, IDs inexistentes e
   `verified` sem fonte verificada.

## Verificações feitas

- `npm run check` (tipos e 46 testes) e `npm run build` passando.
- Testes automatizados das regras que podem falhar: ordem das missões e requisito para a
  saída, peças da planta, queda e checkpoint preservando missões, reinício que zera o
  roteiro, persistência com dados inválidos ou do formato antigo, entrada combinada de
  teclado e toque, integridade das referências editoriais (fontes inexistentes, metáfora
  sem nota de ficção, interação sem atribuição, fase jogável sem defesa ou sem desfecho)
  e visibilidade das pendências.
- Testes no Chromium com Playwright (scripts fora do repositório):
  - as seis missões cumpridas **só com comandos de teclado**, sem teletransporte, quatro
    rodadas seguidas; cada faixa conferida (fala, resumo, atribuição e categoria); mala
    recusada antes da planta; saída recusada antes da defesa; tecla F abre o cartão e
    pausa; arquivo com as seis interações; final com os quatro desfechos; Rejogar zera;
  - celular deitado e em pé com toque, inclusive mover e pular com dois dedos;
  - build de produção: resumos e desfechos pendentes escondidos, falas do jogo visíveis,
    sem gancho de testes.
- **Não testado:** celular físico, Safari/iOS e áudio audível. O WebGL rodou por software.

## Fora do escopo desta etapa

Deploy, domínio, backend, login, ranking online, multiplayer, analytics, campanha e arte
definitiva.
