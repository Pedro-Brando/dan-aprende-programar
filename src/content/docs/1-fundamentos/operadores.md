---
title: Operadores · Combo system
description: Operadores aritméticos, de comparação e lógicos. As ferramentas que encadeiam valores em expressões, igual o combo do Monk encadeia Bootshine, True Strike e Snap Punch.
---

O Monk em FFXIV é a job mais combo-dependente do jogo. Cada habilidade
prepara a próxima. Bootshine combina com True Strike, que combina com
Snap Punch, que devolve o ciclo. Sair da ordem reseta tudo. **Operadores
em Python são o seu combo system**: símbolos pequenos que encadeiam valores
em expressões, e cada um tem o seu jeito de combinar com os outros.

## Aritméticos

A primeira família. Os que fazem matemática.

| Operador | O que faz | Exemplo | Resultado |
|---|---|---|---|
| `+` | Soma | `5 + 3` | `8` |
| `-` | Subtração | `5 - 3` | `2` |
| `*` | Multiplicação | `5 * 3` | `15` |
| `/` | Divisão (sempre float) | `10 / 3` | `3.333...` |
| `//` | Divisão inteira (corta) | `10 // 3` | `3` |
| `%` | Resto da divisão | `10 % 3` | `1` |
| `**` | Potência | `2 ** 10` | `1024` |

```python
hp_max = 9000
buff = 1.5
hp_buffed = hp_max * buff      # 13500.0

dano_recebido = 1234
hp_atual = hp_max - dano_recebido  # 7766

party_size = 8
gil_total = 80000
gil_por_pessoa = gil_total // party_size  # 10000 (divisão inteira)
```

### `/` versus `//`

Vale memorizar a diferença:

- `/` (uma barra) sempre devolve `float`, mesmo se o resultado for inteiro
  exato: `8 / 2` é `4.0`.
- `//` (duas barras) devolve `int` se os dois lados forem int. É a "divisão
  com chão": joga fora o que sobra.

Use `//` quando quiser um inteiro garantido. Útil pra coisas tipo "quantas
runs de Praetorium dá pra fazer com X tempo".

### `%` (resto, módulo)

Devolve o que sobra de uma divisão. Parece esotérico, mas é absurdamente útil:

```python
nivel = 47
print(nivel % 10)  # 7
```

Útil pra checar se um número é par ou ímpar:

```python
8 % 2   # 0 (par)
9 % 2   # 1 (ímpar)
```

Ou pra "a cada N vezes faça algo":

```python
contador = 50
if contador % 10 == 0:
    print("Marco redondo!")
```

## De comparação

Devolvem sempre `bool` (`True` ou `False`).

| Operador | Pergunta | Exemplo |
|---|---|---|
| `==` | é igual a? | `hp == 0` |
| `!=` | é diferente de? | `job != "Tank"` |
| `<` | é menor que? | `hp < 1000` |
| `>` | é maior que? | `nivel > 50` |
| `<=` | é menor ou igual? | `gil <= 100` |
| `>=` | é maior ou igual? | `dps >= 8000` |

:::caution[Cuidado com `=` e `==`]
- `=` é **atribuição**: "guarda o valor à direita no nome à esquerda".
- `==` é **comparação**: "isso é igual a aquilo?".

Trocar um pelo outro é o erro mais comum de iniciante. Quando estiver
escrevendo `if`, sempre `==`.
:::

```python
hp = 5000
hp_max = 9000

print(hp == hp_max)   # False
print(hp < hp_max)    # True
print(hp != 0)        # True

job = "Paladin"
print(job == "Paladin")  # True
print(job != "Tank")     # True ("Paladin" não é literal "Tank")
```

Strings comparam como ordem alfabética (técnica: ordem do código Unicode
de cada caractere):

```python
print("Alphinaud" < "Alisaie")   # False (porque "p" > "l")
print("a" < "b")                  # True
```

## Lógicos

Combinam booleanos em expressões maiores. Três operadores:

| Operador | Significa | Quando é `True` |
|---|---|---|
| `and` | E | Quando os dois lados são `True` |
| `or` | OU | Quando pelo menos um lado é `True` |
| `not` | NÃO | Quando o que vem depois é `False` |

```python
em_combate = True
hp_baixo = True

precisa_curar = em_combate and hp_baixo   # True
fora_de_combate = not em_combate          # False

esta_em_dungeon = False
esta_em_raid = True
esta_em_grupo = esta_em_dungeon or esta_em_raid   # True
```

### Tabela rápida

