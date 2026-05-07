---
title: Variáveis · Inventory slot
description: Como guardar valores em nomes para reusar depois. O conceito mais fundamental de qualquer linguagem, e o que separa código de calculadora.
---

Imagine que você acabou de começar uma run de Stormblood e seu inventário
está vazio. Você loota uma Allagan tomestone, e agora ela ocupa um slot.
O slot tem uma posição (digamos, slot 1) e dentro dele está aquele item.
Você pode olhar pro slot 1 a qualquer momento, mover o item, soltar, gastar.
**Variáveis em Python funcionam igual ao seu inventário**: você dá um nome
a um slot, coloca um valor lá dentro, e pode usar o nome no resto do código
em vez de repetir o valor.

## A primeira variável

```python
nome = "Dan"
print(nome)
```

Saída:

```text
Dan
```

Leia o `=` como "guarde o que está à direita no slot chamado o que está à
esquerda". O nome da variável fica do lado esquerdo, o valor do lado
direito.

Depois de criada, você usa o nome da variável onde quiser:

```python
nome = "Dan"
print("Bem-vindo a Eorzea,", nome)
print(nome, "começa hoje sua jornada")
```

Saída:

```text
Bem-vindo a Eorzea, Dan
Dan começa hoje sua jornada
```

## Pode mudar o valor

Variável é mutável. Você pode trocar o que está dentro do slot:

```python
job = "Adventurer"
print(job)

job = "Gladiator"
print(job)

job = "Paladin"
print(job)
```

Saída:

```text
Adventurer
Gladiator
Paladin
```

A cada `=`, o valor anterior é descartado e o novo entra no lugar. O slot
do inventário continua sendo o mesmo `job`, mas o item dentro foi trocado.

## Reusando o valor para criar outras variáveis

```python
hp_inicial = 100
hp_atual = hp_inicial
print(hp_atual)
```

`hp_atual` recebe uma cópia do valor de `hp_inicial`. Os dois agora valem
100, mas são slots separados.

## Regras de nomes

Python aceita quase qualquer nome, com algumas regras:

1. **Não começa com número**. `1job` é proibido. `job1` está OK.
2. **Sem espaços**. Use underscore: `nome_do_personagem`, não `nome do personagem`.
3. **Sem caracteres especiais** (exceto underscore). Pode ter letra, número
   e `_`. Nada de `-`, `!`, `@`, `#`, etc.
4. **Sensível a maiúscula/minúscula**. `HP` e `hp` são duas variáveis
   diferentes. Não troque sem querer.
5. **Não use palavras reservadas do Python**. Algumas: `if`, `for`, `while`,
   `class`, `def`, `import`, `True`, `False`, `None`, `print`. Se você
   tentar `print = "oi"` o Python aceita, mas você quebra a função `print`
   pro resto do programa. Não faça.

## Convenção em Python: `snake_case`

Cada linguagem tem um estilo preferido para nomes. Em Python, é
**snake_case**: tudo minúsculo, palavras separadas por underscore.

```python
nome_do_personagem = "Dan"
hp_atual = 100
nivel_do_paladin = 50
ultimo_aetheryte_atunado = "The Crystarium"
```

Java prefere `camelCase` (`nomeDoPersonagem`). Constantes em vários idiomas
preferem `SCREAMING_SNAKE_CASE` (`HP_MAXIMO = 9000`). Em Python, fica
assim:

- Variáveis comuns: `snake_case`
- Constantes (valores que nunca mudam): `SNAKE_CASE_MAIUSCULO`

Você não vai escrever constantes ainda, mas anote.

## Bom nome > comentário

Compare:

```python
# ruim
x = 9000
y = x * 1.5

# bom
hp_maximo = 9000
hp_com_buff = hp_maximo * 1.5
```

O segundo bloco se explica sozinho. O primeiro precisa de comentário pra
fazer sentido. **Sempre invista o tempo de pensar em um nome bom**. É um
dos hábitos mais valiosos de quem programa profissionalmente. Ninguém em
entrevista te respeita por usar `x` e `y`.

## Atribuição múltipla

Você pode criar várias variáveis de uma vez:

```python
hp, mp, tp = 9000, 10000, 1000
print(hp, mp, tp)
```

