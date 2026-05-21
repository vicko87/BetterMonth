// Simple service worker for push notifications
self.addEventListener('push', function(event) {
  let data = {}
  try {
    data = event.data.json()
  } catch (e) {
    data = { title: 'BetterMonth', body: 'You have a new reminder!' }
  }
  const title = data.title || 'BetterMonth'
  const options = {
    body: data.body || 'You have a new reminder!',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: data.url ? { url: data.url } : undefined
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url))
  }
})
