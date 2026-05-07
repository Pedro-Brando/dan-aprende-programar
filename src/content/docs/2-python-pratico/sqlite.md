---
title: SQLite · Saddlebag
description: Banco de dados local sem instalação extra. Embutido no Python e o melhor jeito de aprender SQL na prática. Sua saddlebag, sempre carregada, sem precisar de servidor.
---

A **saddlebag** em FFXIV é o seu inventário extra que viaja com você.
Não precisa de retainer (servidor), não precisa de bank house (um banco
de dados rodando em outro lugar). Está sempre lá, persistente, no seu
personagem. **SQLite é a saddlebag do mundo dos bancos**: vem embutido
no Python (módulo `sqlite3`), salva tudo em um arquivo `.db` único, e
permite SQL completo. Pra aprender, prototipar, ou rodar projeto pequeno,
ele basta.

## SQLite vs Postgres / MySQL

Comparação rápida:

| | SQLite | Postgres / MySQL |
|---|---|---|
| Instalação | Já vem com Python | Servidor separado |
| Onde mora | Arquivo `.db` no disco | Processo rodando, porta de rede |
| Quem usa | App pequeno, prototipo, mobile | App de produção, sistema com vários acessos |
| Limite | ~140TB, 1 escritor por vez | Milhões de queries por segundo, escalável |
| Quando trocar | Quando precisar de muitos clientes simultâneos | - |

A regra prática: **comece com SQLite**. Migrar pra Postgres depois é
tranquilo se você usou SQL padrão (que vamos usar).

## SQL em 60 segundos

SQL (Structured Query Language) é a linguagem dos bancos relacionais.
Cinco comandos cobrem 90% dos casos:

```sql
CREATE TABLE pessoas (
    id INTEGER PRIMARY KEY,
    nome TEXT NOT NULL,
    idade INTEGER
);

INSERT INTO pessoas (nome, idade) VALUES ('Y''shtola', 90);
SELECT * FROM pessoas;
SELECT nome FROM pessoas WHERE idade > 50;
UPDATE pessoas SET idade = 91 WHERE nome = 'Y''shtola';
DELETE FROM pessoas WHERE idade < 30;
```

Você vai aprender mais SQL ao longo da carreira. Por agora, esses
comandos bastam.

## Conectando

```python
import sqlite3

conn = sqlite3.connect("biblioteca.db")
```

Se o arquivo não existe, ele cria. Se existe, abre.

`:memory:` em vez do nome cria um banco em memória, perdido ao fechar
o programa. Útil pra testes:

```python
conn = sqlite3.connect(":memory:")
```

## Cursor: o executor

Você não executa SQL direto na conexão. Cria um **cursor**:

```python
cur = conn.cursor()
cur.execute("CREATE TABLE personagens (id INTEGER PRIMARY KEY, nome TEXT)")
```

`cursor()` te dá um objeto que executa queries. `.execute(sql)` roda
uma. Pra ver o resultado, você lê do cursor.

## Fluxo básico: criar tabela, inserir, ler

```python
import sqlite3

conn = sqlite3.connect("biblioteca.db")
cur = conn.cursor()

# Cria tabela (só na primeira vez):
cur.execute("""
    CREATE TABLE IF NOT EXISTS personagens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        job TEXT,
        nivel INTEGER
    )
""")

# Insere:
cur.execute(
    "INSERT INTO personagens (nome, job, nivel) VALUES (?, ?, ?)",
    ("Y'shtola", "Sage", 90),
)

# Commita (sem isso, nada vai pro disco):
conn.commit()

# Lê:
cur.execute("SELECT * FROM personagens")
for linha in cur.fetchall():
    print(linha)

conn.close()
```

Saída:

```text
(1, "Y'shtola", 'Sage', 90)
```

## Parâmetros: SEMPRE com `?`, NUNCA com format string

A coisa mais importante deste capítulo:

```python
# ERRADO (SQL injection):
nome = input("Nome: ")
cur.execute(f"SELECT * FROM personagens WHERE nome = '{nome}'")

# CERTO:
nome = input("Nome: ")
cur.execute("SELECT * FROM personagens WHERE nome = ?", (nome,))
```

