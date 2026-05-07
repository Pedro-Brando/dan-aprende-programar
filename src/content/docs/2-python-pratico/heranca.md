---
title: Herança · Class to Job
description: Reaproveitar comportamento entre classes. Herança, override, super e por que composição costuma ser melhor. O caminho do Gladiator que vira Paladin.
---

Em FFXIV, todo Paladin foi Gladiator antes. O Job não substitui a Class:
**ele estende**. Você ainda tem todas as ações do Gladiator (Fast Blade,
Fight or Flight, Riot Blade), e ganha as do Paladin por cima (Holy Spirit,
Atonement, Royal Authority). **Isso é herança em Python**: uma classe
filha herda tudo da classe pai e adiciona ou modifica o que precisar.

## Sintaxe básica

```python
class Personagem:
    def __init__(self, nome, nivel):
        self.nome = nome
        self.nivel = nivel
        self.hp = 100 * nivel

    def saudar(self):
        return f"Olá, sou {self.nome}."


class Tank(Personagem):
    def __init__(self, nome, nivel):
        super().__init__(nome, nivel)
        self.hp = self.hp * 2  # tanks têm 2x HP


# Uso:
t = Tank("Aurelia", 90)
print(t.nome)         # Aurelia (herdou)
print(t.nivel)        # 90 (herdou)
print(t.hp)           # 18000 (modificou)
print(t.saudar())     # Olá, sou Aurelia. (herdou método)
```

`class Tank(Personagem):` lê: "Tank é um tipo de Personagem". Tank
herda automaticamente todos os atributos e métodos de Personagem.

## `super()`: chamar a classe pai

`super().__init__(nome, nivel)` chama o `__init__` da classe pai
(Personagem). Sem isso, os atributos básicos (nome, nivel, hp) não
seriam criados.

Use `super()` toda vez que você quer **estender** o comportamento do
pai, não substituir. O fluxo típico:

```python
class Filha(Mae):
    def __init__(self, ...):
        super().__init__(...)   # primeiro, faz o que a mãe faria
        # depois, adiciona o que é só da filha
        self.atributo_novo = ...
```

## Override: sobrescrever método

Se você define um método com mesmo nome do pai, ele substitui:

```python
class Personagem:
    def saudar(self):
        return f"Olá, sou {self.nome}."


class Tank(Personagem):
    def saudar(self):
        return f"Estou aqui pra aguentar dano, sou {self.nome}."


class Healer(Personagem):
    def saudar(self):
        # Quer estender em vez de substituir? Chama super
        original = super().saudar()
        return f"{original} Posso curar, se precisar."


print(Tank("Aurelia", 90).saudar())
# Estou aqui pra aguentar dano, sou Aurelia.

print(Healer("Y'shtola", 90).saudar())
# Olá, sou Y'shtola. Posso curar, se precisar.
```

`Tank` substituiu completamente. `Healer` chama `super()` pra reaproveitar
e estender.

## Polimorfismo

Polimorfismo é uma palavra grande pra um conceito simples: **objetos de
classes diferentes podem responder ao mesmo método de jeitos diferentes**.

```python
party = [
    Tank("Aurelia", 90),
    Healer("Y'shtola", 90),
    Personagem("Alphinaud", 88),
]

for membro in party:
    print(membro.saudar())
```

Cada `membro.saudar()` chama a versão certa baseada no tipo real.
Você não precisa fazer `if isinstance(membro, Tank)`. Python escolhe
sozinho.

Saída:

```text
Estou aqui pra aguentar dano, sou Aurelia.
Olá, sou Y'shtola. Posso curar, se precisar.
Olá, sou Alphinaud.
```

Isso permite escrever código genérico que funciona com qualquer subtipo
de `Personagem`.

## Herança múltipla (com cuidado)

Python permite herdar de mais de uma classe:

```python
class Voador:
    def voar(self):
        return "Voando."


class Nadador:
    def nadar(self):
        return "Nadando."


class Pato(Voador, Nadador):
    pass


p = Pato()
print(p.voar())     # Voando.
print(p.nadar())    # Nadando.
```

Funciona. Mas se as duas classes pais tiverem método com o mesmo nome,
Python segue uma ordem chamada **MRO** (Method Resolution Order). Vira
complicado rápido.

**Conselho prático**: **evite herança múltipla**. Se sentir necessidade,
geralmente composição (próxima seção) resolve melhor.

## Composição em vez de herança

A frase mais repetida em design OOP é **"prefer composition over inheritance"**.

Em vez de Tank herdar tudo de Personagem, ele pode **conter** um
Personagem:

