export default function formatDate(date: number): string {
  if (date < 0) {
    return `${date * -1} BC`;
  } else {
    return `${date} AD`;
  }
}
