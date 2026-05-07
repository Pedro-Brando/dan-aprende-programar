---
title: Web scraping · Echo of the past
description: Extrair dados de páginas web com BeautifulSoup quando uma API pública não existe. Como o Echo, você acessa info que está na superfície mas precisa ser decifrada.
---

O **Echo** é o poder único do Warrior of Light: enxergar memórias e
verdades escondidas em pessoas e lugares. Não há API pra acessar essas
memórias; você só consegue lendo a "superfície" que está exposta. **Web
scraping é o mesmo princípio**: a informação está visível na página,
mas não tem API estruturada que devolva ela direto. Você baixa o HTML
e extrai com paciência. É menos elegante que API, mas às vezes é o que
você tem.

## Quando NÃO fazer scraping

Antes de qualquer coisa: **sempre prefira API se existir**.

Cheque:

1. O site tem uma página `/api`, `/developers`, ou link em footer?
2. Existe biblioteca terceira pra esse site específico (`pip search`)?
3. Tem um endpoint público mesmo que não documentado (Network tab do
   DevTools às vezes mostra)?

Se sim, use a API. **Scraping é frágil**: o site muda HTML, seu código
quebra. API muda mais devagar e dá garantias.

Vai pra scraping só quando:

- Não tem API pública.
- A API é paga e você quer testar antes.
- Você precisa de info muito específica que API não oferece.

## Aspectos legais e éticos

Antes de scrapear:

1. **Leia o `robots.txt`** do site (`https://exemplo.com/robots.txt`).
   Ele diz o que é permitido. Respeitar é boa prática (e pode ser
   exigido por contrato).
2. **Termos de uso**: alguns sites proíbem scraping explicitamente.
   Verifique.
3. **Rate limit**: não bombardeie. Use `time.sleep(1)` entre requests.
   Site pode bloquear seu IP, e está no direito.
4. **Não use scraping para spam, dados pessoais, ou dados de pagamento**.
   Isso abre processo.

Se você está aprendendo, prefira sites feitos pra serem scrapeados:

- <http://quotes.toscrape.com/> - oficial pra praticar
- <http://books.toscrape.com/> - idem
- <https://en.wikipedia.org> - permite (mas tem API melhor: Wikipedia API)

## Instalando BeautifulSoup

```powershell
pip install beautifulsoup4 requests
```

`beautifulsoup4` é o nome do pacote no PyPI. Quando você importa, o nome
é `bs4`:

```python
from bs4 import BeautifulSoup
```

## Primeiro scrape

Vamos pegar a primeira frase do "Quotes to Scrape":

```python
import requests
from bs4 import BeautifulSoup

URL = "http://quotes.toscrape.com/"

r = requests.get(URL, timeout=10)
r.raise_for_status()

soup = BeautifulSoup(r.text, "html.parser")

# Pega a primeira tag <span> com classe "text"
primeira_quote = soup.find("span", class_="text")
print(primeira_quote.get_text())
```

Saída:

```text
"The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking."
```

Etapas:

1. `requests.get` baixa o HTML como string.
2. `BeautifulSoup(html, "html.parser")` parseia o HTML em uma estrutura
   navegável.
3. `soup.find(tag, ...)` acha a primeira ocorrência da tag com filtros.
4. `.get_text()` extrai só o texto dentro.

## Selecionando elementos

### Por tag

```python
soup.find("h1")           # primeiro <h1>
soup.find_all("h1")       # todos os <h1> em lista
```

### Por classe

```python
soup.find("div", class_="quote")           # primeiro <div class="quote">
soup.find_all("span", class_="text")       # todos
```

Note: **`class_` com underscore**, porque `class` é palavra reservada
em Python.

### Por id

```python
soup.find(id="content")
```

### Por atributo qualquer

```python
soup.find("a", attrs={"data-id": "42"})
```

### CSS selectors (mais poderoso)

```python
soup.select_one(".quote")              # primeiro elemento com classe quote
soup.select(".quote .text")            # todos .text dentro de .quote
soup.select("div.quote span.text")     # equivalente
soup.select("a[href]")                 # todos <a> com href
```

`select` é o método mais flexível. Aceita qualquer CSS selector que
você usaria em CSS ou jQuery.

## Extraindo informação

### Texto

```python
elem = soup.find("span", class_="text")
print(elem.get_text())            # texto puro
print(elem.text)                  # alias, mesma coisa
print(elem.get_text(strip=True))  # tira espaços nas pontas
```

### Atributos

```python
link = soup.find("a")
print(link["href"])               # valor do href
print(link.get("href"))           # mesma coisa, devolve None se não tem
print(link.get("nonexistent", "default"))   # com default
```

### Elementos filhos

```python
for elem in soup.find_all("div", class_="quote"):
    texto = elem.find("span", class_="text").get_text()
    autor = elem.find("small", class_="author").get_text()
    print(f'{autor}: "{texto[:60]}..."')
```

## Exemplo completo: todas as frases da primeira página

