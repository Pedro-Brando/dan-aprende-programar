---
title: Erros e exceções · Wipe e raise
description: 'Como ler erros do Python sem pânico, e como tratar com try/except quando algo pode dar errado. O White Mage do código: salva quem ia crashar.'
---

Nada quebra mais o ritmo de uma raid do que wipar na ultima fase. O boss
solta uma mecânica nova, ninguém esperava, party morre. **Erros em Python
são wipes**: a engine vê algo que não consegue executar, para tudo, e
imprime o traceback (o registro do que estava acontecendo). E igual numa
raid de verdade, o time não desiste no primeiro wipe: o White Mage usa
**raise**, levanta quem caiu, e a party tenta de novo. **`try/except` é
o seu raise**: pega o erro antes do programa morrer e dá um caminho
alternativo.

## Anatomia de um traceback

```python
nome = "Alphinaud"
idade = int(nome)
print(idade)
```

Saída:

```text
Traceback (most recent call last):
  File "exemplo.py", line 2, in <module>
    idade = int(nome)
ValueError: invalid literal for int() with base 10: 'Alphinaud'
```

Como ler:

1. **Última linha**: o tipo do erro (`ValueError`) e a mensagem
   (`invalid literal for int()...`). É a parte mais importante.
2. **Linha do meio**: o código que causou o erro. Aqui foi `idade = int(nome)`.
3. **Linha "File ...", "line N"**: onde no código aconteceu.

A mensagem de erro é descritiva. Ela está te dizendo: "tentei converter
a string 'Alphinaud' pra int e não consegui". Faz sentido. Lendo, você
sabe o que consertar.

:::tip[Reflexo]
Sempre comece a leitura pela última linha do traceback. É lá que está a
verdade. As linhas acima dão contexto, especialmente útil quando o erro
acontece dentro de uma função que está dentro de outra função.
:::

## Tipos de erro mais comuns

| Erro | Quando aparece |
|---|---|
| `SyntaxError` | Código mal-formado (parênteses, dois pontos faltando) |
| `NameError` | Usou um nome que não existe (typo, ou esqueceu de criar) |
| `TypeError` | Operação com tipo errado (somar str + int) |
| `ValueError` | Tipo certo, valor errado (`int("abc")`) |
| `IndexError` | Índice fora do tamanho da lista |
| `KeyError` | Chave que não existe no dicionário |
| `ZeroDivisionError` | Dividir por zero |
| `FileNotFoundError` | Arquivo que não existe |
| `AttributeError` | Acessou um método/atributo que o objeto não tem |
| `IndentationError` | Indentação inconsistente |

Decora os 5 primeiros. Você vai ver eles toda semana.

## `try/except`: pegando o erro

Sintaxe básica:

```python
try:
    idade = int(input("Idade: "))
    print(f"Daqui a 10 anos: {idade + 10}")
except ValueError:
    print("Você precisa digitar um número.")
```

Como funciona:

1. Python tenta rodar o bloco do `try`.
2. Se rolar tudo bem, o `except` é ignorado.
3. Se acontecer um `ValueError`, em vez de crashar, Python pula pro
   `except` e roda o bloco de lá.

```text
Idade: vinte
Você precisa digitar um número.
```

Em vez do programa morrer feio, ele fala normalmente com o usuário.

## Capturar o objeto do erro

Você pode pegar o erro como variável e ler a mensagem:

```python
try:
    idade = int("vinte")
except ValueError as e:
    print(f"Erro detectado: {e}")
```

Saída:

```text
Erro detectado: invalid literal for int() with base 10: 'vinte'
```

`as e` salva o objeto exception em `e`. Útil pra log, pra debug, ou pra
mostrar mensagem específica.

## Múltiplos `except`

Você pode pegar tipos diferentes em blocos separados:

```python
try:
    nome = input("Personagem: ")
    indice = int(input("Índice: "))
    party = ["Tank", "Healer", "DPS"]
    print(party[indice])
except ValueError:
    print("Índice tem que ser número.")
except IndexError:
    print("Índice fora da party.")
```

A ordem importa: Python tenta cada `except` na ordem que estão escritos
até achar um que combine.

## Capturar vários tipos de uma vez

Se você quer tratar duas exceções igual:

```python
try:
    valor = int(input("Valor: "))
    resultado = 100 / valor
    print(resultado)
except (ValueError, ZeroDivisionError) as e:
    print(f"Entrada inválida: {e}")
```

Tupla com os tipos. Bom pra "qualquer um destes me preocupa do mesmo
jeito".

## `else` e `finally`

Versão completa:

```python
try:
    valor = int(input("Valor: "))
except ValueError:
    print("Não é número.")
else:
    print(f"Você digitou {valor}.")
finally:
    print("Fim do bloco.")
```

- `else` roda **se o try não levantou exceção**. Use pro código que só
  faz sentido se o try foi sucesso.
- `finally` roda **sempre**, com ou sem erro. Use pra limpeza (fechar
  arquivo, soltar conexão).

Você vai usar `finally` mais quando trabalhar com arquivos e bancos de
dados.

## Levantando exceção: `raise`

