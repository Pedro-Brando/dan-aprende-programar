---
title: APIs com requests · Linkshell call
description: Consumir APIs HTTP com a biblioteca requests. O jeito mais comum de seu programa falar com a internet. O linkshell pra outros sistemas.
---

**Linkshell** em FFXIV é o canal de comunicação cross-server: você fala
em Tonberry, alguém te ouve em Behemoth. **APIs HTTP são o linkshell do
seu programa**: ele faz uma chamada (request), o servidor remoto recebe,
processa, e devolve uma resposta (response). Esse capítulo é sobre a
biblioteca `requests`, a forma mais comum de fazer essas chamadas em
Python.

## API: o que é

API (Application Programming Interface) é um contrato. O servidor diz:
"Se você me mandar uma requisição assim, eu te devolvo um resultado assado".

A maioria das APIs modernas é REST sobre HTTP, devolvendo JSON. Exemplo
real: PokeAPI.

Vá em <https://pokeapi.co/api/v2/pokemon/1> no navegador. Você vê um
JSON gigante com info do Bulbasaur. Esse mesmo endpoint é o que seu
programa Python vai chamar.

## Instalando

```powershell
pip install requests
```

`requests` não vem na stdlib (mas é tão usado que parece padrão).

## Primeiro request

```python
import requests

response = requests.get("https://pokeapi.co/api/v2/pokemon/1")
print(response.status_code)
print(response.json()["name"])
```

Saída:

```text
200
bulbasaur
```

- `requests.get(url)` faz uma requisição HTTP GET.
- A função devolve um objeto `Response`.
- `response.status_code` é o número HTTP do resultado.
- `response.json()` parseia o corpo da resposta como JSON e devolve
  como dict (ou lista).

## Status codes

Os principais que você vai ver:

| Código | Significa |
|---|---|
| 200 | OK, deu certo |
| 201 | Criado (POST que criou recurso) |
| 204 | OK, sem conteúdo (DELETE bem-sucedido) |
| 301/302 | Redirecionamento |
| 400 | Você mandou request inválido |
| 401 | Não autenticado |
| 403 | Autenticado mas sem permissão |
| 404 | Não existe |
| 422 | Dados batem regra mas falham validação |
| 429 | Mandou request demais (rate limited) |
| 500 | Servidor quebrou |
| 503 | Servidor fora do ar |

Regra prática: 2xx é sucesso, 4xx é problema seu, 5xx é problema deles.

## Verificar se deu certo

```python
import requests

response = requests.get("https://pokeapi.co/api/v2/pokemon/9999")
if response.status_code == 200:
    data = response.json()
    print(data["name"])
else:
    print(f"Falhou com código {response.status_code}")
```

Padrão alternativo, mais limpo:

```python
response = requests.get("https://pokeapi.co/api/v2/pokemon/9999")
response.raise_for_status()  # levanta exceção se status for 4xx ou 5xx
data = response.json()
```

`raise_for_status()` levanta `HTTPError` se status for 4xx ou 5xx.
Combine com try/except:

```python
try:
    response = requests.get("https://pokeapi.co/api/v2/pokemon/9999", timeout=10)
    response.raise_for_status()
    data = response.json()
except requests.HTTPError as e:
    print(f"Erro HTTP: {e}")
except requests.Timeout:
    print("Timeout, demorou demais.")
except requests.ConnectionError:
    print("Sem conexão.")
```

## Timeout: SEMPRE use

```python
response = requests.get(url, timeout=10)
```

Sem `timeout`, se o servidor travar, seu programa fica esperando pra
sempre. **Sempre passe timeout em segundos**. 5-30 segundos é o range
típico.

## Parâmetros de query

Para `https://api.exemplo.com/buscar?nome=Y%27shtola&limite=10`:

```python
params = {
    "nome": "Y'shtola",
    "limite": 10,
}
response = requests.get("https://api.exemplo.com/buscar", params=params)
print(response.url)
# https://api.exemplo.com/buscar?nome=Y%27shtola&limite=10
```

`requests` cuida da codificação (espaços, acentos, caracteres especiais)
automaticamente. Não tente concatenar string à mão.

## Headers

Pra customizar headers (ex: User-Agent, Authorization):

```python
headers = {
    "User-Agent": "DanAprendeProgramar/1.0",
    "Accept": "application/json",
}
response = requests.get(url, headers=headers, timeout=10)
```

API que pede chave de autenticação geralmente espera um header tipo
`Authorization: Bearer SEU_TOKEN`:

```python
import os

token = os.environ["MEU_TOKEN_API"]
headers = {"Authorization": f"Bearer {token}"}
response = requests.get(url, headers=headers, timeout=10)
```

:::caution[Nunca comite token no git]
Token de API é segredo. Coloque em variável de ambiente, nunca direto
no código. Se acidentalmente commitar, considere o token vazado: gere
outro.
:::

## POST, PUT, DELETE

Outros métodos HTTP funcionam parecido:

```python
# POST: criar
response = requests.post(
    "https://api.exemplo.com/aventureiros",
    json={"nome": "Y'shtola", "job": "Sage"},
    timeout=10,
)
print(response.status_code)   # 201 esperado

# PUT: atualizar
response = requests.put(
    "https://api.exemplo.com/aventureiros/42",
    json={"nivel": 91},
    timeout=10,
)

# DELETE: remover
response = requests.delete(
    "https://api.exemplo.com/aventureiros/42",
    timeout=10,
)
print(response.status_code)   # 204 esperado
```

