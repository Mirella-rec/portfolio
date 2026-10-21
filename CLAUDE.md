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
4. **Cursor customizado.** Muda sobre os vídeos (ex.: vira "PLAY").
5. **Grain e recortes.** Granulado de filme sutil e elementos de papel recortado e fita sobre fotos e vídeos.

**Referências de usabilidade:**
- heatbureau.com/projects: nav mínima em minúsculas, pouco texto, rodapé em blocos rotulados ([social], [reach], [location]).
- barbianaliu.com: layout editorial/colagem.
- Hungry Tiger (DESIGN.md): só a lógica do objeto guiado por scroll e a tipografia em escala de pôster. **A paleta e as fontes do Hungry Tiger NÃO serão usadas.**

**Identidade visual:** a Mirella não tem marca pessoal ainda.
Paleta, fontes e logo/assinatura serão criados junto com o site.
Enquanto não forem definidos, use tokens provisórios em CSS (`:root`) para facilitar a troca.

## 4. Estrutura do site

1. **Abertura:** colagem animada.
2. **Sobre:** trajetória e números.
   - Marca própria Spencive, criada aos 15 anos, com 70% de ROI em 3 meses.
   - Mais de 1.200 vídeos roteirizados, captados e editados em 9 meses na Casa Martin Medeiros.
   - Festivais Melhor Dia (Chilli Beans, Smoke) e Salão Casa Moda (Amir Slama).
   - Estudante de marketing digital na ESPM.
3. **Projetos:** árvore de pastas com 4 galhos.
   - Moda: Casa Martin Medeiros, Spencive, Salão Casa Moda.
   - Eventos e festivais: Melhor Dia, coberturas, story making.
   - Social media / Reels: moda, beleza, saúde.
   - Teatro e celebrações: Teatro Procópio Ferreira, retrospectivas.
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
6. Responda à Mirella com:
   - 1 ou 2 frases sobre o que mudou;
   - como abrir a prévia.

As versões antigas ficam guardadas no histórico do Git.
Se ela pedir para "voltar para a versão de ontem", recupere pelo histórico.

## 8. Pendências

- [ ] Definir nome/assinatura, paleta e fontes da identidade pessoal.
- [ ] Separar e nomear os vídeos por galho/projeto.
- [ ] Gerar previews e capas dos vídeos.
- [ ] Confirmar quais clientes podem ser citados por nome.
- [ ] Escrever os textos (PT e EN).
- [ ] Definir o número de WhatsApp e a mensagem pronta.
- [ ] Escolher hospedagem e domínio (mais para frente).
