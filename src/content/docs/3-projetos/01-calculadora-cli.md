---
title: Trial 01 · Calculadora de Eorzea
description: Primeiro mini-projeto. Uma calculadora de linha de comando que junta tudo do Tomo I (input, output, condicionais, loops, funções, exceções) num único programa funcional.
---

Bem-vindo ao seu primeiro Trial. Você completou Sua Primeira Extreme,
domina as 14 mecânicas básicas, e agora a Guilda dos Aventureiros pediu
um item simples mas exigente: uma calculadora de gil. Os mercadores de
Limsa Lominsa querem fazer cálculos rápidos sem abrir o Excel. Sua tarefa
é entregar o programa.

## Briefing

Construa uma calculadora de terminal que:

- Pergunta uma operação (`+`, `-`, `*`, `/`)
- Pergunta dois números
- Mostra o resultado
- Repete até o usuário digitar `sair`
- Trata todos os erros possíveis sem crashar

**Tempo estimado**: 1-2 horas se você fez todos os exercícios do Tomo I.

## Loadout requerido

Conceitos do Tomo I que você vai usar:

- `input()` e cast para float
- f-strings
- Condicionais `if/elif/else`
- Loop `while`
- Funções com parâmetros e `return`
- `try/except` para `ValueError` e `ZeroDivisionError`

Se algum desses te trava, volta no capítulo correspondente antes.

## Strat

### Setup do projeto

```powershell
cd C:\Users\seu-nome\Documents\python
mkdir trial-01-calculadora
cd trial-01-calculadora
code .
```

No VS Code, crie `calculadora.py`. Crie também `README.md` (você vai preencher
depois pro GitHub). E inicia git localmente:

```powershell
git init
```

### Versão 1: prova de conceito

Comece com o caminho feliz. Sem tratamento de erro, sem loop. Só pra ver
a mecânica funcionando:

```python
print("Calculadora de Eorzea v1.0")

operacao = input("Operação (+, -, *, /): ")
a = float(input("Primeiro número: "))
b = float(input("Segundo número: "))

if operacao == "+":
    resultado = a + b
elif operacao == "-":
    resultado = a - b
elif operacao == "*":
    resultado = a * b
elif operacao == "/":
    resultado = a / b
else:
    resultado = "operação inválida"

print(f"Resultado: {resultado}")
```

Rode com `python calculadora.py`. Faça `5 + 3`, confira que dá `8.0`.
Faça `10 / 0`, vê o programa quebrar com `ZeroDivisionError`. Esse é o
ponto.

**Comite**: `git add . && git commit -m "v1: caminho feliz da calculadora"`

### Versão 2: extrair pra função

Programa cresce. Tira a lógica de cálculo pra uma função separada:

```python
def calcular(a, b, operacao):
    """Faz a conta entre a e b conforme a operação. Devolve o resultado."""
    if operacao == "+":
        return a + b
    elif operacao == "-":
        return a - b
    elif operacao == "*":
        return a * b
    elif operacao == "/":
        return a / b
    else:
        return None

print("Calculadora de Eorzea v2.0")

operacao = input("Operação (+, -, *, /): ")
a = float(input("Primeiro número: "))
b = float(input("Segundo número: "))

resultado = calcular(a, b, operacao)
if resultado is None:
    print("Operação inválida.")
else:
    print(f"Resultado: {resultado}")
```

`is None` é o jeito certo de comparar com `None`. Não use `== None`.

**Comite**: `v2: extrai funcao calcular`

### Versão 3: loop

Calculadora vira útil quando faz mais de uma conta:

```python
def calcular(a, b, operacao):
    if operacao == "+":
        return a + b
    elif operacao == "-":
        return a - b
    elif operacao == "*":
        return a * b
    elif operacao == "/":
        return a / b
    else:
        return None


def main():
    print("=" * 40)
    print("Calculadora de Eorzea v3.0")
    print("Digite 'sair' a qualquer momento pra encerrar.")
    print("=" * 40)

    while True:
        operacao = input("\nOperação (+, -, *, / ou 'sair'): ")
        if operacao == "sair":
            print("Até a próxima, aventureiro.")
            break

        a = float(input("Primeiro número: "))
        b = float(input("Segundo número: "))

        resultado = calcular(a, b, operacao)
        if resultado is None:
            print("Operação inválida.")
        else:
            print(f"Resultado: {resultado}")


if __name__ == "__main__":
    main()
```

