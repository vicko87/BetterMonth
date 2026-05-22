export function urlBase64ToUint8Array(base64String: string) {
  // Elimina espacios y saltos de línea
  const cleaned = base64String.replace(/\s/g, '');
  const padding = '='.repeat((4 - (cleaned.length % 4)) % 4);
  const base64 = (cleaned + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  let rawData;
  try {
    rawData = window.atob(base64);
  } catch (e) {
    throw new Error('La clave pública VAPID no está bien codificada en base64. Revisa que esté bien copiada y sin espacios extra.');
  }
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
