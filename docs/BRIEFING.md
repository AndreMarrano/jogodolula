# Lulaverso — briefing para desenvolvimento local

> Documento de produto, conteúdo e implementação para Codex ou Claude Code.
> Versão inicial: 7 de outubro de 2026.
> Nome provisório: **Lulaverso — A Jornada do Companheiro**.

## 1. Prompt de início para o agente de programação

Leia este documento inteiro e implemente o projeto nesta pasta. Primeiro inspecione o repositório e as instruções locais; preserve o trabalho existente. Se a pasta estiver vazia, inicialize uma aplicação web local com TypeScript, React, Vite e Phaser. Use versões estáveis compatíveis, confirmando as APIs na documentação oficial. Não é necessário Next.js, servidor ou banco de dados para a primeira versão.

Construa um jogo 2D de plataforma com identidade própria, apresentado como sátira política sobre episódios públicos da trajetória de Lula. Comece pelo menu, controles, sistema de fases e uma Fase 1 completa. Entregue algo efetivamente jogável, com começo, objetivo, obstáculos, conclusão e painel de contexto factual. As outras fases devem aparecer no mapa com seu estado de implementação, sem fingir que já funcionam.

Use sprites e efeitos provisórios originais feitos com formas geométricas ou pixel art simples. Não espere assets externos para começar. Separe o motor do jogo, os dados das fases e o conteúdo editorial. Implemente teclado e controles de toque, pausa, reinício, volume e progresso local. Documente os comandos de instalação, execução e build no README.

Não invente reportagens, decisões, citações, eventos recentes ou acusações. As referências neste documento são pistas de pesquisa, não fontes verificadas. Conteúdos pendentes devem permanecer identificados como tal no protótipo local; não publique alegações sem conferir as fontes e o desfecho. Se estiver sem acesso à internet, avance na implementação com conteúdo provisório, registrando exatamente o que falta verificar.

Não faça deploy, não compre domínio e não configure campanha ou anúncios. O objetivo desta etapa é desenvolver e testar localmente. Prossiga nas decisões técnicas rotineiras sem pedir confirmação; pergunte apenas quando houver uma ambiguidade que impeça o trabalho.

Ao terminar, informe o que funciona, como executar, quais verificações realizou e quais pendências editoriais ou técnicas permanecem.

## 2. Conceito e experiência

Uma aventura curta de plataforma e minijogos, com humor político, caricaturas e referências a controvérsias públicas. A inspiração funcional é o formato de newsgame: episódios viram cenários e mecânicas, e cada fase termina com contexto e fontes.

O jogo deve divertir por si só: boa resposta aos controles, objetivos compreensíveis, animações expressivas e fases com mecânicas diferentes. Não transformar cada tela em um artigo ou interromper constantemente a ação.

- Idioma: português do Brasil.
- Público: público geral interessado em sátira e política, sem personalização por perfil eleitoral.
- Duração desejada do jogo completo: aproximadamente 15–25 minutos.
- Primeira entrega: uma fase de aproximadamente 2–4 minutos, além dos menus.
- Plataformas: navegador de desktop e celular.
- Tom: irônico, ácido e visualmente cômico, com distinção clara entre encenação e fatos.
- Não incluir pedido de voto, recomendação eleitoral ou mensagens de campanha na primeira versão.

O nome pode mudar depois. Outras opções: “O Retorno do Barba”, “A Jornada do Companheiro” ou “Luiz Adventures”.

## 3. Identidade visual e áudio

