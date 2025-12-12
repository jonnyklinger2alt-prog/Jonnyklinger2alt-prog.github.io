// coi-serviceworker.js
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", function(event) {
  event.respondWith(
    (async function () {
      const response = await fetch(event.request);
      const newHeaders = new Headers(response.headers);

      // Add required COOP/COEP headers
      newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
      newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    })()
  );
});

