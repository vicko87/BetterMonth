// Ejemplo de envío de notificación push desde Node.js usando web-push y tus claves VAPID
import 'dotenv/config';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';


// Configura tus claves VAPID desde variables de entorno
webpush.setVapidDetails(
  'mailto:tu-email@dominio.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Ejemplo de suscripción (esto normalmente lo obtienes de tu base de datos)
const exampleSubscription = {
  endpoint: 'PON_AQUI_EL_ENDPOINT_DEL_USUARIO',
  keys: {
    p256dh: 'PON_AQUI_LA_LLAVE_p256dh',
    auth: 'PON_AQUI_LA_LLAVE_auth'
  }
};

// Payload de la notificación
const payload = JSON.stringify({
  title: '¡Recordatorio diario!',
  body: 'No olvides registrar tus hábitos hoy en BetterMonth.'
});

// Envía la notificación
webpush.sendNotification(exampleSubscription, payload)
  .then(() => console.log('Notificación enviada'))
  .catch(err => console.error('Error enviando push:', err));
