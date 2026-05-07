# Dan Aprende a Programar

> Tomo de Sharlayan - Edição do Aventureiro
>
> Uma jornada do nível 1 ao primeiro estágio em Python.

Site público em GitHub Pages, escrito em **português (BR)**, focado em ensinar
**Python do zero** com identidade visual high fantasy / referências leves a
Final Fantasy XIV (cristais aetheriais, tomos, trials).

---

## Para o aventureiro (você, Dan)

1. Site publicado: <https://pedro-brando.github.io/dan-aprende-programar/>
2. Comece por **Tomo 0 (Main Story Quest)** se você nunca programou.
3. Faça **um capítulo por dia** com tudo que estiver pronto, no seu ritmo.
4. Cada **Trial** (mini-projeto) vira um repositório no seu GitHub, e esse é o portfólio
   que você vai mostrar nas vagas de estágio.
5. Travou? Anota a dúvida e me chama (ou abre uma issue neste repo).

### Ler offline

```powershell
git clone https://github.com/Pedro-Brando/dan-aprende-programar.git
cd dan-aprende-programar
npm install
npm run dev
# abre http://localhost:4321
```

---

## Para o mantenedor

### Stack

- [Astro](https://astro.build) 5 + [Starlight](https://starlight.astro.build) 0.32
- MDX para a landing customizada
- Identidade visual em `src/styles/custom.css`
- Componentes próprios em `src/components/` (`AetherCrystal`, `TomeCard`, `StubScroll`, `TomeHero`)
- Deploy automático via GitHub Actions → GitHub Pages

### Comandos

```powershell
npm install        # instala dependências
npm run dev        # dev server em localhost:4321
npm run build      # gera site estático em dist/
npm run preview    # preview do build
```

### Estrutura

```
src/
├── content.config.ts          # schema do Starlight
├── content/docs/              # todo o conteúdo em .md/.mdx
│   ├── index.mdx              # landing customizada
│   ├── como-usar.md
│   ├── 0-antes-de-programar/  # Tomo 0
│   ├── 1-fundamentos/         # Tomo I
│   ├── 2-python-pratico/      # Tomo II
│   ├── 3-projetos/            # Tomo III (Trials)
│   └── 4-rumo-ao-estagio/     # Tomo IV
├── components/                # componentes temáticos
├── styles/custom.css          # identidade visual
└── assets/aether-mark.svg     # logo do header
```

### Adicionar um novo capítulo

1. Crie `src/content/docs/<tomo>/<slug>.md` com frontmatter `title` + `description`.
2. Adicione a entrada na `sidebar` em `astro.config.mjs`.
3. Substitua o `<aside class="tome-stub">` pelo conteúdo real quando estiver pronto.

### Deploy

Repositório: <https://github.com/Pedro-Brando/dan-aprende-programar>

GitHub Pages está configurado em **Settings → Pages → Source: GitHub Actions**
e o workflow `.github/workflows/deploy.yml` publica automaticamente a cada push em `main`.

---

## Identidade visual

- Paleta: void/night/parchment/aether/gold/crystal-violet
- Fontes: Cinzel (display) + EB Garamond (body) + JetBrains Mono (code)
- Stub "Em construção" exibido como **Pergaminho selado pelos Sábios - em transcrição**
- Capítulos mantêm título técnico claro (ex: `Variáveis`, `Loops`); só os agrupadores
  ("Tomo I - Sua primeira extreme") e a landing usam linguagem de fantasia
- Zero asset proprietário da Square Enix - referências são apenas evocativas

---

## Roadmap de conteúdo

Tudo está como **stub** nesta primeira versão. A ordem sugerida para preencher
o conteúdo real, sessão após sessão:

1. `0-antes-de-programar/instalando-python.md` - Dan precisa do Python rodando
2. `0-antes-de-programar/editor-vscode.md` + `terminal-basico.md`
3. `1-fundamentos/ola-mundo.md` → `variaveis.md` → `tipos-de-dados.md` em sequência
4. Trilha de fundamentos completa
5. `3-projetos/01-calculadora-cli.md` como primeiro marco
6. Tomos II, III e IV pela ordem da sidebar

---

Forjado em Sharlayan - para um aventureiro.
