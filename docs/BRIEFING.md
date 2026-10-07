# Lulaverso — briefing para desenvolvimento local

> Documento de produto, conteúdo e implementação para Codex ou Claude Code.
> Versão 2: 7 de outubro de 2026 — roteiro crítico dentro das fases.
> Atualiza a Fase 1 já desenvolvida; preserva a implementação existente.
> Nome provisório: **Lulaverso — A Jornada do Companheiro**.

## 1. Prompt para atualizar o projeto existente

A Fase 1 já foi desenvolvida. Leia este briefing e inspecione o repositório, as instruções locais e a implementação atual. Preserve a engine, os controles, a física e o que já funciona. Não reinicialize o projeto nem troque a stack sem necessidade.

Atualize principalmente a narrativa jogável: a crítica deve estar nos objetivos, NPCs, itens, cenários, animações e frases exibidas durante a fase. Um jogador que nunca abrir o painel “Contexto” deve entender que a fase satiriza a controvérsia do tríplex, as reformas da OAS e as acusações que foram noticiadas.

Implemente a sequência e os textos da seção 6. Troque os papéis genéricos por objetos identificáveis; acrescente o empreiteiro, o projeto de reforma, o contrato cenográfico, o elevador privativo e a mala simbólica. Vincule cada interação aos IDs de fontes da seção 9. A mala é uma metáfora visual da vantagem alegada, não a reconstrução de uma entrega de dinheiro comprovada.

Não esconder a acusação apenas em uma página de fontes; também não esconder a defesa e o desfecho apenas nessa página. Use atribuições curtas no próprio momento da interação, como “Segundo o MPF” ou “Relato de Léo Pinheiro”. As frases cômicas originais devem aparecer como fala ficcional do jogo, sem aspas ou assinatura que as faça parecer citação real.

Priorize a Fase 1 já existente. Depois aplique o padrão às demais fases, com as mecânicas descritas na seção 5. Esta versão usa episódios históricos localizados em fontes: a Fase 4 passa a tratar de Gamecorp/Oi, e a Fase 6 usa o debate de 2006. Não importar as alegações não verificadas de 2026 da conversa anterior.

Faça as mudanças locais, execute as verificações pertinentes e descreva o que foi alterado. Não faça deploy. Prossiga nas escolhas técnicas rotineiras sem pedir confirmação. Se um arquivo ou recurso essencial estiver ausente, avance no que puder e aponte o bloqueio específico.


## 2. Conceito e experiência

Uma aventura curta de plataforma e minijogos, com crítica política explícita, caricaturas e humor visual. As notícias entram no cenário: personagens, objetos e objetivos encenam os episódios, com atribuição curta no momento da interação. O contexto final aprofunda uma narrativa que o jogador já entendeu durante a ação.

O objetivo desta revisão é retirar o caráter genérico da primeira fase. Não basta coletar papéis e ler a crítica depois: a crítica precisa ser jogável. As animações exageradas e as frases cômicas são ficcionais; os resumos das notícias mantêm sujeito, data e desfecho.

O jogo deve divertir por si só: boa resposta aos controles, objetivos compreensíveis, animações expressivas e fases com mecânicas diferentes. Não transformar cada tela em um artigo ou interromper constantemente a ação.

- Idioma: português do Brasil.
- Público: público geral interessado em sátira e política, sem personalização por perfil eleitoral.
- Duração desejada do jogo completo: aproximadamente 15–25 minutos.
- Prioridade atual: atualizar a Fase 1 existente; duração desejada de 3–5 minutos.
- Plataformas: navegador de desktop e celular.
- Tom: irônico, ácido e visualmente cômico, com distinção clara entre encenação e fatos.
- Não incluir pedido de voto, recomendação eleitoral ou mensagens de campanha na primeira versão.

O nome pode mudar depois. Outras opções: “O Retorno do Barba”, “A Jornada do Companheiro” ou “Luiz Adventures”.

## 3. Identidade visual e áudio

- Estética 2D retrô original, com cenários brasileiros e caricaturas reconhecíveis como ilustração.
- Personagem principal: caricatura de Lula com barba branca, camisa e animações expressivas; sem reprodução fotográfica ou voz clonada.
- Paleta quente, com vermelho, bege, azul e verde usados conforme o cenário.
- Tipografia de aparência retrô nos títulos; fonte legível nos textos e fontes.
- HUD: fase, missão atual, interações descobertas, fonte da interação e pausa. Evitar textos genéricos como “colete os documentos”.
- Resolução lógica sugerida: 960 × 540, com escala responsiva e proporção preservada.
- Usar câmera lateral e pixel art nítida quando apropriado.
- Não copiar sprites, músicas, mapas, logotipos, interfaces ou personagens de Nintendo/Mario ou do site de referência.
- Áudio original ou licenciado; iniciar somente após interação do usuário.
- Mute persistente e efeitos curtos; a narrativa deve funcionar sem áudio.
- Evitar flashes intensos; disponibilizar redução de movimento nos efeitos de interface.

O site https://www.superflavio.com/ é referência de formato, não uma fonte de assets ou código. Se estudado, registrar apenas observações de experiência e mecânicas gerais.

## 4. Estrutura da aplicação

Fluxo: abertura → menu → seleção de fase → premissa curta → jogo com notícia, crítica e contexto em cena → resultado → contexto/fontes → próxima fase.

Uma fase precisa funcionar para quem não abre a tela extra de fontes. NPCs e itens trazem os elementos do episódio; defesa e desfecho também aparecem na rota normal, em linguagem curta. O texto completo fica disponível para consulta.

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

## 5. As sete fases — crítica integrada à jogabilidade

