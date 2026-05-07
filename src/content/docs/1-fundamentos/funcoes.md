---
title: Funções · Macro
description: 'Empacotar lógica em blocos reutilizáveis com nome. Igual gravar um macro no FFXIV: você define a sequência uma vez e dispara ela com um botão sempre que precisar.'
---

Quem joga FFXIV mais a sério acaba criando macros: aquela sequência de
comandos que você grava numa única ação. `/ac "Cure" <t>` seguido de
`/ac "Esuna" <t>` seguido de `/p Curado <t>!` num só botão. Você define
o macro uma vez e usa quantas vezes quiser. **Função em Python é o seu
macro**: um pedaço de código com um nome, parâmetros configuráveis, e
um resultado. Você define uma vez, chama mil vezes.

## Definindo a primeira função

```python
def saudar():
    print("Olá, aventureiro!")
    print("Que sua jornada seja próspera.")

saudar()
saudar()
saudar()
```

Saída:

```text
Olá, aventureiro!
Que sua jornada seja próspera.
Olá, aventureiro!
Que sua jornada seja próspera.
Olá, aventureiro!
Que sua jornada seja próspera.
```

Estrutura:

- `def` é a palavra-chave que abre uma definição de função.
- `saudar` é o nome (regras iguais às de variável).
- Parênteses `()` são onde vão os parâmetros (vazios por enquanto).
- Dois pontos `:` no fim, igual `if` e `for`.
- Bloco indentado embaixo: o "corpo" da função.

Pra **chamar** a função, você usa o nome seguido de `()`. Sem `()` é só o
nome (o objeto função em si).

## Parâmetros: input customizável

Macro fica útil quando você pode passar valores diferentes a cada uso:

```python
def saudar(nome):
    print(f"Olá, {nome}!")

saudar("Y'shtola")
saudar("Alphinaud")
saudar("Estinien")
```

Saída:

```text
Olá, Y'shtola!
Olá, Alphinaud!
Olá, Estinien!
```

`nome` é um **parâmetro** (variável que existe só dentro da função). Quando
você chama com `saudar("Y'shtola")`, esse valor preenche o parâmetro.

## Múltiplos parâmetros

Separados por vírgula:

```python
def status_personagem(nome, nivel, job):
    print(f"{nome} (Lv. {nivel} {job})")

status_personagem("Y'shtola", 90, "Sage")
status_personagem("Alphinaud", 88, "Summoner")
```

A ordem importa: o primeiro argumento da chamada vai para o primeiro
parâmetro, e assim por diante.

## Retornar um valor: `return`

Função vira útil mesmo quando ela **devolve** alguma coisa:

```python
def soma(a, b):
    return a + b

resultado = soma(150, 200)
print(resultado)   # 350
```

`return` sai da função e devolve o valor. Quem chamou pega o valor com
`=`.

```python
def calcula_dps(dano_total, tempo_segundos):
    return dano_total / tempo_segundos

dps = calcula_dps(1500000, 200)
print(f"DPS: {dps:.0f}")
```

### Função sem `return`

Se a função não tem `return`, ela devolve `None` por padrão. As funções
de exemplo no começo (`saudar`) só fazem `print` e devolvem `None`.

```python
def saudar(nome):
    print(f"Olá, {nome}!")

resultado = saudar("Dan")
print(resultado)   # None
```

## Argumentos nomeados

Você pode passar argumentos pelo nome do parâmetro, ignorando a ordem:

```python
def status(nome, nivel, job):
    print(f"{nome} (Lv. {nivel} {job})")

status(job="Paladin", nome="Aurelia", nivel=50)
```

Bom pra clareza quando uma função tem muitos parâmetros, especialmente
booleanos.

## Valores padrão

Você pode dar um valor padrão para um parâmetro, deixando-o opcional:

```python
def cumprimento(nome, titulo="Aventureiro"):
    print(f"{titulo} {nome}")

cumprimento("Dan")              # Aventureiro Dan
cumprimento("Aurelia", "Lady")  # Lady Aurelia
```

Parâmetros com valor padrão devem vir **depois** dos sem padrão.

```python
# certo
def f(a, b=10):
    pass

# errado, dá SyntaxError
def f(a=5, b):
    pass
```

## Escopo: o que vive dentro vs fora

Variáveis criadas dentro da função existem só lá:

```python
def calcular():
    x = 10
    return x * 2

resultado = calcular()
print(resultado)   # 20
print(x)           # NameError: name 'x' is not defined
```

`x` "morre" quando a função termina. Por outro lado, a função pode **ler**
variáveis de fora:

```python
hp_maximo = 9000

def calcular_hp_buffed():
    return hp_maximo * 1.5    # lê hp_maximo de fora

print(calcular_hp_buffed())   # 13500.0
```

Mas evite isso. O ideal é passar tudo que a função precisa como
parâmetro:

```python
def calcular_hp_buffed(hp_max):
    return hp_max * 1.5

print(calcular_hp_buffed(9000))
```

Mais explícito, mais testável, mais fácil de mover pra outro lugar.

## Funções pequenas, com nome bom

Boa prática: cada função faz **uma coisa só**, e o nome diz claramente o
quê.

