---
title: Trial 05 · API do Aventureiro
description: Construir uma API REST completa com FastAPI. Endpoints CRUD, Pydantic, SQLite, documentação automática, testes. O projeto-âncora do portfólio júnior.
---

Esse é o último Trial do Tomo III. O **fight final do farm de BIS**.
Você vai construir uma API REST de verdade: rotas, métodos HTTP, validação
de dados, persistência em banco, documentação automática, testes. O tipo
de projeto que recrutador olha e diz "ok, esse aqui sabe o que está
fazendo". É o **Best in Slot** do seu portfólio antes de partir pro Tomo
IV.

:::caution[Pré-requisito]
Tomo II completo, especialmente APIs com requests, classes, SQLite e
testes com pytest. Sem isso aqui você trava em duas horas.
:::

## Briefing

API REST de cadastro de aventureiros. Endpoints:

- `GET /aventureiros` - lista todos
- `GET /aventureiros/{id}` - pega um por id
- `POST /aventureiros` - cria novo
- `PUT /aventureiros/{id}` - atualiza
- `DELETE /aventureiros/{id}` - remove
- `GET /aventureiros/?job={job}` - filtra por job

Cada aventureiro tem: id, nome, raça, job, nível, cidade.

Persistência em SQLite. Validação com Pydantic. Documentação automática
via Swagger UI em `/docs`. Pelo menos 5 testes em pytest.

**Tempo estimado**: 6-10 horas.

## Loadout requerido

- `pip install fastapi uvicorn sqlalchemy pydantic pytest httpx`
- Tudo dos Trials e Tomos anteriores
- Conhecimento básico de HTTP: GET, POST, PUT, DELETE, status codes
  (200, 201, 404, 422)
- FastAPI: rotas, decoradores, dependency injection
- Pydantic: BaseModel, validação automática
- SQLAlchemy ou sqlite3 puro (FastAPI funciona com qualquer um)

## Estrutura

```
trial-05-api-aventureiro/
├── app/
│   ├── __init__.py
│   ├── main.py            # criação do app, rotas
│   ├── models.py          # SQLAlchemy
│   ├── schemas.py         # Pydantic
│   ├── database.py        # engine, session
│   └── crud.py            # operações de banco
├── tests/
│   ├── __init__.py
│   └── test_aventureiros.py
├── aventureiros.db        # gerado
├── requirements.txt
└── README.md
```

Estruturar em pacote `app/` é boa prática. Cada arquivo com responsabilidade
única.

## Strat

### Setup

```powershell
mkdir trial-05-api-aventureiro
cd trial-05-api-aventureiro
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install fastapi uvicorn sqlalchemy pytest httpx
pip freeze > requirements.txt
git init
code .
```

Crie a estrutura de pastas. Cada `__init__.py` pode ser vazio (só sinaliza
que é pacote Python).

### Etapa 1: o "Hello, World" do FastAPI

`app/main.py`:

```python
from fastapi import FastAPI

app = FastAPI(title="API do Aventureiro", version="0.1.0")


@app.get("/")
def root():
    return {"mensagem": "Bem-vindo, aventureiro."}
```

Rode:

```powershell
uvicorn app.main:app --reload
```

Abra <http://localhost:8000>. Você vê o JSON. Abra <http://localhost:8000/docs>.
Swagger UI gerado automático mostra a rota. Já isso impressiona muito
júnior.

**Comite**: `etapa 1: hello world fastapi com /docs`

### Etapa 2: Pydantic schemas

`app/schemas.py`:

```python
from pydantic import BaseModel, Field
from typing import Optional


class AventureiroBase(BaseModel):
    nome: str = Field(..., min_length=2, max_length=50)
    raca: str
    job: str
    nivel: int = Field(..., ge=1, le=90)
    cidade: str


class AventureiroCriar(AventureiroBase):
    pass


class AventureiroAtualizar(BaseModel):
    nome: Optional[str] = Field(None, min_length=2, max_length=50)
    raca: Optional[str] = None
    job: Optional[str] = None
    nivel: Optional[int] = Field(None, ge=1, le=90)
    cidade: Optional[str] = None


class Aventureiro(AventureiroBase):
    id: int

    class Config:
        from_attributes = True
```

