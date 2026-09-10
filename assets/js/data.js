/* Dados iniciais - extraidos da planilha "pizza.xlsx" (abas base / final).
   Tudo em gramas. O usuario pode editar, adicionar e apagar pela propria PWA. */

/* IMPORTANTE: sempre que voce adicionar um sabor ou ingrediente aqui embaixo,
   suba este numero em 1. E ele que faz os aparelhos que JA usam o app receberem
   a novidade - sem numero novo, quem ja tem dados salvos nao ve o que voce
   acrescentou. Sabores que o proprio usuario criou ou editou nunca sao tocados,
   e o que ele apagou de proposito nao volta. */
const CATALOGO_VERSAO = 2;

const CATEGORIAS = [
  'Massa',
  'Molhos',
  'Queijos',
  'Carnes e frios',
  'Hortifrúti',
  'Doces',
  'Outros'
];

const SEED_INGREDIENTES = [
  { id: 'massa',         nome: 'Massa',                un: 'g', cat: 'Massa' },
  { id: 'molho',         nome: 'Molho de tomate',      un: 'g', cat: 'Molhos' },
  { id: 'queijo',        nome: 'Queijo mussarela',     un: 'g', cat: 'Queijos' },
  { id: 'rucula',        nome: 'Rúcula',               un: 'g', cat: 'Hortifrúti' },
  { id: 'parma',         nome: 'Presunto parma',       un: 'g', cat: 'Carnes e frios' },
  { id: 'bacon',         nome: 'Bacon',                un: 'g', cat: 'Carnes e frios' },
  { id: 'cream-cheese',  nome: 'Cream cheese',         un: 'g', cat: 'Queijos' },
  { id: 'catupiry',      nome: 'Catupiry',             un: 'g', cat: 'Queijos' },
  { id: 'tomate',        nome: 'Tomate',               un: 'g', cat: 'Hortifrúti' },
  { id: 'manjericao',    nome: 'Manjericão',           un: 'g', cat: 'Hortifrúti' },
  { id: 'milho',         nome: 'Milho',                un: 'g', cat: 'Hortifrúti' },
  { id: 'frango',        nome: 'Frango',               un: 'g', cat: 'Carnes e frios' },
  { id: 'bufala',        nome: 'Mussarela de búfala',  un: 'g', cat: 'Queijos' },
  { id: 'azeitona',      nome: 'Azeitona',             un: 'g', cat: 'Hortifrúti' },
  { id: 'nutella',       nome: 'Nutella',              un: 'g', cat: 'Doces' },
  { id: 'banana',        nome: 'Banana',               un: 'g', cat: 'Hortifrúti' },
  { id: 'morango',       nome: 'Morango',              un: 'g', cat: 'Hortifrúti' },
  { id: 'goiabada',      nome: 'Goiabada',             un: 'g', cat: 'Doces' },
  { id: 'calabresa',     nome: 'Calabresa',            un: 'g', cat: 'Carnes e frios' },
  { id: 'abobrinha',     nome: 'Abobrinha',            un: 'g', cat: 'Hortifrúti' },
  { id: 'pepperoni',     nome: 'Pepperoni',            un: 'g', cat: 'Carnes e frios' },
  { id: 'mortadela',     nome: 'Mortadela',            un: 'g', cat: 'Carnes e frios' },
  { id: 'pistache',      nome: 'Pistache',             un: 'g', cat: 'Outros' },
  { id: 'pernil',        nome: 'Pernil de porco',      un: 'g', cat: 'Carnes e frios' },
  { id: 'coalhada',      nome: 'Coalhada',             un: 'g', cat: 'Queijos' },
  { id: 'fraldinha',     nome: 'Fraldinha',            un: 'g', cat: 'Carnes e frios' },
  { id: 'gorgonzola',    nome: 'Gorgonzola',           un: 'g', cat: 'Queijos' },
  { id: 'doce-de-leite', nome: 'Doce de leite',        un: 'g', cat: 'Doces' }
];

