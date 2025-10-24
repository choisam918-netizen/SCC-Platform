// Service Worker for SCC Platform
const CACHE_NAME = 'scc-platform-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './football/index.html',
  './football/styles.css',
  './football/script.js',
  './math/index.html',
  './math/style.css',
  './math/script.js',
  './typeanything/index.html',
  './typeanything/common.css',
  './ramdom/index.html',
  './group/group.html',
  './Rank/index.html',
  './back-to-main.js',
  './manifest.json'
];

// 安裝事件
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service Worker: 緩存已打開');
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.log('Service Worker: 緩存安裝失敗', error);
      })
  );
});

// 激活事件
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: 刪除舊緩存', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 攔截請求
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // 如果緩存中有，返回緩存的版本
        if (response) {
          console.log('Service Worker: 從緩存返回', event.request.url);
          return response;
        }
        
        // 否則從網絡獲取
        console.log('Service Worker: 從網絡獲取', event.request.url);
        return fetch(event.request).then(function(response) {
          // 檢查是否為有效響應
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // 克隆響應
          var responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(function(error) {
          console.log('Service Worker: 網絡請求失敗', error);
          // 如果是HTML頁面請求失敗，返回離線頁面
          if (event.request.destination === 'document') {
            return caches.match('./index.html');
          }
        });
      })
  );
});

// 推送通知
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'SCC Platform 有新消息',
    icon: './icon-192.png',
    badge: './icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '查看詳情',
        icon: './icon-192.png'
      },
      {
        action: 'close',
        title: '關閉',
        icon: './icon-192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('SCC Platform', options)
  );
});

// 通知點擊事件
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});

// 後台同步
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // 執行後台同步任務
      doBackgroundSync()
    );
  }
});

function doBackgroundSync() {
  // 這裡可以執行後台同步任務
  console.log('Service Worker: 執行後台同步');
  return Promise.resolve();
}
