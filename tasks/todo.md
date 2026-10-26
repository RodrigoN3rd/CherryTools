# Tarefas: expansão tipográfica e web

- [x] Fundação Google Fonts, Material Symbols e exportadores
  - Aceite: fontes/ícones renderizam; exportador PNG funciona; WebM detecta suporte.
  - Verificar: `npm test -- --reporter=verbose`, `npm run typecheck`, `npm run lint`.
  - Arquivos: `app/layout.tsx`, `app/globals.css`, `components/google-symbol.tsx`, `lib/tools/export.ts`, testes.

- [x] Catálogo e contratos das 15 ferramentas
  - Aceite: 35 rotas únicas, títulos e categorias corretos.
  - Verificar: teste do catálogo.
  - Arquivos: `lib/tools/catalog.ts`, testes.

- [x] Estúdios tipográficos estáticos
  - Aceite: as sete ferramentas estáticas alteram a prévia e baixam PNG.
  - Verificar: teste unitário de desenho e Playwright de download.
  - Arquivos: novo estúdio tipográfico, exportadores, CSS, workspace, testes.

- [x] Estúdio de tipografia cinética
  - Aceite: gera PNG e WebM local com fallback explícito.
  - Verificar: testes de suporte e download em Chromium.
  - Arquivos: estúdio, exportador, testes.

- [ ] Estúdios de web design estáticos
  - Aceite: seis ferramentas geram prévia e PNG a partir de controles reais.
  - Verificar: unitários e Playwright.
  - Arquivos: novo estúdio web, exportadores, CSS, workspace, testes.

- [ ] Fundo orgânico animado
  - Aceite: gera PNG e WebM local com fallback explícito.
  - Verificar: suporte e download em Chromium.
  - Arquivos: estúdio, exportador, testes.

- [ ] PNG para as 20 ferramentas existentes
  - Aceite: os exportadores de CSS/JSON/texto também oferecem uma imagem da prévia; formatos antigos continuam disponíveis.
  - Verificar: matriz de smoke tests de cada categoria.
  - Arquivos: estúdios existentes, CSS, exportadores e testes.

- [ ] Regressão e handoff
  - Aceite: build de produção, teste de navegador em 375 px e 1440 px, console limpo e worktree limpo.
  - Verificar: `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`.
