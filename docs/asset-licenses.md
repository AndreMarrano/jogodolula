# Inventário de assets

Todos os assets atuais são **originais e provisórios**, gerados em código neste
repositório. Não há imagens, músicas, fontes ou sprites de terceiros, e nada foi copiado
de Nintendo/Mario, do site de referência (superflavio.com) ou de outros jogos.

| Asset | Onde | Como foi feito | Licença |
| --- | --- | --- | --- |
| Personagem (parado, caminhada, pulo, queda) | `src/game/textures.ts` (`FRAMES`) | Pixel art 16×23 desenhada em código, caricatura própria (barba branca, camisa vermelha) | Original do projeto |
| Laje, andaime, piso, elevador, alçapão | `src/game/textures.ts` | Retângulos em canvas | Original do projeto |
| Empreiteiro (personagem genérico e fictício) | `src/game/textures.ts` (`CONTRACTOR_FRAMES`) | Pixel art 16×23 em código: capacete, colete, prancheta | Original do projeto |
| Pasta de contratos, planta baixa, mala simbólica, pedestal, recorte de notícia ilustrado, balcão da defesa, arquivo de registro, mesa, tapume, elevador e cabine privativos, piso do andar privativo | `src/game/textures.ts` | Retângulos em canvas; o recorte não reproduz página nem logotipo de jornal | Original do projeto |
| Cozinha e escada montadas, linha “Tese da acusação”, quadro de empreendimentos, capacetes | `src/game/scenes/TriplexScene.ts` | Formas geométricas (Graphics) | Original do projeto |
| Bandeira de checkpoint, portas | `src/game/textures.ts` | Retângulos em canvas | Original do projeto |
| Céu, sol, nuvens, mar, morros, prédio | `textures.ts` e `TriplexScene.ts` | Gradiente e formas geométricas | Original do projeto |
| Carimbos da sequência final | `TriplexScene.ts` (`makeStamp`) | Texto e moldura desenhados | Original do projeto |
| Nomes “OAS”, “Petrobras”, “Solaris — Guarujá” | textos em cena | Só texto simples, para identificar o episódio; sem logotipos nem identidade visual das empresas | — |
| Efeitos sonoros | `src/game/systems/audio.ts` | Sintetizados com WebAudio (osciladores) | Original do projeto |
| Fontes tipográficas | `src/styles/global.css` | Fontes do sistema (monoespaçada e sans-serif) | Do sistema do usuário; nada é distribuído |

## Como substituir por arte definitiva

1. Coloque os arquivos em `public/assets/` e registre a licença de cada um nesta tabela.
2. Carregue-os num `preload()` da cena com as mesmas chaves de `TEX` (`textures.ts`).
   `generateTextures` não sobrescreve chaves que já existem.
3. O personagem usa quadros separados (`lula-idle-0`, `lula-walk-0` … `lula-fall`); uma
   spritesheet exige ajustar `Player.ensureAnimations`.

Não usar fotografia, voz clonada ou reprodução realista de pessoas reais.
