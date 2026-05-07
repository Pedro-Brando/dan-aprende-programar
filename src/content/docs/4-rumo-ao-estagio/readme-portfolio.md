---
title: README de portfólio · Trophy room
description: Como escrever README de projeto que faz recrutador entender e querer rodar em 30 segundos. Cada projeto pinado é um troféu, e o README é a vitrine.
---

Em FFXIV, conquistas (achievements) ficam exibidas no Lodestone como
troféus. "Cleared Eden Savage Tier 1", "Diadem maxed", "Crafter de todas
as classes em 90". O troféu não vale nada sozinho: o que conta é a vitrine
que mostra ele. **README é a vitrine de cada projeto seu**. Sem README
bom, recrutador vê só o nome do repo e a primeira linha de código. Com
README bom, ele entende em 30 segundos o que você fez, por que fez, como
rodar, e por que isso é impressionante.

## A regra dos 30 segundos

Recrutador abre seu repo. Em 30 segundos, ele decide se vai investir mais
tempo ou voltar pra próxima candidatura. O README precisa, nessa janela:

1. Dizer o que o projeto **faz** (em 1 frase)
2. Dizer **como rodar** (3-5 comandos)
3. Mostrar uma **screenshot ou GIF** se aplicável
4. Listar **stack/tecnologias**
5. (Bonus) Mostrar **decisões técnicas**

Tudo o que vier depois disso é cereja.

## Estrutura recomendada

```markdown
# Nome do Projeto

> Frase de uma linha que descreve o projeto.

[Screenshot ou GIF se for visual]

## O que faz

Parágrafo de 3-4 linhas detalhando o que o projeto faz e quem é o
público-alvo.

## Stack

- Linguagem: Python 3.11
- Framework: FastAPI
- Banco: SQLite via SQLAlchemy
- Testes: pytest

## Como rodar

```powershell
git clone https://github.com/seu-user/projeto.git
cd projeto
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py
```

## Estrutura

```
projeto/
├── app/
│   ├── main.py
│   └── models.py
├── tests/
└── requirements.txt
```

## Decisões técnicas

- **Por que SQLite?** Projeto pequeno, persistência local suficiente,
  zero setup.
- **Por que Pydantic?** Validação declarativa + integração natural com
  FastAPI.
- **Sem autenticação:** escopo do projeto é praticar CRUD; auth fica
  pra v2.

## Próximos passos

- [ ] Adicionar autenticação JWT
- [ ] Migrar para Postgres
- [ ] Cobertura de testes acima de 90%
```

## A primeira linha vale por tudo

Recrutador lê **a primeira linha** do README e decide se segue. Compare:

```
# Calculadora
```

vs.

```
# Calculadora de Eorzea

> Calculadora de linha de comando feita em Python puro,
> com tratamento robusto de erros e arquitetura limpa.
```

O primeiro parece projeto abandonado de aluno entediado. O segundo já
contextualiza: o nome temático mostra criatividade, a frase explica
escopo e qualidade. Mesmo projeto, uma versão recebe clique, a outra
não.

## Screenshot/GIF: o que muda tudo

Para projetos visuais (CLI, web, GUI), uma imagem ou GIF demonstrando o
projeto rodando aumenta drasticamente o engajamento.

### Como gravar GIF de CLI

Ferramentas:

- **Asciinema** (`asciinema.org`) - terminal recording, gera link.
- **ScreenToGif** (Windows, gratuito) - GIF de qualquer parte da tela.
- **LICEcap** (Mac/Win, gratuito) - GIF simples.

Grave 10-15 segundos do programa fazendo as principais operações. Salve
como `demo.gif` na raiz do repo. Coloque no README:

```markdown
![Demo](demo.gif)
```

Pronto. O recrutador vê o programa rodando antes mesmo de ler.

### Para APIs

Print do Swagger UI (`/docs`) em ação, mostrando os endpoints. Coloque
sobre uma seção "API Documentation".

