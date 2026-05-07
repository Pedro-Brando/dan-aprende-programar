---
title: O editor VS Code · Stormblood
description: Instalar o Visual Studio Code, configurar a extensão Python, dominar atalhos essenciais e rodar o primeiro arquivo `.py` direto do editor.
---

Em Stormblood você liberta Doma e Ala Mhigo. Mas antes de partir pra qualquer
batalha, você precisa de uma arma decente. **VS Code** é a sua katana neste
capítulo: o editor que vai segurar todo código que você escrever de agora em
diante. É gratuito, é da Microsoft, e é o que praticamente todo dev profissional
usa.

## Por que VS Code

Você poderia escrever Python no Bloco de Notas. Funcionaria. Mas todo dev
júnior que está sendo entrevistado hoje abre o VS Code, e o entrevistador
espera ver um VS Code. Isso já basta como motivo. Adicione a isso:

- Destaque de sintaxe (cores diferentes pra cada parte do código)
- Autocomplete inteligente (Pylance preenchendo o que você ia digitar)
- Terminal integrado (sem precisar alternar entre janelas)
- Debugger gráfico (vai ser útil no Tomo I)
- Git integrado (você vai usar no último capítulo deste Tomo)

## Baixando

1. Abra <https://code.visualstudio.com/> no navegador.
2. Clique em **Download for Windows**. O site detecta seu sistema sozinho.
3. O download é um `.exe` de uns 100 MB.

## Instalando

Execute o arquivo. As telas:

1. **License Agreement**: aceite, próximo.
2. **Destination Location**: deixe o padrão, próximo.
3. **Start Menu Folder**: deixe o padrão, próximo.
4. **Select Additional Tasks**: a tela importante. Marque:
   - "Add 'Open with Code' action to Windows Explorer file context menu"
   - "Add 'Open with Code' action to Windows Explorer directory context menu"
   - "Add to PATH"

   As duas primeiras dão o atalho "Open with Code" quando você clica com o
   botão direito numa pasta. A terceira deixa você abrir o VS Code do terminal
   com `code .`. Você vai usar isso o tempo todo.

5. **Install**, espere terminar, **Finish** (com a opção "Launch Visual Studio Code"
   marcada para abrir direto).

## A extensão Python

VS Code "puro" não sabe nada de Python ainda. Você precisa instalar a
extensão oficial:

1. Com o VS Code aberto, aperte **Ctrl + Shift + X**. Abre o painel de extensões
   no lado esquerdo.
2. Na busca do painel, digite **Python**.
3. O primeiro resultado deve ser **Python**, da Microsoft, com mais de 100M de
   downloads. Clique em **Install**.
4. A extensão **Pylance** instala junto. Ela é o que dá o autocomplete bom.

Pronto. Agora o VS Code entende Python.

:::tip[Tema de Eorzea]
VS Code vem com o tema escuro padrão, que é ótimo. Se quiser brincar, aperte
**Ctrl + K** seguido de **Ctrl + T** e escolha outro. Eu recomendo "Dark+" ou
"GitHub Dark" para começar. Tema é gosto pessoal, igual as keybinds da sua rotation.
:::

## Primeiro arquivo `.py`

Hora de sair do REPL e escrever código que sobrevive ao fechar a janela.

1. **Crie uma pasta** no seu computador para os experimentos. Por exemplo:
   `C:\Users\seu-nome\Documents\python\`. Pode ser onde você quiser, mas
   mantenha o caminho sem espaços e sem acentos (cria menos dor de cabeça).
2. **Abra a pasta no VS Code**: clique com o botão direito nela e escolha
   **Open with Code**. (É por isso que pediu pra marcar aquela opção na instalação.)
3. **Crie um arquivo novo**: no painel esquerdo, clique no ícone de "novo
   arquivo" (folha com `+`), nomeie como `ola.py`. A extensão `.py` é
   importante, é como o VS Code sabe que é Python.
4. **Escreva**:

   ```python
   nome = "Dan"
   print(f"Olá, {nome}. Bem-vindo a Doma.")
   ```

5. **Salve com Ctrl + S**.

## Rodando o arquivo

VS Code dá três jeitos de rodar:

### Jeito 1: terminal integrado

Aperte **Ctrl + `** (a crase, ao lado do 1). Abre um terminal embutido no
VS Code, já apontando para a pasta do projeto. Digite:

```powershell
python ola.py
```

Saída esperada:

```text
Olá, Dan. Bem-vindo a Doma.
```

### Jeito 2: botão Run

No canto superior direito do editor, com o arquivo `.py` aberto, aparece um
triângulo verde de **Play**. Clique nele. O VS Code abre o terminal sozinho
e roda o arquivo.

### Jeito 3: tecla F5 (debug)

Você verá isso no Tomo I em mais detalhe. Por ora, ignore. Os dois jeitos
acima são suficientes.

## Atalhos que você vai usar todo dia

Memorize estes cinco. Os outros aparecem com o tempo:

| Atalho | O que faz |
|---|---|
| **Ctrl + S** | Salva o arquivo atual |
| **Ctrl + `** | Abre/fecha o terminal integrado |
| **Ctrl + /** | Comenta/descomenta a linha onde o cursor está |
| **Ctrl + Shift + P** | Abre a Paleta de Comandos (faz quase tudo) |
| **Ctrl + P** | Abre o seletor rápido de arquivo |

A Paleta de Comandos (Ctrl + Shift + P) é o atalho mais importante. Quando
você não souber como fazer alguma coisa no VS Code, abra a paleta e digite
o que você quer fazer. Funciona pra mais de 90% dos casos.

## Exercícios

1. **Comentário**: abra o `ola.py`, posicione o cursor na linha do `print`, e
   aperte **Ctrl + /**. A linha vira `# print(...)`. Rode o arquivo. O que
   aparece? Aperte Ctrl + / de novo pra descomentar.

2. **Múltiplos prints**: edite o `ola.py` para:

   ```python
   print("linha 1")
   print("linha 2")
   print("linha 3")
   ```

   Rode. Confira que aparecem três linhas.

3. **Erro de propósito**: troque `print("linha 1")` por `prnt("linha 1")` (com
   typo). Salve, rode. Leia a mensagem de erro inteira. Anote o nome do erro
   (`NameError`). Conserte.

4. **Paleta de comandos**: aperte Ctrl + Shift + P, digite "format", e veja
   quantos comandos relacionados aparecem. Não precisa executar, é só pra
   sentir o tamanho da paleta.

## Você concluiu

- VS Code está instalado e configurado com Python + Pylance.
- Você sabe abrir uma pasta, criar um `.py`, salvar e rodar.
- Você decora cinco atalhos essenciais.
- Você sabe ler um erro pequeno e corrigir.

Próximo capítulo: o terminal. Você precisa entender o ambiente sombrio onde
o seu código realmente roda, antes de rodar coisas mais sérias.
