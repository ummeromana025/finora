import { describe, expect, it } from 'vitest'
import { money } from './services/api'
describe('money', () => { it('formats USD', () => expect(money(1234.5)).toBe('$1,234.50')) })
