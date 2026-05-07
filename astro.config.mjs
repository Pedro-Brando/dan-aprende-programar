// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';

const SITE = 'https://pedro-brando.github.io';
const BASE = '/dan-aprende-programar';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  integrations: [
    starlight({
      title: 'Dan Aprende a Programar',
      description:
        'Uma jornada do nível 1 ao primeiro estágio em Python - escrita em forma de tomo aetherial.',
      defaultLocale: 'root',
      locales: {
        root: { label: 'Português', lang: 'pt-BR' },
      },
      logo: {
        src: './src/assets/aether-mark.svg',
        replacesTitle: false,
      },
      favicon: '/favicon.svg',
      customCss: ['./src/styles/custom.css'],
      social: {
        github: 'https://github.com/Pedro-Brando/dan-aprende-programar',
      },
      editLink: {
        baseUrl:
          'https://github.com/Pedro-Brando/dan-aprende-programar/edit/main/',
      },
      lastUpdated: true,
      pagination: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 },
      sidebar: [
        {
          label: 'Tomo 0 - Main Story Quest',
          collapsed: false,
          items: [
            {
              label: 'Como usar este tomo · A Realm Reborn',
              slug: 'como-usar',
            },
            {
              label: 'Instalando Python · Heavensward',
              slug: '0-antes-de-programar/instalando-python',
            },
            {
              label: 'O editor VS Code · Stormblood',
              slug: '0-antes-de-programar/editor-vscode',
            },
            {
              label: 'Terminal básico · Shadowbringers',
              slug: '0-antes-de-programar/terminal-basico',
            },
            {
              label: 'Git e GitHub · Endwalker',
              slug: '0-antes-de-programar/git-github',
            },
          ],
        },
        {
          label: 'Tomo I - Sua primeira extreme',
          collapsed: false,
          items: [
            { label: 'Olá, mundo', slug: '1-fundamentos/ola-mundo' },
            { label: 'Variáveis', slug: '1-fundamentos/variaveis' },
            {
              label: 'Tipos de dados',
              slug: '1-fundamentos/tipos-de-dados',
            },
            { label: 'Operadores', slug: '1-fundamentos/operadores' },
            {
              label: 'Entrada e saída',
              slug: '1-fundamentos/entrada-saida',
            },
            { label: 'Condicionais', slug: '1-fundamentos/condicionais' },
            { label: 'Loops', slug: '1-fundamentos/loops' },
            {
              label: 'Listas e tuplas',
              slug: '1-fundamentos/listas-e-tuplas',
            },
            { label: 'Dicionários', slug: '1-fundamentos/dicionarios' },
            { label: 'Funções', slug: '1-fundamentos/funcoes' },
            { label: 'Strings', slug: '1-fundamentos/strings' },
            {
              label: 'Erros e exceções',
              slug: '1-fundamentos/erros-excecoes',
            },
            { label: 'Arquivos', slug: '1-fundamentos/arquivos' },
            { label: 'Módulos', slug: '1-fundamentos/modulos' },
          ],
        },
        {
          label: 'Tomo II - Savage',
          collapsed: true,
          items: [
            {
              label: 'pip e ambientes virtuais',
              slug: '2-python-pratico/pip-venv',
            },
            {
              label: 'Classes e objetos',
              slug: '2-python-pratico/classes-objetos',
            },
            { label: 'Herança', slug: '2-python-pratico/heranca' },
            {
              label: 'APIs com requests',
              slug: '2-python-pratico/apis-com-requests',
            },
            { label: 'JSON', slug: '2-python-pratico/json' },
            {
              label: 'Web scraping',
              slug: '2-python-pratico/web-scraping',
            },
            {
              label: 'Pandas básico',
              slug: '2-python-pratico/pandas-basico',
            },
            { label: 'SQLite', slug: '2-python-pratico/sqlite' },
            {
              label: 'Testes com pytest',
              slug: '2-python-pratico/testes-pytest',
            },
          ],
        },
        {
          label: 'Tomo III - Farm de BIS',
          collapsed: true,
          items: [
            {
              label: 'Trial 01 - Calculadora de Eorzea',
              slug: '3-projetos/01-calculadora-cli',
            },
            {
              label: 'Trial 02 - Lista de Recados',
              slug: '3-projetos/02-todo-list',
            },
            {
              label: 'Trial 03 - Biblioteca de Sharlayan',
              slug: '3-projetos/03-biblioteca-oop',
            },
            {
              label: 'Trial 04 - Echo de Dados',
              slug: '3-projetos/04-scraper-analise',
            },
            {
              label: 'Trial 05 - API do Aventureiro',
              slug: '3-projetos/05-api-fastapi',
            },
          ],
        },
        {
          label: 'Tomo IV - Ultimate cleanup',
          collapsed: true,
          items: [
            {
              label: 'Perfil GitHub',
              slug: '4-rumo-ao-estagio/perfil-github',
            },
            {
              label: 'README de portfólio',
              slug: '4-rumo-ao-estagio/readme-portfolio',
            },
            {
              label: 'Currículo júnior',
              slug: '4-rumo-ao-estagio/curriculo-junior',
            },
            {
              label: 'LinkedIn técnico',
              slug: '4-rumo-ao-estagio/linkedin-tecnico',
            },
            {
              label: 'Onde procurar vagas',
              slug: '4-rumo-ao-estagio/onde-procurar-vagas',
            },
            {
              label: 'Entrevista técnica',
              slug: '4-rumo-ao-estagio/entrevista-tecnica',
            },
            {
              label: 'Comportamental',
              slug: '4-rumo-ao-estagio/comportamental',
            },
          ],
        },
      ],
    }),
    mdx(),
  ],
});
