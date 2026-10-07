# Instruções para agentes de código

Este repositório é trabalhado **alternadamente por dois agentes: Claude Code e Codex**.
Os dois **nunca trabalham ao mesmo tempo**, mas cada um roda no próprio ambiente
(container/clone separado). Por isso, um agente só vê o trabalho do outro **depois que
esse trabalho foi commitado e enviado (push) ao GitHub**.

## Antes de mexer em qualquer coisa

1. Sincronize com o remoto e veja se o outro agente fez algo desde a sua última sessão:
   ```sh
   git fetch --all --prune
   git status
   git branch -a
   git log --all --oneline --graph -n 30
   ```
2. Se houver commits novos (do outro agente ou de qualquer pessoa), **leia-os antes de
   editar** (`git log -p`, `git show <commit>`) e traga-os para a sua branch
   (`git pull` / `git merge`) antes de começar.
3. Se a árvore de trabalho tiver alterações não commitadas que você não fez, **pare e
   pergunte ao usuário**. Não descarte nem sobrescreva.
4. Ao dar o resumo inicial ao usuário, diga o que mudou desde a última sessão (quais
   commits, de qual agente).

## Ao terminar

- **Commit e push de tudo** antes de encerrar. Trabalho que fica só no ambiente local
  some para o outro agente.
- Mensagens de commit claras, dizendo o que mudou e por quê, e **identificando o agente**
  (ex.: trailer `Co-Authored-By` do Claude ou prefixo `[codex]`), para o outro saber
  quem fez o quê.
- Não reescreva o histórico já enviado (`rebase`, `amend`, `push --force`) de commits
  que o outro agente pode já ter usado.

## Outras regras

- Só crie ou altere código quando o usuário pedir. A ideia do jogo vem de um documento
  `.md` enviado pelo usuário. Siga esse documento e pergunte o que não estiver claro.
