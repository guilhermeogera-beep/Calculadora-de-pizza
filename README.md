# 🍕 Calculadora de Pizza

PWA (funciona offline e instala na tela de início do celular) que faz o mesmo que a planilha
`pizza.xlsx`, só que no bolso: você diz quantas pizzas de cada sabor quer e ela devolve a lista
de compras com as quantidades, quanto de comida dá por pessoa e a receita da massa.

Tudo roda no navegador. Não tem servidor, não tem cadastro, nenhum dado sai do aparelho
(fica no `localStorage`).

## As quatro abas

| Aba | O que faz |
|---|---|
| **Pedido** | Escolhe a quantidade de cada sabor, e tocando no nome abre os ingredientes daquela pizza com as gramagens. Mostra total de pizzas, peso total, peso de recheio e, informando o número de pessoas, quantas pizzas/fatias/gramas dão por cabeça. O alvo é **1 pizza por pessoa**, e o aviso diz quantas faltam ou sobram para chegar lá. |
| **Compras** | A lista de ingredientes somada, agrupada por seção do mercado. A massa já vem quebrada no que se compra de verdade — farinha, sal e fermento, na proporção da receita escolhida na aba Massa (a água aparece só como referência). Dá para marcar o que já comprou e tocar em cada item para ver de quais sabores aquela quantidade veio. O botão **Compartilhar** manda a lista pronta pro WhatsApp. |
| **Massa** | Três receitas completas e independentes: escolha uma e só ela aparece embaixo — ingredientes calculados a partir da massa do pedido, modo de preparo em linha do tempo (com as etapas de espera destacadas) e dicas específicas daquela receita. |
| **Cadastro** | Cria, edita e apaga sabores (com a gramagem de cada ingrediente por pizza) e o catálogo de ingredientes. |

No menu **⋯** (canto superior direito) tem buscar atualização do app, gerar o `catalogo.json`,
exportar/importar backup em `.json` e restaurar os
sabores originais.

## Rodando na sua máquina

Como é só HTML/CSS/JS estático, não precisa instalar nada. Basta abrir o `index.html` no
navegador — só que o service worker (o modo offline) exige `http://` ou `https://`, então para
testar a PWA de verdade suba um servidor local qualquer, por exemplo:

```bash
npx serve .
```

## Publicando no GitHub Pages

```bash
git remote add origin https://github.com/SEU-USUARIO/calculadora-pizza.git
git branch -M main
git push -u origin main
```

Depois, no GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: `main` / `root` → Save**.

Em um ou dois minutos o app fica no ar em
`https://SEU-USUARIO.github.io/calculadora-pizza/`.

Abra esse endereço no celular e use **Adicionar à tela de início** (Android: menu ⋮ do Chrome;
iPhone: botão de compartilhar do Safari). A partir daí ele abre em tela cheia, sem barra de
navegador, e funciona sem internet.

> Todos os caminhos do projeto são relativos (`./`), então funciona tanto na raiz do domínio
> quanto em um subdiretório como `/calculadora-pizza/`.

### Publicando uma atualização

Sempre que mudar algum arquivo, incremente a versão do cache no topo de `sw.js`:

```js
const VERSAO = 'pizza-v8';   // era pizza-v7
```

### "Publiquei mas o celular continua na versão antiga"

O service worker trabalha em **rede primeiro**: com internet, o que está publicado
sempre ganha. Mas o navegador só percebe que o `sw.js` mudou quando releva o cache
HTTP dele, e o GitHub Pages ainda serve os arquivos por CDN com alguns minutos de
validade. Ou seja: pode demorar.

Na ordem, do mais rápido para o mais bruto:

1. No app, **⋯ → 🔄 Buscar atualização do app**. Ele apaga o cache, revalida o
   service worker e recarrega. Resolve na hora, sem perder seus dados.
2. Confira no rodapé do mesmo menu ⋯ qual catálogo está carregado
   (`Catálogo v2 · 17 sabores`). Se o número bateu com o `CATALOGO_VERSAO` do
   `data.js` que você publicou, atualizou.
3. Confirme que o arquivo no ar é mesmo o novo, abrindo direto no navegador:
   `https://SEU-USUARIO.github.io/SEU-REPO/assets/js/data.js` — procure o
   `CATALOGO_VERSAO` no topo. Se lá ainda estiver o antigo, o problema é o upload
   ou o build do Pages, não o cache do celular.
4. Veja em **Actions**, no GitHub, se o build do Pages terminou (leva 1–2 min).
   Arrastar arquivos pela web cria um commit; sem commit, nada sobe.
5. Último caso: desinstale a PWA da tela de início e adicione de novo. Isso apaga
   os dados salvos, então **exporte o backup antes** (⋯ → Exportar).

