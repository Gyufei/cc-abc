import numbro from 'numbro';

export function formatNumber(num: string | number) {
  if (isNaN(Number(num))) {
    return String(num);
  }

  return numbro(num).format({
    thousandSeparated: true,
    mantissa: 4,
    trimMantissa: true,
    roundingFunction: Math.floor,
  });
}

export function formatPercentage(num: string | number) {
  return numbro(num).format({
    trimMantissa: true,
    thousandSeparated: true,
    mantissa: 2,
    output: 'percent',
    roundingFunction: Math.floor,
  });
}

export function truncateNumber(result: string, precision: number): string {
  const arr = result.split('.');
  const integerPart = arr[0];
  let fractionalPart = arr[1];

  if (!fractionalPart) {
    return result;
  }

  // Check if there are additional digits
  if (fractionalPart.length <= precision) {
    fractionalPart = fractionalPart.padEnd(precision + 1, '0');
  }

  const fractionToRound = fractionalPart.slice(0, precision);

  // No rounding needed
  result = integerPart;
  if (fractionToRound) {
    result += '.' + fractionToRound;
  }

  // Remove unnecessary trailing zeros in the fractional part
  result = result.replace(/(\.\d*?[1-9])0+$/g, '$1');
  result = result.replace(/\.0+$/, '');
  result = result.replace(/\.$/, '');

  return result;
}
