import type { LevelDefinition } from "../types";

/**
 * Fase 1 — conteúdo editorial.
 *
 * As afirmações abaixo são RASCUNHOS escritos para estruturar o painel. Estão
 * todas `pending`: nenhuma fonte foi lida (ver src/content/sources). Não
 * publicar sem conferir datas, órgãos, decisões e o desfecho atual.
 */
export const triplexLevel: LevelDefinition = {
  id: "triplex",
  number: 1,
  title: "Tríplex: Subindo na Vida",
  summary:
    "Suba um prédio litorâneo estilizado, reúna as peças do processo e acompanhe o percurso judicial do caso do tríplex.",
  mechanic: "platformer",
  implementationStatus: "playable",
  editorialStatus: "pending",
  objective: "Suba pelos andares e reúna os documentos (pelo menos 4 de 6).",
  intro:
    "Um prédio na praia, três setores e um elevador que não colabora. Os documentos espalhados representam peças de um processo — não dinheiro, bens ou provas de crime.",
  fictionalizationNote:
    "A subida pelo prédio, os documentos coletáveis, o elevador \"processual\" e a reorganização do mapa são encenação. Os carimbos resumem, em ordem, etapas do percurso judicial; não afirmam culpa nem inocência. Anulação por incompetência e reconhecimento de suspeição são decisões sobre o processo, não sobre o mérito das acusações.",
  sourceIds: ["stf-464261", "stf-468184", "stf-464566"],
  claims: [
    {
      id: "triplex-denuncia",
      category: "allegation",
      text: "O Ministério Público Federal acusou Lula de receber da construtora OAS um apartamento tríplex no Guarujá (SP), com reformas, como vantagem indevida.",
      attribution: "Ministério Público Federal — denúncia (data a confirmar, provavelmente 2016)",
      sourceIds: [],
      status: "pending",
      toVerify: "Localizar a denúncia ou notícia oficial; confirmar data, crimes imputados e redação da acusação.",
    },
    {
      id: "triplex-defesa",
      category: "defense",
      text: "A defesa de Lula negou que ele fosse dono do imóvel e afirmou que o processo tinha motivação política.",
      attribution: "Defesa de Lula",
      sourceIds: [],
      status: "pending",
      toVerify: "Buscar manifestação pública da defesa com data; usar a formulação da própria defesa.",
    },
    {
      id: "triplex-condenacao-1a-instancia",
      category: "legal_outcome",
      text: "Em 2017, a 13ª Vara Federal de Curitiba, então a cargo do juiz Sergio Moro, condenou Lula nesse processo.",
      sourceIds: [],
      status: "pending",
      toVerify: "Confirmar data da sentença, crimes e pena; localizar fonte oficial.",
    },
    {
      id: "triplex-trf4",
      category: "legal_outcome",
      text: "Em 2018, o Tribunal Regional Federal da 4ª Região (TRF-4) manteve a condenação em segunda instância.",
      sourceIds: [],
      status: "pending",
      toVerify: "Confirmar data, pena fixada e decisões posteriores (inclusive STJ).",
    },
    {
      id: "triplex-incompetencia",
      category: "legal_outcome",
      text: "Em 2021, o STF declarou a 13ª Vara Federal de Curitiba incompetente para julgar o caso e anulou as condenações, remetendo o processo a outro juízo.",
      sourceIds: ["stf-464261", "stf-464566"],
      status: "pending",
      toVerify: "Confirmar relator, datas da decisão monocrática e do plenário, e o juízo de destino.",
    },
    {
      id: "triplex-suspeicao",
      category: "legal_outcome",
      text: "Em 2021, o STF reconheceu a suspeição do então juiz Sergio Moro no caso do tríplex.",
      sourceIds: ["stf-468184"],
      status: "pending",
      toVerify: "Confirmar órgão julgador (Turma/Plenário), datas e quais processos foram alcançados pela extensão de efeitos.",
    },
    {
      id: "triplex-desfecho-atual",
      category: "legal_outcome",
      text: "Situação atual do processo após a remessa: a verificar.",
      sourceIds: [],
      status: "pending",
      toVerify:
        "Verificar se houve arquivamento, prescrição ou outro encerramento após 2021, com data e fonte. Não afirmar absolvição.",
    },
  ],
};
