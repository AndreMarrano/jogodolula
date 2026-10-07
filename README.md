# Lulaverso — A Jornada do Companheiro

Jogo 2D de plataforma, em formato de *newsgame*, apresentado como sátira política sobre
episódios públicos da trajetória de Lula. Cada fase termina com um painel de contexto
que separa fato, alegação, defesa, desfecho jurídico e encenação.

> **Protótipo local.** Sem deploy, backend, cadastro, analytics ou conteúdo eleitoral.
> O conteúdo factual ainda **não foi verificado** (ver `docs/editorial-review.md`).

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

- `npm run dev` mostra **tudo**, com as afirmações não verificadas marcadas como
  *pendente* e as notas internas do que falta checar.
- `npm run build` **esconde** toda afirmação e fonte com status `pending`. O painel mostra
  só “Contexto em revisão” e a nota sobre o que é encenação.
- Para gerar um build de revisão interna com as pendências visíveis:
  `VITE_SHOW_PENDING=true npm run build`.

Um build que passa **não** é aprovação editorial para publicação.

## O que está jogável

- Abertura com o aviso de sátira → menu → seleção de fase → contexto curto → jogo →
  resultado → contexto e fontes → próxima fase.
- Menu: Jogar, Selecionar fase, Como jogar, Contexto e fontes, Sobre o projeto, Configurações.
- **Fase 1 — “Tríplex: Subindo na Vida”** completa (cerca de 1 a 3 minutos):
  - três setores (térreo e tutorial; andaimes com plataforma móvel, elevador e checkpoint;
    cobertura com alçapões temporizados e segundo checkpoint);
  - seis documentos; a saída exige pelo menos quatro, e o HUD indica isso;
  - porta de serviço que abre com a tecla de interagir;
  - queda no mar volta ao último checkpoint, mantendo os documentos;
  - sequência final com os carimbos “CONDENAÇÃO” → “ANULAÇÃO POR INCOMPETÊNCIA” →
    “SUSPEIÇÃO DO JUIZ”, que reorganiza o mapa (com o aviso “Contexto em revisão”).
- Fases 2 a 7 aparecem no mapa como **Planejada** ou **Em pesquisa** (4 e 6), sem fingir
  que funcionam.
- Pausa (congela física, animações e cronômetro), reinício previsível, volume, mudo,
  “reduzir movimento” (segue a preferência do sistema) e controles de toque.
- Progresso e preferências no `localStorage`, com versão do formato; dados corrompidos
  voltam ao padrão sem quebrar o jogo.

### Controles

| Ação | Teclado | Celular |
| --- | --- | --- |
| Mover | A/D ou setas | ◀ ▶ |
| Pular (segure para ir mais alto) | Espaço, W ou ↑ | ⤒ |
| Interagir | E | ✋ |
| Pausar | Esc ou P | ❚❚ |

No celular, o jogo pede a tela na horizontal. Dá para segurar ◀/▶ e pular ao mesmo tempo.

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

- `npm run typecheck`, `npm test` (44 testes) e `npm run build` passando.
- Testes automatizados das regras que podem falhar: requisito de documentos para a saída,
  checkpoint e queda, reinício, persistência com dados inválidos ou storage indisponível,
  entrada combinada de teclado e toque, validação editorial e visibilidade das pendências.
- Testes no Chromium com Playwright (scripts fora do repositório):
  - ciclo menu → fase → coleta → checkpoint → queda → pausa → saída negada → porta →
    conclusão → contexto → repetir → reiniciar;
  - a fase inteira concluída **só com comandos de teclado**, sem teletransporte (6 de 6
    documentos);
  - celular deitado (863×360) com toque, incluindo mover e pular com dois dedos ao mesmo
    tempo; aviso para girar a tela em retrato; menus sem rolagem horizontal em 360 px;
  - “reduzir movimento”, build de produção (pendências escondidas, sem gancho de testes).
- **Não testado:** celular físico, Safari/iOS e áudio audível (o navegador de teste não
  tem saída de som). O WebGL rodou por software.

## Fora do escopo desta etapa

Deploy, domínio, backend, login, ranking online, multiplayer, analytics, campanha e arte
definitiva.