```python
True  and True   # True
True  and False  # False
False and True   # False
False and False  # False

True  or True    # True
True  or False   # True
False or True    # True
False or False   # False

not True         # False
not False        # True
```

## Precedência (e por que parênteses são amigos)

Igual a matemática, alguns operadores têm prioridade sobre outros. Python
calcula nesta ordem (do mais alto pro mais baixo):

1. `**` (potência)
2. `*`, `/`, `//`, `%`
3. `+`, `-`
4. `<`, `>`, `<=`, `>=`, `==`, `!=`
5. `not`
6. `and`
7. `or`

Na dúvida, **use parênteses**. Eles deixam a intenção clara e nunca
custam performance.

```python
# Sem parênteses, ordem padrão funciona, mas é menos legível:
total = 100 + 50 * 2  # 200 (multiplicação primeiro)

# Com parênteses, intenção explícita:
total = 100 + (50 * 2)  # 200, idêntico, mas mais óbvio

# Forçar a soma primeiro:
total = (100 + 50) * 2  # 300
```

## Atribuição composta

Os operadores `+=`, `-=`, `*=`, `/=`, `//=`, `%=`, `**=` são atalhos para
"atualiza esta variável aplicando esta operação".

```python
hp = 9000
hp -= 1500     # hp = hp - 1500 → 7500
print(hp)

gil = 0
gil += 5000    # gil = gil + 5000 → 5000
gil += 12000   # 17000
print(gil)

contador = 1
contador *= 2  # 2
contador *= 2  # 4
contador *= 2  # 8
```

Usar `+=` em loop é o jeito padrão de "ir somando" coisas. Você vai ver
muito.

## Encadear comparações

Python aceita uma sintaxe que outras linguagens não aceitam: comparações
encadeadas.

```python
nivel = 47

if 30 <= nivel <= 50:
    print("Está na faixa de Heavensward")
```

Lê literalmente: "se 30 é menor ou igual a nivel, e nivel é menor ou igual
a 50". Mais limpo que `if nivel >= 30 and nivel <= 50`.

## Exercícios

1. **Calculadora básica**: crie `01-calc.py` que define `a = 27` e `b = 4`,
   imprime os resultados de `a + b`, `a - b`, `a * b`, `a / b`, `a // b`,
   `a % b`, `a ** b`. Confira manualmente.

2. **Buff de tank**: crie `02-tank.py`. Tank tem `hp_base = 60000` e usa um
   skill que aumenta HP em 30%. Calcule `hp_buffed`. Depois, recebe uma
   tankbuster que tira `hp_buffed - 8000`. Imprima `hp_apos_dano` e o
   `hp_percent` resultante.

3. **GCD timer**: crie `03-gcd.py`. Em FFXIV o GCD base é 2.5 segundos.
   Calcule quantas habilidades dá pra usar em uma janela de 60 segundos
   (use `//`). Imprima a resposta no formato `Em 60 segundos cabem N
   habilidades GCD`.

4. **É membro da party?**: crie `04-party.py` com:

   ```python
   tem_tank = True
   tem_healer = True
   dps_count = 6
   ```

   Calcule e imprima `party_completa` que é `True` se: tem tank, tem
   healer, e tem exatamente 6 DPS. (Use `and` e `==`.)

5. **Pegadinha do encadeamento**: rode mentalmente cada uma destas e anote
   sua previsão. Depois confira no REPL:
   - `5 + 3 * 2`
   - `(5 + 3) * 2`
   - `10 // 3 + 1`
   - `10 / 3 - 1`
   - `2 ** 3 ** 2`  (essa é a pegadinha real)
   - `True and False or True`

6. **Atribuição composta**: crie `06-counter.py` que começa com `gil = 0`,
   e simula sete ações: ganhou 5000, gastou 200, ganhou 1500, gastou 80%
   (use `*= 0.2` que sobra 20%, ou `-= gil * 0.8`), ganhou 10000, gastou
   3333, gastou 1. Imprima `gil` ao fim. Confira no papel se bate.

## Você concluiu

- Você usa todos os operadores aritméticos, incluindo o `%` (resto).
- Você diferencia `=` (atribuição) de `==` (comparação).
- Você combina condições com `and`, `or`, `not`.
- Você usa parênteses pra evitar ambiguidade de precedência.
- Você sabe encadear comparações no estilo `if 30 <= nivel <= 50`.

Próximo capítulo: **Entrada e saída · Chat channels**. Hora do programa
começar a falar com o usuário, não só com você. `input()` é o `/tell` que
o jogo te manda, e `print` formatado é o seu `/yell` pro mundo.
