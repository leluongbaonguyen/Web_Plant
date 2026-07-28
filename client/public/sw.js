/* ChronoFlow Service Worker for Lock Screen Notifications */
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
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
