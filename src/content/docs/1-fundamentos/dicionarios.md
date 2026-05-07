---
title: Dicionários · Hunting Log
description: Estrutura chave-valor. A ferramenta perfeita para representar coisas com vários atributos. Igual ao Hunting Log, que para cada monstro guarda nome, level, zona, drops.
---

Abra o Hunting Log do seu personagem em FFXIV. Cada inimigo registrado tem
o nome, o nível, a zona onde aparece, quanto EXP dá. Você procura pelo
nome do bicho, e tira todas essas informações. **Dicionário em Python é
exatamente isso**: uma estrutura onde você acessa valores por uma "chave"
em vez de por posição numérica. Lista é hotbar (item por slot). Dicionário
é Hunting Log (item por nome).

## Criando um dicionário

```python
personagem = {
    "nome": "Y'shtola",
    "raca": "Miqo'te",
    "job": "Sage",
    "nivel": 90,
    "cidade": "The Crystarium",
}

print(personagem)
```

Saída:

```text
{'nome': "Y'shtola", 'raca': "Miqo'te", 'job': 'Sage', 'nivel': 90, 'cidade': 'The Crystarium'}
```

Sintaxe:

- Delimitadores: `{}` (chaves)
- Cada par é `chave: valor`
- Pares separados por vírgula
- A chave costuma ser string (mas pode ser qualquer tipo imutável)
- O valor pode ser qualquer coisa

## Acessando um valor pela chave

```python
print(personagem["nome"])    # Y'shtola
print(personagem["nivel"])   # 90
```

Use `[]` com a chave, igual lista usa `[]` com índice. Mas aqui o índice
é uma string (ou qualquer chave que você definiu).

### Chave que não existe

```python
print(personagem["mount"])
```

Erro:

```text
KeyError: 'mount'
```

Pra evitar erro, use `.get()`:

```python
print(personagem.get("mount"))           # None
print(personagem.get("mount", "Chocobo")) # Chocobo (default)
```

`get()` devolve `None` se a chave não existe (ou um valor padrão se você
passar um segundo argumento). Mais seguro pra leitura.

## Adicionando e atualizando

```python
personagem["nome"] = "Alisaie"   # atualiza
personagem["mount"] = "Magitek Reaper"  # adiciona
print(personagem)
```

Se a chave já existe, sobrescreve. Se não existe, cria.

## Removendo

```python
del personagem["mount"]      # remove a chave
removida = personagem.pop("nivel")   # remove e devolve o valor
```

`pop()` é útil quando você quer pegar e tirar de uma vez. `del` só remove.

## Verificar se a chave existe: `in`

```python
if "mount" in personagem:
    print("Tem montaria.")

if "shoes" not in personagem:
    print("Sem sapatos registrados.")
```

`in` checa entre as **chaves**, não entre os valores. Pra checar valores,
use `valor in personagem.values()` (próxima seção).

## Iterando

### Pelas chaves

```python
for chave in personagem:
    print(chave)
```

Saída:

```text
nome
raca
job
nivel
cidade
```

`for x in dicionario` itera pelas **chaves** por padrão.

### Pelas chaves e valores juntos: `.items()`

```python
for chave, valor in personagem.items():
    print(f"{chave}: {valor}")
```

Saída:

```text
nome: Y'shtola
raca: Miqo'te
job: Sage
nivel: 90
cidade: The Crystarium
```

Esse padrão é o mais comum. Decora.

### Só os valores: `.values()`

```python
for valor in personagem.values():
    print(valor)
```

### Listar tudo

```python
print(personagem.keys())     # dict_keys(['nome', 'raca', 'job', 'nivel', 'cidade'])
print(personagem.values())   # dict_values(['Y'shtola', "Miqo'te", 'Sage', 90, 'The Crystarium'])
print(personagem.items())    # dict_items([('nome', "Y'shtola"), ...])
```

## Tamanho

```python
print(len(personagem))   # 5 (cinco pares)
```

`len()` aqui devolve o número de chaves (igual a número de pares).

## Dicionários aninhados (estrutura realista)

Cada valor pode ser outro dicionário, ou uma lista, ou qualquer coisa.

```python
party = {
    "tank": {
        "nome": "Aurelia",
        "job": "Paladin",
        "nivel": 90,
    },
    "healer": {
        "nome": "Y'shtola",
        "job": "Sage",
        "nivel": 90,
    },
    "dps1": {
        "nome": "Alphinaud",
        "job": "Summoner",
        "nivel": 88,
    },
}

print(party["healer"]["nome"])   # Y'shtola
print(party["tank"]["nivel"])    # 90
```

Esse padrão (dicionário de dicionários, ou dicionário de listas) é como
você modela quase qualquer coisa do mundo real em Python. JSON (próximo
Tomo) é literalmente isso.

## Lista de dicionários

Combinação muito comum: cada item da lista é um dicionário.

```python
inventario = [
    {"item": "Allagan Tomestone", "quantidade": 450, "tipo": "currency"},
    {"item": "Dark Matter VII", "quantidade": 12, "tipo": "material"},
    {"item": "Crystal of Light", "quantidade": 1, "tipo": "key"},
]

for entrada in inventario:
    print(f"{entrada['item']}: {entrada['quantidade']} ({entrada['tipo']})")
```

