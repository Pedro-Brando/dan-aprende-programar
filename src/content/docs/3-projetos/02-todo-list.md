---
title: Trial 02 · Echo Journal
description: Lista de tarefas em CLI que sobrevive ao fechar o programa. Salva em JSON, gerencia adicionar, completar, remover e listar. Persistência de verdade.
---

O **Echo** em FFXIV é o poder que deixa um aventureiro lembrar de eventos
do passado. Sem o Echo, o Warrior of Light esqueceria tudo a cada quest.
**Esse Trial é seu Echo do código**: até agora seus programas esquecem
tudo quando fecham. O Echo Journal é uma lista de tarefas que persiste
em arquivo JSON. Você abre, adiciona uma tarefa, fecha o programa, abre
de novo no dia seguinte, ela ainda está lá.

## Briefing

Construa um app CLI de lista de tarefas (todo list) que:

- Adiciona tarefas com texto livre
- Lista tarefas pendentes e concluídas
- Marca tarefa como concluída
- Remove tarefa
- Persiste tudo em `tarefas.json`
- Sobrevive ao fechar e reabrir o programa

**Tempo estimado**: 2-3 horas.

## Loadout requerido

- Tudo do Trial 01
- Listas e dicionários
- f-strings com formatação
- `with open(...)` para ler/escrever arquivo
- Módulo `json` da stdlib
- `pathlib` (opcional mas recomendado)

Capítulos do Tomo I que cobrem: Listas, Dicionários, Arquivos, Módulos.

## Modelagem dos dados

Antes de codar, decida a estrutura. Cada tarefa é um dicionário:

```python
{
    "id": 1,
    "texto": "Atunar Aetheryte de Crystarium",
    "concluida": False,
    "criada_em": "2026-05-07 14:30",
}
```

A lista de tarefas é uma **lista de dicionários**:

```python
tarefas = [
    {"id": 1, "texto": "...", "concluida": False, "criada_em": "..."},
    {"id": 2, "texto": "...", "concluida": True, "criada_em": "..."},
]
```

Quando salvar em JSON, vira o mesmo formato. Quando carregar, volta
exatamente igual.

## Strat

### Setup

```powershell
mkdir trial-02-echo-journal
cd trial-02-echo-journal
git init
code .
```

Crie `journal.py`. Crie também `tarefas.json` vazio com `[]` dentro
(uma lista vazia válida em JSON).

### Funções de persistência

Comece pelo coração: ler e salvar o arquivo. Sem isso nada funciona.

```python
import json
from pathlib import Path

ARQUIVO = Path("tarefas.json")


def carregar_tarefas():
    """Lê tarefas.json e devolve a lista. Devolve [] se o arquivo não existe."""
    if not ARQUIVO.exists():
        return []
    with open(ARQUIVO, encoding="utf-8") as f:
        return json.load(f)


def salvar_tarefas(tarefas):
    """Escreve a lista em tarefas.json com indentação."""
    with open(ARQUIVO, "w", encoding="utf-8") as f:
        json.dump(tarefas, f, ensure_ascii=False, indent=2)
```

`ensure_ascii=False` faz o JSON salvar acentos como `é` em vez de `é`.
Mais legível quando você abrir o arquivo no editor.

### Função de adicionar

```python
from datetime import datetime


def proximo_id(tarefas):
    """Devolve o id da próxima tarefa (1 acima do maior atual)."""
    if not tarefas:
        return 1
    return max(t["id"] for t in tarefas) + 1


def adicionar_tarefa(tarefas, texto):
    """Adiciona uma nova tarefa com id automático e timestamp."""
    nova = {
        "id": proximo_id(tarefas),
        "texto": texto,
        "concluida": False,
        "criada_em": datetime.now().strftime("%Y-%m-%d %H:%M"),
    }
    tarefas.append(nova)
    return nova
```

`max(t["id"] for t in tarefas)` é uma **expressão geradora**. Equivalente
a "o maior id entre todas as tarefas". Você ainda não viu formalmente,
mas leitura é intuitiva.

### Função de listar

```python
def listar_tarefas(tarefas, mostrar_concluidas=True):
    """Imprime a lista bonita."""
    if not tarefas:
        print("Sem tarefas. Aproveite a paz de Norvrandt.")
        return

    print("=" * 60)
    print(f"{'ID':<4} {'Status':<10} {'Tarefa':<30} Criada em")
    print("=" * 60)
    for t in tarefas:
        if not mostrar_concluidas and t["concluida"]:
            continue
        marca = "[x]" if t["concluida"] else "[ ]"
        print(f"{t['id']:<4} {marca:<10} {t['texto']:<30} {t['criada_em']}")
    print("=" * 60)
```

### Função de concluir

```python
def concluir_tarefa(tarefas, id_alvo):
    """Marca a tarefa com o id dado como concluída. Devolve True/False."""
    for t in tarefas:
        if t["id"] == id_alvo:
            t["concluida"] = True
            return True
    return False
```

