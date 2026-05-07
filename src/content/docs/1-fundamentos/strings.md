---
title: Strings · /yell
description: Texto em profundidade. Métodos essenciais, slicing, formatação, e os porquês de acentos quebrarem em alguns lugares. O canal /yell do Python.
---

`/yell` em FFXIV é o canal mais escandaloso. Letras grandes, alcance da
zona inteira, todo mundo te escuta. Quando precisa avisar "AOE NA AREA"
no meio de Eden Savage, é com /yell. **Strings em Python são as ferramentas
para qualquer texto que você manipule**: dos prompts mais discretos do
`input()` até os yells em caps de aviso de mecânica. Esse capítulo vai
fundo em como cortar, transformar, e formatar texto.

## Recapitulando o básico

```python
s = "Hydaelyn"
s = 'Hydaelyn'   # mesma coisa
s = "Y'shtola"   # aspas duplas pra string com '
s = 'They yelled "stack!"'   # aspas simples pra string com "
```

E você já viu f-string:

```python
nome = "Dan"
print(f"Olá, {nome}")
```

Agora vamos fundo.

## Strings são imutáveis

```python
s = "Eorzea"
s[0] = "B"   # TypeError
```

Você não pode mudar uma string "no lugar". Toda transformação devolve uma
**nova string**, e você atribui a uma variável (mesma ou outra):

```python
s = "Eorzea"
s = "B" + s[1:]   # nova string: "Borzea"
```

Igual a tupla, no capítulo passado. Lembra?

## Indexação e slicing

String é uma sequência de caracteres. Funciona igual lista:

```python
s = "Hydaelyn"
print(s[0])     # H
print(s[1])     # y
print(s[-1])    # n (último)
print(s[0:4])   # Hyda (do índice 0 ao 3)
print(s[4:])    # elyn (do 4 até o fim)
print(s[:4])    # Hyda
print(s[::-1])  # nyledayH (invertido)
```

Tudo que você sabe de slicing de lista vale.

## Concatenação e repetição

```python
"Bem" + "-" + "vindo"   # "Bem-vindo"
"=" * 20                # "===================="
"Eorzea " * 3           # "Eorzea Eorzea Eorzea "
```

Concatenação com `+` é OK pra duas ou três strings. Pra mais, prefira
**f-string** ou `.join()` (vamos ver).

## Tamanho e busca

```python
s = "The Crystal Tower"
print(len(s))               # 17
print("Tower" in s)         # True
print("Garlemald" in s)     # False
print(s.startswith("The"))  # True
print(s.endswith("Tower"))  # True
print(s.find("Crystal"))    # 4 (índice onde começa)
print(s.find("garlean"))    # -1 (não achou)
```

`find()` devolve `-1` se não acha. `index()` faz a mesma coisa mas dá
erro se não acha. `find` é mais seguro.

## Métodos de transformação

### Maiúsculas, minúsculas

```python
s = "Eorzea"
print(s.upper())       # EORZEA
print(s.lower())       # eorzea
print(s.title())       # Eorzea
print("/yell DAN".lower())   # /yell dan
```

`.upper()` é o seu /yell. `.lower()` é o /whisper.

### Tirar espaços nas pontas

```python
s = "   The Forbidden Land   "
print(s.strip())     # "The Forbidden Land"
print(s.lstrip())    # "The Forbidden Land   "
print(s.rstrip())    # "   The Forbidden Land"
```

`.strip()` é essencial pra processar entrada de usuário, que sempre vem
com espaço sobrando.

### Substituir

```python
s = "Eden Normal"
print(s.replace("Normal", "Savage"))   # "Eden Savage"
print(s)                                # ainda "Eden Normal" (string é imutável!)
```

### Quebrar em lista

```python
s = "Tank,Healer,DPS,DPS,DPS,DPS"
roles = s.split(",")
print(roles)   # ['Tank', 'Healer', 'DPS', 'DPS', 'DPS', 'DPS']
```

