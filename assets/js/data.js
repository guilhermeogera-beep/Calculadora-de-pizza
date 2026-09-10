/* Dados iniciais - extraidos da planilha "pizza.xlsx" (abas base / final).
   Tudo em gramas. O usuario pode editar, adicionar e apagar pela propria PWA. */

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
  { id: 'romeu-julieta', nome: 'Romeu e Julieta', tipo: 'doce', itens: {
      massa: 300, queijo: 150, goiabada: 200 } },
  { id: 'banana-doce-leite', nome: 'Banana com doce de leite', tipo: 'doce', itens: {
      massa: 300, banana: 200, 'doce-de-leite': 150 } }
];

/* Receita da massa: percentuais sobre o peso total de massa.
   Vindos da aba "final" (linhas 76-81 = massa italiana, 58-63 = massa caseira). */
const PERFIS_MASSA = {
  italiana: {
    nome: 'Massa italiana (napolitana)',
    desc: 'Alta hidratação, fermentação longa e fria. É a receita da planilha.',
    pct: { farinha: 0.580, agua: 0.405, sal: 0.014, fermento: 0.002 }
  },
  caseira: {
    nome: 'Massa caseira (mais firme)',
    desc: 'Menos hidratada, mais fácil de abrir na mão. Descanso mais curto.',
    pct: { farinha: 0.600, agua: 0.400, sal: 0.020, fermento: 0.0012 }
  }
};

const CRONOGRAMAS = [
  {
    id: 'longa-fria',
    nome: 'Fermentação longa e fria',
    resumo: '4 h em temperatura ambiente + 48 h a 5 °C',
    passos: [
      'Misture a farinha, a água, o sal e o fermento até formar uma massa homogênea.',
      'Deixe descansar 4 horas em temperatura ambiente, coberta.',
      'Boleie (divida em bolas do peso escolhido) e leve à geladeira.',
      'Deixe 48 horas a 5 °C.',
      'Tire da geladeira 2 a 3 horas antes de abrir, para a massa voltar à temperatura ambiente.'
    ]
  },
  {
    id: 'direta',
    nome: 'Massa direta',
    resumo: '30 h de descanso + 1 h depois de bolear',
    passos: [
      'Misture tudo de uma vez até ficar liso.',
      'Deixe descansar 30 horas.',
      'Boleie nas bolas do peso escolhido.',
      'Deixe mais 1 hora antes de abrir.'
    ]
  },
  {
    id: 'sova',
    nome: 'Sova na bancada (manual)',
    resumo: '1 h + 20 min + 9 h já boleada',
    passos: [
      'Comece com a água bem gelada.',
      'Dissolva o sal na água.',
      'Dissolva o fermento na água.',
      'Vá colocando a farinha aos poucos, até dar para sovar na bancada.',
      'Deixe descansar 1 hora, junte a massa de novo e deixe mais 20 minutos.',
      'Separe nas bolas do peso escolhido e deixe mais 9 horas antes de abrir.'
    ]
  }
];