### Função de remover

```python
def remover_tarefa(tarefas, id_alvo):
    """Remove a tarefa do id. Devolve True/False."""
    for i, t in enumerate(tarefas):
        if t["id"] == id_alvo:
            tarefas.pop(i)
            return True
    return False
```

### O loop principal

```python
def main():
    tarefas = carregar_tarefas()

    print("=" * 60)
    print("Echo Journal - lembre o que precisa ser feito.")
    print("Comandos: add | list | done | rm | sair")
    print("=" * 60)

    while True:
        comando = input("\n> ").strip().lower()

        if comando == "sair":
            print("Até a próxima sessão.")
            break

        elif comando == "add":
            texto = input("Tarefa: ").strip()
            if not texto:
                print("Texto vazio, ignorando.")
                continue
            nova = adicionar_tarefa(tarefas, texto)
            salvar_tarefas(tarefas)
            print(f"Adicionada: #{nova['id']} {nova['texto']}")

        elif comando == "list":
            listar_tarefas(tarefas)

        elif comando == "done":
            try:
                id_alvo = int(input("ID da tarefa concluída: "))
            except ValueError:
                print("ID precisa ser número.")
                continue
            if concluir_tarefa(tarefas, id_alvo):
                salvar_tarefas(tarefas)
                print(f"Tarefa #{id_alvo} marcada como concluída.")
            else:
                print(f"Não achei tarefa com id {id_alvo}.")

        elif comando == "rm":
            try:
                id_alvo = int(input("ID da tarefa a remover: "))
            except ValueError:
                print("ID precisa ser número.")
                continue
            if remover_tarefa(tarefas, id_alvo):
                salvar_tarefas(tarefas)
                print(f"Tarefa #{id_alvo} removida.")
            else:
                print(f"Não achei tarefa com id {id_alvo}.")

        else:
            print(f"Comando '{comando}' não conhecido. Use: add, list, done, rm, sair.")


if __name__ == "__main__":
    main()
```

### Teste manual

Rode. Adicione 3 tarefas. Liste. Marca uma como concluída. Lista de novo.
Sai. Abre o `tarefas.json` no VS Code: você vê o JSON salvo, com os ids,
status e timestamps. Roda o programa de novo: as tarefas continuam lá.
Echo funcionando.

## Mecânicas opcionais

1. **Filtros**: comando `list pendentes` que mostra só as não concluídas.
   Comando `list feitas` mostra só as concluídas.
2. **Editar**: comando `edit <id>` que pede o novo texto e atualiza.
3. **Prioridade**: cada tarefa tem `prioridade` (`alta`, `media`, `baixa`).
   `list` ordena por prioridade.
4. **Limpar concluídas**: comando `clean` remove todas as `concluidas: True`
   de uma vez.
5. **Categoria/tag**: cada tarefa pode ter uma `categoria` (ex: "trabalho",
   "estudo", "casa"). Comando `list <categoria>`.
6. **Backup**: ao salvar, mantém o último arquivo como `tarefas.bak.json`.

## Clearing checklist

- [ ] Adiciona tarefas e elas aparecem no `list`
- [ ] `done <id>` marca como concluída e o `list` mostra com `[x]`
- [ ] `rm <id>` remove
- [ ] Fecha o programa, abre de novo: tarefas continuam lá
- [ ] `tarefas.json` é JSON válido (abre limpo no VS Code)
- [ ] Não crasha com id inexistente, texto vazio, ou comando desconhecido
- [ ] Pelo menos 5 commits descrevendo evolução
- [ ] README explicando como usar

## Loot drop

### README sugerido

```markdown
# Echo Journal

Lista de tarefas CLI com persistência em JSON. Trial 02 do guia
[Dan Aprende a Programar](https://pedro-brando.github.io/dan-aprende-programar/).

## Como usar

```powershell
python journal.py
```

Comandos disponíveis no prompt:
- `add` - adicionar nova tarefa
- `list` - listar tarefas
- `done` - marcar tarefa como concluída (pede id)
- `rm` - remover tarefa (pede id)
- `sair` - encerrar

Os dados ficam salvos em `tarefas.json` no diretório do programa.

## Conceitos exercitados

- Listas de dicionários
- Persistência com `json.dump` / `json.load`
- `pathlib.Path` pra checagem de arquivo
- `datetime.now()` pra timestamp
- Funções com responsabilidade única
- Tratamento de exceções
```

### Subir

Cria o repo no GitHub (sugestão: `echo-journal`), `git push`, e atualiza
o README do seu perfil GitHub adicionando esse projeto na lista de
trabalhos.

Próximo Trial: **Biblioteca de Sharlayan**. Aqui você sobe um nível: vai
trabalhar com classes (POO), modelando livros, usuários e empréstimos.
Esse trial assume que você fez o Tomo II (Savage), então é oportuno
fazer o Tomo II antes.