A seção 6 contém o roteiro completo da primeira fase. Aqui estão os objetivos visuais e narrativos das demais. Os nomes são títulos de sátira; não representam uma conclusão sobre culpabilidade.

### Fase 1 — “Tríplex: Subindo na Vida”

Um prédio à beira-mar, um empreiteiro da OAS, uma planta de reforma, um contrato cenográfico da Petrobras, um elevador privativo e uma mala simbólica. O jogador atravessa a controvérsia e encontra as diferentes versões durante a subida. O final muda o cenário com a anulação, a suspeição do juiz e o arquivamento.

**Crítica encenada:** proximidade com empreiteiros e suspeitas sobre benefícios privados. **Fontes:** S01–S06, S15. Não fazer apenas uma coleta de “documentos processuais”.

### Fase 2 — “Sítio, que sítio?”

**Cenário:** uma propriedade rural, obra na cozinha, caixas de equipamentos, portão e placas das empreiteiras. A propriedade é identificada como “Sítio de Atibaia”; não como imóvel registrado em nome de Lula.

**Objetivos no HUD:**

1. “Procure os responsáveis pela reforma.”
2. “Encontre o projeto da cozinha.”
3. “Siga as placas das empreiteiras.”
4. “Abra o documento de titularidade.”
5. “Confira o que aconteceu com a denúncia.”

**Mecânica:** cada projeto encontrado transforma parte do cenário de obra em ambiente reformado. Uma trilha pontilhada “Versão da acusação” liga empreiteiras, reformas e contratos; uma placa de defesa contesta que esses elementos demonstrem benefício ilícito.

**Frases ficcionais:** “A cozinha ficou pronta. A controvérsia também.”; “Paisagismo de um lado, processo do outro.”

**Atribuição em cena:** “O MPF denunciou supostas vantagens por meio de reformas. Lula contestou as acusações e a propriedade do imóvel.” **Fontes:** S07.

**Fechamento obrigatório:** condenação posteriormente anulada; notícia de rejeição da denúncia reapresentada em Brasília, em 2021, por falta de justa causa demonstrada. Não resumir o desfecho como mera mudança de endereço. **Fontes:** S03, S08.

**Itens de dinheiro:** se houver, são ícones da tese acusatória, com indicação visual. Não animar uma entrega literal a Lula nem somar valores de diferentes versões da acusação como se fossem um total confirmado.

### Fase 3 — “Operação: Volta por Brasília”

**Cenário:** esteiras, malas de processos, portas de tribunais, placas de endereço e carimbos.

**Objetivos:** “Encontre a placa de competência”; “Leve o processo à porta indicada”; “Abra o carimbo de anulação”.

**Mecânica:** puzzle logístico; uma porta de Curitiba deixa de aceitar determinada caixa depois da decisão sobre competência. O caminho é redesenhado e exige uma nova rota.

**Frases ficcionais:** “Anos de processo. Agora confira o endereço.”; “A rota foi recalculada.”

**Crítica encenada:** o percurso institucional e as reviravoltas do caso. A sátira pode questionar o sistema, sem inventar um acordo político que produziu a decisão.

**Atribuição:** “Em 2021, o STF manteve a anulação por incompetência da vara de Curitiba.” Mostrar também o reconhecimento de parcialidade no caso do tríplex. **Fontes:** S03, S04.

A rota de cada processo deve corresponder à fonte. Não apresentar como fato uma única cadeia de remessas para todos os casos.

### Fase 4 — “Ronaldinho dos Negócios”

**Episódio usado nesta versão:** Gamecorp, negócios de Fábio Luís Lula da Silva e relações empresariais com Telemar/Oi. A fase não usa a alegada investigação de cannabis/INSS de 2026.

**Cenário:** estúdio de games/televisão, mesa de contratos, antenas de telefonia e uma pequena arena de futebol empresarial. Personagem jogável: caricatura de Fábio Luís, identificado pelo nome.

**Objetivos:** “Encontre o aporte”; “Abra o contrato empresarial”; “Atravesse a arena dos negócios”; “Encontre o desfecho das apurações”.

**Mecânica:** deslocar pacotes empresariais entre estações e abrir cartões de reportagem. Os pacotes se chamam “Aporte”, “Parceria” e “Investigação”; não “Dinheiro roubado”. Usar um contrato ilustrado sem assinatura fabricada.

**Base noticiada:** a Folha reportou um aporte de R$ 5 milhões da Telemar em 2005 e relatou a expressão de Lula comparando o filho ao Ronaldinho dos negócios. A mesma matéria registra o arquivamento das apurações então examinadas e a conclusão do MPF sobre aquela transação. **Fonte:** S09.

**Humor original:** “No futebol, o gol. Nos negócios, o aporte.”; “Arena empresarial desbloqueada.”

**Desfechos na própria fase:** um portal com “2012 — apurações arquivadas” corresponde a S09; outro cartão, separado e datado, apresenta o arquivamento noticiado em 2022 do inquérito sobre supostos repasses da Oi. S10 descreve exclusão de provas e falta de elementos remanescentes. Não fundir as duas apurações.

**Limites factuais:** aporte não é sinônimo de propina; os valores noticiados sobre empresas e períodos não são patrimônio pessoal comprovado de Lulinha. Não concluir que Lula participou de ilícito por ser pai do empresário. Não usar caricatura do jogador Ronaldinho ou ativos de clubes.

### Fase 5 — “Escolha seu Ministro”

**Cenário:** gabinete presidencial, Senado e STF, ligados por uma travessia caricatural da Praça dos Três Poderes.

**Objetivos:** “Encontre o crachá do ministro”; “Atravesse a sabatina”; “Chegue à cadeira do Supremo”.