```python
import requests
from bs4 import BeautifulSoup

URL = "http://quotes.toscrape.com/"

r = requests.get(URL, timeout=10)
r.raise_for_status()

soup = BeautifulSoup(r.text, "html.parser")
quotes = soup.select("div.quote")

print(f"Encontradas {len(quotes)} frases:\n")

for q in quotes:
    texto = q.select_one("span.text").get_text(strip=True)
    autor = q.select_one("small.author").get_text(strip=True)
    tags = [t.get_text() for t in q.select("a.tag")]
    print(f"{autor} ({', '.join(tags)})")
    print(f"  {texto}\n")
```

Saída (trecho):

```text
Albert Einstein (change, deep-thoughts, thinking, world)
  "The world as we have created it is a process of our thinking..."

J.K. Rowling (abilities, choices)
  "It is our choices, Harry, that show what we truly are..."
```

## Paginação

Quase todo site tem várias páginas. Padrão comum:

```python
import time
import requests
from bs4 import BeautifulSoup

URL_BASE = "http://quotes.toscrape.com/page/{}/"

todas_quotes = []
pagina = 1

while True:
    r = requests.get(URL_BASE.format(pagina), timeout=10)
    soup = BeautifulSoup(r.text, "html.parser")
    quotes = soup.select("div.quote")

    if not quotes:
        # página vazia significa que acabou
        break

    todas_quotes.extend(quotes)
    print(f"Página {pagina}: {len(quotes)} frases")

    pagina += 1
    time.sleep(1)   # gentil

print(f"Total: {len(todas_quotes)} frases")
```

Note o `time.sleep(1)`: 1 segundo entre requests. Suficiente pra
servidor não te bloquear.

## Limitações

### Sites que carregam por JavaScript

Muitos sites modernos carregam conteúdo via JavaScript depois da página
abrir. `requests` só pega o HTML inicial; conteúdo dinâmico não aparece.

Soluções (avançadas):

- **Selenium** ou **Playwright**: controlam navegador real, esperam JS
  carregar.
- **API endpoints internos**: às vezes você acha um JSON sendo carregado
  no Network tab e pode chamar direto.

Pra agora, foque em sites estáticos. Selenium é assunto pra outro
momento.

### Sites com proteção anti-bot

Cloudflare, reCAPTCHA, "verifying you're human"... a partir daí scraping
fica trabalho de profissional. Quase nunca vale o esforço pra estudante.

## Salvando o scrape

Geralmente você salva em CSV ou JSON pra usar depois:

```python
import csv

# ... scraping aqui, populando uma lista de dicts ...

with open("quotes.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["autor", "texto", "tags"])
    writer.writeheader()
    for q in todas_quotes:
        writer.writerow({
            "autor": q["autor"],
            "texto": q["texto"],
            "tags": "|".join(q["tags"]),
        })
```

Ou JSON:

```python
import json

with open("quotes.json", "w", encoding="utf-8") as f:
    json.dump(todas_quotes, f, ensure_ascii=False, indent=2)
```

## Padrão recomendado

Sempre que escrever scraper, encapsule:

```python
def parsear_quote(div):
    """Recebe um <div class="quote"> e devolve dict."""
    return {
        "texto": div.select_one("span.text").get_text(strip=True),
        "autor": div.select_one("small.author").get_text(strip=True),
        "tags": [t.get_text() for t in div.select("a.tag")],
    }


def baixar_pagina(numero):
    """Baixa e devolve lista de dicts da página N."""
    r = requests.get(f"http://quotes.toscrape.com/page/{numero}/", timeout=10)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
    return [parsear_quote(d) for d in soup.select("div.quote")]
```

Funções pequenas. Cada uma faz uma coisa. Fácil de testar.

## Exercícios

1. **Primeira página**: crie `01-quotes.py` que pega
   <http://quotes.toscrape.com/> e imprime as 10 primeiras frases com
   autor.

2. **Todas as páginas**: estende pra pegar todas as páginas usando o
   padrão de paginação. Conte o total de frases.

3. **Filtro por autor**: pega só as frases do autor "Albert Einstein"
   (vai aparecer em várias páginas). Use `if` durante a coleta.

4. **Books to Scrape**: vá em <http://books.toscrape.com/>. Pegue título,
   preço e nota (rating) dos primeiros 20 livros. Imprima como tabela.

5. **Salvar em JSON**: pegue o resultado do exercício anterior e salve
   num `livros.json` com indent=2.

6. **Wikipédia**: pegue a página <https://pt.wikipedia.org/wiki/Python>.
   Extraia a primeira frase do texto principal (a "intro" do artigo).
   Esse exercício é mais difícil porque a estrutura HTML é mais complexa.

## Você concluiu

- Você diferencia API (preferida) de scraping (último recurso)
- Você usa `requests` + `BeautifulSoup` pra baixar e parsear HTML
- Você seleciona elementos por tag, classe, id, atributo, e CSS selectors
- Você extrai texto e atributos de elementos
- Você lida com paginação respeitando rate limit
- Você sabe que sites com JS dinâmico precisam de Selenium/Playwright

Próximo capítulo: **Pandas básico · Damage parser**. Hora de processar
dados em escala. Igual o ACT (parser oficial não-oficial de FFXIV) lê
log de combate e calcula DPS.