`split()` quebra a string num separador e devolve uma lista. Sem
argumento, quebra em qualquer espaço (útil pra processar uma linha de
texto).

```python
linha = "  Bardo  cantou  uma  song  "
palavras = linha.split()    # ['Bardo', 'cantou', 'uma', 'song']
```

### Juntar lista em string

```python
roles = ["Tank", "Healer", "DPS", "DPS"]
print(",".join(roles))     # "Tank,Healer,DPS,DPS"
print(" - ".join(roles))   # "Tank - Healer - DPS - DPS"
```

`.join()` é o oposto do `.split()`. A string que você chama é o
**separador**. Sintaxe meio invertida, mas é assim que é.

## Verificações

```python
"123".isdigit()        # True
"abc123".isdigit()     # False
"abc".isalpha()        # True
"Y'shtola".isalpha()   # False (apóstrofo não é letra)
"   ".isspace()        # True
"".isspace()           # False (string vazia)
```

Útil pra validar input do usuário antes de converter.

## f-string com formatação

Você já viu o básico. Lembrando os formatos mais úteis:

```python
gil = 1234567

print(f"{gil}")        # 1234567
print(f"{gil:,}")      # 1,234,567 (separador de milhar)
print(f"{gil:>15}")    # "        1234567" (alinhado à direita, largura 15)
print(f"{gil:<15}|")   # "1234567        |" (alinhado à esquerda)
print(f"{gil:^15}")    # "    1234567    " (centralizado)
print(f"{gil:0>10}")   # "0001234567" (preenche com zeros)

pct = 0.3456
print(f"{pct:.0%}")    # "35%" (porcentagem sem casas)
print(f"{pct:.2%}")    # "34.56%" (2 casas)

f = 3.14159
print(f"{f:.2f}")      # "3.14"
print(f"{f:.4f}")      # "3.1416"
print(f"{f:10.2f}")    # "      3.14"
```

Esse formato `:` dentro da chave da f-string é chamado de **format spec**.
Tem mais coisas (data, hexadecimal, etc.), mas esse subconjunto cobre
99% do que você vai precisar.

## Strings de várias linhas e raw strings

### Aspas triplas

```python
abertura = """
Bem-vindo a Eorzea.
A jornada começa aqui.
"""
print(abertura)
```

### Raw strings (`r"..."`)

Quando você quer que `\n` e outros escapes sejam tratados literalmente.
Útil pra caminhos no Windows e regex (capítulo futuro):

```python
caminho_normal = "C:\Users\Dan\Documents"   # erro: \U vira escape
caminho_raw = r"C:\Users\Dan\Documents"     # OK, exatamente como digitado
print(caminho_raw)
```

## Encoding (rápido, mas importante)

Strings em Python 3 são Unicode por default. Isso significa que **acentos
e emojis funcionam direto**:

```python
s = "Acentuação é tranquila"
print(s)
print(len(s))   # 22 (cada caractere conta como 1, mesmo os acentuados)
```

Quando você lê arquivo, principalmente arquivo gerado em outro sistema,
às vezes precisa especificar o encoding. UTF-8 é o padrão moderno e o
que você deve usar:

```python
with open("arquivo.txt", encoding="utf-8") as f:
    conteudo = f.read()
```

Se ver caracteres tipo `Ã©` em vez de `é`, é problema de encoding. Vamos
falar mais no capítulo de Arquivos.

## Concatenação eficiente

Para juntar muitas strings em loop, use `.join()` em vez de `+=`:

```python
# ruim (lento em loops grandes)
resultado = ""
for nome in nomes:
    resultado += nome + "\n"

# bom
resultado = "\n".join(nomes)
```

Não é diferença prática pra 10 strings. Mas pra 10000+, é dramática.

## Métodos cheat-sheet