**Mecânica:** o personagem Dino troca o crachá do Executivo pela toga ao completar indicação, aprovação e posse. O Senado é uma etapa real do percurso, não um obstáculo dispensável.

**Crítica encenada:** trânsito de uma trajetória política para a Corte e debate sobre independência institucional.

**Frase original:** “Mudou a roupa. A pergunta continua: como fica a independência?”

**Cartão em cena:** “Indicado por Lula, então ministro da Justiça, Dino foi aprovado pelo Senado em 2023. Na sabatina, afirmou que sua atuação no STF não teria viés político.” **Fonte:** S11. Posse em fevereiro de 2024: S12.

Não atribuir uma fala ficcional diretamente ao ministro como citação real. Não implementar “Dino obedece a Lula” ou um botão que anule processos a mando do presidente. Moraes não foi indicado por Lula; essa nomeação não integra a mecânica.

### Fase 6 — “Cadê o Debate? — 2006”

**Episódio usado nesta versão:** ausência no debate da Globo de 28/09/2006. Exibir “2006” no título, no HUD e nos cartões, para não parecer notícia de 2026.

**Cenário:** palco iluminado, cadeira vazia, corredor de bastidores e palanque de comício.

**Objetivos:** “Encontre a cadeira reservada”; “Escolha o caminho do comício”; “Passe longe do holofote”; “Abra o cartão do segundo turno”.

**Mecânica:** stealth cômico, com luzes de estúdio e microfones móveis. Não aparecer no palco nessa cena é a regra ficcional do minijogo; esconder-se fisicamente dos jornalistas é invenção do roteiro, não conduta noticiada.

**Frases originais:** “Presença: pendente.”; “A cadeira compareceu.”; “Próxima parada: palanque.”

**Base:** a Memória Globo registra a ausência no primeiro turno e a participação no debate do segundo turno de 2006. A Folha relatou o comício em São Bernardo na mesma noite. **Fontes:** S13, S14.

**Fechamento:** o palco se ilumina de novo com a data 27/10/2006, quando Lula participou do debate com Alckmin. Não transmitir que nunca debateu, nem acrescentar uma motivação secreta como fato.

### Fase 7 — “O Retorno”

**Cenário:** portais de datas, instalação prisional estilizada, mapa processual, urna e Planalto.

**Objetivos:** “Abra a porta de 2019”; “Atravesse as decisões de 2021”; “Chegue ao resultado de 2022”.

**Mecânica:** a habilidade do personagem muda por etapa: em 2019 abre-se a saída da prisão; em 2021 muda o estado das condenações e da elegibilidade; em 2022 abre-se a passagem ao Planalto.

**Humor original:** “Fim de jogo? O roteiro tinha outra fase.”; “Retorno desbloqueado.”

**Cronologia:** prisão em 2018; soltura em 2019 ligada à decisão sobre execução da pena; anulações em 2021; vitória eleitoral em 2022. **Fontes:** S16, S03, S17.

Não fazer a porta de 2019 depender de um carimbo de 2021. O fechamento pode mostrar “Continua…”, sem inventar eventos ou resultados de 2026.


## 6. Fase 1 — roteiro pronto para implementação

### 6.1. Resultado desejado

O jogador deve reconhecer o episódio **durante a ação**. Os elementos são nomeados: OAS, empreiteiro, contratos da Petrobras, reformas, elevador privativo, acusação, defesa e desfecho. A crítica visual recai sobre a relação entre poder, empreiteiras e benefícios privados alegados.

Não substituir esse roteiro por seis papéis genéricos seguidos de um texto explicativo. Não transformar a fase em prova de conhecimentos jurídicos. A informação vem de interações breves, enquanto o jogo continua funcionando como plataforma.

### 6.2. Abertura

**Título:** “TRÍPLEX: SUBINDO NA VIDA”

**Subtítulo:** “Guarujá — a controvérsia que virou processo”

**Texto original de apresentação:** “Um prédio à beira-mar. Uma reforma sob medida. E uma pergunta que não cabe no elevador: quem ficou com a conta?”

**Linha factual atribuída:** “A acusação noticiada relacionava benefícios da OAS a contratos da Petrobras. Lula negou recebimento ilícito; as condenações foram anuladas.”

**Rodapé curto:** “Sátira de acusações e decisões noticiadas. Interações têm fontes.”

**Botões:** “Entrar no prédio” e “Como jogar”.

Fontes da linha factual: S01, S03. O subtítulo, a pergunta e o texto de apresentação são redação do jogo.

### 6.3. Mapa e direção de arte

Reaproveitar o mapa e a câmera existentes; expandir só onde necessário. Se precisar de um novo layout, usar três andares e aproximadamente 3.200 × 1.080 unidades de mundo.

| Zona | Visual | Interação que dá sentido à crítica |
| --- | --- | --- |
| Calçada | Litoral, fachada “Solaris — Guarujá”, tapumes e capacetes com “OAS” em texto simples | Encontrar o empreiteiro |
| Escritório da obra | Mesa, contrato ilustrado, carimbo, telefone e quadro de empreendimentos | Abrir a ligação alegada com contratos |
| Área de reforma | Planta baixa, cozinha em instalação, escada e trilhos de elevador | Montar o projeto para mudar o cenário |
| Mezanino da acusação | Recorte ilustrado de notícia e mala com identificação de metáfora | Encontrar a mala simbólica |
| Andar privativo | Elevador diferenciado, varanda e acabamento mais sofisticado | Usar a reforma como mecânica |
| Balcão da defesa | Cartão de versão defensiva e representação de registro imobiliário | Abrir a contestação antes da saída |
| Terraço final | Porta, mapa de datas e carimbos | Ver a sequência dos desfechos |

