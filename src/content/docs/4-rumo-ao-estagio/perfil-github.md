---
title: Perfil GitHub · Lodestone
description: Como deixar seu perfil GitHub atrativo para recrutador. Username, foto, bio, README de perfil, repositórios pinados. O Lodestone do programador.
---

O **Lodestone** é a página oficial de cada personagem de FFXIV: foto,
job atual, achievements, screenshots, free company. É o cartão de visita
que outros jogadores acham antes de te convidar pra raid. **GitHub é o
seu Lodestone profissional**: o primeiro lugar onde recrutador clica
quando olha sua candidatura. Esse capítulo é sobre deixá-lo digno do
clique.

## A primeira impressão é em 5 segundos

Recrutador abre seu perfil. Em 5 segundos ele decide se vale a pena ler
mais ou voltar pra fila. Os elementos que decidem nesse intervalo:

1. **Foto** (que tem ou não tem)
2. **Username** (gamertag random ou nome real?)
3. **Bio** (uma linha que diz o que você faz)
4. **Repositórios pinados** (os 6 destaques no topo)
5. **Atividade recente** (commits do último mês, ou só verde de 2022?)

Se algum desses falha, ele já saiu. Vamos consertar todos.

## Username: você pode mudar (uma vez)

Se você criou conta com `xXDarkLordXx` ou similar, **mude agora**. GitHub
deixa renomear (Settings → Account → Change username). Os redirects de
URLs antigas funcionam por um tempo.

Username bom:

- `dan-pereira`
- `danpereira`
- `pereirad`
- `dpereira`

Username ruim:

- `xxdarklordxx`, `lalafell-supreme`, `gamer-pro-2003`
- `dan98382` (números aleatórios)
- `pedro-brando-do-brasil` (longo demais)

A regra: **você apresentaria esse username pessoalmente?** Se sim, OK. Se
você morreria de vergonha de dizer numa entrevista, troca.

## Foto

Foto profissional não significa terno. Significa:

- Você (não cachorro, não anime, não meme)
- Bem iluminado
- Cara visível
- Sorridente é melhor que sério, mas natural é melhor que forçado
- Selfie do celular **funciona**, contanto que dá pra ver seu rosto

Não tira foto na praia tomando cerveja. Não usa filtro de Snapchat. Foto
de carteira de identidade até serve de fallback, mas tira uma decente
qualquer dia desses.

## Bio

Você tem 160 caracteres pra dizer quem você é. Modelos:

- `"Estudante de programação, focado em Python e back-end. Construindo portfólio."`
- `"Aprendendo Python para back-end. Procurando estágio."`
- `"Junior Python developer. Aspirante a back-end. Disponível para estágio."`

Não use:

- `"Apaixonado por tecnologia 💻🚀"`  (vazio, não diz nada)
- `"Mero aprendiz no caminho do código"` (humilde demais, parece insegurança)
- `"Code is my passion ❤️"` (em inglês quebrado e clichê)

Bio bom é **específico** e **direto**. Diz o que você faz e o que você
quer.

## README de perfil

Esse é o boost mais alto que você pode dar ao perfil sem ainda nem ter
projetos.

### Como criar

1. Vá em <https://github.com/new>.
2. Repository name: **igual ao seu username**. Se seu user é `dan-pereira`,
   crie repo `dan-pereira`. Esse é o "repo mágico".
3. Marque "Add a README".
4. Crie.

Quando alguém visita seu perfil, esse README aparece no topo. É a sua
landing page pessoal.

### Modelo

```markdown
# Olá, eu sou Dan 👋

Estudante de programação focado em **Python** para back-end. Atualmente
construindo portfólio enquanto procuro o primeiro estágio.

## O que estou estudando agora

- API REST com FastAPI + SQLAlchemy
- Testes automatizados com pytest
- Conceitos de banco de dados (SQLite, vai pra Postgres)

## Projetos em destaque

- **[API do Aventureiro](link)** - API REST CRUD com FastAPI, SQLite e
  testes pytest.
- **[Hunt Train Tracker](link)** - Pipeline que coleta dados de API
  pública, processa com pandas e gera relatório markdown.
- **[Biblioteca de Sharlayan](link)** - Sistema de empréstimos em POO,
  com SQLite e CLI completa.

## Onde me achar

- LinkedIn: [linkedin.com/in/seu-nome](link)
- Email: seu-email@dominio.com
```

Adapte conforme seus projetos reais.

:::tip[Sem emojis se preferir]
Se a vibe do seu perfil é mais sóbria, pode tirar todos os emojis. Eles
não são obrigatórios. O importante é o conteúdo.
:::

## Repositórios pinados

GitHub deixa você "pinar" até 6 repos no topo do perfil. **Esses 6 são o
seu portfólio**. Escolha com cuidado:

1. **Sempre o melhor projeto primeiro**. No fim do guia, é a API do
   Aventureiro (Trial 05).
2. **Diversidade de skills**. Não pina 6 calculadoras. Pinha um projeto
   de API, um de dados, um de OOP, um de scripting.
3. **Cada projeto tem README decente**. Sem README, parece abandonado.

Pra pinar: vá no seu perfil, na sessão "Pinned" tem um link "Customize
your pins". Clica, escolhe os 6.

## Atividade: o gráfico verde

Aquele heatmap verde dos commits no perfil é uma das coisas que
recrutador olha. Não precisa ser verde-fluorescente todo dia, mas precisa
ter movimento.

Como manter:

- **Faça commits enquanto estuda**. Cada exercício do guia é um commit.
- **Commit pequeno e frequente** > commit gigante uma vez por mês.
- **Não force commit fake**. Recrutador esperto vê. Faz código de verdade.

Se você fez os Tomos 0, I, II e III completos seguindo o guia, vai ter um
gráfico decente no fim.

## Contributions em código de outros (avançado)

Bonus pontos se você contribuir em projetos open source. Achar um issue
"good first issue" em um projeto Python que você usa, fazer PR, e ter o
PR mergeado, vale muito num perfil júnior.

Não é exigência, mas é diferencial. O Tomo IV não cobre, mas anote pra
depois.

## Settings que importam

Em <https://github.com/settings/profile>:

- **Name**: seu nome completo (não username, NOME mesmo).
- **Public email**: o que você quer que apareça no perfil. Pode ser o
  mesmo do GitHub ou um secundário.
- **Bio**: a tal frase de até 160 chars.
- **URL**: link do seu LinkedIn ou portfolio site.
- **Twitter username**: se você tem Twitter técnico, sim. Se é só pessoal,
  pula.
- **Company**: deixa vazio se você não trabalha. Não invente.
- **Location**: cidade/estado. Recrutador filtra por isso.

## Action items

Faça hoje, antes de dormir:

- [ ] Trocar username se for ruim
- [ ] Trocar foto se for amadora
- [ ] Escrever bio decente (até 160 chars)
- [ ] Criar repo `seu-username` com README de perfil
- [ ] Pinar os 6 melhores repositórios
- [ ] Preencher Name, Email, Location, URL nos settings

Tempo total: 30-45 minutos.

## Você concluiu

- Username profissional escolhido
- Foto, bio e dados básicos preenchidos
- README de perfil publicado e bonito
- 6 repositórios pinados representando suas skills
- Você sabe que o gráfico de contribuições importa e mantém movimento

Próximo capítulo: **README de portfólio · Trophy room**. Cada um dos 6
repos pinados merece um README que vende o projeto. É a vitrine de cada
trofeu.
