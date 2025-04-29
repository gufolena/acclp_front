const CACHE_NAME = 'app-cache-v1';
const urlsToCache = [
  // HTML
  '/',
  '/index.html',
  '/pages/auth/login.html',
  '/pages/cases/detalhes-caso.html',
  '/pages/cases/listagem-caso.html',
  '/pages/cases/novo-caso.html',
  '/pages/perfil/atualiza-perfil.html',
  '/pages/perfil/perfil.html',
  '/pages/user/cadastrar-usuario.html',
  '/pages/user/listagem-usuario.html',

  // JS essenciais
  '/assets/js/auth.js',

  // JS features
  '/assets/js/features/atualiza-perfil.js',
  '/assets/js/features/cadastrar-usuario.js',
  '/assets/js/features/detalhes-caso.js',
  '/assets/js/features/home-integration.js',
  '/assets/js/features/listagem-caso.js',
  '/assets/js/features/listagem-usuario.js',
  '/assets/js/features/novo-caso.js',
  '/assets/js/features/script.js',
  '/assets/js/features/user-info.js',

  // JS integration
  '/assets/js/integration/0-main.js',
  '/assets/js/integration/1-core.js',
  '/assets/js/integration/2-listagem-casos.js',
  '/assets/js/integration/3-cadastro-caso.js',
  '/assets/js/integration/4-detalhes-caso.js',
  '/assets/js/integration/5-perfil-usuario.js',
  '/assets/js/integration/6-atualizar-perfil.js',
  '/assets/js/integration/7-cadastro-usuario.js',
  '/assets/js/integration/8-listagem-usuarios.js',
  '/assets/js/integration/9-perfil-usuario-by-id.js',
  '/assets/js/integration/10-atualizar-perfil-by-id.js',

  // CSS
  '/assets/styles/atualiza-perfil.css',
  '/assets/styles/detalhes-caso.css',
  '/assets/styles/home.css',
  '/assets/styles/listagem-caso.css',
  '/assets/styles/listagem-usuario.css',
  '/assets/styles/login.css',
  '/assets/styles/novo-caso.css',
  '/assets/styles/perfil.css',

  // IMAGENS
  '/assets/img/dentista-perito-judicial-como-se-formar.png',
  '/assets/img/foto_perfil.jpg',
  '/assets/img/relatorio-medico.ico',
  '/assets/img/relatorio-medico.png'

];

// Instalação
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Ativação (limpa caches antigos)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      )
    )
  );
});

// Intercepta requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
