# Revisão editorial — estado da checagem

Última atualização: 2026-10-07 (briefing v2).

## Situação

- As fontes S01–S18 vêm do registro do briefing v2 (`docs/BRIEFING.md`, seção 9). O
  briefing informa que foram consultadas em 07/10/2026, algumas só pelo conteúdo
  recuperado em busca (`accessMode: "search_content"`).
- **No repositório, todas continuam `pending`.** O ambiente em que o código foi escrito
  não tinha acesso a esses sites (bloqueio da política de rede). Por isso, ninguém
  conferiu aqui os resumos do jogo contra o texto das fontes.
- Os textos das interações, desfechos e afirmações foram copiados do roteiro do briefing
  (seções 6.5–6.12), sem acréscimos factuais.

`reviewed` significa que o resumo corresponde ao que a fonte publicou e preserva o
contexto. Não significa que uma acusação foi provada.

## O que aparece em cada versão

| Versão | Falas do jogo (ficção) | Resumos de notícia, desfechos, linha factual | Fontes |
| --- | --- | --- | --- |
| `npm run dev` ou build com `VITE_SHOW_PENDING=true` | sim | sim, com selo **pendente** | sim, “não revisada” |
| `npm run build` (público) | sim | “Notícia em revisão” / “Decisão em revisão” enquanto a fonte estiver pendente | só as revisadas |

A nota da mala (“A mala representa a vantagem indevida alegada…”) é redação do próprio
jogo e aparece sempre.

## Como marcar uma fonte como revisada

1. Abra a fonte e leia o texto. Confira sujeito, data, órgão e desfecho.
2. Compare com cada resumo que cita a fonte (`src/content/levels/triplex.ts`: campos
   `sourcedSummary`, `attributionLabel`, `outcomes` e `claims`).
3. Em `src/content/sources/index.ts`, preencha `checkedAt` (AAAA-MM-DD) e `accessMode`,
   ajuste `notes` com o que foi conferido e mude `status` para `"reviewed"`.
4. Revise as afirmações do painel (`claims`) que dependem dela e mude o `status` delas.
5. Rode `npm run check:content`. A validação recusa afirmação revisada apoiada em fonte
   pendente e fonte revisada sem `checkedAt`.

## Fase 1 — fontes e onde aparecem

| Fonte | Usada em | Observação do briefing |
| --- | --- | --- |
| S01 — Agência Brasil, 24/01/2018 | contrato, mala (tese), 2017 “Houve condenação”, linha factual | Notícia da época; acompanhar de S03–S06. Não sustenta mala real. |
| S02 — UOL, 20/04/2017 | empreiteiro, elevador, defesa | Relato atribuído a Pinheiro; não certifica titularidade. |
| S03 — Agência Brasil, 15/04/2021 | 2021 “Condenações anuladas”, linha factual | Conteúdo por busca; acórdão não lido. |
| S04 — STF, 23/06/2021 | 2021 “Juiz considerado parcial” | Conteúdo institucional por busca. |
| S05 — Migalhas, 28/01/2022 | 2022 “Caso arquivado” | Conferir com S06. |
| S06 — decisão da 12ª Vara Federal do DF, 27/01/2022 | 2022 “Caso arquivado” | Não confundir com os capítulos do acervo presidencial. |
| S15 — Folha, 26/04/2017 | planta da reforma, elevador | Conteúdo por busca. |

### Encenação (não depende de fonte)

- O empreiteiro é um personagem genérico; as falas dele não são de Léo Pinheiro.
- O contrato é uma ilustração (“não reproduz um contrato real”), sem assinatura.
- A mala é “METÁFORA DA ACUSAÇÃO”, identificada no próprio objeto e no cartão. Não há
  animação de entrega, soma de valores ou “propina coletada”.
- Missões, frases cômicas, portas de “novos destinos” e a piada final são do jogo.

## Fases 2–7

Planejadas conforme a seção 5 do briefing v2, com as fontes S07–S17 já ligadas a cada
fase. Ainda não têm eventos nem afirmações. Pontos de atenção:

- **Fase 2:** “Sítio de Atibaia”, não imóvel registrado em nome de Lula. Fechamento com a
  rejeição de 2021 (S08), sem generalizar.
- **Fase 3:** cada processo segue a rota da fonte; nada de acordo político inventado.
- **Fase 4 (Gamecorp/Oi):** arquivamentos de 2012 (S09) e 2022 (S10) são distintos.
  Aporte não é propina. Sem caricatura do jogador Ronaldinho. Não usa as alegações de
  2026 da conversa anterior.
- **Fase 5:** sem fala ficcional atribuída a Dino como citação; Moraes fora da mecânica.
- **Fase 6 (2006):** exibir o ano; o stealth é invenção; houve debate no 2º turno.
- **Fase 7:** soltura de 2019 não depende das anulações de 2021; final “Continua…”.

## Antes de qualquer publicação (etapa futura)

Revisar autoria e expediente, direitos sobre os assets, regras eleitorais vigentes na data,
rotulagem de conteúdo sintético e textos potencialmente ofensivos ou descontextualizados.
S18 (STJ) é referência editorial: a liberdade de crítica não dispensa diligência e não é
validação jurídica deste jogo.