- Estética 2D retrô original, com cenários brasileiros e caricaturas reconhecíveis como ilustração.
- Personagem principal: caricatura de Lula com barba branca, camisa e animações expressivas; sem reprodução fotográfica ou voz clonada.
- Paleta quente, com vermelho, bege, azul e verde usados conforme o cenário.
- Tipografia de aparência retrô nos títulos; fonte legível nos textos e fontes.
- HUD discreto: fase, objetivo, itens coletados e botão de pausa.
- Resolução lógica sugerida: 960 × 540, com escala responsiva e proporção preservada.
- Usar câmera lateral e pixel art nítida quando apropriado.
- Não copiar sprites, músicas, mapas, logotipos, interfaces ou personagens de Nintendo/Mario ou do site de referência.
- Áudio original ou licenciado; iniciar somente após interação do usuário.
- Mute persistente e efeitos curtos; a narrativa deve funcionar sem áudio.
- Evitar flashes intensos; disponibilizar redução de movimento nos efeitos de interface.

O site https://www.superflavio.com/ é referência de formato, não uma fonte de assets ou código. Se estudado, registrar apenas observações de experiência e mecânicas gerais.

## 4. Estrutura da aplicação

Fluxo: abertura → menu → seleção de fase → contexto curto → jogo → resultado → contexto factual/fontes → próxima fase.

### Menu principal

- Jogar.
- Selecionar fase.
- Como jogar.
- Contexto e fontes.
- Sobre o projeto.
- Configurações.

Na abertura, exibir de forma simples: “Uma sátira política. As cenas são encenações; confira o contexto e as fontes de cada episódio.” Não usar esse aviso para justificar alegações sem respaldo.

### Controles

| Ação | Teclado | Celular |
| --- | --- | --- |
| Mover | A/D ou setas | Botões esquerda/direita |
| Pular | Espaço, W ou seta para cima | Botão de pulo |
| Interagir | E | Botão de interação |
| Pausar | Esc ou P | Botão de pausa |

Controles precisam ter o mesmo comportamento em teclado e toque. Impedir rolagem da página apenas na área de jogo durante interação. Suportar toque simultâneo para mover e pular.

### Resultado e contexto

Depois de cada fase, mostrar tempo, progresso e opções “Repetir”, “Ver contexto” e “Próxima fase”. O contexto também deve estar disponível diretamente pelo menu, sem exigir terminar o jogo.

O painel editorial contém:

1. **O que aconteceu:** fatos sustentados pelas fontes.
2. **O que foi alegado:** acusações, com autoria e data.
3. **Defesa:** posição dos envolvidos, quando pertinente.
4. **Desfecho jurídico:** decisão e estado do caso na data da checagem.
5. **O que a fase encena:** explicação breve dos elementos ficcionais.
6. **Fontes:** título, veículo/órgão, data, URL e data de verificação.

Campos sem pertinência podem ser omitidos. Campos sem verificação não podem parecer fatos confirmados.

## 5. As sete fases

### Fase 1 — “Tríplex: Subindo na Vida”

**Tema:** o processo do tríplex e seu percurso judicial.

**Cenário:** prédio litorâneo estilizado, com três setores verticais. O jogador sobe por plataformas e elevadores, coleta documentos e chega à saída do último andar.

**Mecânica principal:** plataforma com coleta de documentos e checkpoints. Os documentos representam peças de um processo, não dinheiro ou produto de crime. Obstáculos são portas, andaimes e elevadores; não pressupor uma ação criminosa do personagem.

**Virada narrativa:** ao concluir a subida, surge uma sequência ilustrada do percurso judicial. O cenário recebe carimbos de “CONDENAÇÃO”, depois “ANULAÇÃO POR INCOMPETÊNCIA” e “SUSPEIÇÃO DO JUIZ”. Os carimbos modificam visualmente o mapa e abrem a saída para a próxima fase.

**Humor:** “Elevador processual indisponível”; “Novo destino: juízo competente”. Os personagens podem reagir ao mapa que se reorganiza.

**Contexto a verificar:** condenações anteriores, anulação das decisões por incompetência e reconhecimento da suspeição de Sergio Moro no caso. Incluir a defesa de Lula e atualizar eventual encerramento posterior antes de publicar.

**Evitar:** “Lula roubou um apartamento”, apresentar condenação anulada como vigente ou sugerir que anulação/suspeição prova culpa ou inocência material.