Note o padrão `if __name__ == "__main__":` que você viu no capítulo de
módulos.

**Comite**: `v3: loop principal e main()`

### Versão 4: tratamento de erros

Agora o programa não pode crashar pra nada. Envolva os pontos perigosos
em `try/except`:

```python
def calcular(a, b, operacao):
    if operacao == "+":
        return a + b
    elif operacao == "-":
        return a - b
    elif operacao == "*":
        return a * b
    elif operacao == "/":
        if b == 0:
            raise ValueError("Divisão por zero.")
        return a / b
    else:
        return None


def pedir_numero(mensagem):
    """Pede um número até o usuário digitar algo válido."""
    while True:
        entrada = input(mensagem)
        try:
            return float(entrada)
        except ValueError:
            print(f"'{entrada}' não é um número. Tenta de novo.")


def main():
    print("=" * 40)
    print("Calculadora de Eorzea v4.0")
    print("Digite 'sair' a qualquer momento pra encerrar.")
    print("=" * 40)

    while True:
        operacao = input("\nOperação (+, -, *, / ou 'sair'): ").strip()
        if operacao == "sair":
            print("Até a próxima, aventureiro.")
            break

        a = pedir_numero("Primeiro número: ")
        b = pedir_numero("Segundo número: ")

        try:
            resultado = calcular(a, b, operacao)
        except ValueError as e:
            print(f"Erro: {e}")
            continue

        if resultado is None:
            print("Operação inválida.")
        else:
            print(f"Resultado: {resultado}")


if __name__ == "__main__":
    main()
```

Essa é a versão final que você vai entregar. Robusta, limpa, com
funções com responsabilidades claras.

**Comite**: `v4: tratamento de erros completo`

## Mecânicas opcionais (stretch goals)

Se você terminou o básico antes do tempo, escolha 1 ou 2 destas pra
incrementar:

1. **Histórico**: guardar cada operação numa lista e oferecer comando
   `historico` que mostra os últimos 10 cálculos.
2. **Operações extras**: adicionar `**` (potência), `//` (divisão inteira),
   `%` (resto).
3. **Persistir histórico**: salvar o histórico num arquivo JSON. Toda vez
   que o programa abrir, carrega.
4. **Modo expressão**: aceitar `5 + 3` numa só linha em vez de pedir
   separadamente. Use `split()` e converta cada parte.
5. **Resultado anterior**: aceitar `ans` como referência ao último
   resultado. Tipo: `ans + 5` usa o último valor calculado.

## Clearing checklist

Antes de declarar a trial completa, confira:

- [ ] Roda sem erro `python calculadora.py`
- [ ] Faz +, -, *, / corretamente com inteiros e decimais
- [ ] Não crasha com input não-numérico (pede de novo)
- [ ] Não crasha com divisão por zero (mostra erro)
- [ ] Não crasha com operação inválida
- [ ] Sai limpo com `sair`
- [ ] Pelo menos 4 commits no git, descrevendo a evolução
- [ ] Tem `README.md` (próxima seção)

## Loot drop

### O README

Crie um `README.md` na raiz do projeto. Modelo mínimo:

```markdown
# Calculadora de Eorzea

Calculadora de linha de comando feita como Trial 01 do guia
[Dan Aprende a Programar](https://pedro-brando.github.io/dan-aprende-programar/).

## O que faz

Lê duas operandos e uma operação (+, -, *, /), mostra o resultado.
Roda em loop até o usuário digitar `sair`. Trata input inválido,
operação desconhecida e divisão por zero.

## Como rodar

```powershell
python calculadora.py
```

## Conceitos exercitados

- Input/output e cast pra float
- Funções com `return`
- Loop `while True` com `break`
- Tratamento de exceções com `try/except`
- Padrão `if __name__ == "__main__":`
```

### Subir no GitHub

```powershell
git remote add origin https://github.com/seu-username/calculadora-de-eorzea.git
git branch -M main
git push -u origin main
```

(Crie o repo no GitHub primeiro, com o nome que você preferir.)

Pronto. Primeiro projeto público no portfólio. **Pegue uma água, marque o
Trial 01 como cleared, e respire**. O resto da trilha vai escalando, mas
você acabou de provar que consegue construir software pequeno e robusto
sozinho.

Próximo Trial: **Echo Journal**. Lista de tarefas com persistência em
JSON. Mais arquivos, mais estruturas, mas tudo seguindo a mesma fórmula.
