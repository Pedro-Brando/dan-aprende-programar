---
title: Trial 03 — Biblioteca de Sharlayan
description: Sistema de biblioteca em OOP — livros, usuários, empréstimos. Primeiro projeto que justifica usar classes.
---

<aside class="tome-stub not-content" role="note" aria-label="Página em transcrição">
  <p class="tome-stub__seal">Em transcrição</p>
  <h2 class="tome-stub__title">Pergaminho selado pelos Sábios</h2>
  <p class="tome-stub__body">
    Este capítulo ainda está sendo transcrito pelos eruditos da Biblioteca de
    Sharlayan. Volte em breve — o conteúdo aparecerá conforme o tomo evolui.
  </p>
</aside>

## O que você vai construir

Sistema de biblioteca com classes `Livro`, `Usuario` e `Biblioteca`. O usuário pode pegar emprestado, devolver, listar empréstimos. Persistência em SQLite.

## Habilidades exercitadas

- Classes, atributos, métodos, `__str__`/`__repr__`
- Composição (Biblioteca contém Livros e Usuários)
- SQLite como persistência (substitui o JSON do trial anterior)
- Tratamento de erros: livro indisponível, usuário inexistente
- Organização do código em múltiplos arquivos (`models.py`, `repo.py`, `main.py`)

## Entrega esperada

Repo com diagrama simples (texto/Mermaid) mostrando as classes e suas relações.
