export function formatDate(date: string | number | Date) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}