Os objetos são ilustrações próprias. Não reproduzir fotos, páginas inteiras de jornais, logotipos ou assinaturas sem licença. O nome textual da empresa serve para identificar o episódio; a arte não deve sugerir patrocínio.

### 6.4. Regra de apresentação das notícias

Cada interação tem duas camadas:

- **Fala do jogo:** curta, cômica e identificada como ficcional.
- **Faixa de notícia:** resumo atribuível e fonte/data, mostrado junto ao objeto.

Exemplo de composição: personagem fala uma piada; imediatamente abaixo aparece “Relato de Léo Pinheiro • UOL • 20/04/2017”. Ao ativar o ícone de fonte, o jogo pausa e abre o cartão com o resumo. No teclado, isso funciona por foco e tecla; no celular, por toque.

Manter fonte e categoria visíveis no momento da descoberta. Não usar texto microscópico, aviso que some antes de poder ser lido ou cor que indique que uma acusação é fato confirmado. Categorias: “Notícia”, “Acusação”, “Defesa”, “Decisão” e “Metáfora”.

Mostrar a faixa de contexto por pelo menos 5 segundos; o jogador pode fechá-la ou reabri-la. Não impedir o controle do personagem por textos longos. Pausar somente quando ele abrir um painel modal.

### 6.5. Missão 1 — “Procure o empreiteiro da OAS”

**Gatilho:** sair do tutorial e chegar ao tapume.

**NPC:** “Empreiteiro”, personagem ficcional de capacete e prancheta. Não atribuir as falas inventadas a Léo Pinheiro.

**Fala original:** “Por aqui, a conversa começa na planta e termina no processo.”

**Resumo noticiado:** “Léo Pinheiro afirmou em depoimento que a unidade estava reservada à família de Lula. A defesa contestou a versão.” **Fonte:** S02.

**Efeito no jogo:** o NPC abre a porta do escritório e marca o próximo objetivo.

**HUD após interação:** “Encontre o contrato na mesa.”

**Piada ambiental:** placa “Atendimento personalizado. Controvérsia também.”

### 6.6. Missão 2 — “Encontre o contrato da Petrobras”

**Objeto:** pasta sobre uma mesa com “Contratos Petrobras” na capa. Ao abrir, o documento interno deve trazer “Ilustração — não reproduz um contrato real”.

**Resumo noticiado:** “O MPF alegou ligação entre vantagens da OAS e favorecimento em contratos da Petrobras.” **Fonte:** S01.

**Fala original de narrador:** “A pasta é grande. A pergunta também.”

**Animação:** uma linha pontilhada liga a pasta ao prédio. O rótulo “Tese da acusação” permanece junto à linha. A planta da reforma fica iluminada.

**Efeito no jogo:** desbloqueia uma passagem ou plataforma já existente.

Não desenhar a assinatura de Lula, uma cláusula de propina ou um contrato fictício como se tivesse sido apreendido. A pasta representa a relação alegada; não prova que ele assinou contratos da estatal.

### 6.7. Missão 3 — “Ache a planta da reforma”

**Objeto:** planta baixa cenográfica, dividida em três peças: cozinha, escada e elevador.

**Mecânica:** encontrar as peças por uma rota curta de plataformas; encaixar no quadro do escritório ou ativá-las por interação. Não exigir cliques precisos em mobile.

**Resumo noticiado:** “Executivos da OAS relataram obras e um elevador privativo; um deles disse que a empresa bancou a reforma. A defesa contestou o benefício atribuído a Lula.” **Fonte:** S15.

**Fala original:** “A reforma sobe de padrão. O caso sobe de instância.”

**Efeito visual:** cozinha e elevador aparecem montados, com animação rápida. Usar materiais, bancadas e portas concretas, não apenas um brilho no documento.

**HUD seguinte:** “Encontre a mala de dinheiro.”

Não mostrar um pagamento pessoal de Lula ou uma aceitação da reforma como fato. A transformação visual traduz o episódio noticiado, sem definir a titularidade ou a ilicitude.

### 6.8. Missão 4 — “Encontre a mala de dinheiro”

**Objeto:** mala cenográfica sobre um pedestal junto ao recorte de notícia. Notas estilizadas podem aparecer dentro.

**Identificação obrigatória no próprio objeto:** “METÁFORA DA ACUSAÇÃO”.

**Card de descoberta:** “A mala representa a vantagem indevida alegada. Não retrata uma entrega literal noticiada neste episódio.”

**Fonte associada à tese sobre vantagem:** S01. Essa fonte não é evidência de uma mala real.

**Fala original:** “Neste jogo, a acusação ganhou alça.”

**Mecânica:** interagir com a mala revela o símbolo no “Arquivo da fase”, com a categoria “Metáfora”. Não acrescentar dinheiro ao patrimônio do personagem, não realizar animação de entrega por empreiteiro a Lula e não converter a mala em uma prova encontrada.

**Pontuação:** +1 interação descoberta, sem “R$ recebidos”, “propina coletada” ou simulação de enriquecimento.

**HUD seguinte:** “Use o elevador privativo.”

A existência de dinheiro como linguagem visual é permitida pelo conceito satírico. A representação não pode fabricar um evento específico que as fontes não relatam. Se o layout não comportar a identificação clara, substituir a mala por um ícone de “Vantagem alegada”.

### 6.9. Missão 5 — “Use o elevador privativo”

**Objeto:** elevador de vidro ou acabamento destacado; porta com a palavra “Privativo”.