```python
# ruim: nome vago, faz duas coisas
def processar(dados):
    soma = sum(dados)
    print(f"Soma: {soma}")
    return soma

# melhor: nomes claros, responsabilidades separadas
def somar(numeros):
    return sum(numeros)

def imprimir_total(total):
    print(f"Soma: {total}")

dados = [10, 20, 30]
total = somar(dados)
imprimir_total(total)
```

A regra heurística: se a função tem mais de 15-20 linhas, provavelmente
está fazendo coisa demais.

## Docstrings: documentando

Boa prática profissional: a primeira coisa dentro de uma função é uma
**docstring** (string entre aspas triplas) explicando o que ela faz.

```python
def calcular_dps(dano_total, tempo_segundos):
    """
    Calcula o DPS médio dado o dano total e o tempo decorrido.

    dano_total: int ou float, dano total no fight
    tempo_segundos: float, duração do fight em segundos
    Retorna: float, DPS médio
    """
    return dano_total / tempo_segundos
```

Docstring aparece no autocomplete do VS Code, e ferramentas de documentação
automática extraem ela. Pega o hábito cedo.

## *args e **kwargs (preview)

Você vai ver código com `*args` e `**kwargs`. Resumão por agora:

```python
def f(*args):
    # args é uma tupla com todos os argumentos posicionais
    print(args)

f(1, 2, 3)   # imprime (1, 2, 3)

def g(**kwargs):
    # kwargs é um dicionário com todos os argumentos nomeados
    print(kwargs)

g(nome="Dan", nivel=50)   # imprime {'nome': 'Dan', 'nivel': 50}
```

Útil quando a função aceita um número variável de argumentos. Não vai
precisar disso ainda, mas anote pra quando ler código alheio.

## Combinando: programa de DPS check

```python
def calcular_dps(dano_total, tempo_segundos):
    """Calcula DPS médio."""
    return dano_total / tempo_segundos

def avaliar_dps(dps, threshold=8000):
    """Diz se o DPS passa do threshold de uma savage típica."""
    if dps >= threshold:
        return "PASSOU"
    else:
        return "ABAIXO"

def relatorio(nome, dano_total, tempo):
    """Imprime um relatório de DPS de um jogador."""
    dps = calcular_dps(dano_total, tempo)
    status = avaliar_dps(dps)
    print(f"{nome}: {dps:,.0f} DPS [{status}]")

# uso
relatorio("Aurelia", 1_650_000, 200)
relatorio("Y'shtola", 980_000, 200)
relatorio("Alphinaud", 1_440_000, 200)
```

Saída:

```text
Aurelia: 8,250 DPS [PASSOU]
Y'shtola: 4,900 DPS [ABAIXO]
Alphinaud: 7,200 DPS [ABAIXO]
```

(Note: usar `_` em literais numéricos como `1_650_000` é só pra leitura,
Python ignora.)

## Exercícios

1. **Função simples**: crie `01-saudacao.py` com uma função `saudar(nome)`
   que imprime `f"Olá, {nome}, bem-vindo a Eorzea."`. Chame três vezes
   com nomes diferentes.

2. **DPS calc**: crie `02-dps.py` com a função `calcular_dps(dano, tempo)`
   que devolve dano/tempo. Teste com 3 conjuntos de valores e imprima os
   resultados.

3. **Default**: crie `03-default.py` com a função
   `cumprimento(nome, titulo="Adventurer")`. Chame uma vez com 1 argumento,
   uma vez com 2.

4. **Tankbuster**: crie `04-tankbuster.py` com a função
   `mitigar(dano, mitigacao=0.3)` que devolve `dano * (1 - mitigacao)`.
   Use pra calcular dano com 30% de mitigação (default) e com 50%.

5. **HP percent**: crie `05-hp.py` com `hp_percent(hp_atual, hp_max)` que
   devolve a porcentagem (float). Outra função `precisa_curar(hp_atual, hp_max)`
   que usa a primeira e devolve `True` se < 50%, senão `False`. Teste.

6. **Hunting log lookup**: crie `06-hunting.py`. Use o dicionário
   `hunting_log` do capítulo passado. Crie a função
   `buscar_monstro(log, nome)` que devolve as informações do monstro pelo
   nome, ou `None` se não existe. Teste com um nome existente e um
   inexistente.

7. **Refator de funções**: pegue `04-tomestones.py` do capítulo de Entrada
   e Saída (calculadora de tomestones) e refatore separando em funções:
   `pegar_input_tomestones()`, `calcular_pecas(tomestones, custo_peca=500)`,
   `imprimir_resultado(pecas, sobra)`. O fluxo principal só chama as três
   em ordem.

8. **Docstring**: pegue uma das funções acima, adicione uma docstring
   completa explicando o que ela faz, parâmetros, e retorno.

## Você concluiu

- Você define funções com `def`, parâmetros, e `return`.
- Você usa argumentos posicionais, nomeados e padrão.
- Você sabe que variáveis dentro da função têm escopo local.
- Você prefere passar dados por parâmetro em vez de ler de fora.
- Você adota o hábito de funções pequenas com nomes claros e docstring.

Próximo capítulo: **Strings · /yell**. Você vai dominar o tipo `str` em
profundidade: métodos, formatação avançada, slicing. Tudo que faz texto
ser texto.