const SEED_SABORES = [
  { id: 'parma-rucula', nome: 'Parma com rúcula', tipo: 'salgada', itens: {
      massa: 300, molho: 60, queijo: 150, rucula: 50, parma: 150 } },
  { id: 'marguerita', nome: 'Marguerita', tipo: 'salgada', itens: {
      massa: 300, molho: 60, queijo: 200, tomate: 70, manjericao: 50 } },
  { id: 'corn-bacon', nome: 'Corn bacon', tipo: 'salgada', itens: {
      massa: 300, molho: 60, queijo: 150, bacon: 75, milho: 65 } },
  { id: 'philadelfia', nome: 'Philadélfia', tipo: 'salgada', itens: {
      massa: 300, molho: 60, queijo: 150, bacon: 75, 'cream-cheese': 75, tomate: 70 } },
  { id: 'frango-catupiry', nome: 'Frango com catupiry', tipo: 'salgada', itens: {
      massa: 300, molho: 60, queijo: 150, catupiry: 75, frango: 150 } },
  { id: 'caprese', nome: 'Caprese', tipo: 'salgada', itens: {
      massa: 300, molho: 60, queijo: 150, tomate: 70, bufala: 100, azeitona: 100 } },
  { id: 'calabresa', nome: 'Calabresa', tipo: 'salgada', itens: {
      massa: 300, molho: 60, queijo: 150, calabresa: 150 } },
  { id: 'zucchine', nome: 'Zucchine (abobrinha)', tipo: 'salgada', itens: {
      massa: 300, molho: 60, queijo: 150, abobrinha: 200 } },
  { id: 'pepperoni', nome: 'Pepperoni', tipo: 'salgada', itens: {
      massa: 300, molho: 60, queijo: 150, pepperoni: 150 } },
  { id: 'montanella', nome: 'Montanella (mortadela)', tipo: 'salgada', itens: {
      massa: 300, molho: 60, queijo: 150, mortadela: 210, pistache: 15, coalhada: 100 } },
  { id: 'pernil-pizza', nome: 'Pernil', tipo: 'salgada', itens: {
      massa: 300, molho: 60, queijo: 150, goiabada: 50, pernil: 200 } },
  { id: 'fraldinha-pizza', nome: 'Fraldinha com gorgonzola', tipo: 'salgada', itens: {
      massa: 300, molho: 60, queijo: 150, fraldinha: 200, gorgonzola: 50 } },
  { id: 'crostine', nome: 'Crostine (só massa)', tipo: 'salgada', itens: {
      massa: 300 } },
  { id: 'banana-nutella', nome: 'Banana com Nutella', tipo: 'doce', itens: {
      massa: 300, nutella: 150, banana: 100 } },
  { id: 'morango-nutella', nome: 'Morango com Nutella', tipo: 'doce', itens: {
      massa: 300, nutella: 150, morango: 120 } },
  { id: 'romeu-julieta', nome: 'Romeu e Julieta', tipo: 'doce', itens: {
      massa: 300, queijo: 150, goiabada: 200 } },
  { id: 'banana-doce-leite', nome: 'Banana com doce de leite', tipo: 'doce', itens: {
      massa: 300, banana: 200, 'doce-de-leite': 150 } }
];

/* Receitas da massa. Cada uma é autocontida: as proporções (percentuais sobre o
   peso total de massa) e o modo de preparo daquela receita, e nada mais.
   As proporções vêm da aba "final" da planilha — linhas 76-81 (italiana) e 58-63
   (caseira); os tempos vêm das anotações de 12/01 e 13/01 da mesma aba.
   A chave 'italiana' foi mantida para não invalidar o que já está salvo nos celulares. */