| Método | O que faz |
|---|---|
| `.upper()`, `.lower()`, `.title()`, `.capitalize()` | mudar caixa |
| `.strip()`, `.lstrip()`, `.rstrip()` | tirar espaços |
| `.replace(antigo, novo)` | substituir |
| `.split(sep)` | quebrar em lista |
| `sep.join(lista)` | juntar lista em string |
| `.startswith(prefix)`, `.endswith(suffix)` | verificar começo/fim |
| `.find(s)`, `.index(s)` | índice de substring |
| `.count(s)` | quantas vezes aparece |
| `.isdigit()`, `.isalpha()`, `.isspace()` | classificar conteúdo |
| `len(s)` | tamanho |

## Exercícios

1. **Yell formatter**: crie `01-yell.py` com uma função `yell(msg)` que
   devolve a string em maiúsculo, com `"!!! "` no começo e no fim.
   Exemplo: `yell("aoe na area")` retorna `"!!! AOE NA AREA !!!"`.

2. **Limpa input**: crie `02-clean.py` com função
   `limpar(entrada)` que:
   - Tira espaços nas pontas
   - Converte pra minúsculo
   - Devolve a string limpa
   Use pra "padronizar" várias entradas: `"  Y'SHTOLA  "`, `"y'shtola"`,
   `"Y'Shtola"`. Confira que as três viram a mesma coisa.

3. **Lista de roles**: crie `03-parse-roles.py`. Pegue a string
   `"Tank, Healer , DPS, DPS , DPS, DPS"`. Use `split(",")` e depois um
   for que aplica `strip()` em cada item. Imprima a lista limpa.

4. **Joiner**: crie `04-join.py` com a lista
   `scions = ["Alphinaud", "Alisaie", "Y'shtola", "Urianger", "Thancred"]`.
   Use `.join()` pra produzir três outputs:
   - separados por `, ` → `"Alphinaud, Alisaie, ..."`
   - separados por ` & ` → `"Alphinaud & Alisaie & ..."`
   - cada um numa linha → use `"\n"`

5. **Tabela alinhada**: crie `05-tabela.py` com:
   ```python
   personagens = [
       ("Y'shtola", 90, "Sage"),
       ("Alphinaud", 88, "Summoner"),
       ("Aurelia", 50, "Paladin"),
   ]
   ```
   Imprima como tabela alinhada usando f-string:
   ```text
   Y'shtola   |  Lv 90 | Sage
   Alphinaud  |  Lv 88 | Summoner
   Aurelia    |  Lv 50 | Paladin
   ```

6. **Censurar**: crie `06-censura.py` com função `censurar(texto, palavra)`
   que substitui todas as ocorrências de `palavra` por `*` * len(palavra).
   Teste com `"Garlemald é o vilão. Garlemald não vai vencer."` e palavra
   `"Garlemald"`.

7. **Validar nome**: crie `07-validar.py` com função `validar_nome(nome)`
   que devolve `True` se: tem entre 3 e 20 caracteres, não começa com
   número, não é só espaços. Teste com vários casos.

8. **Conta vogais**: crie `08-vogais.py` com função `contar_vogais(s)`.
   Itere sobre a string, conte quantos caracteres estão em
   `"aeiouAEIOU"`. Teste com `"Hydaelyn"` (esperado: 4).

## Você concluiu

- Você usa indexação e slicing em string igual em lista.
- Você sabe os métodos essenciais: `upper`, `lower`, `strip`, `split`,
  `join`, `replace`, `startswith`, `endswith`.
- Você usa f-string com formatos avançados: alinhamento, casas decimais,
  porcentagem.
- Você sabe que strings são imutáveis e que toda transformação devolve
  uma nova.
- Você reconhece raw strings e sabe quando usar.

Próximo capítulo: **Erros e exceções · Wipe e raise**. Você vai aprender a
tratar erros sem deixar o programa morrer. O `try/except` é a Resurrection
do Python: dá uma segunda chance pra coisa que ia crashar.
