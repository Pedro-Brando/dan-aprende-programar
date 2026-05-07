---
title: Tipos de dados · Aether types
description: Os cinco tipos básicos do Python (int, float, str, bool, None) e como o aether de cada um se comporta diferente nas magias do código.
---

Em Eorzea, o aether se manifesta em aspectos diferentes: fogo, gelo, raio,
água, vento, terra, luz, treva. Um Black Mage não pode lançar Cure porque
Cure precisa de aether de luz, e o BLM canaliza fogo. Cada feitiço tem o
seu **aspecto**. Em Python, cada valor tem o seu **tipo**. E igual ao
aether, alguns tipos não combinam direto: somar texto com número é como
tentar curar um inimigo com Fire III.

## Os cinco aspectos

Os cinco tipos básicos que você vai usar todo dia:

| Tipo | O que é | Aspecto FFXIV (analogia) |
|---|---|---|
| `int` | Número inteiro | Fogo: direto, sem decimais, alto dano |
| `float` | Número decimal | Água: flui, tem casas depois da vírgula |
| `str` | Texto (string) | Vento: palavras carregam intenção |
| `bool` | Verdadeiro ou falso | Luz/Treva: dois polos, sem meio termo |
| `None` | Ausência de valor | Vácuo aetheric: lugar sem aether |

A analogia não é perfeita, mas ajuda a lembrar que os tipos têm "naturezas"
diferentes.

## `int` (inteiros)

Números sem casas decimais. Positivos, negativos, zero.

```python
hp_maximo = 9000
nivel = 90
gil = -150  # endividado depois de comprar gear
zero = 0
```

Pode ser tão grande quanto a memória aguentar. `9999999999999999` funciona
sem reclamar.

## `float` (decimais)

Números com vírgula (em Python a vírgula é o ponto: `0.5`, não `0,5`).

```python
critical_rate = 0.234
chance_de_drop = 12.5
hp_percent = 87.6
```

`int` e `float` são números, mas o Python trata como tipos diferentes.
Se você precisa de precisão decimal, é float.

## `str` (strings)

Texto. Sempre entre aspas (simples ou duplas).

```python
nome = "Y'shtola"
cidade = "The Crystarium"
yell = 'NÃO PISA NA AOE'
```

Se o texto tem aspas dentro, use o tipo oposto pra delimitar:

```python
fala = "Aquele Lalafell disse 'me ajuda'"
```