`json=...` é atalho. Faz dois favores:

1. Serializa o dict pra JSON
2. Adiciona o header `Content-Type: application/json`

Use sempre que mandar JSON.

## Sessions: reutilizar conexão

Pra muitas requests pra mesmo servidor, use `Session`:

```python
with requests.Session() as session:
    session.headers.update({"User-Agent": "MeuApp/1.0"})

    for id_ in range(1, 100):
        r = session.get(f"https://api.exemplo.com/item/{id_}", timeout=10)
        # processa r
```

Mais rápido que `requests.get` solto, porque reusa a conexão TCP.
Importante quando você faz centenas de requests.

## Rate limiting: seja gentil

Quase toda API limita quantos requests por minuto/hora você pode fazer.
Se ultrapassar, recebe 429.

Pra evitar:

```python
import time

for id_ in range(1, 1000):
    response = requests.get(f"https://api.exemplo.com/item/{id_}", timeout=10)
    response.raise_for_status()
    # processa
    time.sleep(0.1)   # 100ms entre requests = 10 por segundo
```

`time.sleep(N)` pausa por N segundos. Adapte conforme o limite da API
(documentação geralmente diz).

## Padrão de função pra consumir API

Boa prática: encapsule chamadas de API em funções pequenas:

```python
import requests

URL_BASE = "https://pokeapi.co/api/v2"


def buscar_pokemon(id_):
    """Busca um pokémon. Devolve dict ou None se não achou."""
    try:
        r = requests.get(f"{URL_BASE}/pokemon/{id_}", timeout=10)
        if r.status_code == 404:
            return None
        r.raise_for_status()
        return r.json()
    except requests.RequestException as e:
        print(f"Erro buscando pokemon {id_}: {e}")
        return None


# Uso:
p = buscar_pokemon(25)
if p:
    print(p["name"])      # pikachu
```

Vantagens:

1. Testável (pode mockar `requests.get`)
2. Reusável (chama de mil lugares sem repetir)
3. Centralizado (mudou a URL? muda em um lugar só)

## Exemplo completo: pega 5 pokémon

```python
import requests
import time

URL_BASE = "https://pokeapi.co/api/v2"


def buscar_pokemon(id_):
    r = requests.get(f"{URL_BASE}/pokemon/{id_}", timeout=10)
    r.raise_for_status()
    data = r.json()
    return {
        "id": data["id"],
        "nome": data["name"],
        "tipos": [t["type"]["name"] for t in data["types"]],
        "hp": data["stats"][0]["base_stat"],
    }


def main():
    for id_ in range(1, 6):
        try:
            p = buscar_pokemon(id_)
            print(f"#{p['id']:03d} {p['nome']:<12} tipos={p['tipos']} hp={p['hp']}")
            time.sleep(0.2)
        except requests.RequestException as e:
            print(f"Falhou pra id={id_}: {e}")


if __name__ == "__main__":
    main()
```

Saída esperada:

```text
#001 bulbasaur    tipos=['grass', 'poison'] hp=45
#002 ivysaur      tipos=['grass', 'poison'] hp=60
...
```

## Exercícios

1. **Primeiro GET**: crie `01-primeiro.py` que faz `requests.get` em
   `https://pokeapi.co/api/v2/pokemon/25` (pikachu). Imprima o nome
   e os tipos.

2. **Tratamento de erro**: crie `02-trata.py` com `try/except`
   capturando `requests.HTTPError`, `requests.Timeout`,
   `requests.ConnectionError`. Force cada um:
   - 404 com `id=99999`
   - timeout com `timeout=0.001`
   - connection error com URL inexistente.

3. **Lista por iteração**: crie `03-loop.py` que pega os 10 primeiros
   pokémon (id 1 a 10), com `time.sleep(0.2)` entre cada. Imprime tabela
   com nome e altura.

4. **Brasil API**: troque PokeAPI por Brasil API. Crie `04-cep.py` que
   consulta um CEP em `https://brasilapi.com.br/api/cep/v1/<cep>`. Pede
   CEP do usuário, busca, mostra rua/cidade.

5. **Comparar duas APIs**: crie `05-clima.py` que pergunta uma cidade
   e devolve clima dela. Use uma API gratuita: <https://openweathermap.org/>
   tem free tier mas precisa de chave. Se preferir sem chave, use
   wttr.in: `https://wttr.in/<cidade>?format=j1`.

6. **Encapsulando**: refator do exercício 4 pra função
   `buscar_cep(cep)`. Devolve dict ou `None`. Trate todos erros
   silenciosamente, devolvendo None.

## Você concluiu

- Você instala e usa `requests` para chamadas HTTP
- Você lê `status_code` e usa `raise_for_status()`
- Você passa `params=...`, `headers=...`, `json=...`, `timeout=...`
- Você diferencia GET, POST, PUT, DELETE
- Você trata erros de rede com try/except
- Você respeita rate limit das APIs

Próximo capítulo: **JSON · Tomestone format**. O formato que praticamente
toda API usa pra trocar dados.
