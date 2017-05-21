import { DateTime } from './../providers';
import { pull } from './../util';
import * as DATETIME from '../locales/int/datetime';

const data = pull('datetime.json', 'en');

const datetime = new DateTime();

describe('Test datetime provider', () => {

  it('should return random day of week for current locale', () => {
    expect(data.day.name).toContain(datetime.dayOfWeek());
    expect(data.day.abbr).toContain(datetime.dayOfWeek({ abbr: true }));
  });

  it('should return random month for current locale', () => {
    expect(data.month.name).toContain(datetime.month());
    expect(data.month.abbr).toContain(datetime.month({ abbr: true }));
  });

  it('should return random year', () => {
    expect(datetime.year()).toBeGreaterThanOrEqual(1990);
    expect(datetime.year()).toBeLessThanOrEqual(2050);
  });

  it('should return random century', () => {
    expect(DATETIME.ROMAN_NUMS).toContain(datetime.century());
  });

  it('should return random periodicity string', () => {
    expect(data.periodicity).toContain(datetime.periodicity());
  });
});