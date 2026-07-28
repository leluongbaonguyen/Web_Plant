export async function dispatchMobileLockScreenNotification(title, body, delayMs = 0) {
  if (!('Notification' in window)) return;

  if (Notification.permission !== 'granted') {
    try {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return;
    } catch {
      return;
    }
  }

  const options = {
    body: body || 'Đã đến lúc thực hiện công việc theo lịch sinh hoạt!',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [500, 110, 500, 110, 500, 110, 500],
    tag: 'chronoflow-mobile-alert',
    renotify: true,
    requireInteraction: true,
  };

  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.active) {
        reg.active.postMessage({
          type: 'SCHEDULE_NOTIFICATION',
          title,
          body,
          delayMs,
        });
        return;
      } else if (reg && reg.showNotification) {
        if (delayMs > 0) {
          setTimeout(() => reg.showNotification(title, options), delayMs);
        } else {
          await reg.showNotification(title, options);
        }
        return;
      }
    } catch {
      // Fallback below
    }
  }

  try {
    if (delayMs > 0) {
      setTimeout(() => new Notification(title, options), delayMs);
    } else {
      new Notification(title, options);
    }
  } catch {}
}
