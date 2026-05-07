---
title: JSON · Tomestone format
description: O formato mais usado para trocar dados entre sistemas. Ler, escrever e manipular com o módulo json. O padrão de tomestone do código moderno.
---

Allagan Tomestones em FFXIV são moedas universalmente aceitas. Você
ganha em qualquer expansão, gasta em qualquer mercador. Padronizado, sem
ambiguidade. **JSON é o tomestone do mundo do código**: praticamente toda
API moderna devolve JSON, todo arquivo de configuração tende ao JSON ou
similar (YAML, TOML), e quase toda persistência local começa em JSON.
Esse capítulo é sobre dominar o módulo `json` da stdlib.

## O que é JSON

JSON (JavaScript Object Notation) é um formato de texto que representa
dados estruturados. Sintaxe parece muito com Python:

```json
{
  "nome": "Y'shtola",
  "job": "Sage",
  "nivel": 90,
  "vivo": true,
  "ultima_morte": null,
  "scions": ["Alphinaud", "Alisaie"],
  "stats": {
    "hp": 9000,
    "mp": 10000
  }
}
```

Equivalência JSON ↔ Python:

| JSON | Python |
|---|---|
| `{}` | `dict` |
| `[]` | `list` |
| `"texto"` | `str` |
| `123` | `int` |
| `1.5` | `float` |
| `true` / `false` | `True` / `False` |
| `null` | `None` |

Diferenças que você vai esbarrar:

- **Em JSON**: aspas SEMPRE duplas. Aspas simples são erro.
- **Em JSON**: `true` e `null` são minúsculos. Em Python, `True` e `None`
  com inicial maiúscula.
- **Em JSON**: vírgula no fim do último item é erro. Python permite.

## Importando e o básico

```python
import json
```

Quatro funções principais. Vamos por pares:

### Texto ↔ Python: `loads` / `dumps`

```python
import json

# String JSON → dict Python
texto = '{"nome": "Y\'shtola", "nivel": 90}'
dados = json.loads(texto)
print(dados)              # {'nome': "Y'shtola", 'nivel': 90}
print(dados["nome"])      # Y'shtola

# dict Python → string JSON
personagem = {"nome": "Alphinaud", "job": "Summoner", "nivel": 88}
texto = json.dumps(personagem)
print(texto)
# {"nome": "Alphinaud", "job": "Summoner", "nivel": 88}
```

Mnemônico:

- `loads` (load **s**tring): de string PRA Python
- `dumps` (dump **s**tring): de Python PRA string

### Arquivo ↔ Python: `load` / `dump`

```python
# Salvar dict em arquivo:
personagem = {"nome": "Y'shtola", "nivel": 90}
with open("personagem.json", "w", encoding="utf-8") as f:
    json.dump(personagem, f)

# Ler dict de arquivo:
with open("personagem.json", encoding="utf-8") as f:
    dados = json.load(f)
print(dados)
```

Mnemônico:

- `load` (sem `s`): lê de **arquivo**
- `dump` (sem `s`): escreve em **arquivo**

A regra mental: o `s` no fim significa "string". Sem `s`, é arquivo.

## Pretty-print: indentação e acentos

Por padrão, `dumps`/`dump` jogam tudo numa linha só, e escapa acentos
pra `\uXXXX`. Resultado é compacto mas ilegível pra humano.

Pra arquivo legível:

```python
personagem = {
    "nome": "Y'shtola",
    "cidade": "The Crystarium",
    "scions": ["Alphinaud", "Alisaie"],
}

texto = json.dumps(personagem, indent=2, ensure_ascii=False)
print(texto)
```

Saída:

```json
{
  "nome": "Y'shtola",
  "cidade": "The Crystarium",
  "scions": [
    "Alphinaud",
    "Alisaie"
  ]
}
```

`indent=2` força quebra de linha + indentação de 2 espaços.
`ensure_ascii=False` mantém acentos como letras (não escapa).

**Sempre use ambos** quando salvar JSON pra arquivo que humano vai abrir.

## Listas no topo

JSON aceita lista no nível mais externo, não só dicionário:

```python
party = [
    {"nome": "Tank", "hp": 18000},
    {"nome": "Healer", "hp": 9000},
    {"nome": "DPS", "hp": 10000},
]

with open("party.json", "w", encoding="utf-8") as f:
    json.dump(party, f, indent=2, ensure_ascii=False)
```

`party.json`:

```json
[
  {
    "nome": "Tank",
    "hp": 18000
  },
  {
    "nome": "Healer",
    "hp": 9000
  },
  {
    "nome": "DPS",
    "hp": 10000
  }
]
```

Padrão muito comum: lista de objetos.

## Parseando resposta de API

`response.json()` da biblioteca requests faz `json.loads(response.text)`
por baixo dos panos:

```python
import requests

r = requests.get("https://pokeapi.co/api/v2/pokemon/1", timeout=10)
data = r.json()       # já é dict Python
print(data["name"])   # bulbasaur
print(data["weight"]) # 69
```