**Mecânica:** desbloqueado pela planta da reforma. Transporta o jogador por um trecho vertical; deixa uma última rota curta de plataforma antes do terraço.

**Fala original:** “Subir ficou fácil. Explicar a subida, nem tanto.”

**Resumo noticiado:** “O elevador privativo aparece nos relatos sobre a reforma do tríplex.” **Fontes:** S02, S15.

**Efeito:** checkpoint no desembarque.

**HUD seguinte:** “Abra a versão da defesa.”

Não usar “Luxo roubado” ou “Reforma paga com dinheiro roubado” como voz factual do narrador. A crítica já fica visível pelo acabamento, pela identificação da empresa e pela pergunta sobre a conta.

### 6.10. Missão 6 — “Abra a versão da defesa”

**Objeto:** cartão “Defesa de Lula” ao lado da representação de registro do imóvel.

**Resumo:** “Lula negou ser proprietário do tríplex e receber vantagem ilícita. Sua defesa contestou o relato de Pinheiro e a prova de benefício pessoal.” **Fonte:** S02.

**Fala original do narrador:** “Na escritura e no processo, a história tem versões diferentes.”

**Efeito:** atualiza o arquivo e libera a porta final. Este encontro é parte da rota principal; não um segredo opcional distante.

Não escrever “não tem escritura, então não pode existir corrupção”: a disputa era mais ampla que propriedade formal. Mostrar a posição defensiva como posição defensiva, sem decidir o mérito por um item do cenário.

### 6.11. Final — a fase muda de regra

A porta do terraço inicia uma sequência breve de cenários e datas. Ela é visível para todos que terminarem a fase, mesmo sem clicar em “Contexto”.

| Etapa | Texto principal | Texto complementar | Fonte |
| --- | --- | --- | --- |
| 2017 | “HOUVE CONDENAÇÃO” | “A decisão seria posteriormente anulada.” | S01 |
| 2021 | “CONDENAÇÕES ANULADAS” | “Incompetência da vara de Curitiba.” | S03 |
| 2021 | “JUIZ CONSIDERADO PARCIAL” | “STF confirmou a suspeição de Sergio Moro no caso do tríplex.” | S04 |
| 2022 | “CASO ARQUIVADO” | “Extinção da punibilidade por prescrição quanto às imputações do tríplex.” | S05, S06 |

**Animação:** carimbos mudam a fachada do mapa; andaimes cedem lugar a portas com novos destinos. Não fazer documentos arderem ou desaparecerem como se os ministros tivessem destruído provas.

**Piada final original:** “O prédio tinha três andares. A história ganhou outros capítulos.”

**Importante:** não encerrar com “preso até 2021”. Se a fase exibir prisão e soltura, usar a cronologia da Fase 7 e S16. Para a primeira atualização, a sequência acima basta.

**Botões:** “Rejogar”, “Ver notícias” e “Próxima fase”.

### 6.12. Contexto final pronto, em blocos curtos

- **Acusação noticiada:** a reforma e o apartamento foram apresentados pela acusação como benefícios relacionados à OAS. Fonte S01.
- **Relatos noticiados:** Pinheiro e outros executivos deram versões sobre reserva e reformas; a defesa as contestou. Fontes S02, S15.
- **Defesa:** negou titularidade e recebimento ilícito. Fonte S02.
- **Decisões:** anulação, reconhecimento de parcialidade e arquivamento posterior. Fontes S03–S06.
- **Encenação:** NPC genérico, contrato ilustrado, missões, mala e frases cômicas foram criados para o jogo. A mala não documenta uma entrega de dinheiro.

Não reproduzir as reportagens inteiras. Exibir resumos próprios, links, datas e atribuição.

### 6.13. Estado da fase

Trocar a antiga regra “4 de 6 documentos” por seis interações principais. Itens exploratórios extras podem valer pontuação, mas não substituem o roteiro.

Estados propostos:

```text
INTRO
MEET_CONTRACTOR
FIND_CONTRACT
ASSEMBLE_RENOVATION
DISCOVER_SYMBOLIC_BAG
RIDE_PRIVATE_ELEVATOR
OPEN_DEFENSE
LEGAL_OUTCOME
COMPLETE
```

A morte ou queda preserva interações concluídas e reinicia no checkpoint. Reiniciar a fase zera o roteiro. Não permitir concluir antes de abrir a defesa e de assistir à sequência final; permitir pular a animação apenas depois de todos os textos essenciais ficarem disponíveis na tela de resultado.

### 6.14. Critérios visuais específicos

O empreiteiro deve ser reconhecível como NPC; a planta deve parecer planta; a pasta deve ter identificação de contratos; a mala deve ter formato de mala; o elevador deve se mover. Não satisfazer isso com retângulos iguais que só mudam de título.

Aceitar assets provisórios bem distintos, gerados por SVG ou formas próprias. Não requerer arte definitiva para implementar. Em uma captura comum da fase, deve ser possível enxergar ao menos uma referência ao episódio além do nome “Lula”.


## 7. Modelo de dados

Definir fases por dados tipados, sem embutir todo o conteúdo em componentes ou cenas. Exemplo de estrutura; adaptar sem adicionar complexidade desnecessária:

