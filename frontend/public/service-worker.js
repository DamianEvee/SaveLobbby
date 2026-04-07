const CACHE_NAME = 'savelobby-v1';

// Archivos esenciales que se guardarán en la memoria del dispositivo
const ASSETS_TO_CACHE = [
    '../index.html',
    '../css/variables.css',
    '../css/layout.css',
    '../css/components.css',
    '../js/app.js',
    './manifest.json'
];

// 1. Instalación: Guardar los archivos en caché
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Archivos cacheados exitosamente');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// 2. Activación: Limpiar cachés antiguas si actualizamos la versión de SaveLobby
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('[Service Worker] Limpiando caché antigua:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 3. Fetch: Interceptar peticiones. Si no hay internet, sirve desde la caché.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Devuelve la respuesta en caché si existe, si no, hace la petición a la red
                return response || fetch(event.request);
            })
    );
});