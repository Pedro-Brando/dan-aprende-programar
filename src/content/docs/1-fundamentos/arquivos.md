---
title: Arquivos
description: Ler e escrever arquivos de texto e CSV - o primeiro passo para programas que persistem dados.
---

<aside class="tome-stub not-content" role="note" aria-label="Página em transcrição">
  <p class="tome-stub__seal">Em transcrição</p>
  <h2 class="tome-stub__title">Pergaminho selado pelos Sábios</h2>
  <p class="tome-stub__body">
    Este capítulo ainda está sendo transcrito pelos eruditos da Biblioteca de
    Sharlayan. Volte em breve - o conteúdo aparecerá conforme o tomo evolui.
  </p>
</aside>

## O que você vai aprender

- Abrir arquivos com `open()` e os modos `r`, `w`, `a`
- Por que sempre usar `with open(...) as f:` em vez de fechar manualmente
- Ler tudo de uma vez (`read`) ou linha a linha (`readlines`, iteração)
- Escrever texto e cuidar com encoding (`encoding="utf-8"`)
- Introdução rápida ao módulo `csv` para ler planilhas
