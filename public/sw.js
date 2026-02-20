const CACHE_NAME = "selfscope-v2";
const SHELL = ["./", "./index.html"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Skip non-http requests (chrome-extension, etc.)
  if (!url.protocol.startsWith("http")) return;

  // Always network-first for Google APIs
  if (url.hostname.includes("googleapis.com") || url.hostname.includes("accounts.google.com")) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Cache-first for everything else
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request).then((response) => {
        if (e.request.method === "GET" && response.status === 200 && url.protocol.startsWith("http")) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => {
        if (e.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});