---
title: Trial 04 · Hunt Train Tracker
description: Pipeline de dados que coleta informação de uma API pública, transforma com pandas e gera um relatório. Primeiro projeto que mexe com a internet de verdade.
---

Em FFXIV, **Hunt Trains** são grupos de jogadores que viajam por zonas
abrindo e matando S/A-Rank monsters em sequência, registrando spawns,
horários, e drops. Tudo organizado em planilhas comunitárias que ficam
online. **Esse Trial te coloca pra construir um Hunt Train Tracker**:
você vai consumir uma API HTTP de verdade, processar com pandas, e gerar
um relatório markdown automático. É o primeiro projeto que sai da memória
do seu computador e fala com o resto do mundo.

:::caution[Pré-requisito]
Esse Trial assume **Tomo II completo**, especialmente: pip e venv, APIs
com requests, JSON, pandas básico. Se ainda não fez, faça antes.
:::

## Briefing

Pipeline de dados pequeno mas completo:

1. **Coleta**: pega dados de uma API pública (PokeAPI ou outra simples).
2. **Persistência**: salva em CSV.
3. **Análise**: lê com pandas, calcula 3-5 estatísticas.
4. **Relatório**: gera um Markdown com os achados.

A escolha de API é flexível. Sugestões:

- **PokeAPI** (`https://pokeapi.co/api/v2/`): catálogo de Pokémon. Sem
  chave. Bom pra praticar.
- **ViaCEP** (`https://viacep.com.br/ws/<cep>/json/`): consulta CEP. Útil
  pra projetos brasileiros.
- **JSONPlaceholder** (`https://jsonplaceholder.typicode.com/`): API fake
  com posts, users, comments. Boa pra prototipar.

Vou guiar usando **PokeAPI**, já que é estável, documentada, e o domínio
é divertido. Você pode aplicar a mesma estrutura em qualquer API similar.

**Tempo estimado**: 4-5 horas.

## Loadout requerido

- `pip install requests pandas`
- Tudo do Tomo I + Trials anteriores
- `requests.get`, `response.json()`, tratamento de status HTTP
- `pandas.DataFrame`, `read_csv`/`to_csv`, `describe`, `groupby`
- Loop com paciência (a API é rate-limited, mete `time.sleep` se precisar)

## Strat

### Setup

```powershell
mkdir trial-04-hunt-train
cd trial-04-hunt-train
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install requests pandas
pip freeze > requirements.txt
git init
code .
```

Estrutura sugerida:

```
trial-04-hunt-train/
├── coletar.py        # baixa da API e salva CSV
├── analisar.py       # lê CSV, processa, gera relatório
├── pokemon.csv       # gerado
├── relatorio.md      # gerado
├── requirements.txt
└── README.md
```

### Etapa 1: coletar

```python
"""coletar.py - baixa dados da PokeAPI e salva em CSV."""

import time
import requests
import pandas as pd

URL_BASE = "https://pokeapi.co/api/v2/pokemon"
TOTAL = 50  # primeiros 50 pokémons (geração 1, gen 1)


def buscar_pokemon(id_):
    """Busca um pokémon pelo id e devolve dict com os campos que importam."""
    response = requests.get(f"{URL_BASE}/{id_}", timeout=10)
    response.raise_for_status()
    data = response.json()

    return {
        "id": data["id"],
        "nome": data["name"],
        "altura_dm": data["height"],   # decímetros, conforme API
        "peso_hg": data["weight"],     # hectogramas
        "tipos": "/".join(t["type"]["name"] for t in data["types"]),
        "hp": data["stats"][0]["base_stat"],
        "ataque": data["stats"][1]["base_stat"],
        "defesa": data["stats"][2]["base_stat"],
        "velocidade": data["stats"][5]["base_stat"],
        "experiencia": data["base_experience"],
    }


def main():
    print(f"Coletando os primeiros {TOTAL} pokémons...")
    registros = []
    for i in range(1, TOTAL + 1):
        try:
            pkm = buscar_pokemon(i)
            registros.append(pkm)
            print(f"  [{i:03}] {pkm['nome']}")
            time.sleep(0.1)  # gentil com a API
        except requests.RequestException as e:
            print(f"  [{i:03}] FALHOU: {e}")

    df = pd.DataFrame(registros)
    df.to_csv("pokemon.csv", index=False, encoding="utf-8")
    print(f"\nSalvou {len(df)} linhas em pokemon.csv")


if __name__ == "__main__":
    main()
```

Rode com `python coletar.py`. Vai demorar uns 10-15 segundos. No fim
você tem `pokemon.csv` com 50 linhas.

**Comite**: `git add . && git commit -m "etapa 1: coletor da PokeAPI funcionando"`

### Etapa 2: analisar