Se o usuário digita `"; DROP TABLE personagens; --` no input, a
versão errada **executa o DROP TABLE**. Você acabou de perder a tabela.

Versão certa, o `?` força o SQLite a tratar o valor como dado, não como
SQL. Imune a injection.

**Regra de ouro: TODA variável que você passa pra SQL vai como `?`,
sempre.**

Múltiplos placeholders:

```python
cur.execute(
    "SELECT * FROM personagens WHERE job = ? AND nivel >= ?",
    ("Sage", 80),
)
```

Note: a tupla precisa ter o número certo de itens. Para um valor só:
`(valor,)` (com vírgula, senão Python entende como parênteses, não tupla).

## Lendo resultados

Três métodos:

```python
cur.execute("SELECT * FROM personagens")

cur.fetchone()    # devolve UMA linha (ou None se não tem mais)
cur.fetchmany(5)  # devolve até 5 linhas em lista
cur.fetchall()    # devolve todas em lista
```

Ou itere direto:

```python
cur.execute("SELECT * FROM personagens")
for linha in cur:
    print(linha)
```

Cada linha é uma **tupla** com os valores na ordem das colunas:

```python
linha = ("Y'shtola", "Sage", 90)
nome, job, nivel = linha    # desempacota
```

## Acessando por nome em vez de índice: `Row`

```python
conn = sqlite3.connect("biblioteca.db")
conn.row_factory = sqlite3.Row     # importante!

cur = conn.cursor()
cur.execute("SELECT * FROM personagens")

for linha in cur:
    print(linha["nome"], linha["job"])
```

Com `row_factory = sqlite3.Row`, você acessa por nome de coluna em vez
de índice. **Sempre use isso**. Mais legível.

## Context manager: fechamento garantido

`sqlite3.Connection` funciona com `with`:

```python
with sqlite3.connect("biblioteca.db") as conn:
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute("INSERT INTO personagens (nome) VALUES (?)", ("Y'shtola",))
    # commit automático ao sair do bloco se não houve erro
```

`with` garante commit ao sair (se OK) ou rollback (se erro), e fecha a
conexão. Padrão ouro.

## Inserindo várias linhas

```python
dados = [
    ("Y'shtola", "Sage", 90),
    ("Alphinaud", "Summoner", 88),
    ("Estinien", "Dragoon", 90),
]

cur.executemany(
    "INSERT INTO personagens (nome, job, nivel) VALUES (?, ?, ?)",
    dados,
)
conn.commit()
```

`executemany` é muito mais rápido que loop com `execute`. Use sempre
que for inserir batch.

## Atualizar e deletar

```python
cur.execute(
    "UPDATE personagens SET nivel = ? WHERE nome = ?",
    (91, "Y'shtola"),
)

cur.execute(
    "DELETE FROM personagens WHERE nivel < ?",
    (50,),
)

conn.commit()
```

`cur.rowcount` te diz quantas linhas foram afetadas:

```python
cur.execute("DELETE FROM personagens WHERE nivel < ?", (50,))
print(f"Removidos: {cur.rowcount}")
```

## Schema com múltiplas tabelas

```python
cur.executescript("""
    CREATE TABLE IF NOT EXISTS livros (
        isbn TEXT PRIMARY KEY,
        titulo TEXT NOT NULL,
        autor TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS emprestimos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        isbn TEXT NOT NULL,
        usuario TEXT NOT NULL,
        data TEXT NOT NULL,
        FOREIGN KEY (isbn) REFERENCES livros(isbn)
    );
""")
```

`executescript` roda múltiplos comandos SQL separados por `;`. Útil pra
schema inicial.

`FOREIGN KEY` cria a relação: cada `emprestimos.isbn` precisa
referenciar uma linha existente em `livros.isbn`. SQLite só **força**
isso se você ativar:

```python
conn.execute("PRAGMA foreign_keys = ON")
```

Faça isso logo após conectar.

