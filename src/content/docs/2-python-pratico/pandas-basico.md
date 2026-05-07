---
title: Pandas básico · Damage parser
description: A biblioteca queridinha para manipular dados tabulares em Python. DataFrame, filtros, groupby, agregações. O ACT do código.
---

ACT (Advanced Combat Tracker) é o parser não-oficial de FFXIV que lê o
log de combate em tempo real e calcula DPS, HPS, sequência de ações, e
gera relatórios bonitos. Sem ACT, raid lead voa às cegas. **`pandas` é
o ACT do mundo Python**: a biblioteca padrão pra trabalhar com dados em
formato tabular (linhas e colunas), igual planilha Excel mas com 100x
mais poder. Quase todo trabalho de dados em Python passa por aqui.

## O que é um DataFrame

Imagine uma planilha do Excel. Linhas, colunas, cabeçalhos. Cada coluna
tem um tipo (texto, número, data). Em pandas, isso é um **DataFrame**.

```python
import pandas as pd

dados = [
    {"nome": "Aurelia",   "job": "Paladin",   "dps": 8200, "tempo": 200},
    {"nome": "Y'shtola",  "job": "Sage",      "dps": 4200, "tempo": 200},
    {"nome": "Alphinaud", "job": "Summoner",  "dps": 7400, "tempo": 200},
    {"nome": "Estinien",  "job": "Dragoon",   "dps": 8900, "tempo": 200},
]

df = pd.DataFrame(dados)
print(df)
```

Saída:

```text
        nome       job   dps  tempo
0    Aurelia   Paladin  8200    200
1   Y'shtola      Sage  4200    200
2  Alphinaud  Summoner  7400    200
3   Estinien   Dragoon  8900    200
```

Você acabou de criar um "log de combate" como DataFrame.

## Instalando

```powershell
pip install pandas
```

Pesado pelos padrões Python (uns 50 MB), mas vai junto com numpy e
outras dependências. Vale.

## Lendo CSV

Na vida real você raramente cria DataFrame manualmente. Lê de arquivo:

```python
df = pd.read_csv("combate.csv")
print(df.head())     # 5 primeiras linhas
print(df.tail(3))    # 3 últimas linhas
```

`read_csv` aceita caminho ou URL:

```python
df = pd.read_csv("https://exemplo.com/dados.csv")
```

## Inspecionando o DataFrame

```python
df.shape          # (4, 4) - 4 linhas, 4 colunas
df.columns        # Index(['nome', 'job', 'dps', 'tempo'], dtype='object')
df.dtypes         # tipo de cada coluna
df.info()         # resumo: tipos, contagem, memória
df.describe()     # estatísticas: count, mean, std, min, max, etc.
```

`df.describe()` é o seu melhor amigo pra primeiro contato com dataset
desconhecido:

```text
               dps  tempo
count     4.000000    4.0
mean   7175.000000  200.0
std    2092.964459    0.0
min    4200.000000  200.0
25%    6605.000000  200.0
50%    7800.000000  200.0
75%    8375.000000  200.0
max    8900.000000  200.0
```

## Selecionando colunas

```python
df["nome"]                    # uma coluna (Series)
df[["nome", "dps"]]           # várias colunas (DataFrame)
```

Note: uma coluna `df["x"]` é um **Series** (lista 1D), várias é um
**DataFrame** (tabela 2D).

## Selecionando linhas

### Por posição: `iloc`

```python
df.iloc[0]            # primeira linha (Series)
df.iloc[0:2]          # primeiras 2 linhas (DataFrame)
df.iloc[-1]           # última linha
```

### Por valor (filtro): boolean mask

```python
# Quem fez mais de 8000 DPS:
df[df["dps"] > 8000]
```

Saída:

```text
       nome      job   dps  tempo
0   Aurelia  Paladin  8200    200
3  Estinien  Dragoon  8900    200
```

Como funciona:

- `df["dps"] > 8000` produz uma Series de True/False.
- `df[mascara]` devolve só as linhas onde a máscara é True.

Filtros compostos:

```python
df[(df["dps"] > 7000) & (df["job"] != "Sage")]
```

`&` é AND, `|` é OR, `~` é NOT. **Use parênteses em volta de cada
condição** ou Python interpreta errado.

## Adicionando coluna

```python
df["dano_total"] = df["dps"] * df["tempo"]
print(df)
```

```text
        nome       job   dps  tempo  dano_total
0    Aurelia   Paladin  8200    200     1640000
1   Y'shtola      Sage  4200    200      840000
2  Alphinaud  Summoner  7400    200     1480000
3   Estinien   Dragoon  8900    200     1780000
```

A operação `df["dps"] * df["tempo"]` aplica multiplicação **elemento
por elemento**, sem precisar de loop.

## Modificando coluna

```python
df["nome"] = df["nome"].str.upper()
```

Saída de `df["nome"]`:

```text
0      AURELIA
1     Y'SHTOLA
2    ALPHINAUD
3     ESTINIEN
```

`.str.algumacoisa` aplica método de string em cada item da Series.

## Ordenando

```python
df.sort_values("dps", ascending=False)   # maior pro menor
df.sort_values(["job", "dps"])           # múltiplas colunas
```

`sort_values` devolve novo DataFrame. Pra modificar no lugar:
`df.sort_values("dps", inplace=True)`. Mas geralmente é melhor reatribuir:

```python
df = df.sort_values("dps", ascending=False)
```

## Agregações

```python
df["dps"].sum()     # 28700
df["dps"].mean()    # 7175.0
df["dps"].median()  # 7800.0
df["dps"].max()     # 8900
df["dps"].min()     # 4200
df["dps"].std()     # 2092.96... (desvio padrão)
df["nome"].count()  # 4 (não-nulos)
```

## groupby: o canivete suíço

Imagine que você tem dados de várias raids:

```python
dados = [
    {"raid": "Eden 1", "job": "Paladin",  "dps": 8200},
    {"raid": "Eden 1", "job": "Sage",     "dps": 4200},
    {"raid": "Eden 1", "job": "Dragoon",  "dps": 8900},
    {"raid": "Eden 2", "job": "Paladin",  "dps": 8500},
    {"raid": "Eden 2", "job": "Sage",     "dps": 4500},
    {"raid": "Eden 2", "job": "Dragoon",  "dps": 9200},
]

df = pd.DataFrame(dados)
```

DPS médio por raid:

```python
df.groupby("raid")["dps"].mean()
```

Saída:

```text
raid
Eden 1    7100.000000
Eden 2    7400.000000
Name: dps, dtype: float64
```

DPS médio por job (across todas as raids):

```python
df.groupby("job")["dps"].mean()
```

Saída:

```text
job
Dragoon    9050.0
Paladin    8350.0
Sage       4350.0
Name: dps, dtype: float64
```

Múltiplas agregações de uma vez:

```python
df.groupby("job")["dps"].agg(["min", "mean", "max", "count"])
```

```text
            min    mean   max  count
job
Dragoon    8900  9050.0  9200      2
Paladin    8200  8350.0  8500      2
Sage       4200  4350.0  4500      2
```

`groupby` + agregação é **a habilidade mais valiosa** de pandas.
Praticamente todo trabalho com dados passa por isso.

## Salvando

```python
df.to_csv("saida.csv", index=False, encoding="utf-8")
df.to_excel("saida.xlsx", index=False)   # precisa pip install openpyxl
df.to_json("saida.json", orient="records", indent=2, force_ascii=False)
```

`index=False` evita salvar a coluna do índice (que geralmente é só
0, 1, 2, 3...).

## Lidando com missing values (NaN)

Dados reais têm furos. Pandas usa `NaN` (Not a Number) pra representar
ausência.

```python
df.isna().sum()       # quantos NaN por coluna
df.dropna()           # remove linhas com qualquer NaN
df["dps"].fillna(0)   # preenche NaN com 0
```

Pra média ignorar NaN, pandas já faz isso por padrão. Só fica atento
em joins/merges, onde NaN aparecem com facilidade.

## DataFrame de uma API

Combinando com o capítulo de APIs:

```python
import pandas as pd
import requests

URL = "https://pokeapi.co/api/v2/pokemon"
dados = []

for id_ in range(1, 21):
    r = requests.get(f"{URL}/{id_}", timeout=10)
    p = r.json()
    dados.append({
        "id": p["id"],
        "nome": p["name"],
        "altura": p["height"],
        "peso": p["weight"],
        "hp": p["stats"][0]["base_stat"],
    })

df = pd.DataFrame(dados)
print(df.describe())
print()
print("Top 5 HP:")
print(df.nlargest(5, "hp")[["nome", "hp"]])
```

`nlargest(N, coluna)` devolve as N linhas com maior valor na coluna.
Tem `nsmallest` também.

## Exercícios

1. **DataFrame manual**: crie `01-df.py` com lista de 6 dicts (party de
   raid: nome, role, dps). Crie DataFrame. Imprima `.head()`, `.shape`,
   `.describe()`.

2. **Filtros**: usando o DataFrame anterior, filtre só os DPSes (role
   == "DPS"). Imprima.

3. **Sort + top**: ordene por dps decrescente. Mostre top 3 com
   `.head(3)`.

4. **groupby**: agrupe por role e calcule dps médio. Imprima.

5. **CSV**: salve o DataFrame original em `party.csv`. Apague o
   DataFrame da memória (`del df`). Releia do arquivo com `read_csv`.
   Confira que voltou igual.

6. **Pipeline pequeno**: combine o que aprendeu em web scraping com
   pandas. Pegue os 20 livros do
   <http://books.toscrape.com/>, monte DataFrame com título, preço e
   rating. Calcule preço médio por rating com groupby.

7. **PokeAPI + pandas**: pegue os 50 primeiros pokémons via API. Crie
   DataFrame. Salve em CSV. Em outro script, lê o CSV e gera
   estatísticas: HP médio, top 5 com mais HP, distribuição por tipo
   principal (use `df["tipos"].str.split("/").str[0]`).

## Você concluiu

- Você cria DataFrame de lista de dicts ou de CSV
- Você inspeciona com `head`, `shape`, `dtypes`, `describe`
- Você seleciona colunas e filtra linhas com boolean mask
- Você adiciona/modifica colunas com operações vetorizadas
- Você agrega com `mean`, `sum`, etc., e usa `groupby`
- Você salva pra CSV/JSON

Próximo capítulo: **SQLite · Saddlebag**. Hora de armazenamento durável
em banco de dados, com a leveza de não precisar de servidor.
