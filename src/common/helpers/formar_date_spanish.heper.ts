export function formatDateInSpanish(fecha: Date) {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // weekday: 'long',
    // hour: '2-digit',
    // minute: '2-digit',
    // second: '2-digit'
  }).format(fecha).toUpperCase();
}