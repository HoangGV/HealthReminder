const CACHE_NAME = 'health-offline-v2';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// 1. Khi cài đặt: Lưu file vào bộ nhớ đệm (Cache)
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Đang lưu cache offline...');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Khi kích hoạt: Xóa cache cũ nếu có cập nhật code mới
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// 3. Khi chạy App: Lấy file từ Cache ra dùng (Offline first)
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((response) => {
      // Nếu có trong cache thì trả về ngay (không cần mạng)
      return response || fetch(evt.request);
    })
  );
});