Ou escape com `\`:

```python
fala = 'Aquele Lalafell disse \'me ajuda\''
```

## `bool` (booleano)

Só dois valores: `True` e `False` (com inicial maiúscula, sem aspas).

```python
esta_em_combate = True
tem_raise_disponivel = False
party_completa = True
```

Booleano é o resultado de qualquer comparação:

```python
hp = 5000
hp_maximo = 9000
print(hp == hp_maximo)   # False
print(hp < hp_maximo)    # True
```

Você vai usar muito em condicionais (próximos capítulos).

## `None`

O valor especial que representa "nada". Não é zero. Não é string vazia.
É a ausência de valor.

```python
ultimo_target = None
buff_atual = None
```

Útil para variáveis que ainda não foram preenchidas, ou para sinalizar
"não tem". Você vai ver muito em retornos de funções (capítulos à frente).

## Descobrindo o tipo: `type()`

A função `type()` te diz o tipo de qualquer valor.

```python
print(type(9000))           # <class 'int'>
print(type(0.5))            # <class 'float'>
print(type("Eorzea"))       # <class 'str'>
print(type(True))           # <class 'bool'>
print(type(None))           # <class 'NoneType'>
```

Útil quando você não tem certeza do que está numa variável (especialmente
depois de uma chamada `input()`, que sempre devolve `str`).

## Convertendo entre tipos (cast)

Você pode forçar a conversão de um tipo pra outro com funções do mesmo
nome do tipo:

```python
str(9000)         # "9000"
int("90")         # 90
float("0.5")      # 0.5
bool(0)           # False
bool(1)           # True
bool("qualquer")  # True (qualquer string não-vazia é True)
```

### Quando dá erro

Nem toda conversão funciona:

```python
int("Y'shtola")
```

Erro:

```text
ValueError: invalid literal for int() with base 10: "Y'shtola"
```

Faz sentido. "Y'shtola" não é um número, Python não tem como traduzir.

```python
int("90.5")
```

Erro:

```text
ValueError: invalid literal for int() with base 10: '90.5'
```

`int()` recusa decimais em formato string. Se quiser converter "90.5" pra
inteiro, faça em duas etapas:

```python
float("90.5")     # 90.5
int(float("90.5"))  # 90 (corta a parte decimal)
```

## Misturando tipos: o que pode e o que não pode

### Pode

```python
3 + 5            # 8 (int + int)
3 + 5.0          # 8.0 (int + float vira float)
"casa" + "pato"  # "casapato" (concatenação de strings)
"chao" * 3       # "chaochaochao" (string vezes int repete)
```

### Não pode

```python
"3" + 5
```

Erro:

```text
TypeError: can only concatenate str (not "int") to str
```

Python não adivinha se você quer somar (3 + 5 = 8) ou concatenar ("3" + "5"
= "35"). Você precisa decidir e converter:

```python
int("3") + 5         # 8
"3" + str(5)         # "35"
```

Esse erro vai aparecer MUITO no começo. Toda vez que você usar `input()`
e tentar somar com número, vai bater. Lembre disso.

## Por que isso importa

Porque a coisa mais comum em programa real é receber um valor (do usuário,
de um arquivo, de uma API), descobrir o tipo, converter pra algo útil, e
seguir. Quem não entende tipos passa horas tentando entender por que
`9 < "10"` dá `False` (resposta: porque `"10"` é string, não int, e a
comparação faz ordem alfabética: `"9"` vem depois de `"1"`).

## Exercícios

1. **Inventário de tipos**: crie `01-tipos.py` com pelo menos uma variável
   de cada tipo (`int`, `float`, `str`, `bool`, `None`). Use `print(type(x))`
   pra cada uma e confira que cada tipo aparece corretamente.

2. **Conversão de gil**: crie `02-conversao.py`. Você recebe a string
   `"125000"` (gil que o NPC vai pagar) e precisa somar com um bônus de
   `5000`. Converta corretamente e imprima `Total: 130000 gil`.

3. **HP em porcentagem**: crie `03-hp-percent.py`. Defina `hp_atual = 4523`
   e `hp_maximo = 9000`. Calcule e imprima `hp_percent` (precisa ser float,
   resultado por volta de 50.25). Dica: divisão de int por int em Python
   já dá float automaticamente.

4. **Os erros do bardo**: crie `04-bardo.py` que tenta fazer `"Eorzea" + 5`
   e captura o erro lendo. Conserte de duas maneiras:
   - convertendo o número pra string,
   - mudando o número pra string `"5"` direto.
   Comente explicando qual versão você escolheria em código real e por quê.

5. **Bool gymnastics**: crie `05-bool.py`. Imprima o resultado de:
   - `bool(0)`
   - `bool(1)`
   - `bool(-1)`
   - `bool("")`
   - `bool("False")`
   - `bool(None)`

   Tente prever cada um antes de rodar. Anote os que você errou. Os "falsy
   values" (que viram `False`) são uma das pegadinhas mais cobradas em
   entrevista júnior.

## Você concluiu

- Você reconhece os cinco tipos básicos: `int`, `float`, `str`, `bool`, `None`.
- Você usa `type()` pra descobrir o tipo de qualquer valor.
- Você converte entre tipos com `int()`, `float()`, `str()`, `bool()`.
- Você sabe que somar string com número quebra, e como resolver.

Próximo capítulo: **Operadores · Combo system**. Você vai aprender a
encadear ações como num combo de Monk: cada operador é uma habilidade
com uma reação específica.
