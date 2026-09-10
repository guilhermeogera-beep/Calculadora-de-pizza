/* Service worker - app shell offline.
   Troque a versão sempre que publicar mudanças, para o app atualizar nos celulares. */
const VERSAO = 'pizza-v3';

const ARQUIVOS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/style.css',
  './assets/js/data.js',
  './assets/js/app.js',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSAO)
      .then(c => c.addAll(ARQUIVOS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;

  /* REDE PRIMEIRO, cache como rede de segurança.
     Antes era cache primeiro, e o resultado era este: você publicava uma versão
     nova, o index.html vinha da rede, mas o app.js continuava saindo do cache
     velho — o app parecia não atualizar. Agora, com internet, o que está no ar
     sempre ganha; sem internet, cai para o cache e continua funcionando. */
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copia = res.clone();
          caches.open(VERSAO).then(c => c.put(req, copia));
        }
        return res;
      })
      .catch(() => caches.match(req).then(hit =>
        hit ||
        (req.mode === 'navigate' ? caches.match('./index.html') : null) ||
        new Response('', { status: 504, statusText: 'Offline' })
      ))
  );
});
