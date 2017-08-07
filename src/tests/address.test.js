import { Address } from '../providers.js';
import { pull } from './../util';
import { CONTINENT_CODES, COUNTRIES_ISO } from "../locales/int/address.js";

const data = pull('address.json', 'en');
const address = new Address();

describe('Test address provider', () => {
  it('should be return random number', () => {
    expect(address.streetNumber()).toBeGreaterThanOrEqual(1);
    expect(address.streetNumber()).toBeLessThanOrEqual(1400);
  });

  it('should be in array', () => {
    expect(data.street.name).toContain(address.streetName());
  });

  it('should be in array', () => {
    expect(data.street.suffix).toContain(address.streetSuffix());
  });

  it('should be string', () => {
    expect(typeof address.address()).toBe('string');
  });

  it('should be in array', () => {
    expect(data.state.abbr).toContain(address.state({abbr: true}));
    expect(data.state.name).toContain(address.state());
  });

  it('should be in array', () => {
    expect(data.country.name).toContain(address.country());
  });

  it('should be in array', () => {
    expect(data.city).toContain(address.city());
  });

  it('should be number and have diapason (-180 to 180)', () => {
    expect(typeof address.longitude()).toBe('number');
    expect(address.longitude()).toBeGreaterThanOrEqual(-180);
    expect(address.longitude()).toBeLessThanOrEqual(180);
  });

  it('should be number and have diapason (-90 to 90)', () => {
    expect(typeof address.latitude()).toBe('number');
    expect(address.latitude()).toBeGreaterThanOrEqual(-90);
    expect(address.latitude()).toBeLessThanOrEqual(90);
  });

  it('should be object and have latitude and longitude', () => {
    const result = address.coordinates();
    expect(result).toBeInstanceOf(Object);

    const longitude = result['longitude'];
    expect(typeof longitude).toBe('number');
    expect(longitude).toBeGreaterThanOrEqual(-180);
    expect(longitude).toBeLessThanOrEqual(180);

    const latitude = result['latitude'];
    expect(typeof latitude).toBe('number');
    expect(latitude).toBeGreaterThanOrEqual(-180);
    expect(latitude).toBeLessThanOrEqual(180);
  });

  it('should be in array', () => {
    expect(CONTINENT_CODES).toContain(address.continent({code: true}));
    expect(data.continent).toContain(address.continent());
  });

  it('should be in array', () => {
    expect(COUNTRIES_ISO['iso2']).toContain(address.countryISO());
  });

  it('should raise error if format is unsupported', () => {
    expect(
      () => address.countryISO({ format: 'unsupported' })
    ).toThrow(new Error(`Unsupported format. Use: ${Object.keys(COUNTRIES_ISO)}`));
  });


});
