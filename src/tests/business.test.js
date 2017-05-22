import { Business } from './../providers';
import { pull } from './../util';
import * as BUSINESS from './../locales/int/business';

const data = pull('business.json', 'en');

const business = new Business();

describe('Test business provider', () => {

  it('should return company type for current locale', () => {
    expect(data.company.type.title).toContain(business.companyType());
    expect(data.company.type.abbr).toContain(business.companyType({ abbr: true }));
  });

  it('should return company name for current locale', () => {
    expect(data.company.name).toContain(business.company());
  });

  it('should return copyright for current locale', () => {
    expect(business.copyright()).toMatch(new RegExp(/© [A-z\W]+, (.*)/g));
  });

  it('should return currency in ISO format', () => {
    expect(BUSINESS.CURRENCIES).toContain(business.currencyISO());
  });

  it('should return random price', () => {
    const [value, currency] = business.price({ minimum: 1, maximum: 500}).split(' ');
    expect(Number(value)).toBeGreaterThanOrEqual(1);
    expect(Number(value)).toBeLessThanOrEqual(500);
    expect(value).toMatch(/[0-9]+\.[0-9]{1,2}/g);
    expect(currency).toEqual('$');
  });


});