---
title: Testes com pytest · Striking Dummy
description: Escrever testes automáticos para garantir que seu código funciona. A habilidade que diferencia júnior de iniciante absoluto. O Striking Dummy do código.
---

Em FFXIV existe um item chamado **Striking Dummy**: um boneco de
treinamento sem AI, que fica parado, com HP gigante. Você bate nele pra
medir DPS, testar rotation, conferir se um buff aumenta dano sem precisar
entrar em raid de verdade. **Testes automatizados são o Striking Dummy
do código**: você executa seu programa contra um cenário controlado e
mede se o resultado bate com o esperado. Sem eles, você só sabe se o
código funciona pulando direto pro pull e torcendo.

## Por que testar

Cenário típico de quem não testa:

1. Você implementa uma função que calcula DPS.
2. Roda manualmente com 1 input. Funciona. "Tá bom."
3. Mês depois, refatora. Manualmente testa de novo com mesmo input.
   Funciona. "Beleza."
4. Empurra pra produção. Cliente reporta bug com input diferente. Você
   reabre. Conserta. Quebra outro caso enquanto conserta.

Com testes:

1. Você implementa a função. Escreve 5 testes cobrindo casos comuns,
   bordas, e erros.
2. Refatora. Roda `pytest`. Se passar, sabe que nada quebrou. Se quebrar,
   o teste te diz exatamente o que.
3. Empurra com confiança.

Tempo gasto: 20 minutos a mais escrevendo teste, **dezenas de horas
economizadas** no longo prazo.

## Instalando

```powershell
pip install pytest
```

## Estrutura básica

Convenção:

- Arquivos de teste: `test_alguma_coisa.py` ou `algumacoisa_test.py`.
- Funções de teste: `def test_descricao_do_caso():`.
- Asserções: `assert expressao`.

Exemplo simples:

```python
# arquivo: test_calculadora.py

def somar(a, b):
    return a + b


def test_somar_dois_positivos():
    assert somar(2, 3) == 5


def test_somar_negativo():
    assert somar(-1, 1) == 0


def test_somar_zero():
    assert somar(0, 0) == 0
```

Rode:

```powershell
pytest
```

Saída:

```text
============================= test session starts =============================
collected 3 items

test_calculadora.py ...                                                  [100%]

============================== 3 passed in 0.02s ==============================
```

Os pontinhos `...` são os testes passando. Cada `.` é um sucesso.

## Quando um teste falha

Modifica `somar` pra quebrar:

```python
def somar(a, b):
    return a - b   # bug introduzido
```

Roda `pytest`:

```text
test_calculadora.py FFF                                                  [100%]

================================== FAILURES ===================================
______________________ test_somar_dois_positivos ______________________________

    def test_somar_dois_positivos():
>       assert somar(2, 3) == 5
E       assert -1 == 5
E        +  where -1 = somar(2, 3)

test_calculadora.py:8: AssertionError
```

Pytest mostra:

- Qual teste falhou (`test_somar_dois_positivos`)
- A linha culpada
- O valor real (-1) vs esperado (5)
- O input que produziu o erro

Recapitulando: **mensagens de erro de pytest são desenhadas pra te
ajudar**. Leia com atenção, raramente precisa adivinhar.

## Estrutura de projeto com testes

Convenção típica:

```text
meu-projeto/
├── app/
│   ├── __init__.py
│   ├── calculadora.py
│   └── utils.py
├── tests/
│   ├── __init__.py
│   ├── test_calculadora.py
│   └── test_utils.py
└── pytest.ini      # opcional
```

Em `test_calculadora.py`:

```python
from app.calculadora import somar


def test_somar():
    assert somar(2, 3) == 5
```

Pra rodar tudo: `pytest` na raiz do projeto.

Pra rodar um arquivo só: `pytest tests/test_calculadora.py`.

Pra rodar um teste específico: `pytest tests/test_calculadora.py::test_somar`.

## Padrão Arrange / Act / Assert

Cada teste segue uma estrutura:

```python
def test_calcular_dps():
    # Arrange: prepara
    dano_total = 1000000
    tempo = 200

    # Act: executa
    resultado = calcular_dps(dano_total, tempo)

    # Assert: verifica
    assert resultado == 5000
```

Três fases visualmente separadas. Não é regra rígida (testes simples
podem ser uma linha), mas pra testes médios torna claro o que está
sendo testado.

## Asserts úteis