### Para projetos de dados

Print de uma tabela do relatório, ou de um gráfico gerado. Mesmo um
recorte do CSV.

## Badges (com moderação)

Badges são aqueles selos coloridos no topo do README. Quando bem usados,
dão informação rápida. Quando mal usados, parecem firula:

```markdown
![Python](https://img.shields.io/badge/python-3.11-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Tests](https://github.com/user/projeto/workflows/tests/badge.svg)
```

**Bons usos**:

- Versão de linguagem/runtime
- Status de CI (testes passando)
- Cobertura de testes
- Licença
- Versão do projeto

**Maus usos** (parecem decoração):

- "Made with love"
- "Powered by coffee"
- Mais de 6 badges em sequência

Use 2-4 que sejam **informação real**.

## Decisões técnicas: a seção que diferencia

Quase todo README júnior só tem "como rodar". O que separa o seu é a
seção **Decisões técnicas**. Aqui você explica os porquês das suas
escolhas:

```markdown
## Decisões técnicas

- **Por que SQLite e não Postgres?**
  O projeto é solo, escopo pequeno, e SQLite vem com Python. Migração para
  Postgres é trivial via SQLAlchemy quando precisar.

- **Por que Pydantic em vez de validar manualmente?**
  Validação declarativa é mais legível e o erro 422 da FastAPI já vem
  formatado. Manual seria reinventar a roda.

- **Sem autenticação?**
  Escopo do exercício é praticar CRUD. Adicionar auth seria complicar
  sem ensinar mais sobre o que eu queria praticar.
```

Por que isso é importante? Porque mostra **maturidade técnica**. Você
pensou nos trade-offs. Não é macaco copiando tutorial. Em entrevista,
essa seção vira o roteiro do "me explica esse projeto".

## Tamanho ideal

README ideal de projeto júnior: **caber numa tela e meia de scroll**.

- Muito curto (3 linhas): parece preguiça.
- Muito longo (TCC): parece auto-importância sem proporção.
- Meio termo, com seções claras e diretas: recrutador lê, gosta, clica
  no código.

Se você tem MUITA coisa pra dizer, divida. Coloque docs detalhadas em
`docs/`, exemplos em `examples/`, e mantém o README focado.

## Anti-patterns comuns

Evite:

- **README de uma linha**: `# Projeto`. Sem mais nada. Comum, e parece
  morto.
- **Lorem ipsum descabido**: copy-paste de algum modelo, sem adaptar.
  Recrutador percebe.
- **Palavras vazias**: "projeto incrível", "tecnologia de ponta",
  "solução robusta". Diz nada.
- **Diários de aprendizado dentro do README**: "Aprendi muito fazendo
  isso, foi desafiador, etc.". Coisa pra blog post, não pro README.
- **Português + inglês misturados**: escolha um e fica nele. Para
  recrutador BR, português está OK. Para vagas internacionais, inglês.
  Misturar é tropeço.

## Action items

Pegue **um** dos seus 5 Trials. Reescreve o README dele seguindo essa
estrutura. Adicione screenshot/GIF se possível. Commit, push.

Compare com a versão antiga. Você vai ver a diferença. Aplica nos outros
4 ao longo da semana.

- [ ] Trial 01: README completo com decisões técnicas
- [ ] Trial 02: idem + GIF de uso
- [ ] Trial 03: idem + diagrama do schema
- [ ] Trial 04: idem + print do relatório gerado
- [ ] Trial 05: idem + screenshot do Swagger UI

## Você concluiu

- Você sabe a estrutura padrão de um README profissional
- Você adiciona screenshot/GIF quando faz sentido
- Você usa badges com moderação e propósito
- Você adiciona "Decisões técnicas" pra mostrar maturidade
- Você refatorou pelo menos 1 README seguindo o padrão

Próximo capítulo: **Currículo júnior · Adventurer's resume**. O CV de uma
página que recrutador vai usar pra te chamar (ou descartar).
