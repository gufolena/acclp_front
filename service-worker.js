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
  '/js/features/atualiza-perfil.js',
  '/js/features/cadastrar-usuario.js',
  '/js/features/detalhes-caso.js',
  '/js/features/home-integration.js',
  '/js/features/listagem-caso.js',
  '/js/features/listagem-usuario.js',
  '/js/features/novo-caso.js',
  '/js/features/script.js',
  '/js/features/user-info.js',

  // JS integration
  '/js/integration/0-main.js',
  '/js/integration/1-core.js',
  '/js/integration/2-listagem-casos.js',
  '/js/integration/3-cadastro-caso.js',
  '/js/integration/4-detalhes-caso.js',
  '/js/integration/5-perfil-usuario.js',
  '/js/integration/6-atualizar-perfil.js',
  '/js/integration/7-cadastro-usuario.js',
  '/js/integration/8-listagem-usuarios.js',
  '/js/integration/9-perfil-usuario-by-id.js',
  '/js/integration/10-atualizar-perfil-by-id.js',

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

self.addEventListener('install', event => {
    self.skipWaiting(); // ativa imediatamente
  });
  
  self.addEventListener('activate', event => {
    clients.claim(); // assume o controle das páginas abertas
  });