### Fase 2 — “Sítio, que sítio?”

**Tema:** a controvérsia sobre o sítio de Atibaia e o respectivo processo.

**Cenário:** sítio estilizado, cozinha em reforma, jardins, placas e um lago com pedalinho.

**Mecânica:** exploração e classificação de informações. O jogador encontra documentos e separa “registro”, “alegação” e “decisão”. Não perguntar se um objeto isolado “prova culpa”.

**Objetivo:** montar um quadro do episódio sem confundir propriedade registral, uso do imóvel, alegações sobre reformas e resultado processual.

**Humor:** placas com interrogações e diálogos sobre a dificuldade de encontrar o documento certo. O pedalinho pode ser elemento de cenário, condicionado à checagem do contexto.

**Contexto a verificar:** titularidade do imóvel, imputações, defesa, decisões de anulação e desdobramentos posteriores. Não assumir propriedade de Lula.

### Fase 3 — “Operação: Volta por Brasília”

**Tema:** competência judicial e percurso dos processos.

**Cenário:** labirinto de corredores, tribunais estilizados e caixas identificadas com processos.

**Mecânica:** puzzle logístico. O jogador precisa levar cada caixa ao destino previsto pela cronologia verificada; portas e placas mudam conforme os atos processuais.

**Humor:** “Local errado”, “Redistribuição em andamento” e “Viagem rápida desbloqueada”.

**Contexto a verificar:** quais processos foram afetados e para onde foram enviados em cada etapa. Não tratar todos como idênticos nem inventar uma sequência universal Curitiba → TRF-4 → STJ → STF → Brasília.

**Observação de produto:** manter esta fase curta para não repetir a mecânica e o conteúdo das fases 1 e 2.

### Fase 4 — “Quem Influencia Quem?” — conceito condicionado à pesquisa

**Tema proposto:** controvérsia pública envolvendo Fábio Luís Lula da Silva, se houver fontes suficientes e atuais.

**Estado editorial inicial:** bloqueado. A conversa anterior mencionou uma investigação de 2026, mas este documento não confirma sua existência, objeto ou situação. Não preencher esses detalhes por memória nem converter a referência em acusação dentro do jogo.

**Mecânica possível:** puzzle de documentos em que o jogador diferencia vínculos documentados, suspeitas atribuídas a autoridades e relações não demonstradas.

**Limite narrativo:** parentesco, reunião ou vínculo empresarial não demonstram participação de Lula ou do filho em ilícito. A mecânica não pode premiar a associação automática entre nomes e culpa.

**Critério de ativação:** fontes verificadas, atribuição precisa das alegações, defesa e situação processual atual. Se não houver base suficiente, manter um espaço no mapa com “Em pesquisa” e propor outro episódio documentado; não fabricar conteúdo para completar sete fases.

### Fase 5 — “Escolha seu Ministro”

**Tema:** indicação de Flávio Dino ao STF e passagem entre cargos públicos.

**Cenário:** Praça dos Três Poderes estilizada, Ministério da Justiça, Senado e STF.

**Mecânica:** puzzle de percurso institucional: indicação presidencial, aprovação pelo Senado e posse. Representar os passos efetivos, sem transformar a escolha em poder unilateral de nomeação instantânea.

**Humor:** troca de figurino, crachás e portas de gabinete; travessia literal da praça.

**Contexto a verificar:** cargos, datas e procedimento da indicação de Dino. Selecionar documentos oficiais para o painel.

**Limites:** a indicação não demonstra cumplicidade ou favorecimento em decisões. Não inventar ordens do presidente ao STF. Se Alexandre de Moraes aparecer, identificar corretamente que sua indicação ao STF foi feita por Michel Temer; não associar sua nomeação a Lula.

### Fase 6 — “Cadê o Debate?” — conceito condicionado à pesquisa

**Tema proposto:** controvérsia documentada sobre participação ou ausência em debate.

**Cenário:** palco, púlpitos, câmeras, microfones e corredores.

