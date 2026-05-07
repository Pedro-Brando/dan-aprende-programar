---
title: pip e ambientes virtuais · Materia melding
description: Instalar bibliotecas externas com pip e isolar projetos com venv. Os pacotes do ecossistema Python encaixados no seu projeto, igual materia encaixada em peça de gear.
---

Materia em FFXIV é o sistema de upgrade onde você pega uma pedrinha
encantada, encaixa numa peça de gear, e ela ganha stats novos. Cada peça
tem slots, cada materia preenche um. **`pip` e `venv` são o sistema de
materia melding do Python**: você cria um ambiente isolado pro seu
projeto (a peça de gear), e dentro dele encaixa as bibliotecas externas
que precisar (as materias). Esse capítulo abre o Tomo II porque sem isso
você não consegue instalar nada do que vamos usar daqui pra frente:
requests, pandas, FastAPI, pytest. Tudo passa por aqui.

## Por que ambiente virtual existe

Imagine: você instala `pandas==1.5` globalmente pra um projeto. Daqui a
seis meses, começa outro projeto que precisa de `pandas==2.1`. Atualiza
globalmente. Volta no primeiro projeto: quebrou, porque uma função
mudou de assinatura entre as versões.

Multiplique isso por 50 bibliotecas, 10 projetos, e 3 anos de carreira.
**Caos**.

A solução: cada projeto tem o próprio ambiente isolado. Suas bibliotecas
não se misturam com as de outros projetos, nem com o Python global do
sistema. Isso é o **virtualenv**.

## Criando um venv

```powershell
cd meu-projeto
python -m venv .venv
```

`python -m venv` chama o módulo `venv` da stdlib. `.venv` é o nome
convencional da pasta (com ponto na frente, fica oculta). Cria uma pasta
`.venv/` com um Python de bolso e um `pip` próprios.

## Ativando

```powershell
.\.venv\Scripts\Activate.ps1
```

O prompt muda. Agora aparece `(.venv)` antes do path:

```text
(.venv) PS C:\Users\Dan\Documents\meu-projeto>
```

Esse `(.venv)` é o sinal que você está dentro do ambiente. Tudo que
instalar com `pip` daqui pra frente vai pra dentro de `.venv/`, não pro
Python global.

### Se der erro de execution policy

Windows às vezes bloqueia scripts PowerShell. Se aparecer
"cannot be loaded because running scripts is disabled", rode uma vez:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

E tenta ativar de novo. Você só faz isso uma vez por usuário.

### No cmd em vez do PowerShell

```cmd
.venv\Scripts\activate.bat
```

### Desativando

```powershell
deactivate
```

Volta pro Python global. Útil quando você troca de projeto.

## Instalando pacotes

Com o venv ativo:

```powershell
pip install requests
```

Saída (resumida):

```text
Collecting requests
  Downloading requests-2.32.0-py3-none-any.whl (62 kB)
Collecting charset-normalizer<4,>=2
  Downloading charset_normalizer-...
...
Successfully installed certifi-... charset-normalizer-... idna-... requests-... urllib3-...
```

O `pip` baixou `requests` e suas dependências (charset_normalizer, idna,
etc.). Tudo num só lugar (`.venv/Lib/site-packages/`).

Pra confirmar:

```powershell
pip list
```

Lista todos os pacotes instalados nesse ambiente. Você vê `requests`
e seu cortejo.

## Versão específica

```powershell
pip install requests==2.31.0      # versão exata
pip install "requests>=2.30,<3"   # range
pip install "pandas~=2.1.0"        # 2.1.x mas não 2.2
```

Útil quando uma versão futura quebra coisa.

## Atualizar e remover

```powershell
pip install --upgrade requests   # versão mais nova
pip uninstall requests           # remove
```

`pip uninstall` pergunta confirmação. Pra forçar sem perguntar:
`pip uninstall -y requests`.

## requirements.txt: o save da gear

Pra que outra pessoa (ou seu eu daqui a 6 meses) consiga reproduzir o
ambiente, salve a lista de pacotes:

```powershell
pip freeze > requirements.txt
```

Gera um arquivo tipo:

```text
certifi==2024.2.2
charset-normalizer==3.3.2
idna==3.7
requests==2.32.0
urllib3==2.2.1
```

Versões exatas de tudo. Esse arquivo vai pro git.

Pra reinstalar tudo num venv novo:

```powershell
pip install -r requirements.txt
```

`-r` é "requirements". Lê o arquivo, instala um por um.

:::tip[Padrão do dia-a-dia]
Toda vez que você instala um pacote novo, atualize o `requirements.txt`:

```powershell
pip install pacote-novo
pip freeze > requirements.txt
git add requirements.txt
git commit -m "deps: adiciona pacote-novo"
```
:::

## .gitignore: NÃO comite o venv

A pasta `.venv/` tem MB de coisa. Não vai pro git. Adicione no
`.gitignore`:

```text
.venv/
__pycache__/
*.pyc
```

O `requirements.txt` substitui ela: quem clonar o repo cria o próprio
`.venv` e instala via `pip install -r`.

## Onde os pacotes ficam (rapidamente)

Estrutura típica:

```text
meu-projeto/
├── .venv/                    # IGNORADO no git
│   ├── Scripts/              # python.exe, pip.exe, activate
│   └── Lib/site-packages/    # pacotes instalados
├── .gitignore
├── requirements.txt
├── main.py
└── README.md
```

`.venv/Lib/site-packages/` é onde literalmente moram os arquivos das
bibliotecas. Você nunca mexe lá direto, mas vale saber que existe.

## Fluxo completo de novo projeto

```powershell
mkdir novo-projeto
cd novo-projeto
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install requests pandas pytest
pip freeze > requirements.txt
git init
echo ".venv/" > .gitignore
git add .
git commit -m "chore: bootstrap"
code .
```

Esse é o ritual de abertura. Memorize. Vai usar todo dia.

## Erros comuns

### Esqueci de ativar o venv e instalei global

`pip install` rodou no Python do sistema, polui ambiente global.

**Solução**: `pip uninstall pacote` (sem venv ativo) pra desfazer. Depois
ativa o venv e reinstala dentro.

**Prevenção**: sempre confira o `(.venv)` no prompt antes de digitar
`pip install`.

### `pip` quebrou ou está velho

```powershell
python -m pip install --upgrade pip
```

### Pacote conflita com outro

```text
ERROR: pip's dependency resolver does not currently take into account...
```

Significa que dois pacotes pedem versões incompatíveis de uma terceira.
Soluções:

1. Procure no PyPI uma combinação que case
2. Use ambiente novo (`deactivate`, apaga `.venv/`, recria, instala
   pacote por pacote pra isolar o conflito)

Não é comum em projeto pequeno; aparece quando você mistura framework
grandes (Django + alguma lib velha, por exemplo).

## pip vs uv (preview)

Existe uma alternativa moderna ao `pip`: **`uv`** (`pip install uv` ou
binário direto). É 10-100x mais rápido e gerencia venv automático.
Funciona com `pyproject.toml` em vez de `requirements.txt`.

Não vou cobrir agora porque `pip + venv` ainda é o padrão da maioria
dos projetos. Mas se você ouvir "uv" rolando no Twitter de Python,
saiba que é a evolução natural. Vale aprender depois que você
estiver confortável com `pip`.

## Exercícios

1. **Primeiro venv**: crie `01-venv-test`. Crie venv. Ative. Instale
   `requests`. Roda `pip list` e confirma. Sai e entra no venv pra
   praticar o fluxo.

2. **requirements.txt**: instale `pandas` e `matplotlib` no venv. Faça
   `pip freeze > requirements.txt`. Abra o arquivo no VS Code. Conte
   quantas linhas (vai ter mais que 2, por causa das dependências
   indiretas).

3. **Reproduzir ambiente**: dentro do `01-venv-test`, **apague** `.venv/`
   manualmente. Crie venv novo, ative, e use `pip install -r requirements.txt`.
   Confirme que tudo voltou.

4. **Versão específica**: tente `pip install "requests==1.0"`. Vai
   instalar uma versão de 2014. Use `python -c "import requests; print(requests.__version__)"`
   pra confirmar. Depois `pip install --upgrade requests` pra voltar
   pra atual.

5. **Gitignore**: confirme que `.venv/` não aparece em `git status`.
   Se aparecer, adicione no `.gitignore` e cheque de novo.

6. **Ambiente sujo**: faça uma desativação errada. Saia do VS Code sem
   `deactivate`, abra terminal novo. O `(.venv)` não aparece. Use
   `where python` (Windows) e veja qual python o terminal usa.

## Você concluiu

- Você cria venv com `python -m venv .venv`
- Você ativa com `.\.venv\Scripts\Activate.ps1` e desativa com `deactivate`
- Você instala pacotes com `pip install` e remove com `pip uninstall`
- Você gera `requirements.txt` com `pip freeze` e reproduz com `pip install -r`
- `.venv/` está no `.gitignore` e nunca vai pro git

Próximo capítulo: **Classes e objetos · Job blueprint**. Hora de definir
seus próprios tipos. Cada classe é como uma definição de Job; cada
objeto é um aventureiro daquele Job.
