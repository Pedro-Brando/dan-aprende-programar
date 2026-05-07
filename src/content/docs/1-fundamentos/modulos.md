---
title: Módulos · Job actions
description: Reaproveitar código de outros arquivos e da biblioteca padrão. Ao virar Job em vez de Class, você importa um conjunto inteiro de novas habilidades.
---

Quando seu Gladiator passa do level 30 e completa a job quest, ele recebe
o Job Stone e vira **Paladin**. De repente, novas habilidades aparecem na
hotbar: Holy Spirit, Atonement, Royal Authority. Você não programou nada,
não criou as skills do zero. Elas estavam disponíveis, esperando você
fazer o `import`. **Módulos em Python são exatamente isso**: pacotes de
código pronto que outras pessoas (ou você mesmo) escreveram, que você
puxa pro seu programa com uma linha. Esse capítulo fecha o Tomo I.

## O que é um módulo

Em Python, **qualquer arquivo `.py` é um módulo**. Quando você
`import alguma_coisa`, o Python procura um arquivo `alguma_coisa.py` (ou
um pacote `alguma_coisa/`) e te dá acesso ao que está dentro.

Existem três fontes de módulos:

1. **Biblioteca padrão (stdlib)**: vem instalada com o Python. `math`,
   `random`, `datetime`, `os`, `pathlib`, `csv`, `json`. Centenas de
   módulos, todos prontos pra usar.
2. **Pacotes de terceiros**: instalados via `pip`. `requests`, `pandas`,
   `numpy`. Vamos ver no Tomo II.
3. **Seus próprios módulos**: outros arquivos `.py` que você escrever
   no seu projeto.

## Importando da stdlib

Sintaxe básica:

```python
import math

print(math.pi)            # 3.141592653589793
print(math.sqrt(16))      # 4.0
print(math.floor(3.7))    # 3
print(math.ceil(3.2))     # 4
```

Importou o módulo todo. Pra usar qualquer função/constante de dentro,
prefixa com o nome do módulo: `math.pi`, `math.sqrt(...)`.

## `from ... import`

Você pode importar funções específicas pra usar sem prefixo:

```python
from math import pi, sqrt, floor

print(pi)            # 3.14...
print(sqrt(16))      # 4.0
print(floor(3.7))    # 3
```

Mais conciso, mas perde a "marca" de que veio do `math`.

Convenção:

- `import modulo` quando você usa o módulo em vários lugares.
- `from modulo import x, y` quando você usa só algumas funções específicas.
- Evite `from modulo import *` (importa tudo). Polui o namespace e dificulta
  rastrear de onde veio cada nome.

## Apelido com `as`

Pra módulos com nome longo ou pra encurtar:

```python
import datetime as dt

agora = dt.datetime.now()
print(agora)
```

Algumas convenções de apelidos viraram padrão na comunidade Python:

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
```

Você vai ver isso em qualquer código de dados. Use os apelidos
estabelecidos pra ficar reconhecível.

## Stdlib essencial: módulos que valem ouro

### `math`

Funções matemáticas. `pi`, `e`, `sqrt`, `pow`, `floor`, `ceil`, `log`,
`sin`, `cos`, etc.

```python
import math
print(math.sqrt(2))     # 1.41...
print(math.pow(2, 10))  # 1024.0
print(math.log2(1024))  # 10.0
```

### `random`

Aleatoriedade. Útil pra simulações, jogos, escolha aleatória.

```python
import random

print(random.randint(1, 100))         # número entre 1 e 100 (inclusive)
print(random.choice(["A", "B", "C"])) # escolha um da lista
print(random.random())                # float entre 0 e 1
print(random.shuffle([1, 2, 3, 4]))   # embaralha lista no lugar (None retornado)

# Simulando crit chance:
crit_rate = 0.234
if random.random() < crit_rate:
    print("CRIT!")
```

### `datetime`

Datas e horas.

```python
from datetime import datetime, date, timedelta

agora = datetime.now()
print(agora)                # 2026-05-07 14:30:45.123456
print(agora.year)           # 2026
print(agora.month)          # 5

hoje = date.today()
amanha = hoje + timedelta(days=1)
print(hoje, amanha)

# formatar:
print(agora.strftime("%d/%m/%Y %H:%M"))   # 07/05/2026 14:30
```

### `os` e `pathlib`

Interagir com o sistema operacional. `pathlib` é o moderno; `os` é o
clássico.

```python
from pathlib import Path

cwd = Path.cwd()              # diretório atual
print(cwd)

home = Path.home()            # diretório home do usuário
print(home)

# listar arquivos do diretório atual
for arquivo in cwd.iterdir():
    print(arquivo.name)
```

### `json`

JSON é o formato mais usado pra trocar dados entre sistemas (e pra salvar
dicionários e listas Python em arquivo).

```python
import json

personagem = {
    "nome": "Y'shtola",
    "job": "Sage",
    "nivel": 90,
    "scions": ["Alphinaud", "Alisaie"],
}

# Para string:
texto = json.dumps(personagem, ensure_ascii=False, indent=2)
print(texto)

# Para arquivo:
with open("personagem.json", "w", encoding="utf-8") as f:
    json.dump(personagem, f, ensure_ascii=False, indent=2)

# Lendo de arquivo:
with open("personagem.json", encoding="utf-8") as f:
    carregado = json.load(f)
print(carregado["nome"])
```

JSON é seu melhor amigo pra persistência leve. Mais sobre no Tomo II.

## Criando seu próprio módulo

Crie dois arquivos na mesma pasta:

`utils.py`:

```python
def saudar(nome):
    return f"Olá, {nome}, bem-vindo a Eorzea."