```ts
type EditorialStatus = "pending" | "reviewed";
type ImplementationStatus = "planned" | "playable" | "complete";

interface Source {
  id: string;
  title: string;
  publisher: string;
  url: string;
  publishedAt?: string;
  checkedAt?: string;
  status: EditorialStatus;
  accessMode?: "full_page" | "search_content" | "document";
}

interface EditorialClaim {
  id: string;
  text: string;
  category: "fact" | "allegation" | "defense" | "legal_outcome";
  sourceIds: string[];
  status: EditorialStatus;
}

interface NarrativeEvent {
  id: string;
  missionTitle: string;
  trigger: "proximity" | "interact" | "collect" | "finish";
  objectKind: "npc" | "contract" | "blueprint" | "symbolic_bag"
    | "elevator" | "defense_card" | "outcome";
  satireText: string;
  sourcedSummary: string;
  attributionLabel: string;
  category: "news" | "allegation" | "defense" | "decision" | "metaphor";
  sourceIds: string[];
  fictionNote?: string;
  required: boolean;
  nextEventId?: string;
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
  narrativeEvents: NarrativeEvent[];
}
```

Estado de implementação e estado editorial são independentes. `reviewed` significa que o resumo corresponde ao que a fonte publicou e preserva seu contexto; não significa que uma acusação foi provada. Usar o modo de acesso real informado no registro de fontes. Não inferir revisão apenas pela presença de uma URL.

Para cada evento, ligar o item visível, a missão, o resumo e o painel de fonte pelos mesmos IDs. `satireText` nunca aparece como declaração real de uma pessoa. O ID da mala deve carregar `category: "metaphor"` e a nota de ficção. Bloqueios de missão dependem dos eventos, não de um contador genérico de documentos.

A validação de conteúdo deve detectar IDs inexistentes, alegações sem atribuição, metáforas sem nota de ficção e fases sem desfecho. Novos itens pendentes aparecem apenas em modo de desenvolvimento. Um build local não equivale a revisão jurídica para publicação.

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

## 9. Fontes localizadas e regra de uso

Esta revisão consultou cobertura jornalística, registros institucionais e uma cópia pública da decisão do tríplex. O que foi conferido é **o conteúdo publicado e o desfecho relatado**, não a verdade material das acusações. Usar notícias dispensa fazer uma investigação jornalística própria de todo o episódio; não dispensa ler a matéria, atribuir a versão corretamente e evitar uma encenação que invente um fato.

Não presumir que “a responsabilidade é só do jornalista”. A autoria da nova apresentação importa. O STJ admite críticas severas, irônicas e impiedosas a figuras públicas em temas de interesse público; o mesmo entendimento exige diligência quanto à informação e reconhece responsabilidade por abuso. Referência editorial: S18.

As fontes abaixo dão uma base concreta para a implementação. Novas falas ou alegações que ultrapassem seus conteúdos precisam de outra referência. Não usar uma manchete antiga para apresentar condenação anulada como vigente.

**Data desta consulta:** 07/10/2026. **Uso recomendado:** resumos próprios; não copiar artigos, fotografias ou identidade visual dos veículos.

### S01 — Panorama do caso do tríplex

- Veículo: Agência Brasil.
- Autoria: Paulo Victor Chagas.
- Publicação: 24/01/2018.
- Título: “Entenda o caso triplex em que Lula foi condenado”.
- URL: https://agenciabrasil.ebc.com.br/politica/noticia/2018-01/entenda-o-caso-triplex-em-que-lula-foi-condenado
- Conteúdo utilizado: tese acusatória, ligação alegada com contratos, defesa e condenação histórica.
- Escopo: notícia da época; precisa ser acompanhada por S03–S06.
- Não atribuir a esta reportagem uma entrega literal de mala.

### S02 — Depoimento do empreiteiro e contestação

- Veículo: UOL Notícias.
- Autoria: Andressa Rovani, Bernardo Barbosa, Daniela Garcia e Gustavo Maia.
- Publicação: 20/04/2017; atualização em 24/04/2017.
- Título: “Tríplex do Guarujá era de Lula, diz Léo Pinheiro a Moro na Lava Jato”.
- URL: https://noticias.uol.com.br/politica/ultimas-noticias/2017/04/20/tinha-orientacao-para-nao-colocar-a-venda-porque-era-da-familia-de-lula-diz-leo-pinheiro-sobre-triplex.amp.htm
- Conteúdo utilizado: versões de Pinheiro sobre reserva e obras; negativa da defesa.
- Escopo: relato atribuído ao depoente, não certificação de titularidade pelo jornal.

### S03 — Anulação por incompetência

- Veículo: Agência Brasil.
- Autoria: André Richter.
- Publicação: 15/04/2021.
- Título: “STF mantém anulação das condenações de Lula”.
- URL: https://agenciabrasil.ebc.com.br/justica/noticia/2021-04/stf-mantem-anulacao-das-condenacoes-de-lula
- Conteúdo utilizado: decisão sobre competência, anulações e efeito sobre elegibilidade.
- Acesso nesta consulta: conteúdo fornecido pela busca; a abertura direta apresentou erro. Não registrar que houve leitura do acórdão completo.

### S04 — Suspeição de Moro no tríplex

- Órgão: STF.
- Publicação: 23/06/2021.
- Título: “STF confirma suspeição de Sergio Moro na ação do triplex do Guarujá”.
- URL: https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=468086&ori=1
- Conteúdo utilizado: confirmação da suspeição e manutenção da anulação de atos no caso.
- Acesso nesta consulta: conteúdo institucional fornecido pela busca; abertura direta com erro.

### S05 — Arquivamento do tríplex

- Veículo: Migalhas.
- Autoria: Redação.
- Publicação: 28/01/2022.
- Título: “Juíza do DF arquiva processo contra Lula no caso do tríplex do Guarujá”.
- URL: https://www.migalhas.com.br/quentes/358845/juiza-do-df-arquiva-processo-contra-lula-no-caso-do-triplex-do-guaruja
- Conteúdo utilizado: encerramento por prescrição quanto às imputações relativas ao tríplex.
- Conferência complementar: S06.

