export function stringToAsciiArray(str: string): number[] {
  return str.split('').map((char: string): number => char.charCodeAt(0));
}

export function asciiArrayToString(aArr: number[]): string {
  return String.fromCharCode(...aArr);
}

export function roundToPrecision(num: number, precision: number): number {
  const factor: number = 10 ** precision;
  return Math.round(num * factor) / factor;
}

export function roundArrayToPrecision(arr: number[], precision: number): number[] {
  return arr.map((n: number): number => {
    return roundToPrecision(n, precision);
  });
}
