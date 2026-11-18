/*
 * Elmina: offline-friendly caching for return visits. No tracking, no data.
 *
 *   The page itself      network first (an update is seen at once); the last
 *                        copy is used only when there is no connection.
 *   assets/…             cache first. These files have a fingerprint in their
 *                        name, so a changed file always has a new name.
 *   models/…             the saved copy is shown at once and refreshed in the
 *                        background for next time (their names do not change
 *                        when the model is re-exported).
 *
 * Bump VERSION to throw every saved copy away.
 */
const VERSION = 'elmina-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name !== VERSION) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  if (url.search.includes('retry=')) return;   // a deliberate second attempt must reach the network

  const save = async (response) => {
    if (response && response.ok && response.type === 'basic') {
      const cache = await caches.open(VERSION);
      await cache.put(request, response.clone());
    }
    return response;
  };

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(save).catch(async () => (await caches.match(request)) ?? (await caches.match('./')) ?? Response.error()));
    return;
  }
  if (url.pathname.includes('/assets/')) {
    event.respondWith(caches.match(request).then((hit) => hit ?? fetch(request).then(save)));
    return;
  }
  if (url.pathname.includes('/models/')) {
    event.respondWith(caches.match(request).then((hit) => {
      const fresh = fetch(request).then(save).catch(() => hit);
      if (hit) {
        event.waitUntil(fresh);
        return hit;
      }
      return fresh;
    }));
  }
});
