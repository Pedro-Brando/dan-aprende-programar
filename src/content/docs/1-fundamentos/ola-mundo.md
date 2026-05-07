---
title: Olá, mundo · Aetheryte Attunement
description: Seu primeiro programa Python. Imprimir uma mensagem na tela e entender o ciclo "escrever, salvar, executar". Como atunar ao primeiro Aetheryte de Eorzea.
---

Aventureiro recém-chegado a uma nova cidade, a primeira coisa que você faz
é caminhar até o Aetheryte e tocar nele com a mão direita. O cristal brilha,
guarda sua localização no éter, e a partir dali você pode voltar pra ela
de qualquer lugar do mundo. **`print("Olá, mundo")`** é o seu primeiro
Aetheryte. Pequeno, parece simples, mas marca o ponto onde o seu código
deixa de ser ideia e passa a existir no mundo.

## A função `print`

Tudo em Python que precisa "fazer algo aparecer na tela" passa pela função
`print`. Você passa um valor entre os parênteses, ela mostra na saída do
terminal.

```python
print("Olá, mundo")
```

Saída:

```text
Olá, mundo
```

A coisa entre aspas é uma **string** (texto). As aspas marcam o começo e o
fim. Você pode usar aspas duplas `"..."` ou simples `'...'`, tanto faz, mas
seja consistente dentro do mesmo arquivo.

```python
print("Bem-vindo a Eorzea")
print('A Calamidade já passou')
print("Hydaelyn nos guia")
```

## REPL versus arquivo

No capítulo de instalação você abriu o REPL (com o comando `python` no
terminal) e digitou comandos um por um. O REPL é ótimo para experimentar.
Mas todo programa de verdade vive num **arquivo `.py`**, que é o que vamos
escrever daqui pra frente.

Diferença prática:

- **REPL**: você digita uma linha, o Python executa imediatamente, mostra
  o resultado. Some quando você fecha. Bom para testar.
- **Arquivo `.py`**: você escreve várias linhas, salva, e executa o conjunto
  todo com `python arquivo.py`. Persiste. Bom para qualquer programa real.

## O ciclo: escrever, salvar, executar

Toda vez que você quiser rodar um programa Python a partir de agora, é o
mesmo ritual de três passos:

1. **Escrever** o código no editor (VS Code).
2. **Salvar** com `Ctrl + S`.
3. **Executar** no terminal com `python nome-do-arquivo.py`.

Esse ciclo é o seu "1, 2, 3" da rotation. Vai virar reflexo.

### Mão na massa

Abra o VS Code numa pasta de testes (a pasta de aprendizado que você criou
no Tomo 0 serve). Crie `01-ola.py`. Escreva:

```python
print("Olá, mundo")
print("Eu sou Dan, novo aventureiro de Eorzea")
print("Hoje começa minha jornada Python")
```

Salve. No terminal integrado:

```powershell
python 01-ola.py
```

Saída:

```text
Olá, mundo
Eu sou Dan, novo aventureiro de Eorzea
Hoje começa minha jornada Python
```

## Cada `print` é uma linha nova

Por padrão, toda chamada de `print` quebra para uma linha nova ao terminar.
É como se cada `print` fosse um `/say` diferente: um por vez, em sequência.

Se você quiser várias coisas na mesma linha, passa elas separadas por vírgula:

```python
print("Olá,", "mundo")
```

Saída:

```text
Olá, mundo
```

A vírgula vira um espaço na hora de imprimir. Isso é só uma curiosidade por
ora, vamos ver isso de novo no capítulo de Entrada e saída.

## Por que "Olá, mundo"

A tradição vem de um livro de programação dos anos 70 ("The C Programming
Language"). O primeiro programa de qualquer linguagem é sempre um "Hello,
World!" porque prova que três coisas funcionam de uma vez:

1. A linguagem está instalada.
2. Você sabe escrever um arquivo na sintaxe certa.
3. O computador consegue mostrar a saída.

É o sino que o ferreiro da Lower La Noscea bate antes de aceitar o primeiro
contrato. Se o sino toca, a forja funciona.

## Erros que você vai encontrar (e o que fazer)

### Esqueci as aspas

```python
print(Olá, mundo)
```

Erro:

```text
NameError: name 'Olá' is not defined
```

O Python achou que `Olá` era uma variável (vamos ver no próximo capítulo)
que ele deveria conhecer. Não conhece, então erro. **Solução**: coloque as
aspas em volta do texto.

### Esqueci o parêntese de fechamento

```python
print("Olá, mundo"
```

Erro:

```text
SyntaxError: '(' was never closed
```

Cada `(` precisa de um `)`. Cada `[` precisa de um `]`. Cada `{` precisa
de um `}`. **Solução**: contar parênteses até casar.

### Misturei aspas

```python
print("Olá, mundo')
```

Erro:

```text
SyntaxError: unterminated string literal
```

Começou com `"` e terminou com `'`. **Solução**: use o mesmo tipo de aspa
em todo o lado da mesma string.

:::tip[Reflexo de leitura]
Quando aparecer um erro, sempre olhe para a **última linha** da mensagem.
É lá que está o tipo do erro (`NameError`, `SyntaxError`, etc.) e geralmente
uma dica do que aconteceu. As linhas acima dão contexto, mas a confissão
fica no último parágrafo.
:::

## Exercícios

1. **Apresentação**: crie `02-apresentacao.py` com três `print`. Um com seu
   nome, um com sua idade, um com o nome do seu personagem favorito de FFXIV
   (ou outro jogo, se preferir). Rode.

2. **A torre de Crystarium**: crie `03-torre.py` que imprime exatamente este
   texto, mantendo as quebras de linha:

   ```text
   Crystarium acima
   Crystal Tower abaixo
   Norvrandt entre as duas
   ```

3. **Erro consciente**: copie o `02-apresentacao.py` para `04-quebrado.py`,
   apague uma aspa de propósito, salve e rode. Leia a mensagem de erro
   inteira. Identifique a linha culpada. Conserte.

4. **Combo de prints**: crie `05-combo.py` que imprime o nome de cinco
   cidades de Eorzea, uma por linha (Limsa Lominsa, Gridania, Ul'dah,
   Ishgard, Kugane). Rode. Comite tudo no seu GitHub.

## Você concluiu

- Você sabe usar `print` para mostrar texto na tela.
- Você sabe a diferença entre REPL e arquivo `.py`.
- Você dominou o ciclo "escrever, salvar, executar".
- Você sabe identificar três erros comuns e resolver.

Próximo capítulo: **Variáveis · Inventory slot**. Você vai aprender a
guardar valores em nomes para reusar depois. O equivalente a colocar um
item no inventário e poder pegá-lo pelo nome em vez de re-conjurar do nada.
