import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${amount.toLocaleString()}`;
  }
}

export function formatDimensions(
  width: number,
  height: number,
  depth?: number,
  unit: string = 'cm'
): string {
  if (depth && depth > 0) {
    return `${width} × ${height} × ${depth} ${unit}`;
  }
  return `${width} × ${height} ${unit}`;
}

export function formatDimensionsWithInches(
  widthCm: number,
  heightCm: number,
  depthCm?: number
): { cm: string; inches: string } {
  const toInches = (cm: number) => (cm * 0.393701).toFixed(1);

  const cmStr = depthCm && depthCm > 0
    ? `${widthCm} × ${heightCm} × ${depthCm} cm`
    : `${widthCm} × ${heightCm} cm`;

  const inStr = depthCm && depthCm > 0
    ? `${toInches(widthCm)} × ${toInches(heightCm)} × ${toInches(depthCm)} in`
    : `${toInches(widthCm)} × ${toInches(heightCm)} in`;

  return { cm: cmStr, inches: inStr };
}
