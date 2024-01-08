export function areDatesEqual(fecha1, fecha2) {
  const day1 = fecha1.getDate();
  const month1 = fecha1.getMonth();
  const year1 = fecha1.getFullYear();

  const day2 = fecha2.getDate();
  const month2 = fecha2.getMonth();
  const year2 = fecha2.getFullYear();

  return day1 === day2 && month1 === month2 && year1 === year2;
}