```python
"""analisar.py - lê o CSV, calcula estatísticas, gera relatório."""

import pandas as pd
from datetime import datetime


def carregar(caminho="pokemon.csv"):
    return pd.read_csv(caminho)


def estatisticas_basicas(df):
    """Estatísticas gerais do dataset."""
    return {
        "total_registros": len(df),
        "hp_medio": df["hp"].mean(),
        "hp_max": df["hp"].max(),
        "hp_min": df["hp"].min(),
        "ataque_medio": df["ataque"].mean(),
        "defesa_media": df["defesa"].mean(),
    }


def top_5_por_hp(df):
    """Os 5 pokémons com mais HP."""
    return df.nlargest(5, "hp")[["nome", "tipos", "hp"]]


def por_tipo_principal(df):
    """Conta pokémons por tipo principal (primeiro tipo)."""
    df = df.copy()
    df["tipo_principal"] = df["tipos"].str.split("/").str[0]
    return df.groupby("tipo_principal").size().sort_values(ascending=False)


def gerar_relatorio(df):
    """Cria relatorio.md com as análises."""
    stats = estatisticas_basicas(df)
    top_hp = top_5_por_hp(df)
    por_tipo = por_tipo_principal(df)

    linhas = []
    linhas.append("# Hunt Train Tracker - Relatório PokeAPI\n")
    linhas.append(f"_Gerado em {datetime.now().strftime('%d/%m/%Y %H:%M')}_\n")
    linhas.append("\n## Estatísticas gerais\n")
    linhas.append(f"- Total de pokémons analisados: **{stats['total_registros']}**")
    linhas.append(f"- HP médio: **{stats['hp_medio']:.1f}**")
    linhas.append(f"- HP máximo: **{stats['hp_max']}**")
    linhas.append(f"- HP mínimo: **{stats['hp_min']}**")
    linhas.append(f"- Ataque médio: **{stats['ataque_medio']:.1f}**")
    linhas.append(f"- Defesa média: **{stats['defesa_media']:.1f}**\n")

    linhas.append("\n## Top 5 por HP\n")
    linhas.append("| Nome | Tipos | HP |")
    linhas.append("|---|---|---|")
    for _, row in top_hp.iterrows():
        linhas.append(f"| {row['nome']} | {row['tipos']} | {row['hp']} |")

    linhas.append("\n## Distribuição por tipo principal\n")
    linhas.append("| Tipo | Quantidade |")
    linhas.append("|---|---|")
    for tipo, qtd in por_tipo.items():
        linhas.append(f"| {tipo} | {qtd} |")

    with open("relatorio.md", "w", encoding="utf-8") as f:
        f.write("\n".join(linhas))


def main():
    df = carregar()
    print(f"Carregado: {len(df)} linhas")
    gerar_relatorio(df)
    print("Relatório gerado em relatorio.md")


if __name__ == "__main__":
    main()
```

Rode com `python analisar.py`. Abre o `relatorio.md` no VS Code, ou no
GitHub depois do push: tabela renderizada, estatísticas calculadas,
tudo pronto.

**Comite**: `etapa 2: analise pandas e relatorio markdown`

### Etapa 3 (opcional): gráfico

Se quer um diferencial extra, gere um gráfico simples:

```python
import matplotlib.pyplot as plt

def grafico_hp_por_tipo(df):
    df = df.copy()
    df["tipo_principal"] = df["tipos"].str.split("/").str[0]
    medias = df.groupby("tipo_principal")["hp"].mean().sort_values()

    fig, ax = plt.subplots(figsize=(10, 5))
    medias.plot(kind="barh", ax=ax, color="#7DD3F8")
    ax.set_title("HP médio por tipo principal")
    ax.set_xlabel("HP médio")
    plt.tight_layout()
    plt.savefig("hp_por_tipo.png", dpi=100)
    plt.close()
```

`pip install matplotlib`. No relatório, referencie a imagem:
`![HP por tipo](hp_por_tipo.png)`.

## Mecânicas opcionais

1. **Cache local**: se `pokemon.csv` existe, não baixa de novo (a menos que
   passe `--refresh`).
2. **CLI completa**: aceita argumento `python coletar.py --quantidade 150`.
3. **Filtros no relatório**: gerar relatórios separados por geração ou
   tipo.
4. **Outras APIs**: troque PokeAPI por OpenWeatherMap, Brasil API, ou
   qualquer outra.
5. **Logs estruturados**: usar o módulo `logging` em vez de `print`.
6. **Testes**: pelo menos uns 3 testes pytest na lógica de análise (sem
   precisar de internet).

## Clearing checklist

- [ ] `python coletar.py` baixa e salva CSV
- [ ] CSV tem 50+ linhas com colunas certas
- [ ] `python analisar.py` lê o CSV e gera `relatorio.md`
- [ ] Relatório renderiza certo no GitHub (tabelas, formatação)
- [ ] Tratamento de erro de rede (timeout, 404)
- [ ] `requirements.txt` listando `requests` e `pandas`
- [ ] README com setup, comandos, exemplo de saída
- [ ] Pelo menos 6 commits descrevendo a evolução

## Loot drop

Projeto de pipeline é ouro pra portfólio de júnior, especialmente se a
vaga toca em dados. README desse aqui deveria ter:

- Diagrama do pipeline (`coletar.py` → `pokemon.csv` → `analisar.py` → `relatorio.md`)
- Print de uma seção do relatório gerado (ou link direto pro `relatorio.md` no repo)
- Lista das estatísticas que o programa calcula
- Como rodar do zero (clone → venv → install → coletar → analisar)

Ponto bonus: configure GitHub Actions pra rodar o pipeline automaticamente
e atualizar o `relatorio.md` no repo (commit automático). Agora o relatório
fica sempre fresco e o seu repo demonstra automação.

Próximo Trial: **API do Aventureiro**. Você vai construir uma API REST com
FastAPI, com rotas, validação Pydantic, banco de dados. O projeto-âncora
do portfólio.
