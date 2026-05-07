---
title: Instalando Python · Heavensward
description: Como baixar o Python oficial, instalar no Windows com a opção crítica do PATH marcada, e validar tudo no terminal abrindo seu primeiro REPL.
---

Você sai da capital, atravessa o gelo, e escala Ishgard. No alto da Tribunal
of the Holy See dorme uma linguagem que vai lhe servir por toda a jornada:
**Python**. Sua missão neste capítulo é simples na ideia e cheia de armadilhas
na execução: trazer o Python pra dentro do seu computador, sem que ele caia
no PATH errado.

## Por que do site oficial, e não da Microsoft Store

A primeira pedra no caminho: a Microsoft Store oferece um Python que parece
o oficial, mas é uma versão com permissões restritas. Algumas bibliotecas
não instalam, alguns paths não funcionam, e você vai apanhar por horas tentando
descobrir o motivo.

Sempre instale do site oficial: <https://www.python.org/downloads/>.

## Baixando

1. Abra <https://www.python.org/downloads/> no navegador.
2. Clique no botão amarelo "Download Python 3.x.x" (a versão estável mais
   recente). No momento desta escrita, é Python 3.13, mas qualquer 3.10 ou
   superior serve para tudo neste guia.
3. O download é um arquivo `.exe` de uns 25 MB. Guarde na pasta Downloads.

## Instalando (atenção total nesta tela)

Execute o arquivo baixado. A primeira tela é a parte que importa mais que
qualquer outra do capítulo:

:::caution[Critical drop]
**Antes de clicar em "Install Now", marque a caixa "Add python.exe to PATH"
no rodapé da janela.**

Se você esquecer, o instalador termina com sucesso, mas o `python` não
funciona no terminal. Você vai abrir o PowerShell, digitar `python` e ouvir
o som do silêncio. Marque a caixa.
:::

Com a caixa marcada, clique em **Install Now**. Aceite o UAC do Windows. Espere
o instalador terminar (uns dois minutos), e clique em **Close**.

:::tip[Bônus opcional]
Na última tela, se aparecer um botão **"Disable path length limit"**, clique
nele. Isso remove uma limitação antiga do Windows que ainda morde algumas
bibliotecas Python.
:::

## Validando: o primeiro encontro

Hora de provar que funcionou. Abra o **PowerShell** (tecla Windows, digite
"powershell", Enter). Você deve ver um prompt parecido com:

```text
PS C:\Users\seu-nome>
```

Digite e dê Enter:

```powershell
python --version
```

A resposta deve ser algo como:

```text
Python 3.13.1
```

Se você viu uma versão (qualquer 3.x), está funcionando. Pule para a próxima
seção.

Se viu uma destas mensagens, vá para a seção de troubleshooting abaixo:

```text
Python was not found; run without arguments to install...
```

ou

```text
'python' is not recognized as an internal or external command...
```

## Abrindo o REPL pela primeira vez

REPL é a sigla pra **Read, Eval, Print, Loop**. Você digita uma linha de
código, o Python avalia e mostra o resultado, e repete. É o seu campo de
treino para experimentos rápidos.

No PowerShell ainda aberto, digite:

```powershell
python
```

O prompt muda. Agora você vê três sinais de maior:

```text
Python 3.13.1 (tags/v3.13.1:...) ...
Type "help", "copyright", "credits" or "license" for more information.
>>>
```

Esses `>>>` são o REPL. Tudo que você digitar daqui em diante o Python
interpreta como código. Tente:

```python
>>> 2 + 2
4
>>> print("Olá, Eorzea")
Olá, Eorzea
>>> nome = "Dan"
>>> print(f"Bem-vindo, {nome}")
Bem-vindo, Dan
```

Sem dramatização: você acabou de programar. O REPL é o seu primeiro vislumbre
do que vai vir nos próximos capítulos.

Para sair do REPL, digite:

```python
>>> exit()
```

ou aperte **Ctrl + Z** e Enter. Você volta para o prompt normal do PowerShell.

## Troubleshooting

### "Python was not found..."

Significa que o Windows não encontrou o `python` no PATH. Causas:

- Você esqueceu de marcar "Add python.exe to PATH" na primeira tela.
  **Solução**: rode o instalador de novo, escolha **Modify**, e marque a
  caixa do PATH em "Optional Features" e "Advanced Options".
- O PowerShell foi aberto antes da instalação. **Solução**: feche e abra
  o PowerShell de novo. O PATH só atualiza em janelas novas.

### Aparece a Microsoft Store em vez de rodar Python

Windows tem um stub que abre a Store quando você digita `python` sem ter
nada instalado. Se mesmo após instalar do site oficial isso ainda acontece,
é porque o PATH da Store está antes do PATH do Python real. **Solução**:

1. Tecla Windows, digite "App execution aliases", abra.
2. Desligue os dois aliases chamados `python.exe` e `python3.exe`.

## Exercícios

Antes de fechar tudo:

1. **REPL básico**: abra o REPL, calcule `(15 * 4) + 7` e `2 ** 10` (`**` é
   potência). Confira que os resultados são `67` e `1024`.
2. **Variável**: defina `cidade = "Ishgard"` e mostre `print(f"Sou de {cidade}")`.
3. **Versão correta**: rode `python --version` no PowerShell (fora do REPL) e
   anote a versão. Você vai precisar dela quando alguém perguntar "qual
   versão você está usando?".
4. **Saída limpa**: saia do REPL com `exit()` e depois com Ctrl + Z (em outro
   teste). Confira que ambos voltam para o PowerShell.

## Você concluiu

- Você baixou Python da fonte certa (python.org, não Store).
- Python está no PATH do Windows e responde a `python --version`.
- Você abriu o REPL e executou seu primeiro código de verdade.
- Você sabe o que fazer se o `python` não for reconhecido.

Próximo capítulo: VS Code. Sair do REPL e começar a escrever código de
verdade em arquivos.