Saída:

```text
Allagan Tomestone: 450 (currency)
Dark Matter VII: 12 (material)
Crystal of Light: 1 (key)
```

Repare: dentro da f-string usei aspas simples `'item'` porque a string
externa usa aspas duplas. Você viu essa regra no capítulo de entrada e
saída.

## Dicionário vazio

```python
inventario = {}      # vazio
inventario["Gil"] = 50000
inventario["Linkpearl"] = 5
print(inventario)
```

Útil pra construir um dicionário aos poucos, ou pra começar do zero.

## Métodos úteis

| Método | O que faz |
|---|---|
| `dic[chave]` | Acessa, erro se não existe |
| `dic.get(chave)` | Acessa, devolve `None` se não existe |
| `dic.get(chave, default)` | Acessa, devolve default se não existe |
| `dic[chave] = valor` | Cria/atualiza |
| `dic.pop(chave)` | Remove e devolve |
| `del dic[chave]` | Remove |
| `dic.keys()` | Iterável das chaves |
| `dic.values()` | Iterável dos valores |
| `dic.items()` | Iterável de tuplas (chave, valor) |
| `chave in dic` | Verifica se chave existe |
| `len(dic)` | Quantidade de pares |
| `dic.update(outro)` | Mescla outro dicionário em dic |
| `dic.clear()` | Esvazia |

## Sets (coleção sem duplicata)

Bonus: existe outro tipo, **set**, que é tipo um dicionário só com chaves
(sem valores). Útil pra checar se algo está numa coleção, ou pra remover
duplicatas.

```python
roles_party = {"Tank", "Healer", "DPS", "DPS", "DPS", "DPS"}
print(roles_party)   # {'Tank', 'Healer', 'DPS'} (duplicatas removidas)

if "Healer" in roles_party:
    print("Tem healer.")

# útil pra remover duplicatas de uma lista:
nomes_repetidos = ["Y'shtola", "Alphinaud", "Y'shtola", "Alisaie"]
unicos = set(nomes_repetidos)
print(unicos)   # {'Y'shtola', 'Alphinaud', 'Alisaie'}
```

Sets não preservam ordem. Use só quando ordem não importa.

## Exercícios

1. **Ficha de personagem**: crie `01-personagem.py` com um dicionário
   representando um personagem (nome, raca, job, nivel, cidade,
   gil_atual). Imprima cada par usando `for k, v in dic.items()`.

2. **Promoção a Paladin**: pegue `01-personagem.py`. Atualize o `job` para
   "Paladin" e o `nivel` para 50. Adicione uma chave nova `arma_principal`
   com `"Excalibur"`. Remova `gil_atual`. Imprima o estado final.

3. **Hunting Log**: crie `03-hunting.py` com um dicionário onde a chave é
   o nome do monstro e o valor é outro dicionário com `nivel`, `zona`,
   `exp_recompensa`. Adicione 5 monstros (pode inventar). Imprima cada
   monstro com seu nível e zona.

   Exemplo de estrutura:
   ```python
   hunting_log = {
       "Coblyn": {"nivel": 4, "zona": "Lower La Noscea", "exp_recompensa": 50},
       "Wharf Rat": {"nivel": 1, "zona": "Limsa Lominsa", "exp_recompensa": 12},
       # ...
   }
   ```

4. **Total de drops**: crie `04-drops.py` com uma lista de dicionários
   representando 5 drops de uma run de raid. Cada drop tem `item` e
   `gil_value`. Some todos os `gil_value` com um for. Imprima o total.

5. **Roles count**: crie `05-roles.py` com a lista
   `party = ["Tank", "Healer", "DPS", "DPS", "DPS", "DPS", "Healer", "Tank"]`.
   Use um dicionário pra contar quantos de cada role tem. Resultado
   esperado: `{'Tank': 2, 'Healer': 2, 'DPS': 4}`. Dica: `if role in
   contagem: contagem[role] += 1 else: contagem[role] = 1`.

6. **Set de visitados**: crie `06-set.py`. Comece com a lista
   `cidades_visitadas = ["Limsa", "Gridania", "Limsa", "Ul'dah", "Gridania", "Ishgard"]`.
   Converta para set. Imprima o set e o tamanho.

7. **`get` com default**: crie `07-get.py` com um dicionário de buffs:
   ```python
   buffs = {"Bardo Song": 30, "Battle Voice": 20}
   ```
   Tente acessar `buffs.get("Embolden", 0)`. Imprima. Explique por que isso
   é mais seguro que `buffs["Embolden"]`.

## Você concluiu

- Você cria dicionários com `{}` e acessa com `[chave]` ou `.get(chave)`.
- Você adiciona, atualiza e remove chaves.
- Você itera com `.keys()`, `.values()`, `.items()`.
- Você sabe que `in` checa chaves, e como verificar se a chave existe.
- Você consegue modelar dados aninhados (dict de dict, lista de dict).
- Você conhece sets pra coleções sem duplicata.

Próximo capítulo: **Funções · Macro**. Você vai aprender a empacotar lógica
em pedaços reutilizáveis com nome, igual gravar um macro no FFXIV pra
disparar uma sequência inteira com um botão.
