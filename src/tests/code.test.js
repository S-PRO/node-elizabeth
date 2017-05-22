import { Code } from "../providers.js";
import {LOCALE_CODES} from "../locales/int/code.js";

const code = new Code();

describe('Test code provider', () => {

  it('should return item from 4 digits', () => {
    expect(code.pin()).toMatch(/^[0-9]{4}$/);
  });

  it('should return mask from 4 chars', () => {
    expect(code.customCode({mask: "@###", char: '@', digit: '#'})).toHaveLength(4);
  });

  it('should return random item from array', () => {
    expect(LOCALE_CODES).toContain(code.localeCode());
  });

  it('should return item from 8  and 13 digits', () => {
    expect(code.ean({format: 'ean-8'})).toMatch(/^[0-9]{8}$/);
    expect(code.ean({format: 'ean-13'})).toMatch(/^[0-9]{13}$/);
  })

  it('should return mask fromat 4 digits - 4 digits', () => {
    expect(code.issn()).toMatch(/^[0-9]{4}-[0-9]{4}$/);
  });

  it('should return string <= 15 digits', () => {
    expect(code.imei()).toMatch(/^\d{14,15}$/);
  });
});
