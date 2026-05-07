---
title: Classes e objetos · Job blueprint
description: Programação orientada a objetos. Como criar tipos próprios para modelar coisas do mundo real. Uma classe é o blueprint do Job; cada objeto é um aventureiro vivo.
---

Quando você abre o menu de Job em FFXIV e escolhe Paladin, o jogo carrega
uma definição: HP base, MP base, lista de ações, animações, ícones.
Essa definição existe uma vez. Mas você, e mais 5 milhões de jogadores,
têm cada um o **seu** Paladin com nome próprio, gear próprio, inventário
próprio. **Esse é o conceito de classe e objeto**: a classe é o
blueprint compartilhado (a definição do Job); cada objeto é uma
instância individual (cada aventureiro).

## Por que OOP

Você já modelou coisas em Python sem classes:

```python
personagem = {
    "nome": "Y'shtola",
    "job": "Sage",
    "nivel": 90,
    "hp": 9000,
}
```

Isso funciona pra programa pequeno. Mas conforme cresce, você quer:

1. **Garantia que toda 'personagem' tem os campos certos** (sem `personagem["nivl"]` por engano).
2. **Comportamento associado**: `personagem.tomar_dano(500)` em vez de
   manipular dicionário direto.
3. **Tipos diferentes que compartilham comportamento**: Tank, Healer,
   DPS são tipos de Personagem.

Classes resolvem esses três problemas.

## A primeira classe

```python
class Personagem:
    def __init__(self, nome, job, nivel):
        self.nome = nome
        self.job = job
        self.nivel = nivel
        self.hp_max = 100 * nivel
        self.hp = self.hp_max

    def tomar_dano(self, valor):
        self.hp = max(0, self.hp - valor)

    def curar(self, valor):
        self.hp = min(self.hp_max, self.hp + valor)


# Criando objetos:
yshtola = Personagem("Y'shtola", "Sage", 90)
alphinaud = Personagem("Alphinaud", "Summoner", 88)

print(yshtola.nome)         # Y'shtola
print(yshtola.hp_max)       # 9000

yshtola.tomar_dano(2500)
print(yshtola.hp)           # 6500

yshtola.curar(1000)
print(yshtola.hp)           # 7500
```

Anatomia:

- `class Personagem:` define o tipo.
- `def __init__(self, ...)` é o **construtor**. Roda quando você cria
  um objeto novo (`Personagem("Y'shtola", ...)`).
- `self` é a referência ao objeto sendo manipulado. **Sempre o primeiro
  parâmetro de qualquer método**.
- `self.nome = nome` cria um **atributo** no objeto.
- `def tomar_dano(self, valor)` define um **método** (função que
  pertence à classe).
- `yshtola = Personagem(...)` chama o `__init__` por baixo dos panos.

## `self` em detalhe

`self` é a coisa mais estranha de OOP em Python pra quem vem de outras
linguagens. A regra:

- Dentro de método, **`self` é o objeto que chamou**.
- Quando você faz `yshtola.tomar_dano(2500)`, Python traduz pra
  `Personagem.tomar_dano(yshtola, 2500)`. O `yshtola` vira o `self`.
- Por isso `self` é o primeiro parâmetro: o objeto é passado
  automaticamente.

Você nunca passa `self` explicitamente quando chama um método. Só
quando define.

## Atributo de instância vs de classe

```python
class Personagem:
    # Atributo de classe: compartilhado por TODAS as instâncias
    mundo = "Eorzea"

    def __init__(self, nome):
        # Atributo de instância: cada objeto tem o seu
        self.nome = nome


a = Personagem("Y'shtola")
b = Personagem("Alphinaud")

print(a.nome, b.nome)        # Y'shtola Alphinaud
print(a.mundo, b.mundo)      # Eorzea Eorzea
print(Personagem.mundo)      # Eorzea (não precisa de objeto)

Personagem.mundo = "The First"
print(a.mundo, b.mundo)      # The First The First (mudou pra todos)
```

Use atributo de classe pra **constantes compartilhadas** (`PI`, `MAX_NIVEL`).
Tudo que varia por objeto fica em `self.`.

## Métodos especiais (dunder)

Métodos com nome `__nome__` (dois underscores em volta) são "mágicos":
Python os chama em situações especiais.

### `__str__`: representação amigável

```python
class Personagem:
    def __init__(self, nome, nivel):
        self.nome = nome
        self.nivel = nivel

    def __str__(self):
        return f"{self.nome} (Lv {self.nivel})"


p = Personagem("Y'shtola", 90)
print(p)                # Y'shtola (Lv 90)
print(str(p))           # Y'shtola (Lv 90)
```

Sem `__str__`, `print(p)` mostra algo feio tipo `<__main__.Personagem object at 0x000001234>`.

### `__repr__`: representação técnica

```python
class Personagem:
    def __init__(self, nome, nivel):
        self.nome = nome
        self.nivel = nivel

    def __repr__(self):
        return f"Personagem({self.nome!r}, {self.nivel})"


p = Personagem("Y'shtola", 90)
print(repr(p))          # Personagem('Y'shtola', 90)
print([p])              # [Personagem('Y'shtola', 90)]
```

