---
title: Listas e tuplas · Hotbar
description: As coleções mais usadas em Python. Listas (mutáveis, igual sua hotbar customizável) e tuplas (imutáveis, igual a ordem fixa do GCD do Monk).
---

A hotbar do FFXIV é o lugar onde você arruma suas skills antes de cada
fight. Tank, Healer, DPS: cada um tem sua hotbar, com slots numerados,
ordem que faz sentido pra rotation. Você pode arrastar skills, trocar de
posição, adicionar e remover. **Listas em Python são exatamente isso**:
uma sequência ordenada de coisas que você pode reorganizar à vontade.
**Tuplas** são parecidas, mas congeladas, igual o ciclo fixo Bootshine →
True Strike → Snap Punch que o Monk não inverte.

## Lista: criar e acessar

```python
party = ["Tank", "Healer", "DPS1", "DPS2", "DPS3", "DPS4", "DPS5", "DPS6"]
print(party)
```

Saída:

```text
['Tank', 'Healer', 'DPS1', 'DPS2', 'DPS3', 'DPS4', 'DPS5', 'DPS6']
```

Lista é **delimitada por `[]`**, com itens separados por vírgula. Pode
ter qualquer tipo dentro, e tipos diferentes na mesma lista (mas evite
misturar tipos sem motivo, fica confuso de ler).

### Acessando por índice

Cada item tem uma posição, começando em **0**:

```python
party = ["Tank", "Healer", "DPS1"]
print(party[0])   # Tank
print(party[1])   # Healer
print(party[2])   # DPS1
```

:::caution[Índice começa em zero]
Programador conta de 0. Sempre. O primeiro item da lista é `lista[0]`,
não `lista[1]`. Se quiser o último item, use `lista[-1]` (índices negativos
contam de trás pra frente).
:::

```python
party = ["Tank", "Healer", "DPS1"]
print(party[-1])  # DPS1 (último)
print(party[-2])  # Healer (penúltimo)
```

### Tamanho da lista

```python
party = ["Tank", "Healer", "DPS1", "DPS2"]
print(len(party))  # 4
```

`len()` funciona em qualquer coisa que tem tamanho: lista, string, etc.

## Modificando a lista

Listas são **mutáveis**. Você pode trocar slots, adicionar, remover.

### Trocar item

```python
hotbar = ["Fire", "Blizzard", "Thunder", "Sleep"]
hotbar[3] = "Fire III"   # Sleep virou Fire III
print(hotbar)
```

Saída:

```text
['Fire', 'Blizzard', 'Thunder', 'Fire III']
```

### Adicionar no fim: `append`

```python
hotbar = ["Fire", "Blizzard"]
hotbar.append("Thunder")
print(hotbar)
```

Saída:

```text
['Fire', 'Blizzard', 'Thunder']
```

### Adicionar numa posição específica: `insert`

```python
hotbar = ["Fire", "Thunder"]
hotbar.insert(1, "Blizzard")   # encaixa Blizzard na posição 1
print(hotbar)
```

Saída:

```text
['Fire', 'Blizzard', 'Thunder']
```

### Remover por valor: `remove`

```python
hotbar = ["Fire", "Blizzard", "Thunder"]
hotbar.remove("Blizzard")
print(hotbar)
```

Saída:

```text
['Fire', 'Thunder']
```

Remove a **primeira ocorrência**. Se o item não estiver na lista, dá
`ValueError`.

### Remover por índice: `pop`

```python
hotbar = ["Fire", "Blizzard", "Thunder"]
removida = hotbar.pop(0)   # remove e devolve o primeiro
print(removida)            # Fire
print(hotbar)              # ['Blizzard', 'Thunder']
```

Sem argumento, `pop()` remove o último.

## Slicing: pegando um pedaço

`lista[start:stop]` devolve uma nova lista com os itens do índice `start`
até `stop - 1` (igual `range`).

```python
party = ["Tank", "Healer", "DPS1", "DPS2", "DPS3", "DPS4", "DPS5", "DPS6"]

print(party[0:2])     # ['Tank', 'Healer'] (os dois primeiros)
print(party[2:])      # ['DPS1', 'DPS2', ...] (do índice 2 até o fim)
print(party[:2])      # ['Tank', 'Healer'] (do começo até índice 2)
print(party[-3:])     # os 3 últimos
print(party[::2])     # passo 2: pegando alternados
print(party[::-1])    # invertido
```

Slicing devolve uma **nova lista**. A original não é modificada.

## Iterando

Você já viu no capítulo de loops:

```python
party = ["Tank", "Healer", "DPS"]

for membro in party:
    print(f"Membro: {membro}")
```

Com índice:

```python
for posicao, membro in enumerate(party):
    print(f"{posicao}: {membro}")
```

## Verificar se um item está na lista: `in`

```python
healers = ["White Mage", "Scholar", "Astrologian", "Sage"]

if "Sage" in healers:
    print("Sage é healer.")

if "Bard" not in healers:
    print("Bard não é healer.")
```

`in` é o jeito Python de "está dentro?". Funciona em lista, tupla, string
(verifica substring), dicionário (verifica chave), etc.

## Métodos úteis de lista

| Método | O que faz |
|---|---|
| `append(x)` | Adiciona x no fim |
| `insert(i, x)` | Insere x no índice i |
| `remove(x)` | Remove a primeira ocorrência de x |
| `pop()` ou `pop(i)` | Remove e retorna o último (ou índice i) |
| `sort()` | Ordena a lista no lugar (alfabética/numérica) |
| `reverse()` | Inverte a lista no lugar |
| `count(x)` | Quantas vezes x aparece |
| `index(x)` | Índice da primeira ocorrência de x |
| `clear()` | Esvazia a lista |
| `copy()` | Devolve uma cópia rasa |

