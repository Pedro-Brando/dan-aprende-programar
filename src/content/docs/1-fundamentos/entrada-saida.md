---
title: Entrada e saída · Chat channels
description: Pedir informação ao usuário com input(), formatar texto com f-strings, e dominar print() pra fazer o programa falar como gente.
---

Em Eorzea, todo aventureiro aprende cedo a usar os canais de chat: `/say`
para quem está perto, `/yell` para chamar atenção da zona inteira, `/tell`
para conversar privado com uma pessoa, `/party` para coordenar com seu
grupo. Cada canal tem o seu jeito. Em Python, `input()` e `print()` são os
seus canais de chat: o programa **escuta** o jogador com `input()` e
**fala** com ele com `print()`.

## `input()` é o `/tell` que vem do jogador

A função `input()` pausa o programa, espera o usuário digitar alguma coisa
e apertar Enter, e devolve o que foi digitado.

```python
nome = input("Qual o nome do seu personagem? ")
print("Bem-vindo a Eorzea,", nome)
```

Saída (com o usuário digitando "Y'shtola" e Enter):

```text
Qual o nome do seu personagem? Y'shtola
Bem-vindo a Eorzea, Y'shtola
```

A string que você passa pro `input()` é o **prompt**, mostrado pro usuário
antes do cursor. Sempre coloque um espaço no fim do prompt, fica mais
legível.

## `input()` SEMPRE devolve string

Lembra do capítulo de tipos? Tudo que vem de `input()` é `str`, mesmo se
o usuário digitar números. Se você precisar do número, **converte
explicitamente**:

```python
idade_texto = input("Quantos anos seu personagem tem? ")
idade = int(idade_texto)

idade_em_dez_anos = idade + 10
print("Daqui a 10 anos ele terá", idade_em_dez_anos, "anos")
```

Sem o `int(...)`, o `idade + 10` quebra com `TypeError`. É um dos erros
mais comuns que aparecem no começo. Se o programa quebrar dizendo
"can only concatenate str", investigue se você esqueceu o cast.

Forma mais compacta (cast direto):

```python
idade = int(input("Idade do personagem: "))
```

Funciona, mas se o usuário digitar "vinte" em vez de "20", o `int()` quebra
e o programa morre. Vamos tratar isso no capítulo de erros e exceções.

## `print` por trás dos panos

Você já viu `print` mostrando texto. Tem alguns ajustes úteis.

### Vários valores numa só chamada

```python
nome = "Dan"
nivel = 47
job = "Paladin"

print("Personagem:", nome, "| Nível:", nivel, "| Job:", job)
```

Saída:

```text
Personagem: Dan | Nível: 47 | Job: Paladin
```

Cada vírgula vira um espaço. Útil pra montar linhas rapidinho.

### Argumento `sep`

Você pode trocar o separador padrão (espaço) por qualquer coisa:

```python
print("Limsa", "Gridania", "Ul'dah", sep=" ~ ")
```

Saída:

```text
Limsa ~ Gridania ~ Ul'dah
```

### Argumento `end`

Por padrão, `print` termina com uma quebra de linha (`\n`). Se você quer
juntar várias chamadas na mesma linha, troque o `end`:

```python
print("Carregando", end="")
print(".", end="")
print(".", end="")
print(".")
```

Saída:

```text
Carregando...
```

## f-strings: o jeito moderno de formatar texto

A maneira atual e mais limpa de juntar variáveis com texto em Python é a
**f-string** ("formatted string literal"). Você prefixa a string com `f` e
coloca variáveis entre chaves `{}`:

```python
nome = "Dan"
nivel = 47
job = "Paladin"

print(f"Personagem: {nome} | Nível: {nivel} | Job: {job}")
```

Saída:

```text
Personagem: Dan | Nível: 47 | Job: Paladin
```

f-string é o seu padrão pra qualquer print que combine texto fixo com
variáveis. Esquece concatenação com `+`, esquece `format()` antigo.
**f-string é o jeito.**

### Expressões dentro da chave

Você pode colocar qualquer expressão Python dentro da chave, não só
variáveis simples:

```python
hp = 5500
hp_max = 9000
print(f"HP: {hp} / {hp_max} ({hp / hp_max * 100:.1f}%)")
```

Saída:

```text
HP: 5500 / 9000 (61.1%)
```

O `:.1f` é uma instrução de formato: "uma casa decimal, formato float".
Outros formatos comuns:

- `:.0f` zero casas decimais
- `:.2f` duas casas decimais
- `:,` separa milhares com vírgula: `f"{1000000:,}"` vira `1,000,000`
- `:>10` alinhamento à direita com largura 10
- `:<10` alinhamento à esquerda

