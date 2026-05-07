---
title: Git e GitHub · Endwalker
description: Criar conta no GitHub, instalar Git no Windows, configurar nome e email, fazer o primeiro commit e push, e ver seu código publicado online.
---

Este é o último capítulo do Tomo 0. O fim do Endwalker, o ponto onde o
aventureiro deixa de ser anônimo e a sua presença passa a ser registrada
em Eorzea. **Git** e **GitHub** são as ferramentas que tornam seu código
visível, versionado e compartilhável. Toda vaga de estágio em programação
hoje espera que você saiba usar os dois. Não tem como pular.

## Git e GitHub não são a mesma coisa

Confusão clássica. Vale gastar dois parágrafos:

- **Git** é um programa que roda no seu computador. Ele guarda o histórico
  de mudanças do seu código (cada commit é um snapshot). É offline, não
  precisa de internet. Foi inventado pelo cara que fez o Linux.
- **GitHub** é um site da Microsoft. É um lugar na internet onde você
  hospeda repositórios Git pra outras pessoas verem, colaborarem, e onde
  recrutadores vão olhar seu portfólio.

Outros sites parecidos: GitLab, Bitbucket. Funcionam quase igual. GitHub é
o mais usado, então é o que o guia trata.

## Etapa 1: Conta no GitHub

Antes de instalar qualquer coisa, crie a conta. Demora 3 minutos.

1. Abra <https://github.com/signup> no navegador.
2. Preencha email, senha, e **escolha um username com cuidado**.

:::caution[O username importa]
O username vai aparecer em todo URL dos seus repos (`github.com/seu-username/projeto`),
em todo email do GitHub, e provavelmente no seu currículo. Recomendações:

- **Use seu nome real ou algo próximo**: `dan-pereira`, `danpereira`, `pereirad`.
- **Evite gamertag** (`xxDarkLordxx`, `lalafell-supreme`).
- **Evite números aleatórios** (`dan98382`).
- Pense por uns 30 segundos antes de confirmar. Mudar depois é trabalhoso.
:::

3. Confirme o email pelo link que o GitHub manda.
4. Pula tudo que for opcional (perguntas sobre interesses, plano pago,
   convites pra times). Pode chegar na home com perfil vazio mesmo, vamos
   preencher depois no Tomo IV.

## Etapa 2: Instalar Git no Windows

1. Abra <https://git-scm.com/download/win>. O download começa sozinho.
2. Execute o `.exe`.
3. As telas do instalador são MUITAS. Vou listar o que importa, e o que
   pode deixar no padrão:

   - **License**: aceite.
   - **Destination**: padrão.
   - **Components**: padrão.
   - **Default editor**: troque para **"Use Visual Studio Code as Git's default
     editor"**. Quando o Git precisar abrir um editor (raro, mas acontece),
     vai abrir o VS Code.
   - **Adjusting your PATH**: deixe **"Git from the command line and also
     from 3rd-party software"** (a opção do meio, recomendada).
   - **HTTPS transport**: padrão (OpenSSL).
   - **Line endings**: deixe **"Checkout Windows-style, commit Unix-style"**
     (a primeira). Importa pra evitar dor com colaboradores em Mac/Linux.
   - **Terminal emulator**: padrão (MinTTY).
   - O resto: padrão padrão padrão.

4. Clique **Install**, espere, **Finish**.

Para validar, abra um PowerShell **novo** (não reaproveite uma janela aberta
antes da instalação) e digite:

```powershell
git --version
```

Saída esperada:

```text
git version 2.x.x.windows.1
```

## Etapa 3: Configurar nome e email

O Git precisa saber quem você é, pra carimbar cada commit com seu nome. Use
o **mesmo email** que você usou no GitHub, isso é importante pros commits
aparecerem com sua foto e ligados ao seu perfil.

```powershell
git config --global user.name "Seu Nome Real"
git config --global user.email "seu-email@exemplo.com"
```

`--global` significa "vale pra qualquer repo neste computador". Você só
precisa rodar isso uma vez.

Para conferir:

```powershell
git config --global user.name
git config --global user.email
```

## Etapa 4: Primeiro repositório local

Vamos transformar a pasta de aprendizado num repositório Git de verdade.

```powershell
cd C:\Users\seu-nome\Documents\python
git init
```

`git init` cria uma pasta escondida chamada `.git` dentro do diretório atual.
É onde o Git guarda o histórico. Você nunca mexe nela à mão.

Verifique:

```powershell
git status
```

Saída:

```text
On branch main

No commits yet

nothing to commit (create/copy files and use "git add" to track)
```

