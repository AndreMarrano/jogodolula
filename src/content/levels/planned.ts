import type { LevelDefinition } from "../types";

/**
 * Fases 2–7: apenas planejadas. Nenhuma tem conteúdo factual ainda.
 *
 * As fases 4 e 6 estão `blocked`: o briefing não confirma os episódios, e
 * nada deve ser escrito sobre eles antes de uma pesquisa nova (ver
 * docs/editorial-review.md). Por isso o resumo público não descreve o tema.
 */
export const plannedLevels: LevelDefinition[] = [
  {
    id: "sitio",
    number: 2,
    title: "Sítio, que sítio?",
    summary:
      "Explore um sítio estilizado e separe o que é registro, o que é alegação e o que é decisão judicial.",
    mechanic: "exploration",
    implementationStatus: "planned",
    editorialStatus: "pending",
    objective: "Montar o quadro do episódio sem confundir propriedade, uso do imóvel, alegações e resultado processual.",
    intro: "Em desenvolvimento.",
    fictionalizationNote:
      "Cenário, placas e diálogos serão encenação. A fase não pergunta se um objeto isolado \"prova culpa\" e não assume quem é o proprietário do imóvel.",
    sourceIds: [],
    claims: [],
  },
  {
    id: "volta-por-brasilia",
    number: 3,
    title: "Operação: Volta por Brasília",
    summary: "Puzzle logístico curto: leve cada caixa de processo ao destino certo, conforme a cronologia verificada.",
    mechanic: "logistics",
    implementationStatus: "planned",
    editorialStatus: "pending",
    objective: "Entregar cada processo no juízo indicado pela cronologia verificada.",
    intro: "Em desenvolvimento.",
    fictionalizationNote:
      "Corredores, caixas e placas serão encenação. Cada processo terá seu próprio percurso; não haverá uma sequência única inventada para todos.",
    sourceIds: ["stf-464566"],
    claims: [],
  },
  {
    id: "quem-influencia-quem",
    number: 4,
    title: "Quem Influencia Quem?",
    summary: "Em pesquisa. Esta fase só será desenvolvida se houver fontes suficientes e verificadas.",
    mechanic: "exploration",
    implementationStatus: "planned",
    editorialStatus: "blocked",
    objective: "A definir após a pesquisa.",
    intro: "Em pesquisa.",
    fictionalizationNote:
      "Se for desenvolvida, a mecânica não vai premiar a associação automática entre nomes e culpa. Parentesco, reunião ou vínculo empresarial não demonstram participação em ilícito.",
    sourceIds: [],
    claims: [],
  },
  {
    id: "escolha-seu-ministro",
    number: 5,
    title: "Escolha seu Ministro",
    summary:
      "Atravesse a Praça dos Três Poderes seguindo o percurso real de uma indicação ao STF: indicação, Senado e posse.",
    mechanic: "logistics",
    implementationStatus: "planned",
    editorialStatus: "pending",
    objective: "Cumprir as etapas institucionais de uma indicação ao STF, na ordem correta.",
    intro: "Em desenvolvimento.",
    fictionalizationNote:
      "Figurinos, crachás e portas de gabinete serão encenação. A indicação não demonstra favorecimento em decisões, e a fase não vai inventar ordens do presidente ao STF.",
    sourceIds: [],
    claims: [],
  },
  {
    id: "cade-o-debate",
    number: 6,
    title: "Cadê o Debate?",
    summary: "Em pesquisa. Esta fase só será desenvolvida se o episódio for confirmado por fontes verificadas.",
    mechanic: "agenda",
    implementationStatus: "planned",
    editorialStatus: "blocked",
    objective: "A definir após a pesquisa.",
    intro: "Em pesquisa.",
    fictionalizationNote:
      "Se for desenvolvida, a encenação poderá exagerar desencontros de agenda, mas explicará que não reproduz uma conduta real e não atribuirá a um único participante o que não estiver demonstrado.",
    sourceIds: ["tse-lei-9504", "tse-res-23610"],
    claims: [],
  },
  {
    id: "o-retorno",
    number: 7,
    title: "O Retorno",
    summary:
      "Avance por portais de datas, na ordem certa: prisão, soltura, anulações, elegibilidade e eleição.",
    mechanic: "timeline",
    implementationStatus: "planned",
    editorialStatus: "pending",
    objective: "Atravessar a cronologia na ordem correta, entendendo o que cada decisão mudou.",
    intro: "Em desenvolvimento.",
    fictionalizationNote:
      "Os portais e o final \"Fim? … Continua…\" serão encenação. A soltura de 2019 e as anulações de 2021 são decisões diferentes, com fundamentos diferentes; a fase não vai tratar uma como consequência da outra.",
    sourceIds: [],
    claims: [],
  },
];
