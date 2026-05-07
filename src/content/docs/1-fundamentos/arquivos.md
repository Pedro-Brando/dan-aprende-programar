---
title: Arquivos · Character save
description: 'Ler e escrever arquivos em disco. O save game do seu programa: o que escreve em arquivo sobrevive ao fechar o terminal.'
---

Toda vez que você sai de FFXIV, o servidor salva onde seu personagem
estava, o que tinha no inventário, em qual job estava equipado. Você fecha
o cliente, abre dois dias depois, e tudo continua exatamente igual. **Tudo
que você fez até aqui em Python morria quando o programa terminava**.
Variáveis, listas, dicionários: existiam só na memória. Nesse capítulo
você vai aprender a salvar e a ler de arquivos. É o save game do seu
código.

## Lendo um arquivo

O jeito moderno e seguro:

```python
with open("personagem.txt", encoding="utf-8") as f:
    conteudo = f.read()

print(conteudo)
```

O bloco `with open(...) as f:` é o padrão. Ele:

1. Abre o arquivo.
2. Dá pra você uma referência (`f`) pra ler/escrever.
3. **Fecha automaticamente** quando o bloco termina, mesmo se der erro.

Sem o `with`, você precisaria chamar `f.close()` manualmente, e se der
erro no meio, esquece e o arquivo fica aberto. Sempre use `with`.

## Modos de abertura

O segundo argumento do `open()` é o modo. Os mais comuns:

| Modo | O que faz |
|---|---|
| `"r"` | leitura (default) |
| `"w"` | escrita (apaga o conteúdo existente) |
| `"a"` | append (adiciona no fim, sem apagar) |
| `"r+"` | leitura e escrita |

```python
open("save.txt", "r")   # ler
open("save.txt", "w")   # escrever do zero
open("save.txt", "a")   # adicionar no fim
```

Sempre passe o `encoding="utf-8"` pra evitar dor com acentos no Windows:

```python
with open("save.txt", "r", encoding="utf-8") as f:
    ...
```

## Lendo de várias formas

### Tudo de uma vez

```python
with open("save.txt", encoding="utf-8") as f:
    conteudo = f.read()
print(conteudo)
```

`.read()` devolve a string com todo o arquivo. Bom pra arquivos pequenos.
Se o arquivo for de 4 GB, vai estourar a memória.

### Linha por linha

```python
with open("save.txt", encoding="utf-8") as f:
    for linha in f:
        print(linha.strip())
```

Iterar sobre o arquivo dá uma linha por iteração. **Isso escala**: dá
pra processar arquivo de qualquer tamanho linha por linha, sem carregar
tudo na memória. Note o `.strip()` pra tirar o `\n` do fim de cada linha.

### Como lista de linhas

```python
with open("save.txt", encoding="utf-8") as f:
    linhas = f.readlines()
print(linhas)   # ['linha 1\n', 'linha 2\n', ...]
```

Carrega todas as linhas numa lista. Útil pra processar em ordem aleatória
ou voltar atrás.

## Escrevendo

```python
with open("save.txt", "w", encoding="utf-8") as f:
    f.write("Nome: Y'shtola\n")
    f.write("Job: Sage\n")
    f.write("Nível: 90\n")
```

Note os `\n`: `write()` não adiciona quebra de linha sozinho. Se você
esquecer, tudo fica numa linha só.

### Várias linhas com `writelines`

```python
linhas = [
    "Nome: Y'shtola\n",
    "Job: Sage\n",
    "Nível: 90\n",
]

with open("save.txt", "w", encoding="utf-8") as f:
    f.writelines(linhas)
```

`writelines()` escreve todas as strings da lista, uma após a outra. Sem
adicionar `\n` automaticamente: você inclui na string.

### Escrita com `print` redirecionada

Truque útil:

```python
with open("save.txt", "w", encoding="utf-8") as f:
    print("Nome: Y'shtola", file=f)
    print("Job: Sage", file=f)
```

`print` aceita um argumento `file=` que redireciona a saída pro arquivo.
Adiciona `\n` automaticamente. Mais legível.

## Modo append (adicionar sem apagar)

```python
with open("log.txt", "a", encoding="utf-8") as f:
    f.write("Nova entrada\n")
```

Cada vez que rodar, adiciona uma linha no fim do arquivo. Útil pra log
de jogo, registro de ações.

## Caminhos de arquivo

Quando você passa só o nome do arquivo (`"save.txt"`), Python procura/cria
no **diretório atual** (onde você rodou `python ...`).

Se quiser caminho absoluto:

```python
with open("C:/Users/Dan/Documents/save.txt", encoding="utf-8") as f:
    ...
```

No Windows, prefira `/` (ou `\\` se insistir em backslash) pra evitar
confusão com escape sequences.

Para caminhos relativos a partir do script atual, e no estilo moderno
recomendado, use `pathlib`:

```python
from pathlib import Path

caminho = Path("data") / "save.txt"
caminho.write_text("Nome: Dan\n", encoding="utf-8")

texto = caminho.read_text(encoding="utf-8")
print(texto)
```

`pathlib` cuida de barras, junta caminhos, lida com Windows e Linux. Vamos
ver mais no Tomo II.

## Verificando se o arquivo existe