**Mecânica possível:** desafio cômico de agenda, escolhendo caminhos entre entrevistas e debate. A encenação pode exagerar movimentos e desencontros, mas deve explicar que não reproduz uma conduta secreta real.

**Estado editorial inicial:** bloqueado. A conversa anterior fez afirmações sobre debates de 2026 e decisões do TSE que não foram verificadas neste documento.

**Critério de ativação:** confirmar evento, data, participantes, justificativas públicas e eventual decisão judicial. Incluir contexto que evite atribuir a um único participante o cancelamento de um evento quando isso não estiver demonstrado.

### Fase 7 — “O Retorno”

**Tema:** prisão, soltura, anulações, recuperação da elegibilidade e eleição de 2022.

**Cenário:** mapa cronológico que se transforma entre períodos.

**Mecânica:** aventura curta com portais de datas e cartões de contexto; o desafio é avançar pela cronologia correta.

**Atenção à ordem histórica:** separar prisão em 2018, soltura em 2019, decisões de 2021 e eleição de 2022. Não apresentar a soltura de 2019 como consequência das anulações de 2021. Conferir fundamentos e datas em fontes oficiais.

**Final satírico:** “Fim?” → pausa → “Continua…”. Uma porta com “2026” pode remeter ao presente sem afirmar candidatos de segundo turno, resultado ou fatos eleitorais não verificados.

**Contexto:** explicar o que cada decisão efetivamente mudou. Não substituir a cronologia por “foi absolvido” nem manter “condenado” como situação jurídica atual sem fundamento.

## 6. Especificação jogável da Fase 1

### Mapa inicial

- Mundo de aproximadamente 2.880 × 1.080 unidades, com câmera acompanhando o personagem.
- Setor A: entrada e tutorial, piso seguro e plataformas baixas.
- Setor B: subida, andaimes, duas plataformas móveis e primeiro checkpoint.
- Setor C: último andar, plataforma com tempo de abertura e segundo checkpoint.
- Saída: porta que inicia a sequência narrativa e o resultado.
- Seis documentos coletáveis, distribuídos por rotas acessíveis.
- Exigir pelo menos quatro documentos para abrir a saída; indicar o requisito claramente no HUD.
- Quedas reiniciam no checkpoint; conservar documentos coletados para reduzir repetição.
- Não usar inimigos que representem pessoas reais como alvos de violência.

### Movimento e resposta

- Movimento lateral, gravidade, pulo com altura ajustável pelo tempo de pressionamento.
- Tolerância curta para pular logo após sair da borda e para registrar o comando pouco antes de aterrissar.
- Sem exigir precisão excessiva no tutorial.
- Plataformas móveis precisam transportar o personagem sem atravessamento.
- Pausa congela física, animação e cronômetro do jogo.
- Reiniciar restaura o estado da fase de maneira previsível.

### Textos provisórios de interface

| Situação | Texto |
| --- | --- |
| Entrada | “Suba pelos andares e reúna os documentos.” |
| Tutorial de movimento | “A/D ou setas para mover.” |
| Tutorial de pulo | “Espaço para pular. Segure um pouco para ir mais alto.” |
| Primeiro documento | “Peça do processo encontrada.” |
| Saída sem requisito | “Faltam documentos: encontre pelo menos 4 de 6.” |
| Checkpoint | “Ponto de retorno atualizado.” |
| Conclusão | “Percurso concluído. Agora confira o que aconteceu.” |

Os textos factuais e a sequência judicial só passam a conteúdo revisado depois da pesquisa. No desenvolvimento, usar indicação visível “Contexto em revisão” junto dos rótulos provisórios.

### Assets mínimos

Personagem com idle, caminhada, pulo e queda; chão; plataforma; elevador; andaime; porta; documento; marcador de checkpoint; fundo de litoral; prédio; carimbos da sequência final. Gerar placeholders no código ou SVGs próprios, mantendo um caminho claro para substituir por sprites definitivos.

