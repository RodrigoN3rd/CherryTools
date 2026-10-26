# Plano de implementação: expansão tipográfica e web

## Objetivo

Transformar o Cherry Tools em uma coleção de 35 ferramentas funcionais: integrar Google Fonts e Google Material Symbols, adicionar 15 ferramentas de tipografia e web design e garantir que toda ferramenta tenha uma exportação visual em PNG. As três ferramentas animadas também devem baixar WebM gerado localmente.

## Escopo e decisões

- Google Fonts: carregar famílias específicas pela CSS API v2 com `display=swap`, permitindo que as novas ferramentas pré-visualizem famílias e eixos sem dependência de uma biblioteca de terceiros.
- Google Icons: adicionar Material Symbols Outlined via CSS API, com um componente acessível que usa ligatures e permite peso, preenchimento e tamanho.
- PNG: usar `CanvasRenderingContext2D` e `canvas.toBlob()` para renderizações locais e baixáveis. Os controles devem afetar o canvas exportado, não apenas a prévia HTML.
- WebM: limitar a exportação de vídeo a ferramentas com animação real. Usar `canvas.captureStream()` e `MediaRecorder`, com detecção de suporte e alternativa PNG se o navegador não oferecer WebM.
- Ferramentas estáticas recebem PNG; não serão convertidas artificialmente em vídeos parados.
- As 20 ferramentas existentes preservam seus downloads atuais. O backfill de PNG será feito por categoria após as 15 novas ferramentas; uma ferramenta estática sem imagem exportável não será considerada pronta.

## Arquitetura

```
Google CSS APIs ──────> app/layout.tsx + GoogleSymbol
                              │
canvas exporters <──── lib/tools/export.ts
                              │
catalog (35 routes) ──> ToolWorkspace ──> studios (type / web)
                              │
unit tests + Playwright smoke tests
```

## Ferramentas novas

### Tipografia

1. Explorador de Google Fonts
2. Laboratório de eixos variáveis
3. Pôster tipográfico
4. Contorno e preenchimento de texto
5. Monograma
6. Texto em curva
7. Cartão de citação
8. Loop de tipografia cinética (PNG + WebM)

### Web design

9. Gerador de grid de layout
10. Estúdio de botões
11. Superfícies de vidro
12. Gradiente mesh
13. Compositor de hero
14. Mockup de dispositivo
15. Fundo orgânico animado (PNG + WebM)

## Fases

### Fase 1 — Fundação de fontes, ícones e exportação

- Adicionar Google Fonts e Material Symbols ao layout.
- Criar `GoogleSymbol` e exportadores PNG/WebM com mensagens de fallback.
- Cobrir serialização, dimensão e suporte de mídia com testes unitários.

### Fase 2 — Tipografia

- Entregar as oito ferramentas em dois estúdios focados.
- Cada rota possui controles, prévia em tempo real e botão de PNG; o loop exporta WebM.

### Checkpoint

- Tipos, lint, testes unitários e smoke test das rotas tipográficas passam.

### Fase 3 — Web design

- Entregar as sete ferramentas restantes, incluindo o fundo animado em WebM.
- Verificar downloads e responsividade no navegador.

### Fase 4 — Backfill das 20 existentes

- Acrescentar uma exportação PNG visual às ferramentas existentes que só baixam CSS, JSON ou texto.
- Preservar os formatos de origem atuais como download adicional.

## Critérios de sucesso

- O catálogo contém 35 rotas únicas, categorizadas e implementadas.
- As 15 novas ferramentas alteram uma prévia real e baixam PNG; duas delas também baixam WebM válido quando suportado.
- Toda ferramenta anterior mantém seu exportador atual e oferece PNG quando a saída é visual.
- Google Fonts e Material Symbols carregam sem dependências npm adicionais.
- Sem erros de console em desktop e mobile; testes, lint, typecheck e build passam.

## Riscos e mitigação

| Risco | Mitigação |
| --- | --- |
| WebM não disponível no navegador | Detectar `MediaRecorder.isTypeSupported`; manter PNG como alternativa. |
| Fonte remota ainda não carregada no canvas | Esperar `document.fonts.ready` antes do desenho/exportação. |
| Google CSS APIs aumentarem a carga | Pedir apenas famílias, eixos e Material Symbols necessários, com `display=swap`. |
| Backfill grande demais | Fazer por categoria, sempre preservando o último commit verde. |

## Fontes oficiais

- Next.js Fonts: https://nextjs.org/docs/pages/getting-started/fonts
- Google Fonts CSS API v2: https://developers.google.com/fonts/docs/css2
- Material Symbols: https://developers.google.com/fonts/docs/material_symbols
- Canvas captureStream: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/captureStream
- MediaRecorder: https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder
