export function shuffleInPlace<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function sampleDistinct<T>(array: T[], n: number, exclude?: (item: T) => boolean): T[] {
  const filtered = exclude ? array.filter(a => !exclude(a)) : array.slice();
  const copy = filtered.slice();
  shuffleInPlace(copy);
  return copy.slice(0, Math.min(n, copy.length));
}