```python
gil = 1234567
print(f"Gil: {gil:,}")        # Gil: 1,234,567
print(f"HP percent: {0.6111:.1%}")  # HP percent: 61.1%
```

### Aspas dentro de f-string

A regra das aspas se mantém: se a string usa `"`, dentro das chaves use `'`
(ou ao contrário).

```python
nome = "Y'shtola"
print(f"O nome é '{nome}'")
```

## Caracteres especiais

Algumas sequências têm significado dentro de strings:

| Sequência | Significa |
|---|---|
| `\n` | Quebra de linha |
| `\t` | Tab |
| `\\` | Uma barra invertida literal |
| `\"` | Aspa dupla literal (quando a string já usa `"`) |
| `\'` | Aspa simples literal (quando a string já usa `'`) |

```python
print("Linha 1\nLinha 2\nLinha 3")
```

Saída:

```text
Linha 1
Linha 2
Linha 3
```

```python
print("Coluna1\tColuna2\tColuna3")
```

Saída:

```text
Coluna1 Coluna2 Coluna3
```

## Strings de várias linhas

Para textos com várias linhas naturais, use **aspas triplas**:

```python
abertura = """
Bem-vindo, aventureiro.
A jornada começa hoje.
Que Hydaelyn te guie.
"""
print(abertura)
```

Saída:

```text

Bem-vindo, aventureiro.
A jornada começa hoje.
Que Hydaelyn te guie.

```

(Note as linhas em branco no começo e fim, porque há um Enter logo após
`"""` e antes do `"""` final.)

## Misturando tudo: programa interativo

Junta o que aprendeu até aqui:

```python
print("=" * 40)
print("FICHA DE PERSONAGEM (Adventurers' Guild)")
print("=" * 40)

nome = input("Nome: ")
raca = input("Raça (Hyur/Elezen/Lalafell/Roegadyn/Miqo'te/Au Ra/Hrothgar/Viera): ")
nivel_texto = input("Nível: ")
nivel = int(nivel_texto)

print()
print(f"Personagem registrado:")
print(f"  Nome:  {nome}")
print(f"  Raça:  {raca}")
print(f"  Nível: {nivel}")
print(f"  Faixa: {'iniciante' if nivel < 50 else 'veterano'}")
print()
print("Que sua jornada traga aether prosperity.")
```

(Aquele `if-else` numa linha só você vai entender melhor no próximo
capítulo. Por ora, o resultado é "iniciante" se nivel < 50, senão
"veterano".)

## Exercícios

1. **Ficha interativa**: crie `01-ficha.py`. Pergunte o nome, raça, job e
   nível do personagem. Imprima uma ficha bonita usando f-strings, alinhada,
   com cabeçalho separador (use `"=" * 30`).

2. **Aetheryte teleport**: crie `02-teleport.py`. Pergunte o gil atual e o
   custo do teleport. Calcule o gil restante. Imprima:
   `"Você tem X gil. Após o teleport, restam Y gil."`

3. **HP com porcentagem**: crie `03-hp.py`. Pergunte HP atual e HP máximo
   (converta pra int). Imprima `"HP: 5500 / 9000 (61.1%)"` calculando
   sozinho. Use `:.1f` no formato.

4. **Calculadora de tomestones**: crie `04-tomestones.py`. Pergunte quantos
   tomestones de poetics o usuário tem (`int`). Cada peça do gear custa
   500. Imprima quantas peças ele pode comprar (use `//`) e quantos
   tomestones sobram (use `%`).

5. **Yell box**: crie `05-yell.py` que pergunta uma mensagem e imprime ela
   dentro de uma caixa, tipo:

   ```text
   ###########################
   # NÃO PISA NA AOE         #
   ###########################
   ```

   Dica: use `"#" * largura` pras bordas, e f-string com alinhamento
   pra centralizar/alinhar a mensagem.

6. **Multilinha**: crie `06-canto.py` com uma string de aspas triplas que
   contém um pequeno poema/lore sobre Hydaelyn. Imprima.

## Você concluiu

- Você usa `input()` pra ler do usuário e lembra que volta sempre `str`.
- Você converte para `int` ou `float` quando precisa.
- Você usa f-string com expressões e formatos numéricos.
- Você conhece `\n`, `\t` e strings de aspas triplas.
- Você consegue escrever programas interativos pequenos.

Próximo capítulo: **Condicionais · Duty Roulette**. O programa vai começar
a tomar decisões. Igual o Duty Finder pergunta seu role e te joga numa
duty diferente, `if`/`elif`/`else` desviam o fluxo do código.
