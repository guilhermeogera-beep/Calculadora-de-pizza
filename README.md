# 🍕 Calculadora de Pizza

PWA (funciona offline e instala na tela de início do celular) que faz o mesmo que a planilha
`pizza.xlsx`, só que no bolso: você diz quantas pizzas de cada sabor quer e ela devolve a lista
de compras com as quantidades, quanto de comida dá por pessoa e a receita da massa.

Tudo roda no navegador. Não tem servidor, não tem cadastro, nenhum dado sai do aparelho
(fica no `localStorage`).

## As quatro abas

| Aba | O que faz |
|---|---|
| **Pedido** | Escolhe a quantidade de cada sabor. Mostra total de pizzas, peso total, peso de recheio e — informando o número de pessoas e as fatias por pizza — quantas fatias e quantos gramas sobram por pessoa, com um aviso de "pode faltar / equilibrado / vai sobrar". |
| **Compras** | A lista de ingredientes somada, agrupada por seção do mercado. Dá para marcar o que já comprou e tocar em cada item para ver de quais sabores aquela quantidade veio. O botão **Compartilhar** manda a lista pronta pro WhatsApp. |
| **Massa** | Calcula farinha, água, sal e fermento a partir da massa total do pedido, em duas receitas (italiana/napolitana e caseira). Mostra hidratação, quantas bolas saem e três modos de preparo. |
| **Cadastro** | Cria, edita e apaga sabores (com a gramagem de cada ingrediente por pizza) e o catálogo de ingredientes. |

No menu **⋯** (canto superior direito) tem exportar/importar backup em `.json` e restaurar os
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
const VERSAO = 'pizza-v2';   // era pizza-v1
```

Sem isso, quem já instalou o app continua vendo a versão antiga em cache.

## Estrutura

```
index.html               telas e diálogos
manifest.webmanifest     nome, ícones e cores da PWA
sw.js                    cache offline
assets/css/style.css     estilo (mobile-first, tema escuro)
assets/js/data.js        sabores, ingredientes e receitas iniciais (vindos da planilha)
assets/js/app.js         cálculo, telas e persistência
assets/icons/            ícones 192/512 + maskable
```

Para mudar os sabores que já vêm de fábrica, edite `assets/js/data.js`. Para mudar só no seu
aparelho, use a aba **Cadastro** — ela sobrescreve os dados iniciais.

## De onde vieram os números

Os 16 sabores, as gramagens e as duas receitas de massa saíram direto da planilha original
(abas `base` e `final`). Conferido: o mesmo pedido de exemplo da planilha (2 marguerita,
2 corn bacon, 2 philadélfia, 3 banana com nutella, 2 calabresa, 2 montanella) dá os mesmos
8.760 g totais e as mesmas quantidades por ingrediente, e a massa italiana devolve os mesmos
2.262 g de farinha, 1.579,5 g de água, 54,6 g de sal e 7,8 g de fermento.