### S06 — Decisão judicial do arquivamento, cópia pública

- Órgão emissor: 12ª Vara Federal Criminal da Seção Judiciária do Distrito Federal.
- Data da decisão: 27/01/2022.
- Processo indicado na capa: 1070239-94.2021.4.01.3400.
- Processo de referência: 1028899-73.2021.4.01.3400.
- URL da cópia disponibilizada por Migalhas: https://www.migalhas.com.br/arquivos/2022/1/A1321D59CAC7E2_acao.pdf
- Conteúdo utilizado: dispositivo de arquivamento por prescrição quanto ao tríplex.
- Não confundir essa fundamentação com os capítulos relativos ao acervo presidencial, que têm tratamento distinto no documento.

### S07 — Acusação do sítio e defesa

- Origem: Agência Brasil, reproduzida pelo UOL.
- Autoria: Ivan Richard Esposito.
- Publicação: 22/05/2017.
- Título: “Lava Jato: MPF apresenta nova denúncia contra Lula envolvendo o sítio de Atibaia”.
- URL: https://noticias.uol.com.br/ultimas-noticias/agencia-brasil/2017/05/22/lava-jato-mpf-apresenta-nova-denuncia-contra-lula-envolvendo-o-sitio-de-atibaia.htm
- Conteúdo utilizado: tese sobre reformas e resposta defensiva.
- Os valores e relações da acusação não são fatos de corrupção confirmados pela referência.

### S08 — Desfecho da denúncia reapresentada do sítio

- Veículo: CNN Brasil.
- Autoria: João de Mari.
- Publicação: 22/08/2021.
- Título: “Juíza de Brasília rejeita denúncia contra Lula no caso do sítio de Atibaia”.
- URL: https://www.cnnbrasil.com.br/politica/juiza-de-brasilia-rejeita-denuncia-contra-lula-sobre-sitio-de-atibaia/
- Conteúdo utilizado: rejeição, fundamentos noticiados e posição da defesa.
- Não generalizar esse desfecho para todo caso envolvendo Lula.

### S09 — Gamecorp, aporte e apurações anteriores

- Veículo: Folha de S.Paulo.
- Autoria: José Ernesto Credendio e Andreza Matais.
- Publicação: 09/11/2012.
- Título: “Investigação sobre negócios de filho de Lula é arquivada”.
- URL: https://www1.folha.uol.com.br/fsp/poder/76983-investigacao-sobre-negocios-de-filho-de-lula-e-arquivada.shtml
- Conteúdo utilizado: investimento noticiado, expressão sobre o talento empresarial do filho e arquivamento descrito na matéria.
- Não confundir essa apuração com o inquérito encerrado em 2022.

### S10 — Arquivamento posterior sobre Oi/Gamecorp

- Veículo: Folha de S.Paulo.
- Autoria: Mônica Bergamo.
- Publicação: 17/01/2022.
- Título: “Justiça arquiva caso que liga Lulinha a supostos repasses ilegais da Oi”.
- URL: https://www1.folha.uol.com.br/amp/colunas/monicabergamo/2022/01/justica-arquiva-caso-que-liga-lulinha-a-supostos-repasses-ilegais-da-oi.shtml
- Conteúdo utilizado: pedido do MPF, exclusão de provas e arquivamento.
- Não exibir suspeitas dessa apuração como investigação atual ativa.

### S11 — Dino: aprovação e debate sobre atuação política

- Órgão/veículo: Agência Senado.
- Autoria: Rodrigo Baptista.
- Publicação: 13/12/2023.
- Título: “Com 47 votos favoráveis, Senado aprova Dino para o STF”.
- URL: https://www12.senado.leg.br/noticias/materias/2023/12/13/com-47-votos-favoraveis-senado-aprova-dino-para-o-stf
- Conteúdo utilizado: trajetória, aprovação e declaração de Dino sobre atuação sem viés político.
- Críticas registradas na sabatina são opiniões dos respectivos parlamentares, não conclusões judiciais.

### S12 — Dino: posse

- Órgão: STF.
- Publicação: 22/02/2024.
- URL: https://portal.stf.jus.br/noticias/verNoticiaDetalhe.asp?idConteudo=527684
- Conteúdo utilizado: indicação por Lula e posse na vaga de Rosa Weber.
- Acesso nesta consulta: conteúdo institucional recuperado na busca.

### S13 — Debate de 2006

- Origem: Memória Globo, registro da emissora que realizou os debates.
- Título: “Eleições presidenciais — 2006”.
- URL: https://memoriaglobo.globo.com/jornalismo/coberturas/eleicoes-presidenciais-2006/noticia/eleicoes-presidenciais-2006.ghtml
- Conteúdo utilizado: ausência em setembro e participação em outubro.
- Não trasladar o episódio para 2026.

### S14 — Comício na noite do debate

- Veículo: Folha de S.Paulo.
- Publicação: 29/09/2006.
- URL: https://www1.folha.uol.com.br/fsp/brasil/fc2909200606.htm
- Conteúdo utilizado: presença em comício em São Bernardo na noite da ausência.
- O stealth do jogo é invenção, não relato sobre comportamento nos bastidores.

### S15 — Relatos dos executivos sobre a reforma

- Veículo: Folha de S.Paulo.
- Autoria: José Marques.
- Publicação: 26/04/2017.
- Título: “Executivos dizem que reformaram tríplex para Lula a pedido de Pinheiro”.
- URL: https://www1.folha.uol.com.br/poder/2017/04/1878950-executivos-dizem-que-reformaram-triplex-para-lula-a-pedido-de-pinheiro.shtml
- Conteúdo utilizado: relatos sobre projeto, elevador e custeio; contestação defensiva.
- Acesso nesta consulta: conteúdo da reportagem recuperado na busca.

