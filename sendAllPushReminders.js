// Script para enviar notificaciones push a todos los usuarios con reminder_time igual a la hora actual
require('dotenv').config();
const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

// Configura claves VAPID
webpush.setVapidDetails(
  'mailto:tu-email@dominio.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Conecta a Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Obtén la hora actual en formato HH:mm (hora local del servidor)
function getCurrentTimeHHMM() {
  const now = new Date();
  return now.toTimeString().slice(0,5);
}

async function main() {
  const currentTime = getCurrentTimeHHMM();
  console.log('Enviando recordatorios para la hora:', currentTime);

  // Obtiene usuarios con reminder_time igual a la hora actual
  const { data, error } = await supabase
    .from('user_push_subscriptions')
    .select('user_id, subscription')
    .eq('reminder_time', currentTime);

  if (error) {
    console.error('Error consultando Supabase:', error);
    return;
  }
  if (!data || data.length === 0) {
    console.log('No hay usuarios para notificar en este horario.');
    return;
  }

  for (const row of data) {
    try {
      await webpush.sendNotification(row.subscription, JSON.stringify({
        title: '¡Recordatorio diario!',
        body: 'No olvides registrar tus hábitos hoy en BetterMonth.'
      }));
      console.log('Notificación enviada a usuario', row.user_id);
    } catch (err) {
      console.error('Error enviando push a', row.user_id, err.body || err);
    }
  }
}

main();
