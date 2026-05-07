---
title: Entrevista técnica · O pull final
description: O que cai em entrevista técnica de estágio Python. FizzBuzz, lógica básica, leitura de código, e como pensar em voz alta sem travar.
---

Estagiário com call do RH agendada na quinta às 14h. Esse é o **pull
final**: o momento onde quatro meses de estudo, cinco Trials no GitHub,
e um currículo enxuto convergem numa hora de conversa. Mecânica errada
e a party wipa. **Esse capítulo é o seu treino antes do pull**: o que
cai, como se preparar, e como sobreviver mesmo quando você não sabe a
resposta.

## O formato típico de entrevista técnica de estágio

Estágio raramente tem entrevista técnica de 4 horas com whiteboard
algorítmico. O formato comum:

1. **Conversa inicial sobre você** (5-10 min): "me fala sobre você", "por
   que tecnologia"
2. **Perguntas técnicas básicas** (10-20 min): conceitos de Python,
   estruturas de dados, OOP
3. **Live coding pequeno** (15-30 min): problema simples no compartilhamento
   de tela
4. **Leitura/explicação do seu código** (10-20 min): pegam um dos seus
   projetos do GitHub e perguntam
5. **Suas perguntas pra eles** (5-10 min)

Total: 45-60 minutos. Espera processo de 2-3 etapas: triagem RH →
técnica → comportamental/cultural.

## Live coding: o que esperar

Pra estagiário, **não é LeetCode hard**. Geralmente algo do tipo:

- FizzBuzz (1 a 100, "Fizz" pra múltiplos de 3, "Buzz" pra múltiplos de
  5, "FizzBuzz" pra ambos)
- Inverter uma string
- Achar o maior elemento de uma lista
- Contar quantas vogais tem numa palavra
- Verificar se uma palavra é palíndromo
- Somar pares de uma lista
- Achar duplicatas em uma lista
- Implementar uma função `media()`

Conhecer essas 10 coisas resolve 80% das entrevistas júnior em Python.

### FizzBuzz

```python
for i in range(1, 101):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
```

Note o `% 15` antes do `% 3` e `% 5`. Se inverter, o caso 15 nunca cai
em "FizzBuzz" porque o `% 3` pega antes. Pegadinha clássica.

### Inverter string

```python
def inverter(s):
    return s[::-1]
```

Mostra que você conhece slicing. Se entrevistador pedir sem usar slicing,
faz com loop:

```python
def inverter(s):
    resultado = ""
    for caractere in s:
        resultado = caractere + resultado
    return resultado
```

### Palíndromo

```python
def eh_palindromo(s):
    s = s.lower().replace(" ", "")
    return s == s[::-1]
```

`"arara"` é palíndromo. Faça a normalização (lower, sem espaço) primeiro.

### Vogais

```python
def contar_vogais(s):
    vogais = "aeiouAEIOU"
    return sum(1 for c in s if c in vogais)
```

`sum(1 for ...)` é um padrão Python comum. Pra júnior, vale também:

```python
def contar_vogais(s):
    contador = 0
    for c in s:
        if c.lower() in "aeiou":
            contador += 1
    return contador
```

### Achar duplicatas

```python
def achar_duplicatas(lista):
    vistos = set()
    duplicados = set()
    for item in lista:
        if item in vistos:
            duplicados.add(item)
        else:
            vistos.add(item)
    return list(duplicados)
```

## Pensar em voz alta (metade da nota)

A coisa mais importante numa entrevista técnica de júnior **não é a
resposta certa**. É **como você pensa**.

Modelo de raciocínio:

1. **Repete o problema**: "Ok, eu preciso retornar a maior temperatura
   da lista. Tem garantia que a lista não é vazia?"
2. **Pensa em voz alta sobre o approach**: "Posso fazer com loop e ir
   atualizando o máximo. Ou usar `max()` direto, mas vou fazer manual
   pra mostrar a lógica."
3. **Codifica explicando**: "Inicializo `maior` com o primeiro elemento.
   Aí itero do segundo em diante..."
4. **Testa mentalmente**: "Se a lista é [3, 7, 2], maior começa 3, vê
   7 (atualiza), vê 2 (não muda), retorna 7. Funciona."
5. **Pergunta sobre edge cases**: "E se a lista é vazia? Devo levantar
   exceção ou retornar None?"

Entrevistador anota:

- Você esclareceu o problema (✓)
- Você pensou antes de codar (✓)
- Você considerou alternativas (✓)
- Você testou (✓)
- Você pensou em edge cases (✓)

5 checkmarks. Mesmo se a resposta tiver bug, você recebe nota alta.

## O que NÃO fazer

- **Sair codando em silêncio** sem explicar nada. Entrevistador não
  consegue ajudar e não consegue avaliar.
- **Travar e ficar 5 min em silêncio**. Fala alguma coisa. "Estou
  pensando como abordar". Mantém o canal aberto.
- **Fingir que sabe**. Se não sabe, fala "não sei, vou tentar". Honesto >
  enrolar.
- **Brigar com entrevistador**. Se ele sugere uma melhoria, agradece e
  considera. Não defende sua versão por orgulho.

## Perguntas comuns sobre Python

Decore as respostas:

### Lista vs tupla?
Lista é mutável (`[]`), tupla é imutável (`()`). Tupla é mais rápida e
serve como chave de dicionário. Use tupla quando os itens não devem
mudar.

### Lista vs dicionário?
Lista é ordenada por índice numérico. Dicionário é por chave. Use lista
pra sequência de coisas similares, dicionário pra modelar uma "coisa"
com atributos.

### Mutável vs imutável?
Mutável: pode mudar depois de criado (lista, dict, set). Imutável: não
pode (int, float, str, tuple, bool, None). Strings são imutáveis em
Python (pegadinha pra quem vem de outras linguagens).

### `is` vs `==`?
`==` compara valor. `is` compara identidade (mesmo objeto na memória).
Pra checar `None`, sempre `is None`, não `== None`. Pra valores comuns,
sempre `==`.

### O que é GIL?
Global Interpreter Lock. Cadeado que permite só uma thread executar
Python por vez. Significa que threads em Python não dão speedup pra
trabalho CPU-bound; pra paralelismo real, usa multiprocessing. Pra I/O,
async ou threads ainda dão ganho.

### Decorator é o quê?
Função que recebe uma função e devolve outra. O `@nome` é açúcar pra
`f = nome(f)`. Usado pra logging, autenticação, cache, sem mexer no
código original.

### List comprehension?
Sintaxe compacta de criar lista a partir de outro iterável.
`[x*2 for x in lista if x > 0]` é equivalente a um loop com if + append.

### `*args` e `**kwargs`?
`*args` recolhe argumentos posicionais extras numa tupla. `**kwargs`
recolhe argumentos nomeados num dicionário. Usado quando a função
aceita número variável de argumentos.

## Explicando seu projeto

Eles vão pegar um dos seus repos e perguntar. Seja capaz de explicar:

- **O que o projeto faz** (em uma frase)
- **Por que você usou X tecnologia** (e não Y)
- **Onde foi a parte mais difícil**
- **O que você mudaria se fizesse de novo**
- **Como você testou**

Use a seção "Decisões técnicas" do README como roteiro. Se você escreveu
ela bem, já está preparado.

## Suas perguntas pra eles (importante)

No fim, sempre pergunte. Não pergunta significa "não me importo". Sugestões
pra estagiário:

- "Qual o tamanho do time? Quem seria meu mentor direto?"
- "Como é o processo de code review pra estagiários?"
- "Que tipo de projeto eu pegaria nos primeiros 3 meses?"
- "Como vocês acompanham a evolução de um estagiário durante o programa?"
- "Tem horário de trabalho fixo ou flexível? Como é a rotina remota?"

**Não pergunte salário** na primeira entrevista (RH abre depois).
**Não pergunte sobre férias** ainda. Foca em aprendizado, mentoria,
projeto.

## Antes da call: checklist

Hora antes:

- [ ] Câmera testada
- [ ] Microfone testado
- [ ] Conexão estável (rede ethernet > wifi se possível)
- [ ] Local quieto, fundo neutro
- [ ] Roupa: camiseta lisa ou camisa, sem pijama
- [ ] Água ao lado
- [ ] Caderno e caneta pra anotar
- [ ] CV aberto na tela 2 / impresso
- [ ] GitHub do entrevistador / da empresa lido (sabe pra onde aplicou)
- [ ] Bateria carregada / cabo conectado

5 minutos antes:

- [ ] Entra na call. Aguarda no lobby. Não atrasa nem 1 minuto.
- [ ] Respira. 4 segundos inspira, 4 segura, 4 expira. Funciona.

## Se você não souber uma resposta

Honesto > inventado.

```
"Honestamente, não conheço bem decoradores. Posso descrever conceitualmente
e tentar implementar com sua ajuda, ou prefere passar pra próxima?"
```

Recrutador anota: "honesto, sabe os limites do próprio conhecimento, sabe
pedir ajuda". Vence o "decora resposta de Stack Overflow".

## Action items

Antes da próxima entrevista:

- [ ] Resolva FizzBuzz, palíndromo e contar vogais sem olhar
- [ ] Treine explicar 1 dos seus 5 Trials em 2 minutos
- [ ] Decore as respostas das 8 perguntas Python comuns
- [ ] Prepare 3-5 perguntas pra fazer ao entrevistador
- [ ] Faça um mock interview com colega ou amigo

Sites bons pra praticar:

- **CodeWars** - <https://www.codewars.com/> - kata fáceis, perfeito pra
  júnior
- **HackerRank** - <https://www.hackerrank.com/> - tem trilha "Python"
- **LeetCode Easy** - <https://leetcode.com/> - foca só em "Easy" pra
  estágio

## Você concluiu

- Sabe o formato típico de entrevista técnica de estágio
- Resolve FizzBuzz e os 5-6 problemas mais comuns sem hesitar
- Sabe pensar em voz alta seguindo a estrutura: esclarecer → planejar →
  codar → testar → edge cases
- Decorou as 8 perguntas Python mais comuns
- Tem perguntas próprias pra fazer ao entrevistador

Próximo capítulo (e último): **Comportamental · Post-fight loot**. A parte
da entrevista que ninguém estuda mas reprova mais que a técnica.
