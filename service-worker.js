// Peeback — Service Worker
// Chỉ cache "vỏ app" (app shell: index.html, icon, manifest) để mở app
// lần sau cực nhanh + có thể mở được (offline) ngay cả khi mạng chập chờn.
// Nội dung thật của app (chạy trong iframe trỏ tới Google Apps Script) KHÔNG
// bị cache ở đây — luôn tải mới từ script.google.com để dữ liệu (link, ví,
// đơn hàng...) luôn cập nhật theo thời gian thực.

const CACHE_NAME = 'peeback-shell-v1';
const SHELL_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './favicon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Chỉ can thiệp (cache) các request CÙNG domain (chính app shell này).
  // Mọi request sang domain khác (vd: script.google.com bên trong iframe)
  // để trình duyệt tự xử lý bình thường, không đụng vào.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((res) => {
        // Cache thêm các file tĩnh mới nếu có, bỏ qua lỗi mạng
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return res;
      }).catch(() => cached);
    })
  );
});
