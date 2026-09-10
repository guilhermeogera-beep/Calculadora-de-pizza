/* Calculadora de Pizza - PWA
   Estado 100% local (localStorage). Nada sai do aparelho. */
(function () {
'use strict';

const KEY = 'pizzaCalc.v1';
const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

/* ============================= ESTADO ============================= */

function estadoPadrao() {
  return {
    v: 1,
    catalogo: CATALOGO_VERSAO,
    ingredientes: JSON.parse(JSON.stringify(SEED_INGREDIENTES)),
    sabores: JSON.parse(JSON.stringify(SEED_SABORES)),
    removidos: { sabores: [], ingredientes: [] },
    pedido: {},
    pessoas: 10,
    fatias: 8,
    comprados: {},
    massa: { perfil: 'italiana', bola: 300, override: null }
  };
}

let S, salvoBruto = null;
try {
  const raw = localStorage.getItem(KEY);
  salvoBruto = raw ? JSON.parse(raw) : null;
  S = salvoBruto ? Object.assign(estadoPadrao(), salvoBruto) : estadoPadrao();
} catch (e) {
  S = estadoPadrao();
}
if (!Array.isArray(S.ingredientes) || !S.ingredientes.length) S.ingredientes = estadoPadrao().ingredientes;
if (!Array.isArray(S.sabores)) S.sabores = estadoPadrao().sabores;
if (!S.massa) S.massa = estadoPadrao().massa;

/* Traz para um aparelho que já usa o app os sabores/ingredientes acrescentados ao
   data.js depois. Nunca sobrescreve o que já existe (o usuário pode ter editado)
   e nunca ressuscita o que ele apagou de propósito. */
function lembrarRemovido(tipo, id) {
  if (!S.removidos) S.removidos = { sabores: [], ingredientes: [] };
  if (!Array.isArray(S.removidos[tipo])) S.removidos[tipo] = [];
  if (S.removidos[tipo].indexOf(id) === -1) S.removidos[tipo].push(id);
}

function mesclarCatalogo(versaoSalva) {
  if (Number(versaoSalva) >= CATALOGO_VERSAO) return { sabores: 0, ingredientes: 0 };

  if (!S.removidos) S.removidos = { sabores: [], ingredientes: [] };
  const remS = Array.isArray(S.removidos.sabores) ? S.removidos.sabores : [];
  const remI = Array.isArray(S.removidos.ingredientes) ? S.removidos.ingredientes : [];

  let ni = 0, ns = 0;
  SEED_INGREDIENTES.forEach(seed => {
    if (S.ingredientes.some(i => i.id === seed.id) || remI.indexOf(seed.id) !== -1) return;
    S.ingredientes.push(JSON.parse(JSON.stringify(seed)));
    ni++;
  });
  SEED_SABORES.forEach(seed => {
    if (S.sabores.some(s => s.id === seed.id) || remS.indexOf(seed.id) !== -1) return;
    S.sabores.push(JSON.parse(JSON.stringify(seed)));
    ns++;
  });

  S.catalogo = CATALOGO_VERSAO;
  salvar();
  return { sabores: ns, ingredientes: ni };
}

// A mesclagem em si roda lá no fim do arquivo: ela chama salvar(), que só existe
// depois daqui.

let salvarTimer = null;
function salvar() {
  clearTimeout(salvarTimer);
  salvarTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(S)); }
    catch (e) { toast('Não consegui salvar (armazenamento cheio?)'); }
  }, 120);
}

/* ============================= UTIL ============================= */

const nf = (v, d) => Number(v).toLocaleString('pt-BR', { maximumFractionDigits: d === undefined ? 0 : d });

// Menos casas decimais conforme o número cresce: "8,05 kg", "67,3 kg", "103 kg".
// Sem isso "103,09 kg" quebrava em duas linhas nos cards de resumo do celular.
function casas(kg) { return kg >= 100 ? 0 : (kg >= 10 ? 1 : 2); }

function fmtQt(v, un) {
  if (!v) return '0 ' + (un || 'g');
  if (un === 'g'  && v >= 1000) return nf(v / 1000, casas(v / 1000)) + ' kg';
  if (un === 'ml' && v >= 1000) return nf(v / 1000, casas(v / 1000)) + ' L';
  if (un === 'un') return nf(v, 1) + ' un';
  return nf(v, v < 10 ? 1 : 0) + ' ' + (un || 'g');
}

function slug(txt) {
  return (txt || '').toString().toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'item';
}
function idUnico(base, lista) {
  let id = slug(base), n = 2;
  while (lista.some(x => x.id === id)) id = slug(base) + '-' + (n++);
  return id;
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

let toastTimer = null;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

const ing = id => S.ingredientes.find(i => i.id === id);
const sab = id => S.sabores.find(s => s.id === id);

function idMassa() {
  if (ing('massa')) return 'massa';
  const m = S.ingredientes.find(i => /massa|dough/i.test(i.nome));
  return m ? m.id : null;
}

function pesoSabor(s) {
  return Object.values(s.itens || {}).reduce((a, b) => a + (Number(b) || 0), 0);
}

/* ============================= CÁLCULO ============================= */

function calcular() {
  const porIng = {};       // ingId -> { total, detalhes: [] }
  let totalPizzas = 0, pesoTotal = 0;

  S.sabores.forEach(s => {
    const q = Number(S.pedido[s.id]) || 0;
    if (q <= 0) return;
    totalPizzas += q;
    Object.keys(s.itens || {}).forEach(iid => {
      const g = Number(s.itens[iid]) || 0;
      if (!g) return;
      if (!porIng[iid]) porIng[iid] = { total: 0, detalhes: [] };
      porIng[iid].total += g * q;
      porIng[iid].detalhes.push({ sabor: s.nome, pizzas: q, porPizza: g, total: g * q });
      pesoTotal += g * q;
    });
  });

  const mid = idMassa();
  const massaTotal = mid && porIng[mid] ? porIng[mid].total : 0;

  return { porIng, totalPizzas, pesoTotal, massaTotal, recheio: pesoTotal - massaTotal };
}

/* ============================= NAVEGAÇÃO ============================= */

const TITULOS = { pedido: 'Pedido', compras: 'Lista de compras', massa: 'Massa italiana', sabores: 'Cadastro' };
let viewAtual = 'pedido';

function irPara(v) {
  viewAtual = v;
  $$('.view').forEach(el => el.classList.toggle('hidden', el.id !== 'view-' + v));
  $$('.tab').forEach(b => b.classList.toggle('is-active', b.dataset.view === v));
  $('#viewTitle').textContent = TITULOS[v];
  window.scrollTo({ top: 0 });
  render();
}
$('#tabbar').addEventListener('click', e => {
  const b = e.target.closest('.tab');
  if (b) irPara(b.dataset.view);
});

function render() {
  if (viewAtual === 'pedido')  renderPedido();
  if (viewAtual === 'compras') renderCompras();
  if (viewAtual === 'massa')   renderMassa();
  if (viewAtual === 'sabores') renderSabores();
}

/* ============================= ABA: PEDIDO ============================= */

function renderPedido() {
  const t = calcular();

  $('#resumoPedido').innerHTML =
    stat(nf(t.totalPizzas), 'pizzas') +
    stat(fmtQt(t.pesoTotal, 'g'), 'peso total') +
    stat(fmtQt(t.recheio, 'g'), 'recheio');

  $('#inpPessoas').value = S.pessoas;
  $('#inpFatias').value = S.fatias;

  const pessoas = Math.max(1, Number(S.pessoas) || 1);
  const fatias = Math.max(1, Number(S.fatias) || 1);
  const fatiasPessoa = (t.totalPizzas * fatias) / pessoas;
  const gPessoa = t.pesoTotal / pessoas;
  const pizzaPessoa = t.totalPizzas / pessoas;

  let cls = 'ok', txt = 'Quantidade equilibrada: entre 2 e 4 fatias por pessoa.';
  if (t.totalPizzas === 0) { cls = 'warn'; txt = 'Escolha os sabores abaixo para começar.'; }
  else if (fatiasPessoa < 2) { cls = 'bad'; txt = 'Pode faltar. O normal é de 2 a 4 fatias por pessoa.'; }
  else if (fatiasPessoa > 4) { cls = 'warn'; txt = 'Vai sobrar bastante — ótimo se quiser mandar comida pra casa.'; }

  $('#porPessoa').innerHTML =
    '<div><b>' + nf(fatiasPessoa, 1) + '</b><span>fatias / pessoa</span></div>' +
    '<div><b>' + nf(pizzaPessoa, 2) + '</b><span>pizza / pessoa</span></div>' +
    '<div><b>' + fmtQt(gPessoa, 'g') + '</b><span>comida / pessoa</span></div>' +
    '<div class="aviso ' + cls + '">' + txt + '</div>';

  const busca = ($('#buscaPedido').value || '').toLowerCase().trim();
  const lista = S.sabores.filter(s => !busca || s.nome.toLowerCase().includes(busca));
  const box = $('#listaPedido');

  if (!lista.length) { box.innerHTML = '<p class="vazio">Nenhum sabor encontrado.</p>'; return; }

  box.innerHTML = lista.map(s => {
    const q = Number(S.pedido[s.id]) || 0;
    return '<div class="row' + (q > 0 ? ' on' : '') + '">' +
      '<div class="row-main"><span class="nome">' + esc(s.nome) +
        (s.tipo === 'doce' ? '<span class="tag doce">doce</span>' : '') + '</span>' +
        '<span class="sub">' + fmtQt(pesoSabor(s), 'g') + ' por pizza' +
        (q > 0 ? ' &middot; total ' + fmtQt(pesoSabor(s) * q, 'g') : '') + '</span></div>' +
      '<div class="qtd">' +
        '<button type="button" data-ped="' + s.id + '" data-d="-1" aria-label="Menos">−</button>' +
        '<span class="n">' + q + '</span>' +
        '<button type="button" class="plus" data-ped="' + s.id + '" data-d="1" aria-label="Mais">+</button>' +
      '</div></div>';
  }).join('');
}

function stat(valor, rotulo) {
  return '<div class="stat"><b>' + valor + '</b><span>' + rotulo + '</span></div>';
}

$('#listaPedido').addEventListener('click', e => {
  const b = e.target.closest('[data-ped]');
  if (!b) return;
  const id = b.dataset.ped;
  const atual = Number(S.pedido[id]) || 0;
  const novo = Math.max(0, atual + Number(b.dataset.d));
  if (novo) S.pedido[id] = novo; else delete S.pedido[id];
  salvar();
  renderPedido();
});

$('#buscaPedido').addEventListener('input', renderPedido);

$('#btnLimparPedido').addEventListener('click', () => {
  if (!Object.keys(S.pedido).length) return;
  if (!confirm('Zerar todas as quantidades do pedido?')) return;
  S.pedido = {};
  S.comprados = {};
  salvar();
  renderPedido();
  toast('Pedido zerado');
});

$$('[data-pessoas]').forEach(b => b.addEventListener('click', () => {
  S.pessoas = Math.max(1, (Number(S.pessoas) || 1) + Number(b.dataset.pessoas));
  salvar(); renderPedido();
}));
$$('[data-fatias]').forEach(b => b.addEventListener('click', () => {
  S.fatias = Math.max(1, (Number(S.fatias) || 1) + Number(b.dataset.fatias));
  salvar(); renderPedido();
}));
$('#inpPessoas').addEventListener('input', e => {
  S.pessoas = Math.max(1, Number(e.target.value) || 1); salvar();
  const t = calcular(); atualizaPorPessoa(t);
});
$('#inpFatias').addEventListener('input', e => {
  S.fatias = Math.max(1, Number(e.target.value) || 1); salvar();
  const t = calcular(); atualizaPorPessoa(t);
});
function atualizaPorPessoa() { renderPedido(); }

/* ============================= ABA: COMPRAS ============================= */

let abertos = {};

/* "Massa" é um ingrediente intermediário: no mercado o que se compra é farinha,
   sal e fermento. Aqui ela é quebrada na receita escolhida na aba Massa. */
function fmtMassa(v) {
  if (v >= 1000) return nf(v / 1000, 2) + ' kg';
  return nf(v, v < 100 ? 1 : 0) + ' g';
}

function receitaMassa(totalMassa) {
  const perfil = PERFIS_MASSA[S.massa.perfil] || PERFIS_MASSA.italiana;
  const p = perfil.pct;
  const item = (id, nome, pct, comprar, sub) => ({
    id: 'massa:' + id, nome: nome, sub: sub, un: 'g', qt: totalMassa * pct, comprar: comprar,
    qtTxt: fmtMassa(totalMassa * pct),
    det: [{
      esq: perfil.nome + ' — ' + nf(pct * 100, pct < 0.01 ? 2 : 1) + '% da massa',
      dir: fmtMassa(totalMassa * pct)
    }]
  });
  return {
    perfil: perfil,
    itens: [
      item('farinha',  'Farinha',                 p.farinha,  true),
      item('sal',      'Sal',                     p.sal,      true),
      item('fermento', 'Fermento biológico seco', p.fermento, true),
      item('agua',     'Água',                    p.agua,     false, 'não precisa comprar')
    ]
  };
}

/* Monta a lista agrupada. Usada tanto pela tela quanto pelo botão Compartilhar. */
function gruposCompras(t) {
  const mid = idMassa();
  const massaTotal = massaBase();
  const catMassa = (mid && ing(mid) && ing(mid).cat) || 'Massa';
  const ids = Object.keys(t.porIng).filter(id => t.porIng[id].total > 0 && id !== mid);
  const grupos = [];

  CATEGORIAS.concat(['(sem categoria)']).forEach(cat => {
    const linhas = [];
    let nota = '';

    if (cat === catMassa && massaTotal > 0) {
      const r = receitaMassa(massaTotal);
      const bola = Math.max(1, Number(S.massa.bola) || 300);
      nota = fmtQt(massaTotal, 'g') + ' de massa · ' + nf(massaTotal / bola, 1) +
             ' bolas de ' + nf(bola) + ' g · ' + r.perfil.nome;
      r.itens.forEach(x => linhas.push(x));
    }

    ids.filter(id => (((ing(id) || {}).cat) || '(sem categoria)') === cat)
       .sort((a, b) => t.porIng[b].total - t.porIng[a].total)
       .forEach(id => {
         const i = ing(id) || { nome: id, un: 'g' };
         linhas.push({
           id: id, nome: i.nome, un: i.un, qt: t.porIng[id].total, comprar: true,
           qtTxt: fmtQt(t.porIng[id].total, i.un),
           det: t.porIng[id].detalhes.map(x => ({
             esq: x.sabor + ' — ' + x.pizzas + '× ' + fmtQt(x.porPizza, i.un),
             dir: fmtQt(x.total, i.un)
           }))
         });
       });

    if (linhas.length) grupos.push({ cat: cat, nota: nota, linhas: linhas });
  });
  return grupos;
}

function renderCompras() {
  const t = calcular();

  const box = $('#listaCompras');
  if (!t.totalPizzas) {
    $('#resumoCompras').innerHTML =
      stat('0', 'itens') + stat('0', 'pizzas') + stat('0 g', 'peso total');
    box.innerHTML = '<p class="vazio">Escolha as pizzas na aba <b>Pedido</b> e a lista aparece aqui.</p>';
    return;
  }

  const grupos = gruposCompras(t);
  const aComprar = grupos.reduce((a, g) => a + g.linhas.filter(l => l.comprar).length, 0);

  $('#resumoCompras').innerHTML =
    stat(nf(aComprar), 'itens') +
    stat(nf(t.totalPizzas), 'pizzas') +
    stat(fmtQt(t.pesoTotal, 'g'), 'peso total');

  box.innerHTML = grupos.map(g =>
    '<p class="grupo-title">' + esc(g.cat) + '</p>' +
    (g.nota ? '<p class="grupo-nota">' + esc(g.nota) + '</p>' : '') +
    g.linhas.map(l => {
      const done = l.comprar && !!S.comprados[l.id];
      const open = !!abertos[l.id];
      return '<div class="compra' + (done ? ' done' : '') + (l.comprar ? '' : ' info') + '">' +
        '<div class="compra-head">' +
          (l.comprar
            ? '<button type="button" class="chk' + (done ? ' on' : '') + '" data-chk="' + l.id + '" aria-label="Marcar como comprado">✓</button>'
            : '<span class="chk-vazio" aria-hidden="true"></span>') +
          '<span class="nome" data-det="' + l.id + '">' + esc(l.nome) +
            (l.sub ? '<small>' + esc(l.sub) + '</small>' : '') + '</span>' +
          '<span class="qt" data-det="' + l.id + '">' + esc(l.qtTxt) + '</span>' +
        '</div>' +
        (open && l.det.length ? '<div class="compra-det">' + l.det.map(d =>
          '<div><span>' + esc(d.esq) + '</span><b>' + esc(d.dir) + '</b></div>').join('') + '</div>' : '') +
      '</div>';
    }).join('')
  ).join('');
}

$('#listaCompras').addEventListener('click', e => {
  const c = e.target.closest('[data-chk]');
  if (c) {
    const id = c.dataset.chk;
    if (S.comprados[id]) delete S.comprados[id]; else S.comprados[id] = true;
    salvar(); renderCompras(); return;
  }
  const d = e.target.closest('[data-det]');
  if (d) {
    const id = d.dataset.det;
    abertos[id] = !abertos[id];
    renderCompras();
  }
});

$('#btnDesmarcar').addEventListener('click', () => {
  S.comprados = {}; salvar(); renderCompras();
});

$('#btnCompartilhar').addEventListener('click', async () => {
  const t = calcular();
  if (!t.totalPizzas) { toast('Sua lista está vazia'); return; }

  let txt = '🍕 LISTA DE COMPRAS\n';
  txt += t.totalPizzas + ' pizzas para ' + S.pessoas + ' pessoas\n\n';
  gruposCompras(t).forEach(g => {
    txt += g.cat.toUpperCase() + '\n';
    if (g.nota) txt += '(' + g.nota.replace(/ · /g, ', ') + ')\n';
    g.linhas.forEach(l => {
      txt += '- ' + l.nome + ': ' + l.qtTxt + (l.comprar ? '' : ' (' + (l.sub || 'informativo') + ')') + '\n';
    });
    txt += '\n';
  });
  txt += 'Sabores:\n';
  S.sabores.forEach(s => { const q = S.pedido[s.id]; if (q) txt += '- ' + q + '× ' + s.nome + '\n'; });

  try {
    if (navigator.share) { await navigator.share({ title: 'Lista de compras', text: txt }); return; }
    await navigator.clipboard.writeText(txt);
    toast('Lista copiada! É só colar no WhatsApp.');
  } catch (err) {
    if (err && err.name === 'AbortError') return;
    toast('Não consegui compartilhar aqui');
  }
});

/* ============================= ABA: MASSA ============================= */

function massaBase() {
  const t = calcular();
  return S.massa.override !== null && S.massa.override !== undefined
    ? Number(S.massa.override) || 0
    : t.massaTotal;
}

function renderMassa() {
  const sel = $('#selPerfil');
  if (!sel.options.length) {
    sel.innerHTML = Object.keys(PERFIS_MASSA)
      .map(k => '<option value="' + k + '">' + esc(PERFIS_MASSA[k].nome) + '</option>').join('');
  }
  sel.value = S.massa.perfil in PERFIS_MASSA ? S.massa.perfil : 'italiana';
  const perfil = PERFIS_MASSA[sel.value];
  $('#descPerfil').textContent = perfil.desc;

  $('#inpBola').value = S.massa.bola;
  const total = massaBase();
  if (document.activeElement !== $('#inpMassaTotal')) $('#inpMassaTotal').value = Math.round(total);

  const bola = Math.max(1, Number(S.massa.bola) || 300);
  const bolas = total / bola;
  const p = perfil.pct;
  const farinha = total * p.farinha;
  const agua = total * p.agua;
  const hidr = farinha ? (agua / farinha) * 100 : 0;

  const linha = (nome, valor, pct, dec) =>
    '<div class="linha"><span>' + nome + (pct ? '<span class="pct">' + pct + '</span>' : '') +
    '</span><b>' + (dec !== undefined ? nf(valor, dec) + ' g' : fmtQt(valor, 'g')) + '</b></div>';

  $('#tabelaMassa').innerHTML =
    linha('Farinha', farinha, ' ' + nf(p.farinha * 100, 1) + '%', 0) +
    linha('Água', agua, ' ' + nf(p.agua * 100, 1) + '%', 0) +
    linha('Sal', sal_(total, p), ' ' + nf(p.sal * 100, 1) + '%', 1) +
    linha('Fermento biológico seco', total * p.fermento, ' ' + nf(p.fermento * 100, 2) + '%', 1) +
    '<div class="linha destaque"><span>Massa total</span><b>' + fmtQt(total, 'g') + '</b></div>' +
    '<div class="linha destaque"><span>Bolas de ' + nf(bola) + ' g</span><b>' + nf(bolas, 1) + '</b></div>' +
    '<div class="linha destaque"><span>Hidratação (água ÷ farinha)</span><b>' + nf(hidr, 0) + '%</b></div>';

  $('#cronogramas').innerHTML = CRONOGRAMAS.map((c, idx) =>
    '<details class="crono"' + (idx === 0 ? ' open' : '') + '>' +
      '<summary>' + esc(c.nome) + ' <small>' + esc(c.resumo) + '</small></summary>' +
      '<ol>' + c.passos.map(t => '<li>' + esc(t) + '</li>').join('') + '</ol>' +
    '</details>').join('');
}
function sal_(total, p) { return total * p.sal; }

$('#selPerfil').addEventListener('change', e => { S.massa.perfil = e.target.value; salvar(); renderMassa(); });
$('#inpBola').addEventListener('input', e => { S.massa.bola = Math.max(1, Number(e.target.value) || 300); salvar(); renderMassa(); });
$('#inpMassaTotal').addEventListener('input', e => { S.massa.override = Math.max(0, Number(e.target.value) || 0); salvar(); renderMassa(); });
$('#btnSyncMassa').addEventListener('click', () => {
  S.massa.override = null; salvar(); renderMassa();
  toast('Usando a massa do pedido');
});

/* ============================= ABA: CADASTRO ============================= */

function renderSabores() {
  const busca = ($('#buscaSabor').value || '').toLowerCase().trim();
  const lista = S.sabores.filter(s => !busca || s.nome.toLowerCase().includes(busca));

  $('#listaSabores').innerHTML = lista.length ? lista.map(s =>
    '<div class="row" data-edit-sabor="' + s.id + '">' +
      '<div class="row-main"><span class="nome">' + esc(s.nome) +
        (s.tipo === 'doce' ? '<span class="tag doce">doce</span>' : '') + '</span>' +
        '<span class="sub">' + Object.keys(s.itens || {}).length + ' ingredientes &middot; ' + fmtQt(pesoSabor(s), 'g') + '</span></div>' +
      '<span class="chevron">›</span></div>').join('')
    : '<p class="vazio">Nenhum sabor encontrado.</p>';

  $('#listaIngredientes').innerHTML = S.ingredientes.map(i =>
    '<div class="row" data-edit-ing="' + i.id + '">' +
      '<div class="row-main"><span class="nome">' + esc(i.nome) + '</span>' +
      '<span class="sub">' + esc(i.cat || '-') + ' &middot; ' + esc(i.un) + '</span></div>' +
      '<span class="chevron">›</span></div>').join('');
}

$('#buscaSabor').addEventListener('input', renderSabores);
$('#listaSabores').addEventListener('click', e => {
  const r = e.target.closest('[data-edit-sabor]');
  if (r) abrirSabor(r.dataset.editSabor);
});
$('#listaIngredientes').addEventListener('click', e => {
  const r = e.target.closest('[data-edit-ing]');
  if (r) abrirIngrediente(r.dataset.editIng);
});
$('#btnNovoSabor').addEventListener('click', () => abrirSabor(null));
$('#btnNovoIngrediente').addEventListener('click', () => abrirIngrediente(null));

/* ---------- diálogo de sabor ---------- */

let editandoSabor = null;   // id ou null
let rascunho = {};          // { ingId: gramas }

function abrirSabor(id) {
  editandoSabor = id;
  const s = id ? sab(id) : null;
  rascunho = s ? Object.assign({}, s.itens) : {};
  $('#dlgSaborTitle').textContent = s ? 'Editar sabor' : 'Novo sabor';
  $('#saborNome').value = s ? s.nome : '';
  $('#saborTipo').value = s ? s.tipo : 'salgada';
  $('#btnExcluirSabor').classList.toggle('hidden', !s);
  desenhaItens();
  $('#dlgSabor').showModal();
}

function desenhaItens() {
  const box = $('#saborItens');
  const ids = Object.keys(rascunho);
  box.innerHTML = ids.length ? ids.map(iid => {
    const i = ing(iid) || { nome: iid, un: 'g' };
    return '<div class="item-linha">' +
      '<span class="nome">' + esc(i.nome) + '</span>' +
      '<input type="number" min="0" step="5" inputmode="numeric" value="' + (rascunho[iid] || 0) + '" data-qtd="' + iid + '">' +
      '<span class="un">' + esc(i.un) + '</span>' +
      '<button type="button" class="del" data-rm="' + iid + '" aria-label="Remover">✕</button>' +
    '</div>';
  }).join('') : '<p class="hint">Nenhum ingrediente ainda. Adicione abaixo.</p>';

  const disp = S.ingredientes.filter(i => !(i.id in rascunho));
  $('#novoItemIng').innerHTML = disp.length
    ? disp.map(i => '<option value="' + i.id + '">' + esc(i.nome) + '</option>').join('')
    : '<option value="">— todos já adicionados —</option>';

  const tot = Object.values(rascunho).reduce((a, b) => a + (Number(b) || 0), 0);
  $('#saborTotal').textContent = fmtQt(tot, 'g');
}

$('#saborItens').addEventListener('input', e => {
  const inp = e.target.closest('[data-qtd]');
  if (!inp) return;
  rascunho[inp.dataset.qtd] = Math.max(0, Number(inp.value) || 0);
  const tot = Object.values(rascunho).reduce((a, b) => a + (Number(b) || 0), 0);
  $('#saborTotal').textContent = fmtQt(tot, 'g');
});
$('#saborItens').addEventListener('click', e => {
  const b = e.target.closest('[data-rm]');
  if (!b) return;
  delete rascunho[b.dataset.rm];
  desenhaItens();
});
$('#btnAddItem').addEventListener('click', () => {
  const iid = $('#novoItemIng').value;
  if (!iid) return;
  const q = Number($('#novoItemQtd').value) || 0;
  rascunho[iid] = q;
  $('#novoItemQtd').value = '';
  desenhaItens();
});

function salvarSabor() {
  const nome = $('#saborNome').value.trim();
  if (!nome) { toast('Dê um nome para o sabor'); $('#saborNome').focus(); return; }
  const tipo = $('#saborTipo').value;
  const itens = {};
  Object.keys(rascunho).forEach(k => { if (Number(rascunho[k]) > 0) itens[k] = Number(rascunho[k]); });

  if (editandoSabor) {
    const s = sab(editandoSabor);
    s.nome = nome; s.tipo = tipo; s.itens = itens;
  } else {
    const id = idUnico(nome, S.sabores);
    S.sabores.push({ id, nome, tipo, itens });
  }
  salvar();
  $('#dlgSabor').close();
  render();
  toast('Sabor salvo');
}
$('#btnSalvarSabor').addEventListener('click', salvarSabor);
$('#formSabor').addEventListener('submit', e => { e.preventDefault(); salvarSabor(); });

$('#btnExcluirSabor').addEventListener('click', () => {
  if (!editandoSabor) return;
  const s = sab(editandoSabor);
  if (!confirm('Excluir o sabor "' + s.nome + '"?')) return;
  S.sabores = S.sabores.filter(x => x.id !== editandoSabor);
  delete S.pedido[editandoSabor];
  if (SEED_SABORES.some(x => x.id === editandoSabor)) lembrarRemovido('sabores', editandoSabor);
  salvar();
  $('#dlgSabor').close();
  render();
  toast('Sabor excluído');
});

/* ---------- diálogo de ingrediente ---------- */

let editandoIng = null;

function abrirIngrediente(id) {
  editandoIng = id;
  const i = id ? ing(id) : null;
  $('#dlgIngTitle').textContent = i ? 'Editar ingrediente' : 'Novo ingrediente';
  $('#ingNome').value = i ? i.nome : '';
  $('#ingUn').value = i ? i.un : 'g';
  $('#ingCat').innerHTML = CATEGORIAS.map(c =>
    '<option value="' + esc(c) + '">' + esc(c) + '</option>').join('');
  $('#ingCat').value = i && CATEGORIAS.includes(i.cat) ? i.cat : 'Outros';
  $('#btnExcluirIng').classList.toggle('hidden', !i);
  $('#dlgIngrediente').showModal();
}

function salvarIngrediente() {
  const nome = $('#ingNome').value.trim();
  if (!nome) { toast('Dê um nome para o ingrediente'); $('#ingNome').focus(); return; }
  const un = $('#ingUn').value, cat = $('#ingCat').value;
  if (editandoIng) {
    const i = ing(editandoIng);
    i.nome = nome; i.un = un; i.cat = cat;
  } else {
    S.ingredientes.push({ id: idUnico(nome, S.ingredientes), nome, un, cat });
  }
  salvar();
  $('#dlgIngrediente').close();
  render();
  toast('Ingrediente salvo');
}
$('#btnSalvarIng').addEventListener('click', salvarIngrediente);
$('#dlgIngrediente').querySelector('form').addEventListener('submit', e => { e.preventDefault(); salvarIngrediente(); });

$('#btnExcluirIng').addEventListener('click', () => {
  if (!editandoIng) return;
  const i = ing(editandoIng);
  const usado = S.sabores.filter(s => editandoIng in (s.itens || {}));
  const aviso = usado.length
    ? '\n\nEle é usado em ' + usado.length + ' sabor(es) e será removido deles também.'
    : '';
  if (!confirm('Excluir "' + i.nome + '"?' + aviso)) return;
  S.ingredientes = S.ingredientes.filter(x => x.id !== editandoIng);
  S.sabores.forEach(s => { delete s.itens[editandoIng]; });
  delete S.comprados[editandoIng];
  if (SEED_INGREDIENTES.some(x => x.id === editandoIng)) lembrarRemovido('ingredientes', editandoIng);
  salvar();
  $('#dlgIngrediente').close();
  render();
  toast('Ingrediente excluído');
});

/* ---------- fechar diálogos ---------- */
$$('dialog').forEach(d => {
  d.addEventListener('click', e => {
    if (e.target.matches('[data-close]')) d.close();
    if (e.target === d) d.close();          // clique no backdrop
  });
});

/* ============================= MENU / BACKUP ============================= */

$('#btnMenu').addEventListener('click', () => $('#dlgMenu').showModal());

$('#btnExportar').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'calculadora-pizza-' + new Date().toISOString().slice(0, 10) + '.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast('Backup gerado');
});

$('#btnImportar').addEventListener('click', () => $('#fileImport').click());
$('#fileImport').addEventListener('change', e => {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  const fr = new FileReader();
  fr.onload = () => {
    try {
      const dados = JSON.parse(fr.result);
      if (!dados || !Array.isArray(dados.ingredientes) || !Array.isArray(dados.sabores)) {
        throw new Error('formato');
      }
      if (!confirm('Isso substitui os dados atuais. Continuar?')) return;
      S = Object.assign(estadoPadrao(), dados);
      // backup antigo pode não ter os sabores mais novos
      mesclarCatalogo(Number(dados.catalogo) || 0);
      salvar();
      $('#dlgMenu').close();
      render();
      toast('Backup importado');
    } catch (err) {
      toast('Arquivo inválido');
    }
  };
  fr.readAsText(f);
  e.target.value = '';
});

$('#btnReset').addEventListener('click', () => {
  if (!confirm('Isso apaga seus sabores e volta para a lista original da planilha. Continuar?')) return;
  const pessoas = S.pessoas, fatias = S.fatias;
  S = estadoPadrao();
  S.pessoas = pessoas; S.fatias = fatias;
  salvar();
  $('#dlgMenu').close();
  render();
  toast('Dados restaurados');
});

/* ---------- instalar app ---------- */
let promptInstalar = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  promptInstalar = e;
  if ($('#btnInstalar')) return;
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'menu-item'; b.id = 'btnInstalar';
  b.textContent = '📲 Instalar na tela de início';
  b.addEventListener('click', async () => {
    if (!promptInstalar) return;
    promptInstalar.prompt();
    await promptInstalar.userChoice;
    promptInstalar = null;
    b.remove();
    $('#dlgMenu').close();
  });
  $('.menu-list').prepend(b);
});

/* ============================= SERVICE WORKER ============================= */
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

/* ============================= START ============================= */

// Sem nada salvo, o seed já veio inteiro — não há o que mesclar.
const novidades = mesclarCatalogo(salvoBruto ? (Number(salvoBruto.catalogo) || 0) : CATALOGO_VERSAO);

irPara('pedido');

if (novidades.sabores || novidades.ingredientes) {
  const partes = [];
  if (novidades.sabores) partes.push(novidades.sabores + (novidades.sabores > 1 ? ' sabores novos' : ' sabor novo'));
  if (novidades.ingredientes) partes.push(novidades.ingredientes + (novidades.ingredientes > 1 ? ' ingredientes novos' : ' ingrediente novo'));
  toast('🍕 ' + partes.join(' e '));
}

})();