Você não só pega exceções, você também pode **levantar**:

```python
def calcular_dps(dano, tempo):
    if tempo <= 0:
        raise ValueError("Tempo precisa ser positivo.")
    return dano / tempo

print(calcular_dps(1000000, 200))   # 5000.0
print(calcular_dps(1000000, 0))     # ValueError
```

`raise TipoDeErro(mensagem)` lança um erro. Útil quando sua função recebe
input ruim e você prefere falhar cedo (com mensagem clara) do que rodar
errado.

Em FFXIV, `raise` é o comando do Healer pra ressuscitar alguém. Em Python,
`raise` é o programa avisando "alguém vai precisar tratar isso".

## Quando não usar try/except

Cuidado com **engolir erro**:

```python
try:
    fazer_algo_importante()
except:
    pass    # ignora qualquer erro silenciosamente
```

Isso é antipattern. Você está escondendo bug. Em vez:

1. **Capture só o tipo específico** que você espera (`except ValueError:`,
   não `except:`).
2. **Faça algo significativo** no except: log, mensagem clara, valor
   default. Não só `pass`.

Regra geral: try/except deveria ser usado para **erros que você
antecipa e tem como responder**, não pra esconder bugs do código.

## Padrão "EAFP"

Python tem uma filosofia chamada **EAFP**: Easier to Ask Forgiveness than
Permission. Em vez de checar tudo antes:

```python
# checagem prévia (LBYL: Look Before You Leap)
if "nome" in personagem:
    print(personagem["nome"])

# pedir perdão (EAFP: Easier to Ask Forgiveness than Permission)
try:
    print(personagem["nome"])
except KeyError:
    print("Sem nome.")
```

A filosofia EAFP é mais comum em Python. Em código de produção, escolha
caso a caso o que fica mais legível.

## Programa final: leitor de party robusto

```python
def pegar_membro_party(party, indice_str):
    """
    Devolve o membro da party no índice dado.
    Trata todos os erros possíveis com mensagens claras.
    """
    try:
        indice = int(indice_str)
    except ValueError:
        return f"Erro: '{indice_str}' não é um número."

    try:
        return party[indice]
    except IndexError:
        return f"Erro: índice {indice} fora da party (tamanho {len(party)})."

party = ["Tank", "Healer", "DPS1", "DPS2"]

print(pegar_membro_party(party, "0"))      # Tank
print(pegar_membro_party(party, "10"))     # Erro: índice 10 fora da party (tamanho 4).
print(pegar_membro_party(party, "abc"))    # Erro: 'abc' não é um número.
```

Note o padrão: cada erro previsível tem seu try/except, com mensagem
útil. O programa nunca crasha, mesmo com input maluco.

## Exercícios

1. **Idade segura**: crie `01-idade.py` que pede a idade do usuário com
   `input()` e converte com `int()`. Trate o `ValueError`: se o usuário
   digitar texto, imprime "Idade tem que ser número" e termina sem crashar.

2. **Divisão sem pânico**: crie `02-div.py` que pede dois números e divide.
   Trate `ValueError` (não-número) e `ZeroDivisionError` (divisão por
   zero) com mensagens distintas.

3. **Lookup robusto**: crie `03-lookup.py` com o dicionário do hunting log
   do capítulo passado. Pergunte qual monstro consultar. Use try/except
   pra tratar `KeyError` (monstro não existe) com uma mensagem amigável.

4. **Lista com índice seguro**: crie `04-indice.py` com uma lista de 5
   nomes. Pergunte um índice. Trate `ValueError` e `IndexError`
   separadamente.

5. **Função que valida**: crie `05-validate.py` com a função
   `set_nivel(nivel)` que recebe um inteiro. Se for menor que 1 ou maior
   que 90, levante `ValueError("Nível inválido")`. Senão devolve o nível.
   Teste chamando com 50 (OK), -5 (erro), 100 (erro), e capturando o erro
   do lado de fora.

6. **EAFP vs LBYL**: crie `06-eafp.py`. Dado um dicionário com chaves
   `"hp"`, `"mp"`, `"tp"`, escreva duas versões da mesma função
   `print_recurso(personagem, recurso)`:
   - Versão LBYL: usa `if recurso in personagem:`
   - Versão EAFP: usa `try/except KeyError`
   
   Teste as duas com chave que existe e que não existe.

7. **Programa robusto**: pegue um dos seus exercícios anteriores
   (calculadora, ficha de personagem) e adicione try/except em todo input
   numérico. O programa não pode crashar, importa o que o usuário digite.

## Você concluiu

- Você lê traceback de baixo pra cima e identifica o tipo do erro.
- Você reconhece os 5+ tipos mais comuns: `ValueError`, `TypeError`,
  `NameError`, `IndexError`, `KeyError`.
- Você usa `try/except` pra capturar erros previsíveis.
- Você usa `raise` pra levantar erros nas suas próprias funções.
- Você sabe que engolir erro genericamente é antipattern.

Próximo capítulo: **Arquivos · Character save**. Você vai aprender a ler e
escrever em disco, igual o jogo salva sua ficha de personagem entre
sessões.
