# Nexus Sensi Generator (versão 1.1.0)

Site estático: não precisa de servidor, banco de dados nem instalação.

## Estrutura
```
nexus-sensi-generator/
├── index.html        página única (rotas por #inicio, #gerar, #resultado, #historico, #sobre)
├── css/style.css     visual (cores da Nexus no topo, em :root)
├── js/app.js         algoritmo, formulário, resultado e histórico
├── assets/favicon.svg
├── robots.txt
└── README.md
```

## Como colocar no ar (escolha um)
**Netlify (mais simples):** acesse app.netlify.com/drop e arraste a pasta inteira. O link sai na hora.
**Cloudflare Pages:** Workers & Pages > Create > Pages > Upload assets, envie a pasta.
**GitHub Pages:** crie um repositório, envie os arquivos na raiz, em Settings > Pages escolha a branch main e a pasta / (root).
**Vercel:** vercel.com/new, importe o repositório (sem framework, sem comando de build).
Todos fornecem HTTPS automático e aceitam domínio próprio.

## Testar no computador
Dentro da pasta, rode `python3 -m http.server 8000` e abra http://localhost:8000. Também funciona abrindo o index.html direto.

## Como ajustar o algoritmo
No início de `js/app.js`, o objeto `ALGO` guarda a escala (min 0, max 200), os valores base por estilo e os ajustes de experiência, FPS e RAM. Ao mudar valores, aumente `version`. Os resultados saem sempre limitados a 0–200.

## O que esta versão NÃO tem
Backend, banco de dados online, login e painel administrativo, banco de aparelhos, feedback dos jogadores e estatísticas globais. O histórico fica só no navegador de cada jogador (localStorage). Esses itens exigem um projeto com servidor (por exemplo Next.js + Supabase).

## Aviso
Não há dados de calibração por modelo: os valores são referências estimadas, que o jogador deve testar e ajustar. Ferramenta independente, sem vínculo oficial com a Garena ou o Free Fire.