### S16 — Soltura em 2019

- Veículo: Agência Brasil.
- Publicação: 08/11/2019.
- Título: “Após decisão do STF, juiz manda soltar ex-presidente Lula”.
- URL: https://agenciabrasil.ebc.com.br/justica/noticia/2019-11/apos-decisao-do-stf-juiz-manda-soltar-ex-presidente-lula
- Conteúdo utilizado: fundamento e data da determinação de soltura.
- Acesso nesta consulta: conteúdo fornecido pela busca; abertura direta com erro.

### S17 — Resultado eleitoral de 2022

- Órgão: TSE.
- Publicação original: 31/10/2022.
- Título: “100% das seções totalizadas: confira como ficou o quadro eleitoral após o 2º turno”.
- URL: https://www.tse.jus.br/comunicacao/noticias/2022/Outubro/100-das-secoes-totalizadas-confira-como-ficou-o-quadro-eleitoral-apos-o-2o-turno/
- Conteúdo utilizado: eleição de Lula em 2022.
- Não usar essa fonte para o resultado de 2026.

### S18 — Referência sobre informação e crítica

- Órgão: STJ.
- Referência: Informativo 696; REsp 1.729.550/SP, julgamento em 14/05/2021.
- URL: https://processo.stj.jus.br/jurisprudencia/externo/informativo/?acao=pesquisar&aplicacao=informativo&livre=%40CNOT%3D%27018151%27
- Utilidade: distingue liberdade de crítica, diligência na informação e abuso.
- Não é uma validação jurídica deste jogo nem uma garantia de ausência de responsabilidade.

### Atualizações futuras

Novos episódios entram como dados separados, com datas e fontes próprias. Conferir retificações e desfechos ao atualizar o conteúdo para publicação. Não recuperar como fatos os links possivelmente incorretos ou as afirmações não verificadas de 2026 da conversa anterior.


## 10. Etapas de implementação

### Etapa A — Fundação

Inspecionar a aplicação existente, identificar cena da Fase 1, entidades, controles, HUD e painel de contexto. Confirmar como executar e preservar o funcionamento atual. Inicializar projeto apenas se realmente não houver implementação.

### Etapa B — Primeira fase completa

Substituir coleta genérica pelo roteiro da seção 6. Adicionar os objetos e NPCs, configurar as seis interações, conectar notícias aos eventos e implementar a sequência de desfechos. Reaproveitar física, plataformas, checkpoints, pausa e reinício.

### Etapa C — Experiência e robustez

Adicionar toque, preferências, progresso, responsividade, foco de teclado e comportamento correto ao alternar entre jogo e menus. Refinar animações e feedback.

### Etapa D — Conteúdo e expansão

Usar o registro da seção 9 para montar os cartões e resumos; não iniciar uma pesquisa do zero para textos já delimitados neste roteiro. Expandir fontes apenas quando o código ou a narrativa acrescentarem outra afirmação. Aplicar o sistema de eventos às demais fases. Não confundir episódio histórico com notícia atual.

### Etapa E — Polimento

Substituir assets provisórios, conferir licenças, ajustar dificuldade, revisar todas as fontes e testar o percurso completo. Publicação fica fora do escopo inicial.

## 11. Critérios de aceitação desta atualização

- Instalação, `dev` e `build` documentados e funcionando.
- Menu utilizável e acesso a “Como jogar”, configurações e contexto.
- Fase 1 preservada e atualizada do começo ao resultado, sem depender de serviços externos.
- Empreiteiro, contrato, planta, mala e elevador distinguíveis no cenário.
- HUD mostra as missões da seção 6, com progressão coerente.
- Cada interação apresenta a crítica e o resumo atribuído dentro da fase.
- Sem abrir o contexto extra, o jogador encontra acusação, defesa e desfecho.
- A mala está identificada como metáfora junto do próprio objeto.
- Não há uma simulação de entrega real de mala ou um contrato com assinatura fabricada.
- A sequência final inclui o arquivamento de 2022; não para apenas na condenação de 2017.
- As fases históricas exibem seu ano; a fase do debate não parece notícia de 2026.
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

Testes automatizados devem cobrir regras que podem falhar: ordem e requisito das interações para a saída, restauração dos eventos no checkpoint, persistência com dados inválidos e integridade das referências. Se houver ferramenta de navegador, percorrer as seis missões e capturar a crítica em cena e o final. Não criar testes que apenas repitam constantes ou detalhes internos do código.

Se não puder testar um navegador ou celular, declarar a limitação. Não afirmar que um recurso foi testado quando apenas foi implementado.

## 13. Fora do escopo inicial

Backend, login, pagamentos, multiplayer, ranking online, campanha, segmentação de eleitores, impulsionamento, compra de domínio e deploy. Não é necessário gerar arte definitiva, implementar sete fases de uma vez ou criar uma infraestrutura complexa para demonstrar a ideia.

## 14. Entrega esperada do agente

Projeto existente atualizado, README com comandos, Fase 1 com narrativa crítica integrada, eventos reaproveitáveis, inventário de assets e fontes vinculadas. A resposta final deve apontar como rodar e resumir o que mudou, o que foi verificado e o próximo incremento concreto.

Prompt curto para quem já tem o jogo aberto no Codex/Claude Code: **“Leia a versão 2 do LULAVERSO_BRIEFING.md. Preserve a implementação existente e atualize a Fase 1 conforme a seção 6. A crítica deve aparecer nos NPCs, missões, objetos e animações, com fontes atribuídas no momento da interação.”**
