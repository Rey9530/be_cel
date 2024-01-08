export function calculateDaysBetweenDates(fechaInicio: Date, fechaFin: Date): number {
  const MILISEGUNDOS_POR_DIA = 1000 * 60 * 60 * 24;
  
  // Calcular la diferencia en milisegundos
  const diferenciaEnMilisegundos = fechaFin.getTime() - fechaInicio.getTime();

  // Convertir la diferencia en días
  const dias = diferenciaEnMilisegundos / MILISEGUNDOS_POR_DIA;

  // Redondear al número entero más cercano para obtener la cantidad de días
  return Math.round(dias);
}