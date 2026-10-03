self.addEventListener('push', (event) => {
  console.log(event);
  if (!event.data) {
    console.warn('Push event but no data received.');
    return;
  }

  let data = {};
  try {
    data = event.data.json();
  } catch (error) {
    console.error('Error parsing push notification data:', error);
    return;
  }

  const options = {
    body: data.body || 'You have a new notification',
    vibrate: [200, 100, 200], // Vibration pattern for mobile devices
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
    data: {
      url: data.url || '/', // Store URL for later navigation
    },
  };

  console.log('Notification received', data);
  event.waitUntil(
    self.registration.showNotification(data.title || 'Notification', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        if (clientList.length > 0) {
          // Focus the first available window
          return clientList[0].focus();
        }
        // No open windows, open a new one
        return clients.openWindow(event.notification.data.url || '/');
      })
  );
});
