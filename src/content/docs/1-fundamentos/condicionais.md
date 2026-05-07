---
title: Condicionais · Duty Roulette
description: if, elif e else. Como o programa toma decisões e segue caminhos diferentes dependendo do contexto, igual o Duty Finder escolhe seu destino conforme o role e o nível.
---

Você abre o Duty Finder, escolhe role: Tank, Healer ou DPS. Aperta entrar.
O sistema olha pro seu nível, role escolhido, expansão liberada, e escolhe
em qual duty você cai. Se você for tank lvl 50+ pode cair em Praetorium.
Se for healer lvl 80+, em Eden Savage. Se nada combinar, fica esperando.
**Condicionais em Python são o mesmo motor de decisão**: o código olha pra
um valor, compara, e escolhe qual caminho seguir.

## A estrutura `if`

A forma mais simples:

```python
hp = 1500

if hp < 3000:
    print("ATENÇÃO: HP crítico!")
    print("Cura imediatamente!")
```

Tudo que está **indentado** depois do `if` só executa se a condição for
verdadeira. Se `hp` for, digamos, `8000`, nada do bloco roda.

Três coisas pra notar:

1. A linha do `if` termina com **dois pontos** (`:`). Sem isso, erro.
2. As linhas dentro do bloco são **indentadas com 4 espaços** (o VS Code
   faz isso sozinho quando você aperta Enter depois dos dois pontos).
3. A condição é qualquer expressão que devolve `bool` (ou que possa ser
   convertida pra bool).

## Indentação importa em Python (de verdade)

Outras linguagens delimitam blocos com chaves `{}`. Python usa só
indentação. **Misturar tabs com espaços, ou ter linhas com indentação
diferente, quebra**:

```python
hp = 1500

if hp < 3000:
    print("Crítico!")
   print("Cura!")  # 3 espaços em vez de 4 → erro
```

Erro:

```text
IndentationError: unindent does not match any outer indentation level
```

Padrão Python: **sempre 4 espaços**. O VS Code faz isso pra você.

## `else`: o caminho alternativo

Se a condição for falsa, você pode rodar outro bloco com `else`:

```python
hp = 8000

if hp < 3000:
    print("Crítico, precisa de cura!")
else:
    print("Tudo certo, segue na rotation.")
```

Saída:

```text
Tudo certo, segue na rotation.
```

`else` não tem condição. É "se nada do que veio antes deu, faz isso".

## `elif`: vários caminhos

Pra mais de duas opções, use `elif` (junção de "else if"). Pode ter quantos
quiser.

```python
hp_percent = 45

if hp_percent < 25:
    print("EMERGÊNCIA: Benediction!")
elif hp_percent < 50:
    print("Cure III, full party")
elif hp_percent < 75:
    print("Cure II, manutenção")
else:
    print("Tudo bem, segue DPS")
```

Saída:

```text
Cure III, full party
```

Python avalia de cima pra baixo. **Pega o primeiro que for verdadeiro e
para**. Os outros nem são checados.

Por isso a ordem importa. Se você inverter:

```python
if hp_percent < 75:
    print("Cure II, manutenção")
elif hp_percent < 50:
    print("Cure III, full party")
```

Com `hp_percent = 45`, o primeiro `if` (`< 75`) já é `True`, então roda
Cure II e nem chega no Cure III. Bug.

**Regra prática**: nas comparações encadeadas, comece da condição mais
restritiva e vá afrouxando.

## Condições compostas com `and`, `or`, `not`

Você pode combinar condições:

```python
em_combate = True
hp_baixo = True
tem_swiftcast = False

if em_combate and hp_baixo and not tem_swiftcast:
    print("Cura instantânea: Benediction")
```

Lê: "se está em combate, e o HP está baixo, e não tem swiftcast".

```python
job = "White Mage"

if job == "White Mage" or job == "Scholar" or job == "Astrologian" or job == "Sage":
    print("É healer.")
```

Funciona, mas tem uma forma mais elegante (você vai ver no capítulo de
Listas):

```python
if job in ["White Mage", "Scholar", "Astrologian", "Sage"]:
    print("É healer.")
```

`in` checa se um valor está dentro de uma lista. Vamos pegar mais a fundo
no capítulo certo.

## `if` aninhado

Você pode colocar `if` dentro de `if`:

```python
em_combate = True
hp_percent = 45

if em_combate:
    print("Em combate.")
    if hp_percent < 50:
        print("HP baixo. Curar.")
    else:
        print("HP estável. DPS.")
else:
    print("Fora de combate. Pode descansar.")
```

Funciona, mas aninhar muito vira "código piramidal" e fica difícil de ler.
Quando perceber que está com 3+ níveis de aninhamento, pense em:

