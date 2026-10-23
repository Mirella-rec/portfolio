# Portfólio Mirella — Instruções do Projeto

Este arquivo é o contexto fixo do projeto. Leia-o inteiro antes de qualquer alteração.
O planejamento acontece num chat separado; as decisões de lá chegam aqui por este arquivo.
Quando uma decisão nova for tomada, atualize a seção correspondente.

---

## 1. Sobre a dona do site

Mirella é videomaker e profissional de marketing digital em Guarujá (SP), MEI.
Atua com captação, roteiro e edição (CapCut Pro e Premiere) para moda, beleza, eventos e social media.
É especialista em conteúdo vertical para Instagram e TikTok.
Ela não programa: explique tudo em português simples e execute os comandos por ela.

## 2. Objetivo do site

Portfólio interativo cheio de motion, com uma jornada fluida.
Os vídeos são o centro do site.

- **Público:** agências criativas, marcas de moda/beleza, eventos e festivais.
- **Ação principal:** chamar no WhatsApp (botão com mensagem pronta).
- **Idiomas:** PT-BR (padrão) + EN, com botão de troca.
- **Prazo:** de 2 a 4 semanas para a versão 1.

## 3. Direção criativa

**Linguagem:** colagem/zine misturada com editorial de moda.
São camadas, recortes de papel, fita adesiva e textura, organizadas com o respiro, a hierarquia e a sofisticação tipográfica de uma revista de moda.
Não é caótico: é colagem com curadoria.

**Elementos-assinatura (obrigatórios):**

1. **Celular-guia no scroll.** Um celular vertical fica fixo na tela e muda de posição, rotação e escala a cada etapa do scroll, enquanto o texto avança.
   - A tela do celular toca trechos dos vídeos da Mirella.
   - Inspiração: o pote do site Hungry Tiger (ver `referencias/DESIGN.md`), que acompanha o scroll trocando de lugar.