```python
assert resultado == 42                    # igualdade
assert resultado != 42                    # desigualdade
assert resultado > 10                     # comparação
assert "Y'shtola" in nomes                # contém
assert nome.startswith("Y")               # método de string
assert isinstance(obj, MinhaClass)        # tipo
assert len(lista) == 5                    # tamanho
assert resultado is None                  # is/is not
```

`assert` é Python puro. Qualquer expressão booleana serve.

### Float: cuidado com igualdade exata

```python
assert 0.1 + 0.2 == 0.3   # FALHA: 0.30000000000000004
```

Use `pytest.approx`:

```python
import pytest

assert 0.1 + 0.2 == pytest.approx(0.3)
assert calcular_porcentagem(8, 100) == pytest.approx(0.08, abs=0.01)
```

`abs=` é tolerância absoluta. Útil pra todo cálculo decimal.

## Testando exceções

```python
import pytest


def dividir(a, b):
    if b == 0:
        raise ValueError("Divisão por zero não permitida.")
    return a / b


def test_dividir_normal():
    assert dividir(10, 2) == 5


def test_dividir_zero_levanta():
    with pytest.raises(ValueError):
        dividir(10, 0)


def test_dividir_zero_mensagem():
    with pytest.raises(ValueError, match="Divisão por zero"):
        dividir(10, 0)
```

`pytest.raises(Tipo)` é um context manager: o bloco dentro **DEVE**
levantar aquela exceção. Se levantar, teste passa. Se não, falha.
`match=` checa que a mensagem casa com regex.

## Fixtures: setup compartilhado

Quando vários testes precisam do mesmo cenário:

```python
import pytest


@pytest.fixture
def party():
    """Cria uma party de exemplo pra testes."""
    return [
        {"nome": "Aurelia", "role": "Tank"},
        {"nome": "Y'shtola", "role": "Healer"},
        {"nome": "Alphinaud", "role": "DPS"},
    ]


def test_party_tem_3_membros(party):
    assert len(party) == 3


def test_primeiro_eh_tank(party):
    assert party[0]["role"] == "Tank"


def test_tem_healer(party):
    roles = [m["role"] for m in party]
    assert "Healer" in roles
```

Uma `@pytest.fixture` é uma função que **fornece** dados pra testes.
Cada teste que precisa daquele dado declara `party` como parâmetro.
Pytest chama a fixture e passa o resultado.

Vantagens:

- Não precisa repetir o setup em cada teste
- Mudou os dados? Muda em um lugar só.

## Fixtures com cleanup: `yield`

```python
@pytest.fixture
def banco_temporario(tmp_path):
    """Cria DB temporário e fecha no fim."""
    db_path = tmp_path / "test.db"
    conn = sqlite3.connect(db_path)
    conn.execute("CREATE TABLE itens (nome TEXT)")
    yield conn         # entrega o conn pro teste
    conn.close()       # roda DEPOIS do teste


def test_inserir_item(banco_temporario):
    banco_temporario.execute("INSERT INTO itens VALUES (?)", ("Espada",))
    cur = banco_temporario.execute("SELECT * FROM itens")
    assert cur.fetchone() == ("Espada",)
```

A fixture com `yield`:

1. **Antes do `yield`**: setup
2. **`yield X`**: entrega X pro teste
3. **Depois do `yield`**: cleanup (sempre roda, mesmo se teste falhar)

`tmp_path` é uma fixture built-in do pytest que dá uma pasta temporária
única por teste. Ótima pra criar arquivos sem conflito.

## Parametrize: rodando o mesmo teste com vários inputs

```python
@pytest.mark.parametrize("a,b,esperado", [
    (2, 3, 5),
    (0, 0, 0),
    (-1, 1, 0),
    (100, 200, 300),
])
def test_somar(a, b, esperado):
    assert somar(a, b) == esperado
```

Cria 4 testes a partir de 1 função. Pytest reporta cada um separadamente:

```text
test_calc.py::test_somar[2-3-5] PASSED
test_calc.py::test_somar[0-0-0] PASSED
test_calc.py::test_somar[-1-1-0] PASSED
test_calc.py::test_somar[100-200-300] PASSED
```

Use pra cobrir muitos casos sem repetir código.

## Mocks: simulando dependências externas

Quando sua função depende de algo lento ou externo (API, banco, arquivo
do disco), você quer testar a **lógica**, não a integração. Use mock:

```python
from unittest.mock import patch


def buscar_pokemon(id_):
    r = requests.get(f"https://pokeapi.co/api/v2/pokemon/{id_}")
    return r.json()["name"]


def test_buscar_pokemon():
    with patch("modulo.requests.get") as mock_get:
        mock_get.return_value.json.return_value = {"name": "pikachu"}

        nome = buscar_pokemon(25)
        assert nome == "pikachu"
        mock_get.assert_called_once_with("https://pokeapi.co/api/v2/pokemon/25")
```