## JOIN: combinando tabelas

```sql
SELECT livros.titulo, emprestimos.usuario
FROM livros
JOIN emprestimos ON livros.isbn = emprestimos.isbn
WHERE emprestimos.usuario = 'Dan'
```

Lê: "pega título do livro e nome do usuário, juntando livros e
emprestimos onde o ISBN bate, e filtra os que são do Dan".

JOIN é o cerne de SQL. Vai aparecer muito.

## SQLAlchemy: ORM em 5 minutos

`sqlite3` é ótimo, mas pra projetos maiores você vai querer um **ORM**
(Object-Relational Mapper) que mapeia tabelas pra classes Python.
**SQLAlchemy** é o padrão.

```python
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

engine = create_engine("sqlite:///biblioteca.db")
Base = declarative_base()


class Personagem(Base):
    __tablename__ = "personagens"

    id = Column(Integer, primary_key=True)
    nome = Column(String, nullable=False)
    job = Column(String)
    nivel = Column(Integer)


Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
with Session() as session:
    nova = Personagem(nome="Y'shtola", job="Sage", nivel=90)
    session.add(nova)
    session.commit()

    todas = session.query(Personagem).filter(Personagem.nivel >= 80).all()
    for p in todas:
        print(p.nome, p.job)
```

Vantagens vs `sqlite3` puro:

- Você trabalha com objetos Python, não tuplas
- Migrações automáticas (com Alembic)
- Funciona idêntico em SQLite, Postgres, MySQL

Você vai usar SQLAlchemy no Trial 05 (API do Aventureiro). Vale o tempo
de estudar a documentação oficial: <https://docs.sqlalchemy.org/>.

Pra esse capítulo, foque em `sqlite3` puro. SQLAlchemy é o passo
seguinte natural.

## Exercícios

1. **Schema inicial**: crie `01-schema.py` que cria um banco
   `personagens.db` com tabela `personagens` (id, nome, job, nivel,
   cidade). Use `IF NOT EXISTS`.

2. **Inserir batch**: crie `02-inserir.py` que insere 5 personagens
   usando `executemany`. Confirme com SELECT.

3. **Query parametrizada**: crie `03-buscar.py` que pede um job ao
   usuário e devolve todos os personagens daquele job. Use `?`
   parametrizado.

4. **Update + delete**: crie `04-modificar.py` que aumenta o nivel de
   todos os personagens em +1, e depois apaga quem tem nivel > 90.
   Conta quantos foram apagados.

5. **Banco em memória**: crie `05-memoria.py` que usa `sqlite3.connect(":memory:")`,
   cria schema, insere dados, faz queries. Útil pra testes.

6. **CRUD de aventureiros**: crie `06-aventureiros.py` com 4 funções:
   `criar(nome, job, nivel)`, `listar()`, `atualizar_nivel(id, novo)`,
   `remover(id)`. Use o padrão `with sqlite3.connect(...) as conn:`
   em cada uma.

7. **JOIN simples**: crie 2 tabelas (`personagens` e `gear`, com
   `personagem_id` em gear como FK). Insere uns dados. Faz query JOIN
   pra mostrar nome do personagem + arma equipada.

8. **SQLAlchemy hello world**: instale SQLAlchemy
   (`pip install sqlalchemy`) e replique o exemplo do capítulo. Compare
   com a versão `sqlite3` direta.

## Você concluiu

- Você conecta com `sqlite3.connect()` e usa cursor pra executar queries
- Você usa parâmetros `?` em TODA query com variável (anti-injection)
- Você lê resultados com `fetchone`, `fetchall`, ou iteração
- Você usa `row_factory = sqlite3.Row` pra acessar por nome
- Você usa `executemany` pra inserir em batch
- Você sabe escrever CREATE, INSERT, SELECT, UPDATE, DELETE
- Você tem ideia de quando faz sentido usar SQLAlchemy

Próximo capítulo: **Testes com pytest · Striking Dummy**. Última
mecânica do Tomo II. Vai testar seu código de verdade, em vez de
"funcionou no meu pull".