Saída:

```text
9000 10000 1000
```

Cada nome do lado esquerdo recebe o valor da posição correspondente do
lado direito. Útil quando os valores são relacionados.

## Variável não é o valor: é um nome para o valor

Conceito sutil mas importante:

```python
job = "Paladin"
job_anterior = job

job = "Dark Knight"

print(job)
print(job_anterior)
```

Saída:

```text
Dark Knight
Paladin
```

`job_anterior` continua "Paladin" mesmo depois que `job` mudou, porque na
hora da atribuição `job_anterior = job`, o que foi copiado foi o valor
naquele momento ("Paladin"). Depois disso, são variáveis independentes.

Pense em `job` como uma etiqueta colada num item. Quando você cola a etiqueta
em outro item, a etiqueta antiga não muda.

:::tip[Sobre o termo "variável"]
O nome "variável" é meio confuso. O que varia não é o slot do inventário
(o nome) e sim o conteúdo. Em algumas linguagens há o conceito de "constante"
(slot que nunca muda). Em Python a convenção é usar nome em maiúsculas pra
sinalizar "trate como constante", mas o Python em si não impede você de
mudar.
:::

## Erros comuns

### Usar antes de criar

```python
print(nome)
nome = "Dan"
```

Erro:

```text
NameError: name 'nome' is not defined
```

Python lê o arquivo de cima pra baixo. Na hora do `print`, `nome` ainda
não existe. **Solução**: criar a variável antes de usá-la.

### Erro de digitação no nome

```python
nome_personagem = "Dan"
print(nome_persanagem)
```

Erro:

```text
NameError: name 'nome_persanagem' is not defined
```

Você criou `nome_personagem` e tentou usar `nome_persanagem` (typo). Python
não corrige. **Solução**: copiar o nome com cuidado. O Pylance no VS Code
ajuda muito com autocomplete pra evitar isso.

### Confundir maiúsculas

```python
HP = 9000
print(hp)
```

Erro:

```text
NameError: name 'hp' is not defined
```

`HP` é diferente de `hp`. **Solução**: padroniza num jeito só (recomendado:
sempre minúsculo).

## Exercícios

1. **Ficha de personagem**: crie `01-ficha.py` com cinco variáveis sobre um
   personagem inventado: `nome`, `raca`, `job`, `nivel`, `cidade_natal`.
   Use `print` pra mostrar uma frase com cada um. Exemplo de saída:

   ```text
   Nome: Aurelia Stormwind
   Raça: Elezen
   Job: White Mage
   Nível: 90
   Cidade natal: Ishgard
   ```

2. **Aetheryte teleport cost**: crie `02-teleport.py`. Defina `gil_atual = 50000`
   e `custo_teleport = 213`. Calcule e imprima `gil_apos_teleport` (use a
   subtração). Confirme que dá 49787.

3. **Promoção a Paladin**: crie `03-promocao.py`. Comece com
   `job = "Gladiator"`, imprima. Depois faça `job = "Paladin"` e imprima de
   novo. Mostra a evolução com texto explicando cada estado.

4. **Renomear**: crie `04-renomear.py` com a variável `personagem_principal = "Y'shtola"`.
   Crie uma segunda variável `companheira = personagem_principal`. Mude
   `personagem_principal` para `"Alphinaud"`. Imprima as duas. Pense porque
   o resultado é o que é (lembre da seção "Variável não é o valor").

5. **Snake_case forçado**: crie `05-nomes.py` com cinco variáveis no estilo
   wrong (`nomeDoPersonagem`, `HPmaximo`, `Cidade-Natal`, etc.) e refatore
   pra snake_case correto. Esse exercício é só sobre estilo, mas vai treinar
   o reflexo.

## Você concluiu

- Você sabe criar variáveis com `=` e usá-las depois.
- Você sabe que pode trocar o valor de uma variável.
- Você decora as regras de nome e a convenção `snake_case` do Python.
- Você sabe que variável é um nome pra um valor, não o valor em si.

Próximo capítulo: **Tipos de dados · Aether types**. Cada valor em Python
tem um tipo, igual cada feitiço em FFXIV tem um aspecto de aether (fogo,
gelo, raio). Você vai aprender a diferenciá-los e converter entre eles.