```python
from pathlib import Path

if Path("save.txt").exists():
    print("Achei.")
else:
    print("Não tem save ainda.")
```

Útil antes de tentar ler. Se você tentar ler arquivo inexistente:

```python
with open("inexistente.txt") as f:
    f.read()
```

Erro:

```text
FileNotFoundError: [Errno 2] No such file or directory: 'inexistente.txt'
```

Trate com try/except (capítulo passado) ou cheque com `Path(...).exists()`.

## Exemplo completo: ficha persistente

```python
from pathlib import Path

ARQUIVO = Path("personagem.txt")

def carregar():
    """Lê o arquivo e devolve um dicionário com os dados."""
    if not ARQUIVO.exists():
        return {}

    dados = {}
    with open(ARQUIVO, encoding="utf-8") as f:
        for linha in f:
            chave, valor = linha.strip().split(": ", 1)
            dados[chave] = valor
    return dados

def salvar(dados):
    """Escreve o dicionário no arquivo."""
    with open(ARQUIVO, "w", encoding="utf-8") as f:
        for chave, valor in dados.items():
            f.write(f"{chave}: {valor}\n")

# uso
personagem = carregar()
print("Personagem atual:", personagem)

personagem["nome"] = "Y'shtola"
personagem["job"] = "Sage"
personagem["nivel"] = "90"

salvar(personagem)
print("Salvo.")
```

Se você rodar duas vezes, na segunda vez o `carregar()` já vai trazer os
dados que você salvou antes. Saiu da memória, sobreviveu ao fechar o
programa.

## Lendo CSV (introdução)

CSV (Comma Separated Values) é um formato de arquivo onde cada linha é
um registro e os campos são separados por vírgula. Excel exporta nesse
formato. Pra ler, use o módulo `csv` da stdlib:

```python
import csv

with open("inventario.csv", encoding="utf-8") as f:
    reader = csv.reader(f)
    for linha in reader:
        print(linha)
```

Se cada linha do `inventario.csv` for `Allagan Tomestone,450,currency`,
o `linha` no loop é a lista `['Allagan Tomestone', '450', 'currency']`.

Mais sobre CSV no Tomo II, junto com Pandas.

## Boas práticas resumo

1. **Sempre use `with open(...) as f:`**. Garante fechamento.
2. **Sempre passe `encoding="utf-8"`**. Funciona consistente em
   Windows/Linux/Mac.
3. **Itere linha a linha** se o arquivo for grande, em vez de
   `f.read()`.
4. **Não esqueça o `\n`** quando escrever, ou tudo gruda em uma linha.
5. **Use `pathlib`** pra montar caminhos. Mais robusto que concatenação
   de strings.

## Exercícios

Para os exercícios, vamos criar e ler arquivos. Faça numa pasta dedicada
pra não bagunçar.

1. **Hello save**: crie `01-save.py` que escreve as linhas
   `"Olá, mundo"`, `"Estou aprendendo Python"`, `"Hoje é o dia X"` num
   arquivo `hello.txt`. Confira abrindo o arquivo no VS Code.

2. **Ler de volta**: crie `02-load.py` que lê o `hello.txt` do exercício
   anterior e imprime o conteúdo.

3. **Linha a linha**: crie `03-linhas.py` que lê o `hello.txt` linha por
   linha e imprime numerando: `1: Olá, mundo`, `2: Estou aprendendo`,
   etc.

4. **Append log**: crie `04-log.py` que abre `eventos.log` em modo `"a"`
   e adiciona a linha `"[timestamp] Login do aventureiro"` (use a string
   literal, não precisa de timestamp real ainda). Rode 3 vezes. Abra o
   arquivo: tem que ter 3 linhas iguais.

5. **Ficha persistente**: replique o exemplo "ficha persistente" do
   capítulo. Rode duas vezes. Confira que na segunda vez ele mostra os
   dados salvos antes.

6. **Contar palavras**: crie `06-contar.py` que pede um nome de arquivo,
   lê, e imprime quantas linhas, palavras e caracteres tem. Trate com
   try/except o caso de arquivo inexistente.

7. **Concatenar arquivos**: crie `07-concat.py` que lê dois arquivos
   (`a.txt`, `b.txt`) e escreve um terceiro (`c.txt`) com o conteúdo dos
   dois juntos. Crie os primeiros dois manualmente.

8. **Pathlib explore**: crie `08-pathlib.py` usando `Path` em vez de
   `open` direto. Use `Path("teste.txt").write_text(...)` e
   `.read_text(...)`.

## Você concluiu

- Você usa `with open(...) as f:` para qualquer leitura ou escrita.
- Você sabe os modos `"r"`, `"w"`, `"a"` e quando usar cada um.
- Você lê arquivo todo, linha por linha, ou como lista.
- Você escreve com `write()`, `writelines()`, ou `print(..., file=f)`.
- Você sabe o básico de `pathlib`.
- Você trata `FileNotFoundError` quando faz sentido.

Próximo capítulo: **Módulos · Job actions**. Última side-quest do Tomo I.
Você vai aprender a importar código de outros arquivos e da biblioteca
padrão, igual quando seu Paladin recebe Holy Spirit ao virar Job em vez
de Class.
