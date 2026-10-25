# FleetFlow AI

Painel de logística com IA: visão geral, shipments, despacho, rastreamento, rotas, exceções, motoristas, veículos, clientes, comunicação, agentes de IA, analytics, documentos e configurações. Em inglês e árabe.

Este repositório tem o **build pronto** do app (pasta `dist/`) e um servidor Node pequeno, sem dependências (`server.js`), para hospedar no Railway ou em qualquer lugar que rode Node 18+.

## Rodar localmente

```bash
npm start
```

Abra http://localhost:3000.

## Deploy no Railway

1. Em [railway.com](https://railway.com), clique em **New Project → Deploy from GitHub repo** e escolha este repositório.
2. O Railway detecta o Node e roda `npm start` sozinho.
3. Em **Settings → Networking**, clique em **Generate Domain** para ganhar um endereço público.

## Observações

- O app não tem backend: todos os dados de exemplo estão no próprio JavaScript.
- As rotas (`/shipments`, `/tracking` etc.) caem no `index.html`, então links diretos e recarregar a página funcionam.
- O servidor envia `X-Robots-Tag: noindex`, como o site original, para a demo não aparecer em buscadores.
- `dist/` é um build compilado. Para mudar o app, edite o código-fonte original e gere o build de novo.
