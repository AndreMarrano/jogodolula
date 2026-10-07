# Revisão editorial — estado da checagem

Última atualização: 2026-10-07.

**Nada foi verificado ainda.** Todas as fontes e afirmações do jogo estão com
`status: "pending"`. O ambiente em que o protótipo foi criado não tinha acesso a
`portal.stf.jus.br` nem a `tse.jus.br` (bloqueados pela política de rede), então nenhuma
URL foi aberta ou lida.

As afirmações da Fase 1 são **rascunhos** escritos para estruturar o painel, com base no
que o briefing descreve. Elas aparecem só em `npm run dev`, marcadas como pendentes, e
ficam fora do build de produção.

## Como marcar algo como verificado

1. Abra a fonte e leia o conteúdo completo.
2. Registre em `notes` (em `src/content/sources/index.ts`) o trecho que sustenta a
   afirmação, além do título e da data reais.
3. Preencha `title`, `publishedAt` e `checkedAt` (AAAA-MM-DD) e mude `status` para
   `"verified"`.
4. Revise o texto da afirmação contra a fonte (sujeito, data, órgão, decisão) e só então
   mude o `status` dela.
5. Rode `npm run check:content`. A validação recusa afirmação `verified` apoiada em fonte
   pendente, fonte `verified` sem `checkedAt` e alegação sem autoria.

## Fontes (pistas do briefing)

| ID | URL | Situação | O que falta |
| --- | --- | --- | --- |
| `stf-464261` | portal.stf.jus.br … idConteudo=464261 | não acessada | Confirmar que existe, título, data e se trata da incompetência da 13ª Vara Federal de Curitiba no caso do tríplex. |
| `stf-468184` | portal.stf.jus.br … idConteudo=468184 | não acessada | Título, data e a quais processos a suspeição foi estendida. |
| `stf-464566` | portal.stf.jus.br … idConteudo=464566 | não acessada | Para onde cada processo foi remetido. Não generalizar para todos os casos. |
| `tse-lei-9504` | tse.jus.br — Lei 9.504/1997 | não acessada | Usar na revisão de regras eleitorais antes de qualquer publicação. |
| `tse-res-23610` | tse.jus.br — Res. 23.610/2019 | não acessada | Propaganda eleitoral e rotulagem de conteúdo sintético. |

Se alguma URL não existir, não sustentar a afirmação ou tiver conteúdo diferente, registre
a falha aqui e busque uma fonte adequada.

## Fase 1 — “Tríplex: Subindo na Vida”

Afirmações em `src/content/levels/triplex.ts`, todas pendentes:

| ID | Categoria | Falta |
| --- | --- | --- |
| `triplex-denuncia` | alegação | Localizar a denúncia do MPF ou uma notícia oficial; data, crimes imputados e redação. |
| `triplex-defesa` | defesa | Manifestação pública da defesa, com data e na formulação dela. |
| `triplex-condenacao-1a-instancia` | desfecho | Data da sentença, crimes e pena; fonte oficial. |
| `triplex-trf4` | desfecho | Data, pena e decisões posteriores (inclusive STJ). |
| `triplex-incompetencia` | desfecho | Relator, datas (monocrática e plenário) e juízo de destino. |
| `triplex-suspeicao` | desfecho | Órgão julgador, datas e alcance da extensão de efeitos. |
| `triplex-desfecho-atual` | desfecho | Situação atual após a remessa (arquivamento, prescrição ou outro encerramento), com data. Não afirmar absolvição. |

Cuidados do briefing: não dizer que Lula “roubou um apartamento”, não apresentar
condenação anulada como vigente e não sugerir que anulação ou suspeição provam culpa ou
inocência.

Os carimbos da sequência final (“CONDENAÇÃO”, “ANULAÇÃO POR INCOMPETÊNCIA”, “SUSPEIÇÃO DO
JUIZ”) vêm com o aviso “Contexto em revisão”. Confirme a ordem cronológica antes de
remover o aviso.

## Fases 2, 3, 5 e 7

Planejadas, sem afirmações. Os temas e cuidados de cada uma estão no briefing (seção 5) e
nas notas de `src/content/levels/planned.ts`. Pontos de atenção:

- **Fase 2:** não assumir que Lula é o proprietário do sítio.
- **Fase 3:** cada processo tem um percurso próprio; não inventar uma sequência única.
- **Fase 5:** Alexandre de Moraes foi indicado ao STF por Michel Temer; não associar a
  nomeação dele a Lula.
- **Fase 7:** prisão (2018), soltura (2019), decisões de 2021 e eleição de 2022 são
  eventos distintos. A soltura de 2019 não foi consequência das anulações de 2021.

## Fases 4 e 6 — bloqueadas (“Em pesquisa”)

O briefing não confirma os episódios. Nenhum conteúdo foi escrito sobre eles, e o resumo
público não descreve o tema. É preciso fazer uma pesquisa nova antes de qualquer
implementação. Se não houver base suficiente, propor outro episódio documentado em vez de
completar as sete fases.

## Antes de qualquer publicação (etapa futura)

Revisar autoria e expediente, direitos sobre os assets, regras eleitorais vigentes na data,
rotulagem de conteúdo sintético e textos potencialmente ofensivos ou descontextualizados.
“É sátira” ou “foi noticiado” não garantem licitude.