const RECEITAS_MASSA = {
  italiana: {
    nome: 'Napolitana',
    sub: 'Fermentação longa e fria',
    meta: '~56 h no total · 70% de hidratação',
    desc: 'A receita da planilha, e a que dá a borda alta e cheia de bolhas. Quase todo o tempo é espera: são uns 40 minutos de trabalho, o resto a geladeira faz sozinha.',
    pct: { farinha: 0.580, agua: 0.405, sal: 0.014, fermento: 0.002 },
    passos: [
      { tempo: '10 min', titulo: 'Sal na água',
        texto: 'Use a água bem gelada — de geladeira mesmo, se a cozinha estiver acima de 25 °C. Dissolva o sal mexendo até não sentir mais nenhum grão no fundo.' },
      { tempo: '5 min', titulo: 'Uma parte da farinha',
        texto: 'Junte mais ou menos um décimo da farinha e misture. Essa papa impede que o fermento encoste no sal puro, que mataria boa parte dele.' },
      { tempo: '2 min', titulo: 'Fermento',
        texto: 'Espalhe o fermento e dissolva. Só depois disso entra o resto da farinha.' },
      { tempo: '15 min', titulo: 'Resto da farinha',
        texto: 'Vá jogando aos poucos, misturando sempre. A massa passa de sopa a uma pasta grudenta — é assim mesmo, ela tem 70% de água.' },
      { tempo: '20 min', titulo: 'Descanso antes de sovar', espera: true,
        texto: 'Cubra e deixe parada. A farinha termina de beber a água sozinha e a sova fica muito mais fácil. Pular esta etapa é o que faz a massa parecer que nunca vai desgrudar.' },
      { tempo: '15 min', titulo: 'Sova',
        texto: 'Sove na bancada ou faça quatro séries de dobras, uma a cada 5 minutos. Está no ponto quando você estica um pedaço contra a luz e ele afina sem rasgar.' },
      { tempo: '4 h', titulo: 'Fermentação em bloco', espera: true,
        texto: 'A massa inteira num recipiente untado, coberta, em temperatura ambiente. Ela deve crescer visivelmente, sem chegar a dobrar de tamanho.' },
      { tempo: '15 min', titulo: 'Bolear',
        texto: 'Divida no peso de bola escolhido e feche cada uma puxando as pontas para baixo, até a superfície ficar lisa e tensa. Emenda sempre virada para baixo.' },
      { tempo: '48 h', titulo: 'Geladeira a 5 °C', espera: true,
        texto: 'Bolas separadas, em caixa fechada ou vasilha com filme encostado. É aqui que o sabor aparece: o frio segura o crescimento e deixa a fermentação trabalhar o gosto.' },
      { tempo: '2 a 3 h', titulo: 'Voltar à temperatura ambiente', espera: true,
        texto: 'Tire da geladeira antes de abrir. Massa gelada não estica — ela resiste, volta sozinha e rasga no meio.' },
      { tempo: '2 min', titulo: 'Abrir',
        texto: 'Só com as mãos, do centro para fora, empurrando todo o ar para a borda. Rolo de macarrão espreme esse ar e você perde o cornicione.' },
      { tempo: '60 a 90 s', titulo: 'Assar',
        texto: 'Forno no máximo, com pedra ou chapa pré-aquecida por pelo menos 40 minutos. Quanto mais quente, menos tempo dentro e mais macia a massa fica.' }
    ],
    dicas: [
      'Cozinha acima de 28 °C: tire uns 20% do fermento. Abaixo de 18 °C: acrescente 20%.',
      '70% de hidratação é massa molhada. Trabalhe com a mão úmida em vez de enfarinhar demais — farinha a mais na sova deixa a massa dura.',
      'Farinha comum funciona, mas uma tipo 00 ou de força aguenta melhor as 48 h de geladeira.'
    ]
  },

  direta: {
    nome: 'Direta',
    sub: 'Um descanso só, de 30 h',
    meta: '~32 h no total · 70% de hidratação',
    desc: 'Mesma proporção da napolitana, metade das etapas: mistura tudo de uma vez e espera. É a opção para quando você lembrou da pizza ontem e não anteontem.',
    pct: { farinha: 0.580, agua: 0.405, sal: 0.014, fermento: 0.002 },
    passos: [
      { tempo: '10 min', titulo: 'Tudo de uma vez',
        texto: 'Água gelada, sal dissolvido, fermento e a farinha aos poucos, misturando até virar uma massa homogênea.' },
      { tempo: '10 min', titulo: 'Sova',
        texto: 'Sove até a massa ficar lisa e começar a soltar da bancada.' },
      { tempo: '30 h', titulo: 'Descanso único', espera: true,
        texto: 'Coberta, num canto fresco da casa. É a única fermentação: não precisa mexer, dobrar nem espiar.' },
      { tempo: '10 min', titulo: 'Bolear',
        texto: 'Divida no peso escolhido e feche as bolas com a emenda para baixo.' },
      { tempo: '1 h', titulo: 'Última espera', espera: true,
        texto: 'Depois de boleada a massa precisa relaxar antes de abrir, senão ela encolhe de volta na sua mão.' },
      { tempo: '60 a 90 s', titulo: 'Assar',
        texto: 'Forno no máximo, com pedra ou chapa bem quente.' }
    ],
    dicas: [
      '30 h em temperatura ambiente só funciona em lugar fresco, entre 18 e 20 °C. Se sua cozinha passa dos 25 °C, use metade do fermento ou corte para umas 18 h.',
      'Massa passada do ponto tem cheiro forte de álcool, murcha ao abrir e não segura o formato. Se acontecer, da próxima vez diminua o fermento em vez do tempo.',
      'Sem a etapa fria, o sabor é mais simples que o da napolitana. A borda cresce menos.'
    ]
  },

  caseira: {
    nome: 'Caseira',
    sub: 'Sovada na bancada, no mesmo dia',
    meta: '~11 h no total · 67% de hidratação',
    desc: 'Menos água e mais sal que a napolitana. É a mais firme das três e a mais fácil de abrir com a mão sem rasgar. Dá para começar de manhã e assar à noite.',
    pct: { farinha: 0.600, agua: 0.400, sal: 0.020, fermento: 0.0012 },
    passos: [
      { tempo: '5 min', titulo: 'Água bem gelada',
        texto: 'Numa bacia larga. Gelada de verdade — é ela que segura a fermentação enquanto você sova.' },
      { tempo: '3 min', titulo: 'Sal',
        texto: 'Dissolva o sal na água antes de qualquer outra coisa entrar.' },
      { tempo: '2 min', titulo: 'Fermento',
        texto: 'Dissolva também. Com o sal já diluído, não tem risco de contato direto.' },
      { tempo: '15 min', titulo: 'Farinha até dar o ponto',
        texto: 'Vá acrescentando aos poucos, até a massa desgrudar das mãos e dar para levar à bancada.' },
      { tempo: '15 min', titulo: 'Sova na bancada',
        texto: 'Empurre com a base da mão, dobre, gire um quarto de volta e repita. A massa passa de irregular a lisa e elástica.' },
      { tempo: '1 h', titulo: 'Primeiro descanso', espera: true,
        texto: 'Coberta com um pano úmido ou filme, em temperatura ambiente.' },
      { tempo: '20 min', titulo: 'Dobra e descansa de novo', espera: true,
        texto: 'Dobre a massa sobre ela mesma algumas vezes para reforçar a estrutura e deixe mais 20 minutos.' },
      { tempo: '10 min', titulo: 'Bolear',
        texto: 'Separe no peso escolhido e boleie com a emenda para baixo.' },
      { tempo: '9 h', titulo: 'Espera final', espera: true,
        texto: 'As bolas descansam até a hora de abrir, cobertas.' },
      { tempo: '60 a 90 s', titulo: 'Assar',
        texto: 'Forno no máximo, com pedra ou chapa pré-aquecida.' }
    ],
    dicas: [
      'O sal em 2% é mais alto de propósito: a fermentação curta desenvolve menos sabor e o sal compensa.',
      'Para fazer tudo no mesmo dia, dobre o fermento e reduza a espera final para umas 3 h.',
      'Por ter menos água, aceita farinha comum de supermercado sem reclamar.'
    ]
  }
};
