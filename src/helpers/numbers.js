export const round = (number, decimalPlaces) => {
  const factorOfTen = Math.pow(10, decimalPlaces)
  return Math.round(number * factorOfTen) / factorOfTen
}

export const sumArray = (arr) => {
  return arr.reduce((a, b) => a + b, 0);
}

export const parsePrice = (price, percent) => {

  const rounder = percent ? 2 : 4;

  if (price === 0) {
    return 0;
  }
  else if (price > 1000000) {
    return parseInt(price);
  }
  else if (price > 1) {
    return round(price, 2);
  }
  else {
    const m = -Math.floor( Math.log(Math.abs(price)) / Math.log(10) + 1);
    return round(price, m + rounder);

  }
}

export const logWithBase = (y, x) => {
  return Math.log(y) / Math.log(x);
}

function getMin(data, col) {
  return data.reduce((min, p) => p[col] < min ? p[col] : min, data[0][col]);
}

function getMax(data, col) {
  return data.reduce((max, p) => p[col] > max ? p[col] : max, data[0][col]);
}

export const maxInArray = (data, col) => {
  let max = 0;
  data.forEach( (d) => {
    const dMax = getMax(d, col);
    max = dMax > max ? dMax : max;
  });

  return max;
}

export const minInArray = (data, col) => {
  let min = 0;

  data.forEach( (d, i) => {
    const dMin = Math.round(getMin(d, col) * 100) / 100; 
    min = dMin < min ? dMin : min;
  });

  return min;
}

export const genRandBetween = (min, max, decimalPlaces) => {  
  const rand = Math.random() * (max - min) + min;
  const power = Math.pow(10, decimalPlaces);
  return Math.floor(rand * power) / power;
}

export const formatLargeNumber = (n) => {

  const pow = Math.pow;
  const floor = Math.floor;
  const abs = Math.abs; 
  const log = Math.log;

  const abbrev = 'kmb';

  const baseSuff = floor(log(abs(n)) / log(1000));
  const suffix = abbrev[Math.min(2, baseSuff - 1)];
  const base = abbrev.indexOf(suffix) + 1;
  return suffix ? round(n / pow(1000,base), 2) + suffix : '' + round(n,2);
  
}

export const roundWithFactor = (number) => {
  const factor = String(parseInt(number)).length - 1;
  return Math.pow(10, factor);
}