```python
levels = [50, 90, 70, 80, 60]
levels.sort()
print(levels)   # [50, 60, 70, 80, 90]

levels.reverse()
print(levels)   # [90, 80, 70, 60, 50]

print(levels.index(70))  # 2
print(levels.count(80))  # 1
```

:::tip[`sort` muda a lista, `sorted` cria nova]
- `lista.sort()` ordena a própria lista. Não devolve nada útil.
- `sorted(lista)` devolve uma NOVA lista ordenada, deixando a original
  intacta.

```python
party = ["Tank", "Healer", "Bard"]
party.sort()             # party agora é ['Bard', 'Healer', 'Tank']
nova = sorted(party)     # cria outra ordenada, sem mudar party
```
:::

## Listas dentro de listas

Você pode aninhar:

```python
parties = [
    ["Tank", "Healer", "DPS"],
    ["Tank", "Healer", "DPS"],
    ["Tank", "Healer", "DPS"],
]

print(parties[0])         # ['Tank', 'Healer', 'DPS']
print(parties[1][0])      # 'Tank' (primeira coisa da segunda lista)
```

Útil pra grids, alianças, qualquer coisa 2D.

## Tupla: a hotbar congelada

Tupla é parecida com lista, mas **imutável**. Depois que cria, você não
pode mexer.

```python
combo_monk = ("Bootshine", "True Strike", "Snap Punch")
print(combo_monk[0])   # Bootshine

combo_monk[0] = "Demolish"   # TypeError: 'tuple' object does not support item assignment
```

Sintaxe: `()` em vez de `[]`. Mas o que define tupla mesmo são as
**vírgulas**:

```python
ponto = (10, 20)        # tupla
ponto = 10, 20          # também tupla (parênteses são opcionais!)
um_so = (5,)            # tupla com um item (precisa da vírgula!)
um_so = (5)             # NÃO é tupla, é só o número 5 entre parênteses
```

### Quando usar tupla em vez de lista

- **Quando os itens não devem mudar**. Ex: coordenadas `(x, y)`, nome
  completo `(primeiro, sobrenome)`, dia/mes/ano.
- **Como chave de dicionário**. Lista não pode, tupla pode (próximo
  capítulo).
- **Para comunicar intenção**. Quem lê código vê tupla e sabe "isso é
  fixo, não posso mexer". Lista vê e sabe "pode crescer".
- **Performance** em casos específicos (Python otimiza tuplas), mas isso
  raramente importa em projetos pequenos.

### Desempacotamento (unpacking)

Você pode "desempacotar" uma tupla em variáveis:

```python
ponto = (10, 20)
x, y = ponto
print(x)   # 10
print(y)   # 20

# Funciona com lista também:
party = ["Tank", "Healer", "DPS"]
tank, healer, dps = party
print(tank)   # Tank
```

O número de variáveis tem que bater com o tamanho. Senão erro.

Esse padrão aparece muito em loops:

```python
roulettes = [("Leveling", 100), ("Trials", 60), ("Expert", 100)]

for nome, tomestones in roulettes:
    print(f"{nome}: {tomestones}")
```

## Exercícios

1. **Hotbar inicial**: crie `01-hotbar.py` com uma lista de 10 strings
   representando uma hotbar de Monk lvl 90 (pode inventar/aproximar:
   "Bootshine", "True Strike", "Snap Punch", "Dragon Kick", "Twin Snakes",
   "Demolish", "Form Shift", "Riddle of Fire", "Brotherhood", "Perfect Balance").
   Imprima a hotbar com `enumerate` mostrando slot e nome.

2. **Substituir skill**: pegue o `01-hotbar.py`. Substitua a skill do slot
   2 por "Six-Sided Star". Imprima de novo.

3. **Adicionar e remover**: continue. Adicione "Riddle of Wind" no fim,
   e remova "Form Shift". Imprima a hotbar resultante.

4. **Top 3 healers**: crie `04-top-healers.py` com a lista
   `healers = ["White Mage", "Scholar", "Astrologian", "Sage"]`. Imprima
   só os 3 primeiros usando slicing.

5. **Inverter party**: crie `05-inverter.py` com uma lista de 8 jogadores
   `["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8"]`. Inverta a ordem
   (com `[::-1]` ou `.reverse()`) e imprima.

6. **Achar Y'shtola**: crie `06-find.py` com
   `scions = ["Alphinaud", "Alisaie", "Y'shtola", "Urianger", "Thancred"]`.
   Use `if "Y'shtola" in scions` para confirmar que ela está. Use
   `scions.index("Y'shtola")` pra mostrar a posição.

7. **Tupla de coordenadas**: crie `07-coordenadas.py` com
   `aetherytes = [("Limsa Lominsa", 9, 11), ("Gridania", 11, 12), ("Ul'dah", 12, 12)]`.
   Use desempacotamento no for: `for nome, x, y in aetherytes`. Imprima
   cada um no formato `Nome (x, y)`.

8. **Imutável de propósito**: crie `08-imutavel.py`. Crie uma tupla
   `roles = ("Tank", "Healer", "DPS")`. Tente trocar um item. Capture o
   erro mentalmente, comente o porquê. Reescreva como lista e mostre que
   nessa versão dá pra mudar.

## Você concluiu

- Você cria listas com `[]` e tuplas com `()`.
- Você acessa por índice (incluindo negativos) e por slice.
- Você usa `append`, `insert`, `remove`, `pop`, `sort` em lista.
- Você sabe quando preferir tupla (imutável) sobre lista (mutável).
- Você desempacota tuplas e listas em variáveis.

Próximo capítulo: **Dicionários · Hunting Log**. Você vai aprender a estrutura
chave-valor: igual o Hunting Log que pra cada monstro guarda nome, level,
zona e drops.
