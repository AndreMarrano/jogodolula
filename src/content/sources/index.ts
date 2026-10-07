import type { Source } from "../types";

/**
 * Registro central de fontes.
 *
 * TODAS as fontes abaixo são pistas de pesquisa recebidas no briefing
 * (docs/BRIEFING.md, seção 9). Nenhuma foi lida ainda: o acesso a
 * portal.stf.jus.br e tse.jus.br estava bloqueado no ambiente em que o
 * protótipo foi criado (2026-10-07). Os títulos são descritivos e
 * provisórios, não os títulos reais das páginas.
 */
export const sources: Source[] = [
  {
    id: "stf-464261",
    title: "Notícia do STF associada à anulação de condenações / caso do tríplex (título a confirmar)",
    publisher: "Supremo Tribunal Federal",
    url: "https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=464261",
    status: "pending",
    notes:
      "Pista do briefing. Confirmar se a página existe, título, data e se trata da incompetência da 13ª Vara Federal de Curitiba.",
  },
  {
    id: "stf-468184",
    title: "Notícia do STF associada à extensão de efeitos da suspeição (título a confirmar)",
    publisher: "Supremo Tribunal Federal",
    url: "https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=468184&tip=UN",
    status: "pending",
    notes:
      "Pista do briefing. Confirmar título, data e a quais processos a suspeição foi estendida.",
  },
  {
    id: "stf-464566",
    title: "Notícia do STF associada à competência e remessa dos processos (título a confirmar)",
    publisher: "Supremo Tribunal Federal",
    url: "https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=464566&ori=1",
    status: "pending",
    notes:
      "Pista do briefing. Confirmar para onde cada processo foi remetido; não generalizar para todos os casos.",
  },
  {
    id: "tse-lei-9504",
    title: "Lei das Eleições (Lei nº 9.504/1997), texto compilado",
    publisher: "Tribunal Superior Eleitoral",
    url: "https://www.tse.jus.br/legislacao/codigo-eleitoral/lei-das-eleicoes/lei-das-eleicoes-lei-nb0-9.504-de-30-de-setembro-de-1997/",
    status: "pending",
    notes: "Referência para a revisão de regras eleitorais antes de qualquer publicação (fase 6 e revisão geral).",
  },
  {
    id: "tse-res-23610",
    title: "Resolução TSE nº 23.610/2019, texto compilado",
    publisher: "Tribunal Superior Eleitoral",
    url: "https://www.tse.jus.br/legislacao/compilada/res/2019/resolucao-no-23-610-de-18-de-dezembro-de-2019",
    status: "pending",
    notes: "Propaganda eleitoral e conteúdo sintético. Usar na revisão pré-publicação.",
  },
];

export const sourcesById: ReadonlyMap<string, Source> = new Map(sources.map((s) => [s.id, s]));