1. Combinar condições com `and`.
2. Usar early return (você vai ver em funções).
3. Usar `elif` em vez de aninhar.

## Operador ternário (if numa linha)

Para atribuir um valor com base numa condição, Python tem uma sintaxe
compacta:

```python
hp = 5000
status = "vivo" if hp > 0 else "morto"
print(status)
```

Lê: "status recebe 'vivo' se hp > 0, caso contrário 'morto'".

É a mesma coisa que:

```python
if hp > 0:
    status = "vivo"
else:
    status = "morto"
```

Use o ternário quando for **uma única atribuição simples**. Se a lógica é
mais complexa, prefira o `if`/`else` tradicional pra não esconder
complexidade numa linha só.

## "Truthy" e "falsy"

Toda expressão Python pode ser usada como condição. Se não for `bool`,
Python decide. Os valores que viram `False`:

- `False`
- `0`
- `0.0`
- `""` (string vazia)
- `[]`, `()`, `{}` (coleções vazias, vamos ver)
- `None`

Tudo o resto vira `True`. Isso permite escrever:

```python
nome = input("Nome: ")
if nome:
    print(f"Olá, {nome}")
else:
    print("Você precisa digitar um nome.")
```

Se o usuário só apertar Enter, `nome` vira `""` (string vazia), que é
falsy, e cai no `else`. Mais limpo que `if nome != "":`.

## Pegadinhas comuns

### Trocar `=` por `==`

```python
hp = 5000
if hp = 5000:    # SyntaxError
    print("oi")
```

Em condicional, use sempre `==`. Use `=` só em atribuição.

### Comparar string com número

```python
nivel_texto = input("Nível: ")
if nivel_texto > 50:    # TypeError, comparing str and int
    print("Veterano")
```

`input()` devolve string, e Python não compara string com número
diretamente. Converta antes:

```python
nivel = int(input("Nível: "))
if nivel > 50:
    print("Veterano")
```

### Esquecer `:`

```python
if hp < 1000
    print("crítico")    # SyntaxError
```

Toda linha que abre bloco em Python termina com `:`. Vale para `if`, `elif`,
`else`, `for`, `while`, `def`, `class`, `try`, `except`, etc. Decora.

## Exercícios

1. **Status do HP**: crie `01-status.py` que lê `hp_percent` (int de 0 a 100)
   e imprime:
   - `< 25`: "Crítico"
   - `25-50`: "Baixo"
   - `50-75`: "Médio"
   - `> 75`: "Alto"

2. **Categorizar level**: crie `02-faixa.py` que pede o nível e diz a
   expansão correspondente:
   - 1-50: "A Realm Reborn"
   - 51-60: "Heavensward"
   - 61-70: "Stormblood"
   - 71-80: "Shadowbringers"
   - 81-90: "Endwalker"
   - 91+: "Dawntrail (que segundo Endwalker, não existe)"

3. **Role check**: crie `03-role.py` que pede o nome do job e responde se
   é Tank, Healer ou DPS. Listas de jobs:
   - Tanks: Paladin, Warrior, Dark Knight, Gunbreaker
   - Healers: White Mage, Scholar, Astrologian, Sage
   - Resto: DPS

   Use `if job in [...]`.

4. **Tankbuster check**: crie `04-tankbuster.py` que recebe `hp_atual` e
   `dano_recebido`. Se `dano_recebido >= hp_atual`, imprime "MORREU, raise
   imediato". Caso contrário, imprime `f"Sobreviveu com {hp_atual - dano_recebido} HP"`.

5. **Para roulette**: crie `05-roulette.py` que pede o role e o nível, e
   decide qual roulette o jogador pode fazer:
   - Level 50+ e Tank: "Praetorium"
   - Level 80+ e qualquer role: "Trial Roulette atual"
   - Level 50+ e Healer/DPS: "Crystal Tower"
   - Level abaixo de 50: "Leveling roulette"

6. **Truthy quiz**: crie `06-truthy.py` que checa cada um destes valores
   e imprime se é truthy ou falsy:
   - `0`
   - `1`
   - `-1`
   - `""`
   - `"False"`
   - `[]`
   - `[0]`
   - `None`
   - `True`

   Use `if x: print("truthy")` para cada.

## Você concluiu

- Você sabe escrever `if`, `elif`, `else` com indentação correta.
- Você combina condições com `and`, `or`, `not`.
- Você reconhece truthy e falsy values.
- Você sabe quando usar o ternário (e quando não usar).
- Você decora as três pegadinhas mais comuns (`=` vs `==`, tipo da
  comparação, esquecer o `:`).

Próximo capítulo: **Loops · Daily reset**. Hora do código repetir tarefas
sem precisar de copiar e colar. Daily roulette e weekly tomestone cap
existem porque computador também precisa saber repetir.