Se você fez os exercícios dos capítulos anteriores, deve ter alguns `.py` na
pasta. Eles aparecem como `Untracked files`. Se a pasta está vazia, crie
um arquivo `README.md` com qualquer coisa dentro só pra ter o que commitar.

## Etapa 5: Primeiro commit

Três comandos formam o ciclo básico do Git: **add → commit → push**.

**Add** é "pegar mudanças e colocar na área de staging" (a fila de coisas
que vão entrar no próximo commit):

```powershell
git add .
```

O ponto significa "todos os arquivos modificados nesta pasta e subpastas".

**Commit** é "fechar o pacote com uma descrição":

```powershell
git commit -m "primeiro commit do meu aprendizado"
```

A mensagem (`-m "..."`) deve descrever o que mudou. Pra primeiro commit
qualquer mensagem serve, mas vá criando o hábito de mensagens claras.

Verifique:

```powershell
git log
```

Mostra a lista de commits da pasta. Por enquanto só um.

## Etapa 6: Conectar com o GitHub

Vamos publicar essa pasta no GitHub.

1. No navegador, vá pra <https://github.com/new>.
2. **Repository name**: `aprendendo-python` (ou o que você decidiu no
   primeiro capítulo).
3. **Public** ou **Private**: escolha **Public**, é o seu portfólio.
4. **Não marque** "Add a README", "Add .gitignore", nem licença. Vamos
   subir o que já tem local.
5. **Create repository**.

A próxima tela mostra os comandos pra conectar um repo local. Use estes
(troque `seu-username` pelo seu username real do GitHub):

```powershell
git remote add origin https://github.com/seu-username/aprendendo-python.git
git branch -M main
git push -u origin main
```

Na primeira vez do `push`, o Git abre uma janela pedindo login no GitHub.
Use o navegador (a opção padrão) e autorize. Da segunda vez em diante ele
guarda credencial e não pergunta mais.

## Você acabou de publicar código na internet

Recarregue a página do GitHub do seu repo. Os arquivos aparecem. Esse é o
momento. Aventureiros nascem aqui.

## O ciclo dali pra frente

Toda vez que você editar arquivos e quiser sincronizar com o GitHub:

```powershell
git add .
git commit -m "descrevendo o que mudou"
git push
```

`git push` sem o `-u origin main` na frente funciona depois da primeira vez
porque o Git já lembra pra qual remote mandar.

:::tip[Hábito]
Faça commit pequeno, frequente, com mensagens curtas e específicas.
"Adiciona exercício 3 do capítulo de variáveis" é melhor que "atualizações".
Você vai agradecer no Tomo IV quando estiver tentando lembrar o que fez
mês passado.
:::

## Exercícios

1. **Verificação**: rode `git config --global --list`. Confira que `user.name`
   e `user.email` estão preenchidos. Anote os valores.

2. **Status como reflexo**: edite qualquer arquivo `.py` da sua pasta de
   aprendizado (adicione um comentário). Sem commitar, rode `git status`.
   O arquivo aparece como `modified`. Rode `git diff`. Você vê exatamente
   o que mudou.

3. **Mais um commit**: faça `git add .`, `git commit -m "ajusta exercício
   tal"`, `git push`. Confirme no site do GitHub que apareceu um segundo
   commit.

4. **README inicial**: crie um arquivo `README.md` na raiz da pasta com
   este conteúdo:

   ```markdown
   # Aprendendo Python

   Repositório de exercícios e Trials do guia *Dan Aprende a Programar*.
   ```

   Commit + push. Recarregue a página do GitHub. O README aparece renderizado
   abaixo da lista de arquivos. Aprenda a amar o README, ele é o cartão de
   visita de cada repo.

5. **History check**: rode `git log --oneline`. Você vê um resumo dos commits
   um por linha. Esse é o histórico que recrutador vê quando clica em "commits"
   no GitHub.

## Você concluiu

- Conta no GitHub criada com username profissional.
- Git instalado e configurado com seu nome e email.
- Pasta de aprendizado é um repositório Git real.
- Pelo menos três commits seus já estão no GitHub.
- Você sabe o ciclo `add → commit → push`.

**Tomo 0 fechado.** Você terminou a Main Story Quest. Toma um copo d'água,
abre <https://github.com/seu-username> e olha pro seu perfil pela primeira
vez. Tem código seu na internet.

Próximo Tomo: **Sua primeira extreme**. Variáveis, condicionais, loops,
funções. As mecânicas básicas que toda magia em Python usa. Você vai
escrever bem mais código a partir daqui.
