---
title: Loops · Daily reset
description: for e while. Como repetir ações sem copiar e colar código mil vezes. O daily roulette do Python.
---

Toda quarta-feira às 4h, FFXIV reseta os daily roulettes. Você pode rodar
Praetorium de novo, ganhar de novo as 90 tomestones de poetics, e farmar
de novo até preencher seu cap semanal. **Loops em Python são esse mesmo
mecanismo de repetição**: você define a tarefa uma vez, e o código repete
até o critério de parada bater. Sem isso, qualquer programa não-trivial
vira mil linhas iguais.

## `for`: quando você sabe quantas vezes

A forma mais comum. Você tem uma sequência (lista, range, string, etc.)
e quer rodar um bloco para cada item.

```python
for nome in ["Alphinaud", "Alisaie", "Y'shtola", "Urianger", "Thancred"]:
    print(f"Scion: {nome}")
```

Saída:

```text
Scion: Alphinaud
Scion: Alisaie
Scion: Y'shtola
Scion: Urianger
Scion: Thancred
```

A variável `nome` recebe um item por vez, na ordem da lista. O bloco
indentado roda uma vez por item.

## `range`: gerando uma sequência de números

Quando você quer "rodar N vezes" ou "iterar de A até B", use `range`.

```python
for i in range(5):
    print(f"Ataque {i}")
```

Saída:

```text
Ataque 0
Ataque 1
Ataque 2
Ataque 3
Ataque 4
```

`range(5)` gera os números 0, 1, 2, 3, 4. Note: **começa em 0 e termina
ANTES do número que você passa**. Esse é o jeito Python (e o jeito da
maioria das linguagens). Vai virar reflexo.

### Outras formas de `range`

```python
range(5)          # 0, 1, 2, 3, 4
range(2, 8)       # 2, 3, 4, 5, 6, 7 (de 2 a 7)
range(0, 20, 2)   # 0, 2, 4, 6, 8, 10, 12, 14, 16, 18 (passo 2)
range(10, 0, -1)  # 10, 9, 8, 7, 6, 5, 4, 3, 2, 1 (passo -1, conta regressiva)
```

Padrão: `range(start, stop, step)`. Se você passar só um número, é o stop
(start = 0, step = 1).

### Iterar sobre uma string

String também é uma sequência:

```python
for letra in "Hydaelyn":
    print(letra)
```

Saída:

```text
H
y
d
a
e
l
y
n
```

## `while`: quando você não sabe quantas vezes

Use `while` quando a parada depende de uma condição, não de quantas
iterações.

```python
hp = 9000

while hp > 0:
    dano = 1500
    hp -= dano
    print(f"HP atual: {hp}")

print("Defeated.")
```

Saída:

```text
HP atual: 7500
HP atual: 6000
HP atual: 4500
HP atual: 3000
HP atual: 1500
HP atual: 0
HP atual: -1500
Defeated.
```

A cada iteração, Python verifica a condição (`hp > 0`). Se for `True`, roda
o bloco. Se for `False`, sai.

:::caution[Loop infinito]
Se a condição NUNCA virar False, o loop nunca para. Seu terminal trava.
Aperte Ctrl + C pra interromper. Causa mais comum: você esquece de
atualizar a variável dentro do loop.

```python
hp = 9000
while hp > 0:
    print("Atacando!")
    # esqueceu o hp -= dano. Loop infinito.
```
:::

## `break`: sair antes da hora

Para parar o loop no meio, mesmo que a condição ainda seja verdadeira:

```python
for nome in ["Alphinaud", "Alisaie", "Y'shtola", "Urianger", "Thancred"]:
    if nome == "Y'shtola":
        print(f"Achei: {nome}")
        break
    print(f"Verificando {nome}...")
```

Saída:

```text
Verificando Alphinaud...
Verificando Alisaie...
Achei: Y'shtola
```

Quando achou Y'shtola, `break` saiu do loop antes de checar Urianger e
Thancred.

## `continue`: pular essa iteração

Para pular o resto da iteração atual mas continuar o loop:

```python
for i in range(10):
    if i % 2 == 0:
        continue
    print(f"Ímpar: {i}")
```

Saída:

```text
Ímpar: 1
Ímpar: 3
Ímpar: 5
Ímpar: 7
Ímpar: 9
```

Quando o número é par, `continue` pula direto pra próxima iteração,
ignorando o `print`.

## Loop com índice: `enumerate`

Quando você precisa do item E da posição:

```python
party = ["Tank", "Healer", "DPS1", "DPS2"]

for posicao, role in enumerate(party):
    print(f"Slot {posicao}: {role}")
```

Saída:

```text
Slot 0: Tank
Slot 1: Healer
Slot 2: DPS1
Slot 3: DPS2
```

Mais limpo que controlar um contador na mão. Você vai ver `enumerate`
muito.

## Loop dentro de loop

Pode aninhar:

```python
for dia in ["seg", "ter", "qua"]:
    for roulette in ["expert", "level 90", "trials"]:
        print(f"{dia}: {roulette}")
```

Saída (9 linhas, 3x3):

```text
seg: expert
seg: level 90
seg: trials
ter: expert
...
```

Use com cuidado, especialmente em conjuntos grandes (a complexidade
multiplica).

## `for...else` e `while...else`

Python tem uma curiosidade: você pode adicionar `else` num loop. Ele roda
quando o loop termina normalmente (não por `break`):

```python
for nome in ["Alphinaud", "Alisaie"]:
    if nome == "Y'shtola":
        print("Achei!")
        break
else:
    print("Y'shtola não está na lista.")
```

Útil pra "loops de busca" onde você quer fazer algo só se NÃO encontrou.
Não é super comum, mas vale conhecer pra entender código alheio.

## Combinando: programa de roulette diário

Junta tudo:

```python
roulettes = [
    ("Leveling", 60, 100),
    ("Trials", 30, 60),
    ("Alliance Raid", 30, 120),
    ("Expert", 30, 100),
]

print("Daily Roulettes:")
print("-" * 50)

total_tomestones = 0

for nome, exp_bonus, tomestones in roulettes:
    print(f"  {nome}: +{exp_bonus} EXP, +{tomestones} tomes")
    total_tomestones += tomestones

print("-" * 50)
print(f"Total tomestones do dia: {total_tomestones}")
```

Saída:

```text
Daily Roulettes:
--------------------------------------------------
  Leveling: +60 EXP, +100 tomes
  Trials: +30 EXP, +60 tomes
  Alliance Raid: +30 EXP, +120 tomes
  Expert: +30 EXP, +100 tomes
--------------------------------------------------
Total tomestones do dia: 380
```

Note o **desempacotamento** no `for nome, exp_bonus, tomestones in roulettes`:
cada item da lista é uma tupla de 3 valores, e cada valor cai numa
variável. Você verá isso de novo no capítulo de listas e tuplas.

## Exercícios

1. **Contagem regressiva**: crie `01-pull.py` que conta de 5 até 1 com
   `range`, imprimindo `"Pull em N..."` em cada iteração. No fim, imprime
   `"PULL!"`.

2. **Limit Break charge**: crie `02-limit-break.py` que simula carregar a
   limit break. Comece com `lb = 0` e use um loop while que vai somando
   25 a cada iteração. Imprime o valor a cada passo. Para quando chegar
   em 100. Use `break` se ultrapassar (não devia, mas trate por segurança).

3. **Tabuada de damage**: crie `03-tabuada.py` que recebe um número (ex:
   `1500`) e imprime a tabuada de 1 a 10:
   `1 x 1500 = 1500`, `2 x 1500 = 3000`, etc.

4. **Achar o tank**: crie `04-find-tank.py` com a lista
   `party = ["DPS1", "DPS2", "Healer", "Tank", "DPS3"]`. Use um loop que
   imprime a posição (0, 1, 2...) e o role. Quando achar o Tank, imprima
   `"Tank achado no slot N"` e use `break`.

5. **Ímpares e pares**: crie `05-impar-par.py` que itera de 1 até 20. Para
   cada número, imprime "PAR" ou "IMPAR" usando o operador `%` que você
   viu no capítulo de operadores.

6. **Tomestone farm semanal**: crie `06-farm.py` que simula 7 dias da
   semana. A cada dia, o jogador ganha 380 tomestones (resultado do
   programa do exemplo). Acumule num total. No fim da semana, imprima:
   `"Total semanal: X tomestones"`. Mas: o cap semanal é 2000. Se
   ultrapassar, trave em 2000 e imprima um aviso `"Cap atingido no dia N!"`
   (use `break`).

7. **Pyramid de aether**: crie `07-piramide.py` que imprime esta pirâmide
   de asteriscos:

   ```text
   *
   **
   ***
   ****
   *****
   ```

   Use um for com range, e dentro do print use `"*" * n`.

## Você concluiu

- Você usa `for` quando sabe a sequência ou o número de repetições.
- Você usa `while` quando a parada depende de condição.
- Você sabe `break` (sair do loop) e `continue` (pular iteração).
- Você usa `enumerate` pra ter índice junto com o item.
- Você reconhece e evita loop infinito.

Próximo capítulo: **Listas e tuplas · Hotbar**. Você vai aprender a guardar
várias coisas numa estrutura só, igual a hotbar guarda várias skills.