Pydantic valida tudo automático. `nivel` precisa ser int de 1 a 90, senão
422 com mensagem clara. `nome` precisa ter 2-50 chars. Sem você escrever
uma linha de validação extra.

### Etapa 3: SQLAlchemy + DB

`app/database.py`:

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./aventureiros.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```

`app/models.py`:

```python
from sqlalchemy import Column, Integer, String

from app.database import Base


class Aventureiro(Base):
    __tablename__ = "aventureiros"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False, index=True)
    raca = Column(String, nullable=False)
    job = Column(String, nullable=False, index=True)
    nivel = Column(Integer, nullable=False)
    cidade = Column(String, nullable=False)
```

### Etapa 4: CRUD

`app/crud.py`:

```python
from sqlalchemy.orm import Session

from app import models, schemas


def listar(db: Session, job: str | None = None):
    q = db.query(models.Aventureiro)
    if job:
        q = q.filter(models.Aventureiro.job == job)
    return q.all()


def pegar(db: Session, id_: int):
    return db.query(models.Aventureiro).filter(models.Aventureiro.id == id_).first()


def criar(db: Session, dados: schemas.AventureiroCriar):
    obj = models.Aventureiro(**dados.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def atualizar(db: Session, id_: int, dados: schemas.AventureiroAtualizar):
    obj = pegar(db, id_)
    if obj is None:
        return None
    for chave, valor in dados.model_dump(exclude_unset=True).items():
        setattr(obj, chave, valor)
    db.commit()
    db.refresh(obj)
    return obj


def deletar(db: Session, id_: int):
    obj = pegar(db, id_)
    if obj is None:
        return False
    db.delete(obj)
    db.commit()
    return True
```

### Etapa 5: rotas completas

`app/main.py`:

```python
from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.database import Base, SessionLocal, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="API do Aventureiro", version="1.0.0")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/aventureiros", response_model=list[schemas.Aventureiro])
def listar_aventureiros(job: str | None = None, db: Session = Depends(get_db)):
    return crud.listar(db, job=job)


@app.get("/aventureiros/{id_}", response_model=schemas.Aventureiro)
def pegar_aventureiro(id_: int, db: Session = Depends(get_db)):
    obj = crud.pegar(db, id_)
    if obj is None:
        raise HTTPException(status_code=404, detail="Aventureiro não encontrado.")
    return obj


@app.post("/aventureiros", response_model=schemas.Aventureiro, status_code=status.HTTP_201_CREATED)
def criar_aventureiro(dados: schemas.AventureiroCriar, db: Session = Depends(get_db)):
    return crud.criar(db, dados)


@app.put("/aventureiros/{id_}", response_model=schemas.Aventureiro)
def atualizar_aventureiro(id_: int, dados: schemas.AventureiroAtualizar, db: Session = Depends(get_db)):
    obj = crud.atualizar(db, id_, dados)
    if obj is None:
        raise HTTPException(status_code=404, detail="Aventureiro não encontrado.")
    return obj


@app.delete("/aventureiros/{id_}", status_code=status.HTTP_204_NO_CONTENT)
def deletar_aventureiro(id_: int, db: Session = Depends(get_db)):
    if not crud.deletar(db, id_):
        raise HTTPException(status_code=404, detail="Aventureiro não encontrado.")
```

Rode `uvicorn app.main:app --reload` de novo. Vá em `/docs`. Tem
documentação completa, com schemas dos request/response, e botão
"Try it out" pra cada endpoint. Você consegue criar, listar, atualizar,
deletar tudo pelo navegador.

**Comite**: `etapa 5: CRUD completo + Swagger`

### Etapa 6: testes

`tests/test_aventureiros.py`:

```python
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pytest

from app.main import app, get_db
from app.database import Base


