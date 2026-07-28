/* ChronoFlow Service Worker for Lock Screen Notifications */
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle direct message events from main thread (scheduled or immediate lockscreen alerts)
self.addEventListener('message', (event) => {
  if (!event.data) return;

  const { type, title, body, delayMs, tag } = event.data;

  if (type === 'SCHEDULE_NOTIFICATION' || type === 'SHOW_NOTIFICATION') {
    const notificationOptions = {
      body: body || 'Đã đến lúc thực hiện công việc theo lịch!',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [500, 110, 500, 110, 500, 110, 500],
      tag: tag || 'chronoflow-mobile-alert',
      renotify: true,
      requireInteraction: true,
      silent: false,
      data: {
        url: '/',
        timestamp: Date.now()
      }
    };

    if (delayMs && delayMs > 0) {
      setTimeout(() => {
        self.registration.showNotification(title || '🚨 ChronoFlow Chuông Báo', notificationOptions);
      }, delayMs);
    } else {
      self.registration.showNotification(title || '🚨 ChronoFlow Chuông Báo', notificationOptions);
    }
  }
});

// Handle push notification events for lock screen & background alert
self.addEventListener('push', (event) => {
  let data = { title: '🔔 ChronoFlow Nhắc Nhở', body: 'Đã đến lúc thực hiện công việc của bạn!' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [300, 100, 300, 100, 300],
    tag: 'chronoflow-reminder',
    renotify: true,
    requireInteraction: true,
    data: {
      url: '/'
    }
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle notification click on lock screen
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