def calcular_dps(dano, tempo):
    return dano / tempo

PI_AETHER = 3.141592
```

`main.py`:

```python
import utils

print(utils.saudar("Dan"))
print(utils.calcular_dps(1000000, 200))
print(utils.PI_AETHER)
```

Rode `python main.py`. Funciona. Você acabou de criar e importar seu
primeiro módulo.

Você pode também usar `from utils import saudar`:

```python
from utils import saudar, calcular_dps

print(saudar("Dan"))
print(calcular_dps(1000000, 200))
```

## Onde Python procura os módulos

Quando você faz `import x`, Python procura nessa ordem (simplificado):

1. Built-ins (módulos C que vêm com o Python)
2. Diretório do script atual
3. Pastas listadas em `sys.path` (que inclui a stdlib e os pacotes
   instalados via pip)

Por isso o seu `utils.py` na mesma pasta funciona direto.

## Pacote vs módulo

Quando você tem MUITOS arquivos relacionados, agrupa numa pasta com um
arquivo `__init__.py` (pode ser vazio). Aí a pasta vira um **pacote**:

```
meu_projeto/
    main.py
    utils/
        __init__.py
        math_helpers.py
        string_helpers.py
```

`main.py`:

```python
from utils.math_helpers import calcular_dps
from utils.string_helpers import yell
```

Você não precisa disso ainda em projetos pequenos. Mas vai ver muito ao
ler código de terceiros.

## `if __name__ == "__main__":`

Padrão muito comum no fim de arquivos Python:

```python
def saudar(nome):
    return f"Olá, {nome}!"

def main():
    print(saudar("Dan"))

if __name__ == "__main__":
    main()
```

A condição `__name__ == "__main__"` é verdadeira só quando o arquivo é
executado direto (`python utils.py`). Se ele for **importado** por outro
arquivo, o bloco não roda.

Útil pra:

- Permitir que `utils.py` rode standalone pra teste.
- Permitir que outros arquivos importem só as funções, sem disparar o
  `main()` automaticamente.

Adote o hábito. Vai ver muito.

## `pip` (preview)

Tudo nesse capítulo veio da stdlib. Mas o ecossistema Python tem dezenas
de milhares de pacotes além disso, no PyPI (Python Package Index). Pra
instalar:

```powershell
pip install requests
```

Aí você pode `import requests` no seu código. Vamos ver `pip` e ambientes
virtuais (`venv`) com calma no primeiro capítulo do Tomo II.

## Exercícios

1. **Random hunt**: crie `01-hunt.py` com uma lista de 10 monstros. Use
   `random.choice()` pra sortear um. Use `random.randint(1, 90)` pra
   sortear o nível. Imprima `"Hunting log encontrou: <monstro> (Lv <X>)"`.

2. **Crit roll**: crie `02-crit.py` com função `roll_crit(crit_rate)` que
   usa `random.random()`. Devolve `True` se < crit_rate. Teste rodando
   1000 vezes com `crit_rate=0.234` e contando quantos True saíram.
   Tem que ser próximo de 234.

3. **Data agora**: crie `03-data.py` que importa `datetime`, pega a data
   e hora atual, e imprime no formato `dd/mm/aaaa HH:MM`.

4. **JSON save**: crie `04-json-save.py` com um dicionário de party de 8
   personagens (cada um com nome, job, nivel). Salva em `party.json`
   usando `json.dump`.

5. **JSON load**: crie `05-json-load.py` que lê `party.json` do exercício
   anterior, percorre os personagens e imprime cada um.

6. **Módulo próprio**: crie dois arquivos:
   - `eorzea.py` com funções `saudar(nome)` e `nome_aleatorio()` (usa
     random.choice numa lista de nomes).
   - `main.py` que importa as duas e usa.

7. **`__main__` block**: pegue o `eorzea.py` do anterior. Adicione uma
   função `main()` que demonstra as duas funções, e o bloco
   `if __name__ == "__main__": main()`. Confirme que rodar
   `python eorzea.py` direto faz o demo, mas importar do `main.py` não
   roda nada extra.

8. **Pathlib walk**: crie `08-walk.py` que usa
   `Path.cwd().iterdir()` pra listar todos os arquivos da pasta atual,
   e imprime nome + tamanho de cada um. Use `Path.stat().st_size` pro
   tamanho.

## Você concluiu

- Você importa módulos da stdlib com `import` e `from ... import`.
- Você usa apelidos com `as` quando o nome é longo ou convencional.
- Você conhece os módulos essenciais: `math`, `random`, `datetime`,
  `pathlib`, `json`.
- Você cria seus próprios módulos `.py` e importa de outros arquivos.
- Você reconhece o padrão `if __name__ == "__main__":`.

## **Tomo I encerrado.**

Você terminou Sua Primeira Extreme. Variáveis, tipos, operadores,
condicionais, loops, listas, dicionários, funções, strings, erros e
exceções, arquivos, módulos. Esse é o conjunto de mecânicas básicas que
toda magia em Python usa, do script de 10 linhas ao framework empresarial.

Pegue água. Olhe pro seu repositório no GitHub. Conte os arquivos `.py`
que você commitou. Esse é o seu portfólio começando a tomar forma.

Próximo Tomo: **Savage**. As mecânicas avançadas. Orientação a objetos,
APIs, banco de dados, testes. As coisas que separam quem brinca de quem
trabalha. Continuamos quando você quiser.