Você raramente vai chamar `json.loads` em código de API real, porque
`requests` (e similares) já fazem.

## Tipos que JSON não entende

Se você tentar salvar coisa que não tem mapeamento JSON:

```python
from datetime import datetime

dados = {"agora": datetime.now()}
json.dumps(dados)
```

Erro:

```text
TypeError: Object of type datetime is not JSON serializable
```

Soluções:

### Converter manualmente

```python
dados = {"agora": datetime.now().isoformat()}
json.dumps(dados)   # OK
# {"agora": "2026-05-07T14:30:00"}
```

`isoformat()` devolve string padronizada. Quem ler o JSON depois usa
`datetime.fromisoformat(...)` pra converter de volta.

### Função `default`

```python
def serializa_extra(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Não sei serializar {type(obj)}")


dados = {"agora": datetime.now()}
texto = json.dumps(dados, default=serializa_extra, indent=2)
```

`default` é uma função que `json.dumps` chama pra qualquer coisa que ele
não saiba converter. Útil pra muitos tipos.

## Persistência simples: padrão load/save

Estrutura comum em CLI: carrega JSON ao começar, salva ao terminar:

```python
import json
from pathlib import Path

ARQUIVO = Path("dados.json")


def carregar():
    if not ARQUIVO.exists():
        return {}
    with open(ARQUIVO, encoding="utf-8") as f:
        return json.load(f)


def salvar(dados):
    with open(ARQUIVO, "w", encoding="utf-8") as f:
        json.dump(dados, f, indent=2, ensure_ascii=False)


# Uso:
dados = carregar()
dados["ultima_visita"] = "Crystarium"
salvar(dados)
```

Você vai escrever esse padrão em pelo menos 5 projetos pessoais.

## JSON com classes (intermediário)

Pra serializar objetos de classes próprias, jeito mais simples é
converter pra dict primeiro:

```python
class Personagem:
    def __init__(self, nome, nivel):
        self.nome = nome
        self.nivel = nivel

    def to_dict(self):
        return {"nome": self.nome, "nivel": self.nivel}

    @classmethod
    def from_dict(cls, d):
        return cls(d["nome"], d["nivel"])


# Salvar:
y = Personagem("Y'shtola", 90)
with open("y.json", "w", encoding="utf-8") as f:
    json.dump(y.to_dict(), f, indent=2)

# Carregar:
with open("y.json", encoding="utf-8") as f:
    y2 = Personagem.from_dict(json.load(f))
```

Bibliotecas como **Pydantic** (você vai ver no Trial 05) automatizam
isso. Mas saber fazer manual ajuda a entender o que essas libs fazem
por baixo.

## Validação: cuidado!

JSON em si **não valida** o formato dos dados. Se a API mudou e devolveu
um campo a menos, você só descobre quando seu código tentar acessar:

```python
data = json.loads('{"nome": "Y\'shtola"}')   # sem "nivel"
print(data["nivel"])  # KeyError!
```

Pra dados que vêm de fora (API, usuário, arquivo), use `.get()` ou
valide explicitamente:

```python
nivel = data.get("nivel", 1)   # default = 1 se chave não existe
```

Bibliotecas como Pydantic resolvem isso elegantemente, declarando o
schema esperado.

## Exercícios

1. **Salvar dict**: crie `01-save.py` com um dict de personagem (nome,
   job, nivel, scions=lista). Salve em `personagem.json` com indent
   e ensure_ascii=False. Abra o arquivo no VS Code, confira que ficou
   bonito.

2. **Carregar e modificar**: crie `02-load.py` que lê o arquivo do
   exercício 1, troca o `nivel` pra 91, salva de volta.

3. **Lista de personagens**: crie `03-party.py` com uma lista de 8
   dicts (party de raid). Salve em `party.json`. Lê de volta e imprime
   cada nome.

4. **Tipo não-serializável**: crie `04-datetime.py` que tenta salvar
   `{"data": datetime.now()}`. Veja o erro. Resolve usando `.isoformat()`.
   Carrega de volta com `datetime.fromisoformat()`.

5. **API + JSON**: crie `05-pokemon-save.py` que pega 5 pokémons via
   requests, extrai os campos relevantes, e salva tudo num JSON único.
   Abra o arquivo e confira.

6. **Persistência completa**: crie `06-config.py` com função `carregar()`
   e `salvar()` (igual o padrão do capítulo). Use pra implementar
   um contador: cada execução do programa incrementa um contador
   guardado em `config.json`. Roda 3 vezes, vê o número subindo.

## Você concluiu

- Você diferencia `loads`/`dumps` (string) de `load`/`dump` (arquivo)
- Você usa `indent=2, ensure_ascii=False` para JSON legível
- Você sabe os tipos JSON e suas equivalências em Python
- Você lida com tipos não-serializáveis usando `isoformat()` ou
  função `default`
- Você implementa o padrão load/save pra persistência simples

Próximo capítulo: **Web scraping · Echo of the past**. Quando a API
pública não existe, você vai buscar a info direto no HTML.
