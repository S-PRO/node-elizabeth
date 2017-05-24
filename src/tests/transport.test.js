import { Transport, Code } from '../providers.js';
import { TRUCKS, AIRPLANES, CARS } from "../locales/int/transport.js";


const transport = new Transport();
const code = new Code();

describe('Test transport provider', () => {
  it('should be in array', () => {
    expect(CARS).toContain(transport.car());
  });

  it('should be formated string', () => {
    const result = transport.truck().split('-');
    expect(TRUCKS).toContain(result[0]);
    expect(result[1]).toMatch(/^[0-9]{4} [A-Z]{2}/);
  });

  it('should be formated', () => {
    const result = transport.airplane().split(' ');
    expect(AIRPLANES).toContain(result[0]);
    expect(result[1]).toMatch(/^[0-9]{3}/);
  })
})