`patch` substitui `requests.get` por um mock controlável. Você define
o que ele devolve, sem fazer chamada real à internet.

Avançado, mas vale conhecer. Você vai usar muito quando tiver
dependências externas.

## Cobertura de testes

```powershell
pip install pytest-cov
pytest --cov=app
```

Mostra qual porcentagem do seu código foi exercida pelos testes:

```text
Name                  Stmts   Miss  Cover
-----------------------------------------
app/calculadora.py       12      2    83%
app/utils.py             20      0   100%
-----------------------------------------
TOTAL                    32      2    94%
```

Mirar 80%+ é boa meta pra projeto júnior. 100% nem sempre vale o
esforço (alguns trechos são óbvios demais ou difíceis de testar).

## Pytest config opcional

`pytest.ini` na raiz do projeto:

```ini
[pytest]
testpaths = tests
python_files = test_*.py
addopts = -v
```

`-v` (verbose) mostra cada teste rodando, não só os pontinhos. Útil em
projetos médios.

## Padrão recomendado: testar a função pública

Não teste detalhe interno da implementação. Teste o **comportamento
observável**:

```python
# RUIM: teste depende da implementação interna
def test_calculadora_usa_lista_interna():
    calc = Calculadora()
    calc.somar(2, 3)
    assert len(calc._historico_interno) == 1   # detalhe interno

# BOM: teste o comportamento que o usuário vê
def test_somar_devolve_resultado_correto():
    assert Calculadora().somar(2, 3) == 5
```

Se você muda a implementação (ex: usa dict em vez de lista internamente),
o primeiro teste quebra desnecessariamente. O segundo continua
funcionando.

## Exercícios

1. **Primeiro teste**: crie `01-test-soma.py` (na pasta `tests/`).
   Define função `somar(a, b)` num arquivo separado, testa com 3 casos
   passando.

2. **Teste falhando**: introduza um bug em `somar`. Roda pytest, lê a
   saída de erro com atenção. Conserta. Confirma que volta a passar.

3. **Asserts variados**: crie testes que usam `==`, `!=`, `in`,
   `isinstance`, `len`, `is None`. Pelo menos 1 de cada.

4. **Testar exceção**: implemente `dividir(a, b)` que levanta
   `ValueError` se b é 0. Teste tanto o caso normal quanto o erro
   (com `pytest.raises`).

5. **Fixture**: crie fixture `personagens()` que devolve uma lista de
   3 dicts. Use ela em 3 testes diferentes.

6. **Parametrize**: refator do exercício 1, transformando os 3 testes
   em 1 só com `@pytest.mark.parametrize`.

7. **Banco temporário**: crie fixture com `yield` que cria conexão
   sqlite em memória, cria schema, entrega pro teste, fecha. Escreva 2
   testes usando ela: 1 que insere e confere, 1 que tenta inserir
   inválido e espera erro.

8. **Cobertura**: pegue um exercício do Tomo I (que tinha funções) e
   adicione testes pra ele. Roda `pytest --cov=` na pasta correspondente.
   Veja a porcentagem. Tenta chegar em 100%.

## Você concluiu

- Você cria arquivos `test_*.py` com funções `test_*` e `assert`
- Você roda `pytest` e lê o output em caso de falha
- Você usa `pytest.raises` pra testar exceções
- Você cria fixtures com e sem cleanup (`yield`)
- Você usa `parametrize` pra rodar o mesmo teste com vários inputs
- Você sabe da existência de mocks pra dependências externas
- Você mede cobertura com `pytest-cov`

## **Tomo II encerrado.**

**Savage cleared.** Você atravessou o Tomo II inteiro: pip e venv,
classes e objetos, herança, requests, JSON, web scraping, pandas,
SQLite, e testes com pytest. Essas são as mecânicas que separam quem
brinca de quem trabalha. Toda vaga de júnior em Python vai querer ver
você confortável com pelo menos metade dessas coisas. Você fez todas.

Agora vá fazer (ou refazer) os Trials 03, 04 e 05 com esse loadout
completo. A Biblioteca de Sharlayan, o Hunt Train Tracker e a API do
Aventureiro vão construir o portfólio que vai fechar o jogo.

Quando o último trial estiver no ar, é hora do **Tomo IV**: a marca
da Guilda. Você sabe o caminho.