@pytest.fixture
def client(tmp_path):
    """Cliente isolado com banco temporário por teste."""
    db_url = f"sqlite:///{tmp_path}/test.db"
    engine = create_engine(db_url, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_lista_inicial_vazia(client):
    r = client.get("/aventureiros")
    assert r.status_code == 200
    assert r.json() == []


def test_cria_aventureiro(client):
    r = client.post(
        "/aventureiros",
        json={
            "nome": "Y'shtola",
            "raca": "Miqo'te",
            "job": "Sage",
            "nivel": 90,
            "cidade": "The Crystarium",
        },
    )
    assert r.status_code == 201
    body = r.json()
    assert body["nome"] == "Y'shtola"
    assert body["id"] >= 1


def test_pega_inexistente_retorna_404(client):
    r = client.get("/aventureiros/9999")
    assert r.status_code == 404


def test_validacao_falha_com_nivel_invalido(client):
    r = client.post(
        "/aventureiros",
        json={
            "nome": "Teste",
            "raca": "Hyur",
            "job": "Paladin",
            "nivel": 9999,  # acima do max
            "cidade": "Ul'dah",
        },
    )
    assert r.status_code == 422


def test_filtra_por_job(client):
    client.post("/aventureiros", json={"nome": "A", "raca": "Hyur", "job": "Paladin", "nivel": 80, "cidade": "Ul'dah"})
    client.post("/aventureiros", json={"nome": "B", "raca": "Hyur", "job": "White Mage", "nivel": 80, "cidade": "Gridania"})

    r = client.get("/aventureiros?job=Paladin")
    assert r.status_code == 200
    body = r.json()
    assert len(body) == 1
    assert body[0]["nome"] == "A"
```

Rode `pytest`. Os 5 testes devem passar.

**Comite**: `etapa 6: 5 testes cobrindo casos chave`

## Mecânicas opcionais

1. **Autenticação**: rotas protegidas por API key ou JWT.
2. **Paginação**: `?limit=10&offset=20` em `GET /aventureiros`.
3. **Mais validações**: lista fixa de raças/jobs válidos com `Enum`.
4. **Logs**: cada request logado com método, path, status.
5. **CORS**: permitir front-end em outro domínio (`fastapi.middleware.cors`).
6. **Deploy**: subir num PaaS gratuito (Render, Fly.io, Railway).
7. **Cobertura de testes**: rodar `pytest --cov=app`, mirar 80%+.

## Clearing checklist

- [ ] Todos os 5 endpoints funcionando
- [ ] Swagger UI em `/docs` mostra schemas e tudo
- [ ] Validação Pydantic rejeita dados inválidos com 422
- [ ] 404 quando aventureiro não existe
- [ ] Pelo menos 5 testes pytest passando
- [ ] `requirements.txt` completo
- [ ] README com setup detalhado e exemplos curl
- [ ] Pelo menos 10 commits ao longo da evolução

## Loot drop

Esse é o **projeto-âncora do seu portfólio**. Aqui não vale README curto.
Detalha:

- O que a API faz (em uma frase)
- Stack: FastAPI, SQLAlchemy, Pydantic, pytest
- Como rodar do zero (`git clone`, `venv`, `pip install`, `uvicorn`)
- Exemplos com `curl` ou `httpie` pros endpoints principais
- Screenshot do Swagger UI
- Resultado de `pytest -v` (lista de testes passando)
- Diagrama da arquitetura (3 camadas: rotas → schemas/crud → modelo/db)
- Decisões técnicas (por que SQLite, por que SQLAlchemy, por que Pydantic)

Pin esse repo no seu perfil GitHub. Quando aplicar pra vaga, esse é o
projeto que você cita primeiro.

## **Tomo III encerrado.**

Cinco Trials. Cinco repositórios públicos no GitHub. Calculadora, Echo
Journal, Biblioteca de Sharlayan, Hunt Train Tracker, API do Aventureiro.
Você partiu de zero e agora tem portfólio que faz recrutador clicar.

Próximo Tomo: **Ultimate cleanup**. As mecânicas finais antes da pull
real: GitHub bonito, currículo, LinkedIn, e a entrevista propriamente
dita. Tomo IV é mais curto, mas é o que decide se o portfólio que você
construiu vira oferta de estágio.