## 7. Modelo de dados

Definir fases por dados tipados, sem embutir todo o conteúdo em componentes ou cenas. Exemplo de estrutura; adaptar sem adicionar complexidade desnecessária:

```ts
type EditorialStatus = "pending" | "verified";
type ImplementationStatus = "planned" | "playable" | "complete";

interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  publishedAt?: string;
  checkedAt?: string;
  status: EditorialStatus;
}

interface EditorialClaim {
  id: string;
  text: string;
  category: "fact" | "allegation" | "defense" | "legal_outcome";
  sourceIds: string[];
  status: EditorialStatus;
}

interface LevelDefinition {
  id: string;
  title: string;
  summary: string;
  mechanic: "platformer" | "exploration" | "logistics" | "timeline";
  implementationStatus: ImplementationStatus;
  editorialStatus: EditorialStatus;
  objective: string;
  fictionalizationNote: string;
  claims: EditorialClaim[];
  sources: Source[];
}
```

Estado de implementação e estado editorial são independentes: uma fase jogável pode continuar pendente de checagem. Não inferir `verified` só porque existem URLs.

O conteúdo público deve ter um controle explícito: itens pendentes ficam acessíveis apenas em modo de desenvolvimento. A checagem de conteúdo deve detectar afirmações sem fontes verificadas, IDs inexistentes e fases sem contexto. Um build local não significa aprovação editorial para publicação.

## 8. Organização sugerida

```text
src/
  app/              # telas e integração React
  game/
    scenes/         # Boot, menu, fases e resultado
    entities/       # jogador e objetos interativos
    systems/        # input, checkpoints e progresso
  content/
    levels/         # definições das sete fases
    sources/        # referências e estado da checagem
  components/       # painéis de contexto, configurações e toque
  styles/
public/
  assets/           # sprites e áudio próprios/licenciados
docs/
  editorial-review.md
  asset-licenses.md
README.md
```

Usar React para menus, acessibilidade e painéis de texto; Phaser para o mundo jogável. Gerenciar criação e destruição do jogo corretamente ao montar/desmontar componentes, inclusive no modo de desenvolvimento. Menus e fontes devem continuar legíveis e navegáveis pelo teclado.

Persistir apenas preferências e progresso em `localStorage`, com versão do formato e recuperação em caso de dados inválidos. Não implementar cadastro, analytics, coleta de dados políticos ou ranking remoto nesta etapa.

## 9. Pesquisa e revisão editorial

Este documento transforma uma proposta em briefing. **Não é um parecer jurídico nem uma confirmação das notícias citadas na conversa anterior.** Não repetir como fato informações recentes só porque uma resposta anterior apresentou um link.

Para cada afirmação: localizar a fonte, ler o conteúdo completo, registrar o trecho que a sustenta em notas internas, conferir data e sujeito, distinguir alegação de conclusão e atualizar o desfecho. Preferir decisões e documentos oficiais para afirmações processuais. Reportagens podem documentar declarações, contexto e denúncias, com atribuição correta.

### Pistas de pesquisa fornecidas na conversa — não verificadas

- STF, notícia associada à anulação e ao caso do tríplex: https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=464261
- STF, notícia associada a extensão de efeitos da suspeição: https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=468184&tip=UN
- STF, notícia associada à competência e remessa dos processos: https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=464566&ori=1
- Lei das Eleições, compilação do TSE: https://www.tse.jus.br/legislacao/codigo-eleitoral/lei-das-eleicoes/lei-das-eleicoes-lei-nb0-9.504-de-30-de-setembro-de-1997/
- Resolução TSE 23.610, texto compilado: https://www.tse.jus.br/legislacao/compilada/res/2019/resolucao-no-23-610-de-18-de-dezembro-de-2019

Não usar URLs alegadamente relacionadas a notícias de 2026 como evidência sem localizar a publicação real. Para fases 4 e 6, iniciar uma pesquisa nova. Se uma URL acima não existir, não sustentar a afirmação ou tiver conteúdo diferente, registrar a falha e buscar fonte adequada.

