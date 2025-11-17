interface Price {
  centAmount: number;
  currencyCode: string;
  fractionDigits: number;
}

export function formatPrice(price: Price): string {
  const amount = price.centAmount / Math.pow(10, price.fractionDigits);

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currencyCode,
    minimumFractionDigits: price.fractionDigits,
    maximumFractionDigits: price.fractionDigits,
  }).format(amount);
}