2. **Abertura em colagem.** Fotos, recortes e vídeos curtos montam uma colagem animada que se desfaz conforme o scroll começa.
3. **Árvore de pastas na aba Projetos.** É uma janela de Finder do macOS reimaginada como árvore viva, com folhagem verde pixelada.
   - Pastas e arquivos "brotam" ao longo de galhos orgânicos.
   - Cada galho é uma área de atuação e cada pasta abre um projeto.
   - Referência original: gravação do Inspora.
   - **No celular (≤700px) a árvore não aparece** (decisão de 22/10). No lugar entram cards de vidro (`src/deck.js`):
     um card por galho, **empilhados na vertical, sem sobrepor**, que surgem em fade-in conforme a pessoa rola a tela.
     Cada card (atualizado em 22/10): vidro fosco transparente, sem fundo colorido; só o título grande do galho e uma pasta
     de vidro rosa-bebê (aba translúcida, frente fosca com reflexo, brilho rosa suave embaixo).
     Sem numeração, sem botão "abrir" e sem lista de projetos no card.
     Ao tocar, a pasta abre numa folha que desdobra como papel (arrastar para baixo fecha).
     Título da seção: "PROJETOS" em Playfair Display reta (sem itálico, só neste título), caixa alta, centralizado, sem número e sem texto de apoio abaixo, com respiro maior até a primeira pasta.
     Na folha aberta: título, descrição curta dos vídeos daquele galho (`desc` em content/*.json) e os vídeos com legenda.
     Referências: cards com gradiente e liquid glass, dobradura de papel (promo iPhone/Plasma), progressive blur + frosted glass.
4. **Cursor customizado.** Muda sobre os vídeos (ex.: vira "PLAY").
5. **Grain e recortes.** Granulado de filme sutil e elementos de papel recortado e fita sobre fotos e vídeos.

**Decisões visuais já tomadas (21/10):**
- Fundo off-white com **grade fina de papel quadriculado** (referência: `referencias/neel-saswade-home.png`).
- Tipografia na linha da mesma referência: **serifa elegante, com o nome em itálico**, e texto curto.
- **Árvore orgânica ilustrada** como elo visual: a árvore do rodapé/paisagem conversa com a árvore de pastas da aba Projetos.
  As duas devem parecer da mesma família.

**Menu (22/10):** fixo no topo, mas some ao rolar para baixo e volta ao rolar para cima, com fundo de vidro fosco, para não poluir a jornada no celular.

**Referências de usabilidade:**
- heatbureau.com/projects: nav mínima em minúsculas, pouco texto, rodapé em blocos rotulados ([social], [reach], [location]).
- barbianaliu.com: layout editorial/colagem.
- Neel Saswade (`referencias/neel-saswade-home.png`): fundo quadriculado, serifa itálica, árvore e paisagem ilustradas.
- Hungry Tiger (DESIGN.md): só a lógica do objeto guiado por scroll e a tipografia em escala de pôster. **A paleta e as fontes do Hungry Tiger NÃO serão usadas.**

**Identidade visual (aprovada em 21/10):**

- **Assinatura:** *Mirella Iezzi*, sempre em Playfair Display itálico.
- **Fontes (Google Fonts):**
  - **Playfair Display**: nome, títulos e textos de apresentação. Itálico para a assinatura e destaques.
  - **DM Mono**: menu, legendas dos vídeos, botões, etiquetas, timecode. Sempre em minúsculas, tracking leve (~0.04em).
  - Não usar Playfair em textos menores que 15px.
- **Paleta:**

```css
:root {
  --papel:  #F6F3EC; /* fundo off-white */
  --grade:  #E6E0D3; /* linhas do papel quadriculado (~20px) */
  --tinta:  #2B2A26; /* texto, botão principal */
  --rosa:   #F4D3DB; /* destaque: etiquetas, fitas, realces */
  --rosa-texto: #8A4A5C; /* texto sobre o rosa */
  --folha:  #6B7D4A; /* verde da árvore, detalhes, REC */
  --musgo:  #3E4F2A; /* verde escuro: texto sobre verde claro, sombras da árvore */
  --folha-clara: #DCE3CF; /* fundo de etiqueta verde */
}
```

- **Componentes base:**
  - botão principal (WhatsApp): pílula em `--tinta` com texto `--papel`, DM Mono;
  - etiquetas: pílulas em `--rosa` com texto `--rosa-texto`, ou `--folha-clara` com `--musgo`.
- Sem sombras pesadas nem gradientes. A profundidade vem da colagem: recortes, fita e grain.
  - **Exceção (22/10):** os cards de vidro dos Projetos no celular usam vidro fosco e tons de rosa-bebê (derivados de `--rosa`). Nada de azul/roxo.

## 4. Estrutura do site

1. **Abertura:** colagem animada.
2. **Sobre ("QUEM SOU EU"):** trajetória e números. Feito primeiro no celular (decisão de 22/10: finalizar o mobile antes do desktop).
   - Título no mesmo estilo de PROJETOS (Playfair reta, caixa alta, centralizado, sem número).
   - História curta em **DM Mono** (3 parágrafos) sobre a **paixão pelo audiovisual** (atualizado em 22/10).
     A Spencive (criada aos **16 anos**) é só o gancho de onde veio a habilidade de editar; não falar do ROI da Spencive.
     Fecha dizendo que ela atende **clientes de todo o Brasil como editora remota** (nunca dizer que trabalha só em Guarujá).
     As palavras "acendem" conforme o scroll; números que contam ao aparecer (`src/about.js`).
   - Uma forma orgânica de vidro rosa-bebê **vaga livremente só dentro do bloco da história** (não segue o dedo nem o scroll).
     Precisa ser transparente o bastante para o texto embaixo continuar legível: rosa só na borda e nos reflexos.
   - Destaques: +1.200 vídeos, Brasil (edição remota), festivais e **ESPM** (Marketing Digital Avançado: growth, mídia paga e testes A/B,
     inteligência de dados com jornadas e KPIs, branding e comunidade). Embaixo da ESPM, sem ênfase:
     técnico de informática pela Microcamp e inglês avançado pelo CNA.
   - Nomes de marcas liberados pela Mirella (22/10): Chilli Beans, Smoke, Amir Slama, Casa Martin Medeiros. Só os nomes; logos não sem autorização.
   - Marca própria Spencive, criada aos 16 anos (onde começou a editar).
   - Mais de 1.200 vídeos roteirizados, captados e editados em 9 meses na Casa Martin Medeiros.
   - Festivais Melhor Dia (Chilli Beans, Smoke) e Salão Casa Moda (Amir Slama).
   - Estudante de marketing digital na ESPM.
3. **Projetos:** 5 pastas, nesta ordem e com estes nomes (decisão de 22/10): **moda, eventos, edição, shows, retrospectivas**.
   - Moda: Casa Martin Medeiros, Spencive, Salão Casa Moda.
   - Eventos: Melhor Dia, coberturas, story making.
   - Edição: Reels e vídeos verticais (moda, beleza, saúde).
   - Shows: Teatro Procópio Ferreira.
   - Retrospectivas: aniversário de 15 anos.
   - Os projetos dentro de cada pasta ainda são provisórios: pedir à Mirella a lista real.
   - Ao abrir uma pasta: **só vídeos + legenda curta**, sem case longo.
4. **Serviços:** captação, roteiro, edição, social media, cobertura de eventos.
5. **Contato:** CTA de WhatsApp em destaque, Instagram e e-mail como secundários.

> Antes de publicar nomes de clientes, confirme com a Mirella.

## 5. Vídeos

- **Formato:** MP4, H.264 + AAC. Quase tudo em **vertical 9:16**; o layout é pensado primeiro para vertical.
- **Volume da v1:** de 15 a 40 vídeos. Não hospedar todos junto ao código; usar um serviço de vídeo (sugestão: Bunny Stream) que entregue MP4/HLS.
- **Cada vídeo precisa de duas versões:**
  - preview curto, sem som, leve (~720p, poucos segundos, loop);
  - versão completa.
- Também precisa de uma imagem de capa (poster).
- **Reprodução:** o preview toca sem som no hover (no celular, ao entrar na tela). O clique abre em tela cheia com som e controles.
- Carregar os vídeos sob demanda (lazy loading). Nunca carregar todos ao abrir a página.
- Organização local: `assets/videos/<galho>/<projeto>/`.

## 6. Stack técnica

- HTML/CSS/JS com **Vite**.
- **GSAP + ScrollTrigger** para as animações guiadas por scroll.
- **Lenis** para scroll suave.
- Textos em `content/pt.json` e `content/en.json`, sem texto fixo no HTML, para facilitar a tradução.
- Respeitar `prefers-reduced-motion`: com ele ativo, reduzir as animações.
- Mobile é prioridade, porque o público abre pelo link do Instagram.

**Hospedagem e domínio:** ainda não definidos. Por enquanto, apenas a prévia local.
Quando chegar a hora, sugerir Vercel com publicação automática pelo GitHub.

## 7. Fluxo de trabalho — comando **SALVAR ALTERAÇÃO**

A Mirella tem conta no GitHub, mas não sabe usar. Faça todos os comandos de Git por ela.

Quando ela escrever **SALVAR ALTERAÇÃO**, execute nesta ordem:

1. Rode o build do site (`npm run build`).
2. Substitua a pasta `preview/` pelo resultado novo. A pasta deve conter sempre só a versão mais recente.
3. Faça um commit no Git com a data e um resumo em português do que mudou.
   Exemplo: `2026-10-21 — celular-guia na seção Sobre`.
4. Adicione uma linha em `CHANGELOG.md` com a data, o que mudou e o porquê.
5. Abra a prévia e confirme que ela carrega sem erros.
   Depois publique a pasta `preview/` como link de prévia (Artifact, sempre no mesmo link) para a Mirella abrir no celular.
   Link da prévia: https://claude.ai/artifact/YZGuwbKmEDA5gy1sTi7y78 (atualize este, passando-o como `url`; não crie outro).
   O build usa caminhos relativos (`base: "./"` no vite.config.js) para isso funcionar.
6. Responda à Mirella com:
   - 1 ou 2 frases sobre o que mudou;
   - como abrir a prévia.

As versões antigas ficam guardadas no histórico do Git.
Se ela pedir para "voltar para a versão de ontem", recupere pelo histórico.

## 8. Pendências

- [x] Definir nome/assinatura, paleta e fontes da identidade pessoal.
- [ ] Desenhar logo/monograma (opcional) e o estilo das ilustrações (árvore e personagens).
- [ ] Separar e nomear os vídeos por galho/projeto.
- [ ] Gerar previews e capas dos vídeos.
- [x] Confirmar quais clientes podem ser citados por nome (liberados em 22/10: Chilli Beans, Smoke, Amir Slama, Casa Martin Medeiros).
- [ ] Escrever os textos (PT e EN).
- [ ] Definir o número de WhatsApp e a mensagem pronta.
- [ ] Escolher hospedagem e domínio (mais para frente).
