import { describe, expect, it } from 'vitest'
import { forecastMonth, nextDue, daysUntil, anomalies, mean } from './analytics'
import { convert, fee } from './fx'
import type { Tx } from '@/services/api'
const tx = (amount: number, i: number): Tx => ({ id: 'x' + i, title: 't', amount, type: 'expense', category: 'Food', date: '2026-09-01', status: 'completed' })
describe('analytics', () => {
  it('forecasts month-end spending', () => expect(forecastMonth(300, 10)).toBe(900))
  it('finds the next due date', () => { const d = nextDue(5, new Date(2026, 8, 10)); expect([d.getMonth(), d.getDate()]).toEqual([9, 5]); expect(daysUntil(d, new Date(2026, 8, 30))).toBe(5) })
  it('flags unusually large expenses', () => { const list = [...Array(10).fill(50), 900].map(tx); expect(anomalies(list).map((t) => t.amount)).toEqual([900]) })
  it('computes a mean', () => expect(mean([2, 4])).toBe(3))
})
describe('fx', () => { it('converts and charges a fee', () => { expect(convert(1, 'USD', 'PKR')).toBe(280); expect(fee(100, 'USD', 'PKR')).toBe(0.5); expect(fee(100, 'USD', 'USD')).toBe(0) }) })
