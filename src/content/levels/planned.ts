import type { LevelDefinition } from "../types";

/**
 * Fases 2–7: planejadas conforme o briefing v2 (seção 5). Ainda sem cena,
 * eventos ou afirmações. Os cuidados de cada uma ficam em
 * `fictionalizationNote` e em docs/editorial-review.md.
 */
const base = (): Pick<LevelDefinition, "implementationStatus" | "editorialStatus" | "claims" | "narrativeEvents" | "outcomes"> => ({
  implementationStatus: "planned",
  editorialStatus: "pending",
  claims: [],
  narrativeEvents: [],
  outcomes: [],
});

export const plannedLevels: LevelDefinition[] = [
  {
    ...base(),
    id: "sitio",
    number: 2,
    title: "Sítio, que sítio?",
    summary:
      "Uma propriedade rural em obra: siga as placas das empreiteiras, encontre o projeto da cozinha e confira o que aconteceu com a denúncia.",
    mechanic: "exploration",
    objective: "Procurar os responsáveis pela reforma, o projeto da cozinha, o documento de titularidade e o desfecho da denúncia.",
    intro: "Em desenvolvimento.",
    fictionalizationNote:
      "A propriedade será identificada como “Sítio de Atibaia”, não como imóvel registrado em nome de Lula. Itens de dinheiro, se houver, serão ícones da tese acusatória, sem entrega literal e sem somar valores de versões diferentes.",
    sourceIds: ["S07", "S08", "S03"],
  },
  {
    ...base(),
    id: "volta-por-brasilia",
    number: 3,
    title: "Operação: Volta por Brasília",
    summary: "Puzzle logístico: leve cada processo à porta indicada e veja a rota ser recalculada pela decisão sobre competência.",
    mechanic: "logistics",
    objective: "Encontrar a placa de competência, levar o processo à porta indicada e abrir o carimbo de anulação.",
    intro: "Em desenvolvimento.",
    fictionalizationNote:
      "Esteiras, malas de processos e portas serão encenação. Cada processo terá a rota descrita na fonte; não haverá uma cadeia única de remessas nem acordo político inventado.",
    sourceIds: ["S03", "S04"],
  },
  {
    ...base(),
    id: "ronaldinho-dos-negocios",
    number: 4,
    title: "Ronaldinho dos Negócios",
    year: "2005–2022",
    summary:
      "Gamecorp e Telemar/Oi: desloque pacotes de “Aporte”, “Parceria” e “Investigação” e encontre os desfechos das apurações.",
    mechanic: "logistics",
    objective: "Encontrar o aporte, abrir o contrato empresarial, atravessar a arena dos negócios e encontrar o desfecho das apurações.",
    intro: "Em desenvolvimento.",
    fictionalizationNote:
      "Aporte não é sinônimo de propina, e valores de empresas não são patrimônio pessoal comprovado. As apurações arquivadas em 2012 e em 2022 são distintas e não serão fundidas. Ser pai do empresário não indica participação em ilícito. Sem caricatura do jogador Ronaldinho ou ativos de clubes.",
    sourceIds: ["S09", "S10"],
  },
  {
    ...base(),
    id: "escolha-seu-ministro",
    number: 5,
    title: "Escolha seu Ministro",
    year: "2023–2024",
    summary: "Do gabinete ao STF pela Praça dos Três Poderes: indicação, sabatina no Senado e posse.",
    mechanic: "logistics",
    objective: "Encontrar o crachá do ministro, atravessar a sabatina e chegar à cadeira do Supremo.",
    intro: "Em desenvolvimento.",
    fictionalizationNote:
      "Nenhuma fala ficcional será atribuída ao ministro como citação real, e a fase não vai sugerir que ele obedece ao presidente. Alexandre de Moraes foi indicado por Michel Temer e não integra a mecânica.",
    sourceIds: ["S11", "S12"],
  },
  {
    ...base(),
    id: "cade-o-debate-2006",
    number: 6,
    title: "Cadê o Debate? — 2006",
    year: "2006",
    summary: "Stealth cômico no palco do debate de 28/09/2006, com cadeira vazia e comício na mesma noite. O palco volta a acender em 27/10/2006.",
    mechanic: "stealth",
    objective: "Encontrar a cadeira reservada, escolher o caminho do comício e abrir o cartão do segundo turno.",
    intro: "Em desenvolvimento.",
    fictionalizationNote:
      "Esconder-se de jornalistas é invenção do roteiro, não conduta noticiada. A fase mostra que houve participação no debate do segundo turno de 2006 e não atribui motivação secreta.",
    sourceIds: ["S13", "S14"],
  },
  {
    ...base(),
    id: "o-retorno",
    number: 7,
    title: "O Retorno",
    year: "2018–2022",
    summary: "Portais de datas: prisão em 2018, soltura em 2019, anulações em 2021 e eleição em 2022, na ordem certa.",
    mechanic: "timeline",
    objective: "Abrir a porta de 2019, atravessar as decisões de 2021 e chegar ao resultado de 2022.",
    intro: "Em desenvolvimento.",
    fictionalizationNote:
      "A soltura de 2019 e as anulações de 2021 são decisões diferentes; a porta de 2019 não depende do carimbo de 2021. O final mostra “Continua…”, sem inventar eventos de 2026.",
    sourceIds: ["S16", "S03", "S17"],
  },
];