```python
class Personagem:
    def __init__(self, nome, nivel):
        self.nome = nome
        self.nivel = nivel
        self.hp = 100 * nivel


class Tank:
    def __init__(self, personagem, escudo):
        self.personagem = personagem
        self.escudo = escudo
        self.personagem.hp *= 2

    def saudar(self):
        return f"{self.personagem.nome} é Tank."


t = Tank(Personagem("Aurelia", 90), escudo="Gunblade")
print(t.saudar())               # Aurelia é Tank.
print(t.personagem.nome)        # Aurelia
print(t.escudo)                 # Gunblade
```

Mais código, mas:

1. Mais flexível (Tank não fica acoplado às mudanças de Personagem)
2. Mais fácil de testar (você pode passar um Personagem mock)
3. Sem cadeia de heranças complicada

**Quando herança vence**: quando o "é um" é literal e estável. Tank é
um Personagem, sempre vai ser. Em código de jogo bem modelado isso
funciona.

**Quando composição vence**: quando "tem um" descreve melhor a relação.
Carro **tem** motor, não **é** motor. Esse caso composição é óbvia.

Pra estagiário, a regra prática:

- Use herança pra hierarquias **simples e claras** (Tank/Healer/DPS herdam
  de Personagem; ok).
- Quando a hierarquia ficar com 3+ níveis, ou começar a ter exceções
  ("essa classe filha não usa esse método do pai"), pause e pense em
  composição.

## `isinstance` e `type`

Para checar se um objeto é de certo tipo:

```python
t = Tank("Aurelia", 90)

print(type(t))                  # <class '__main__.Tank'>
print(type(t) == Tank)          # True
print(type(t) == Personagem)    # False (não é igual exato)

print(isinstance(t, Tank))         # True
print(isinstance(t, Personagem))   # True (Tank É Personagem)
```

`isinstance` reconhece a hierarquia. **Quase sempre você quer
`isinstance`**, não `type ==`. Porque com `type ==`, código que esperava
`Personagem` reprovaria um `Tank`, o que não faz sentido.

## Classes abstratas (preview)

Você vai ouvir falar de "classes abstratas": classes que **só servem
pra herdar de**, nunca pra instanciar.

```python
from abc import ABC, abstractmethod


class Animal(ABC):
    @abstractmethod
    def som(self):
        pass


class Cachorro(Animal):
    def som(self):
        return "Woof"


# a = Animal()  # TypeError: Can't instantiate abstract class
c = Cachorro()
print(c.som())  # Woof
```

Útil pra forçar que toda classe filha implemente certos métodos.
Avançado pra estagiário; você não precisa hoje. Mas anote pra quando ler
código real.

## Exercícios

1. **Tank/Healer/DPS**: crie `01-roles.py` com classe `Personagem`
   (nome, nivel, hp_max). Crie 3 subclasses (Tank, Healer, DPS) que
   modificam `hp_max` no `__init__` (Tank: 2x, Healer: 1x, DPS: 0.8x).
   Cada uma tem método `funcao()` que devolve "tankar dano",
   "curar party", "causar dano" respectivamente.

2. **super em ação**: crie `02-super.py` com `Personagem` que tem
   `descrever()` retornando `"Personagem chamado X"`. Crie subclasse
   `Paladin` que sobrescreve `descrever()` chamando `super()` e
   adicionando `". Equipado com escudo."`.

3. **Polimorfismo**: usando classes do exercício 1, crie uma lista
   `party` com 4 membros (1 Tank, 1 Healer, 2 DPS). Itere chamando
   `funcao()` de cada um. Vê o polimorfismo em ação.

4. **Composição**: refatore o exercício 1. Em vez de `Tank` herdar de
   `Personagem`, faça `Tank` ter um `Personagem` como atributo.
   Implementa `tomar_dano(valor)` que delega ao `personagem` interno.
   Compare o código resultante com a versão de herança.

5. **isinstance**: pegue uma lista mista de Tanks, Healers e DPSes.
   Filtre só os Tanks usando `isinstance`. Imprima.

6. **Refator do Trial 03**: se você já tentou o Trial 03 (Biblioteca
   de Sharlayan), revise o código aplicando o que aprendeu aqui:
   `__str__`/`__repr__` decentes nas classes, talvez polimorfismo,
   `dataclass` onde fizer sentido.

## Você concluiu

- Você cria subclasses com `class Filha(Mae):`
- Você usa `super().__init__(...)` pra estender o construtor pai
- Você sobrescreve métodos do pai (e usa `super().metodo()` pra
  estender em vez de substituir)
- Você reconhece polimorfismo: mesma chamada, comportamento diferente
  por tipo
- Você prefere composição quando a relação é "tem um" e não "é um"
- Você usa `isinstance` em vez de `type ==`

Próximo capítulo: **APIs com requests · Linkshell call**. Hora do código
falar com a internet.
