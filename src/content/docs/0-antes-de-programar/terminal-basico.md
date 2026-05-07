---
title: Terminal básico · Shadowbringers
description: Comandos essenciais de PowerShell e cmd no Windows para navegar entre pastas, criar arquivos e executar Python sem depender de cliques.
---

Você atravessou o portal e chegou no Primeiro. Aqui o céu não é azul: é uma
camada uniforme de luz cega que impede o tempo de passar. O **terminal** é
parecido. Tela preta, cursor piscando, nenhuma decoração. Para quem nunca usou,
parece intimidador. Mas é onde o trabalho real acontece, e dominar o terminal
separa um hexa legend de um casual que só faz normal raids.

## O que é um terminal

Um terminal é uma janela que fala com o sistema operacional por texto, em vez
de cliques. Você digita um comando, aperta Enter, o sistema executa, mostra o
resultado, e fica pronto pro próximo comando. Sem mouse, sem janelas pra
arrastar.

No Windows você tem três terminais possíveis:

- **PowerShell**: o moderno, padrão hoje. É o que você vai usar.
- **cmd (Prompt de Comando)**: o antigo. Ainda funciona, mas com menos recursos.
- **Terminal integrado do VS Code**: por padrão é PowerShell por baixo, embutido
  no editor.

Para este guia, **sempre PowerShell**. Os comandos abaixo são os mesmos para o
PowerShell de janela própria e para o terminal integrado do VS Code.

:::note[Sobre o cmd]
Você vai ver tutoriais antigos pedindo `dir` e `cls` (cmd) em vez de
`Get-ChildItem` e `Clear-Host` (PowerShell). PowerShell aceita os dois,
porque mantém aliases dos comandos antigos. Use o que ficar mais na cabeça.
:::

## Onde estou?

Sempre que abre um terminal, ele aponta para um diretório (uma pasta). Para
ver qual:

```powershell
pwd
```

A saída é o caminho completo, tipo:

```text
Path
----
C:\Users\seu-nome
```

`pwd` significa **Print Working Directory**.

## O que tem aqui dentro?

Para listar arquivos e pastas do diretório atual:

```powershell
ls
```

A saída mostra um por linha, com data, tamanho e nome. Pastas aparecem com
`d` na coluna `Mode` (de "directory").

`ls` é alias de `Get-ChildItem`. No cmd antigo era `dir`. PowerShell aceita
todos os três.

## Como ando entre pastas?

`cd` significa **Change Directory**.

```powershell
cd Documents
```

Entra na pasta `Documents` (se ela existir dentro de onde você está agora).

Para subir um nível (voltar para a pasta pai):

```powershell
cd ..
```

Os dois pontos são literalmente o nome especial para "a pasta acima". Você
pode encadear: `cd ..\..` sobe dois níveis.

Para ir direto pra uma pasta absoluta:

```powershell
cd C:\Users\seu-nome\Documents\python
```

:::tip[Atalho do PowerShell]
Comece a digitar o nome da pasta e aperte **Tab**. O PowerShell completa o
nome sozinho. Aperte Tab de novo se houver mais de uma opção, ele vai
ciclando entre elas. Você nunca mais vai digitar nome de pasta inteiro.
:::

## Como crio uma pasta?

```powershell
mkdir trial-01
```

Cria a pasta `trial-01` no diretório atual. `mkdir` é alias de `New-Item -ItemType Directory`.

## Como crio um arquivo vazio?

```powershell
New-Item ola.py
```

Cria `ola.py` vazio na pasta atual. Pra editar depois, abra no VS Code.

:::tip[Combo VS Code]
Se você instalou VS Code marcando "Add to PATH", consegue abrir o editor
direto da pasta atual com:

```powershell
code .
```

O ponto significa "a pasta onde estou". É o atalho que mais economiza
tempo no dia-a-dia.
:::

## Como rodo um arquivo Python?

Com o terminal apontado para a pasta que tem o arquivo:

```powershell
python ola.py
```

Se o arquivo está em outra pasta, ou você passa o caminho completo, ou faz
`cd` até a pasta primeiro. Geralmente é mais simples fazer `cd` antes.

## Como limpo a tela?

Quando o terminal fica cheio de coisa antiga e você quer começar limpo:

```powershell
cls
```

Ou `Clear-Host`, mesma coisa.

## Como cancelo um programa que travou?

Aperte **Ctrl + C**. Funciona no PowerShell, no cmd e no terminal do VS Code.
Funciona também pra interromper o REPL do Python travado, ou um programa que
entrou em loop infinito.

Se Ctrl + C não funcionar (raro), feche a janela e abra de novo.

## Como vejo comandos anteriores?

Use as setas **↑ ↓** do teclado. O PowerShell guarda histórico de tudo que
você digitou. Setinha pra cima volta pro último comando, e assim por diante.

Útil quando você roda o mesmo `python ola.py` mil vezes editando o arquivo
no meio. Em vez de digitar de novo, seta pra cima e Enter.

## Tabela de referência rápida

Cole isso num bloco de notas e tenha à mão:

| Comando | O que faz |
|---|---|
| `pwd` | Mostra a pasta atual |
| `ls` | Lista o que tem na pasta atual |
| `cd nome` | Entra na pasta `nome` |
| `cd ..` | Volta uma pasta |
| `mkdir nome` | Cria pasta `nome` |
| `New-Item nome.py` | Cria arquivo `nome.py` |
| `python nome.py` | Roda o arquivo Python |
| `code .` | Abre VS Code na pasta atual |
| `cls` | Limpa a tela |
| `Ctrl + C` | Cancela comando que está rodando |
| `Tab` | Autocompleta nome de arquivo/pasta |
| `↑ ↓` | Navega o histórico de comandos |

## Exercícios

1. **Tour pelo computador**: abra o PowerShell. Use `pwd` pra ver onde está.
   Use `ls` pra ver o que tem. Faça `cd Documents`, depois `ls`. Volte com
   `cd ..`. Confira com `pwd` que voltou ao ponto inicial.

2. **Pasta para Trials**: navegue até `C:\Users\seu-nome\Documents`. Crie uma
   pasta chamada `python` com `mkdir python`. Entre nela. Crie outra pasta
   chamada `trial-01`. Entre nela. Confira com `pwd` que está em
   `Documents\python\trial-01`.

3. **Arquivo + execução**: ainda dentro de `trial-01`, crie `eorzea.py`. Abra
   com `code .`, escreva `print("Bem-vindo a Norvrandt")`, salve. No terminal,
   rode com `python eorzea.py`. Confira a saída.

4. **Histórico**: aperte ↑ no terminal várias vezes. Veja seus comandos
   anteriores rolando. Encontre o `python eorzea.py`, dê Enter pra rodar
   de novo sem digitar.

5. **Cancelar**: abra o REPL com `python`. Digite `import time; time.sleep(60)`
   e dê Enter. O REPL trava por 60 segundos. Aperte Ctrl + C antes desses
   60s acabarem. Você deve ver `KeyboardInterrupt` e o `>>>` voltar.

## Você concluiu

- Você sabe navegar entre pastas sem o Explorer.
- Você sabe criar pastas e arquivos pelo terminal.
- Você sabe rodar Python pelo terminal.
- Você sabe cancelar comandos travados.

Próximo capítulo: Git e GitHub. O fim do Tomo 0. Você vai publicar seu código
na internet pela primeira vez.
