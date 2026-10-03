export type Cur = 'USD' | 'PKR'
export const RATE = 280
export const convert = (a: number, from: Cur, to: Cur) => (from === to ? a : from === 'USD' ? a * RATE : a / RATE)
export const fee = (a: number, from: Cur, to: Cur) => (from === to ? 0 : a * 0.005)
export const fmt = (n: number, c: Cur) => new Intl.NumberFormat('en-US', { style: 'currency', currency: c }).format(n)