> Ao arrastar arquivos pelo site do GitHub, confira que você substituiu a pasta
> `assets` inteira, e não só os arquivos da raiz. É comum atualizar o `index.html`
> e esquecer o `assets/js/app.js`, que é onde está quase toda a lógica.

## Estrutura

```
index.html               telas e diálogos
manifest.webmanifest     nome, ícones e cores da PWA
sw.js                    cache offline
catalogo.json            sabores publicados, baixado pelo app a cada abertura
assets/css/style.css     estilo (mobile-first, tema escuro)
assets/js/data.js        sabores, ingredientes e receitas iniciais (vindos da planilha)
assets/js/app.js         cálculo, telas e persistência
assets/icons/            ícones 192/512 + maskable
```

Para mudar só no seu aparelho, use a aba **Cadastro**.

## Passando sabores de uma pessoa para outra

São dois caminhos, e os dois só **acrescentam** — nunca sobrescrevem um sabor que a pessoa
editou nem trazem de volta o que ela apagou de propósito.

### 1. Link no WhatsApp (pessoa a pessoa)

Abra o sabor na aba **Cadastro** e toque em **🔗 Compartilhar este sabor**. Sai um link com a
receita inteira dentro dele — inclusive os ingredientes que quem recebe talvez não tenha
cadastrado. Quem abre o link vê um resumo e decide se adiciona.

Não passa por servidor nenhum: a receita viaja na própria URL. Um sabor comum dá uns 550
caracteres, cabe folgado numa mensagem.

Se a pessoa já tiver um sabor com aquele nome, o botão vira **Adicionar como cópia** — nada é
sobrescrito.

### 2. `catalogo.json` (para todo mundo de uma vez)

O app baixa o `catalogo.json` da raiz do site toda vez que abre e acrescenta o que faltar.
É assim que um sabor novo chega em todos os aparelhos sem ninguém precisar mandar link.

Para publicar um sabor que alguém te mandou:

1. Adicione o sabor no seu app (pelo link que a pessoa mandou, ou na mão pela aba Cadastro).
2. Menu **⋯ → 📦 Gerar catalogo.json**. Ele monta o arquivo com tudo que não vem de fábrica,
   já com a versão incrementada.
3. Suba o arquivo na raiz do repositório, junto do `index.html`.

O campo `versao` é o que dispara a atualização nos celulares. Se você editar o arquivo na mão,
**lembre de subir esse número** — sem isso ninguém recebe.

### Acrescentando um sabor direto no código

Edite `assets/js/data.js` **e suba o `CATALOGO_VERSAO` em 1**:

```js
const CATALOGO_VERSAO = 3;   // era 2
```

Esse número é o que faz os celulares que já usam o app receberem a novidade. Os dados ficam
no `localStorage` de cada aparelho, então sem ele quem já tem dados salvos continua vendo a
lista antiga. Na próxima vez que abrir, o app acrescenta só o que faltava e avisa com um
aviso rápido na tela.

O que a mesclagem **não** faz, de propósito:

- não sobrescreve sabor que você editou (se você mexeu na Marguerita, ela fica como está);
- não ressuscita sabor ou ingrediente que você apagou de propósito;
- não encosta no pedido, no número de pessoas nem na receita escolhida.

Lembre de subir também o `VERSAO` do `sw.js`, senão o celular continua servindo os arquivos
antigos do cache.

## De onde vieram os números

16 dos 17 sabores e todas as gramagens saíram direto da planilha original (abas `base` e
`final`). O único sabor acrescentado depois foi o **Morango com Nutella**.

As proporções das massas também são da planilha: a napolitana e a direta usam as linhas 76–81
(58% farinha / 40,5% água / 1,4% sal / 0,2% fermento) e a caseira usa as linhas 58–63
(60 / 40 / 2 / 0,12). Os tempos vêm das anotações de 12/01 e 13/01 da mesma aba.

O modo de preparo da **Napolitana** é o método que o Guilherme faz de verdade: fermento na
água, metade da farinha, sal, resto da farinha, 4 h para dar liga, boleia e 48 h de geladeira —
sem sova. As duas últimas etapas (tirar da geladeira e assar) e as dicas foram escritas para o
app.

Conferido: o mesmo pedido de exemplo da planilha (2 marguerita,
2 corn bacon, 2 philadélfia, 3 banana com nutella, 2 calabresa, 2 montanella) dá os mesmos
8.760 g totais e as mesmas quantidades por ingrediente, e a massa italiana devolve os mesmos
2.262 g de farinha, 1.579,5 g de água, 54,6 g de sal e 7,8 g de fermento.