Antes de eventual publicação, revisar autoria/expediente, direitos sobre assets, regras eleitorais aplicáveis na data, rotulagem de conteúdo sintético e textos potencialmente ofensivos ou descontextualizados. Não tratar “é sátira” ou “foi noticiado” como garantia automática de licitude. Esta revisão é uma etapa futura; não bloqueia a criação do protótipo local.

## 10. Etapas de implementação

### Etapa A — Fundação

Inspecionar a pasta, criar a aplicação quando necessário, configurar TypeScript e scripts, montar menu e cena de jogo, implementar input e personagem. Confirmar execução local antes de expandir.

### Etapa B — Primeira fase completa

Implementar o mapa da Fase 1, documentos, plataformas, checkpoints, saída, pausa, reinício e resultado. Acrescentar o painel de contexto e fontes com marcação de pendências.

### Etapa C — Experiência e robustez

Adicionar toque, preferências, progresso, responsividade, foco de teclado e comportamento correto ao alternar entre jogo e menus. Refinar animações e feedback.

### Etapa D — Conteúdo e expansão

Pesquisar as fontes, completar contexto e defesa e revisar a primeira fase. Criar a segunda e a terceira usando os sistemas existentes. Desenvolver as demais conforme conteúdo verificado e disponibilidade de mecânicas. Manter as fases bloqueadas identificadas como “Em pesquisa”.

### Etapa E — Polimento

Substituir assets provisórios, conferir licenças, ajustar dificuldade, revisar todas as fontes e testar o percurso completo. Publicação fica fora do escopo inicial.

## 11. Critérios de aceitação da primeira entrega

- Instalação, `dev` e `build` documentados e funcionando.
- Menu utilizável e acesso a “Como jogar”, configurações e contexto.
- Uma fase jogável do começo ao resultado, sem depender de serviços externos.
- Movimento e pulo responsivos, coleta, checkpoints e porta de conclusão funcionando.
- Quedas, pausa e reinício sem perda incoerente de estado.
- Controles de toque utilizáveis e teclado funcionando nos menus.
- Layout sem corte relevante em desktop e celular; se paisagem for necessária, orientar o usuário.
- Áudio respeita mute e só inicia após interação.
- Progresso e preferências persistem; dados corrompidos não quebram o jogo.
- Links de fontes abrem corretamente, com conteúdo pendente identificado.
- Fases não implementadas aparecem honestamente como planejadas ou em pesquisa.
- Não há reportagens inventadas, URLs apresentadas como checadas sem leitura ou conteúdo factual pendente disfarçado de confirmação.
- Não há recursos copiados de Mario/Nintendo ou do jogo de referência.

## 12. Verificação técnica

Executar build e checagem de tipos. Fazer um teste funcional do ciclo menu → fase → queda/checkpoint → pausa → conclusão → contexto → reinício. Verificar toque e redimensionamento quando o ambiente permitir.

Testes automatizados devem cobrir regras que podem falhar: requisito de documentos para a saída, restauração de checkpoint, persistência com dados inválidos e validação de referências editoriais. Não criar testes que apenas repitam constantes ou detalhes internos do código.

Se não puder testar um navegador ou celular, declarar a limitação. Não afirmar que um recurso foi testado quando apenas foi implementado.

## 13. Fora do escopo inicial

Backend, login, pagamentos, multiplayer, ranking online, campanha, segmentação de eleitores, impulsionamento, compra de domínio e deploy. Não é necessário gerar arte definitiva, implementar sete fases de uma vez ou criar uma infraestrutura complexa para demonstrar a ideia.

## 14. Entrega esperada do agente

Projeto local organizado, README com comandos, primeira fase completa, sistemas reaproveitáveis, inventário de assets e notas editoriais com pendências precisas. A resposta final deve apontar como rodar e resumir o que está jogável, o que foi verificado e o próximo incremento concreto.