Diferenças:

- `__str__` é pra **humano** (usuário lendo).
- `__repr__` é pra **debug/desenvolvedor** (mostra tudo que precisa pra
  recriar o objeto).

Convenção: **sempre defina `__repr__`**. Se não definir `__str__`, o
Python usa `__repr__` como fallback.

### `__eq__`: comparação

```python
class Personagem:
    def __init__(self, nome):
        self.nome = nome

    def __eq__(self, outro):
        return isinstance(outro, Personagem) and self.nome == outro.nome


a = Personagem("Y'shtola")
b = Personagem("Y'shtola")
c = Personagem("Alphinaud")

print(a == b)           # True
print(a == c)           # False
```

Sem `__eq__`, `a == b` compara identidade (são o mesmo objeto na memória?).
Com `__eq__`, você define o que "igual" significa.

### Outros úteis (preview)

- `__len__(self)` - faz `len(obj)` funcionar
- `__getitem__(self, i)` - faz `obj[i]` funcionar
- `__iter__(self)` - faz `for x in obj` funcionar
- `__add__(self, outro)` - faz `obj + outro` funcionar

Mais sobre quando você precisar.

## dataclass: a forma moderna

Definir `__init__`, `__repr__` e `__eq__` toda hora cansa. Python tem
um atalho:

```python
from dataclasses import dataclass


@dataclass
class Personagem:
    nome: str
    job: str
    nivel: int = 1
    hp: int = 100


y = Personagem("Y'shtola", "Sage", 90, 9000)
print(y)                    # Personagem(nome='Y'shtola', job='Sage', nivel=90, hp=9000)
print(y == Personagem("Y'shtola", "Sage", 90, 9000))   # True
```

`@dataclass` é um **decorator** que automaticamente gera `__init__`,
`__repr__` e `__eq__` a partir dos atributos declarados. Os tipos
(`: str`, `: int`) são **type hints** (boa prática moderna em Python).

Use `@dataclass` quando sua classe é principalmente um "saco de dados".
Se ela tem muito comportamento, classe normal é melhor.

## Quando usar classe (e quando não)

**Use classe quando**:

- O conceito tem **estado** (atributos que mudam ao longo do tempo)
- Vai ter **vários métodos** que operam sobre os mesmos dados
- Você precisa de **vários tipos** que compartilham comportamento (ver
  Herança no próximo capítulo)
- Vai ter muitos objetos do mesmo tipo

**NÃO use classe quando**:

- Você só precisa de uma função (use função!)
- Você só tem dados sem comportamento (use dict ou dataclass)
- Você está fazendo "Java em Python" (criando classe pra tudo, como
  `class Calculadora` com método `somar`. Em Python, função `somar` no
  módulo `calculadora` faz a mesma coisa, mais limpo)

A regra: **Python prefere funções e dicionários a classes desnecessárias**.
Use OOP quando ela paga seu peso.

## Exercícios

1. **Personagem básico**: crie `01-personagem.py` com a classe
   `Personagem` (nome, job, nivel). Implemente `__init__`, `__str__`,
   `__repr__`. Crie 3 objetos e imprima cada um.

2. **Métodos**: adicione `tomar_dano(valor)` e `curar(valor)` na
   `Personagem`. Adicione `esta_vivo()` que retorna `True` se HP > 0.
   Teste fluxo: cria, tomar dano até morrer, conferir `esta_vivo()`.

3. **Atributo de classe**: adicione `MUNDO = "Eorzea"` (atributo de
   classe). Imprima `Personagem.MUNDO` e `obj.MUNDO`. Confira que dão
   a mesma coisa.

4. **dataclass**: rescreva `Personagem` usando `@dataclass`. Compare o
   código antes e depois. Rode os mesmos testes.

5. **Igualdade**: implemente `__eq__` em `Personagem` baseado em nome
   e nivel. Crie dois objetos com mesmo nome+nivel e compare. Crie
   um terceiro com nome diferente, compare.

6. **Inventario**: crie classe `Inventario` que tem uma lista de itens
   internos. Métodos: `adicionar(item)`, `remover(item)`,
   `contem(item)`, `tamanho()`. Implemente `__str__` que mostra todos
   os itens.

7. **Refator**: pegue um dos seus exercícios do Tomo I que usa
   dicionários pra modelar algo (a ficha de personagem, por exemplo)
   e refatore pra uma classe. Compare o código.

## Você concluiu

- Você define classes com `class`, `__init__` e `self`
- Você cria objetos chamando `Classe(...)` e usa atributos com `obj.atributo`
- Você diferencia atributo de instância (`self.x`) de atributo de classe
- Você implementa `__str__`, `__repr__` e `__eq__`
- Você usa `@dataclass` quando a classe é só dados
- Você sabe quando usar classe e quando função basta

Próximo capítulo: **Herança · Class to Job**. Como uma classe pode
herdar de outra. Igual o Gladiator que vira Paladin: mantém os ganhos
do Gladiator e adiciona os do Paladin por cima.
