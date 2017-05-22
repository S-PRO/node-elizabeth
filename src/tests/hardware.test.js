import { Hardware } from '../providers.js';
import { RESOLUTIONS, SCREEN_SIZES, CPU, GENERATION_ABBR, GENERATION, CPU_CODENAMES,
  HDD_SSD, GRAPHICS, MANUFACTURERS, PHONE_MODELS
 } from "../locales/int/hardware.js";
import { pull } from './../util';

const hardware = new Hardware();

describe('Test hardware provider', () => {

  it('should be in array', () => {
    expect(RESOLUTIONS).toContain(hardware.resolution());
  });

  it('should be in array', () => {
    expect(SCREEN_SIZES).toContain(hardware.screenSize());
  });

  it('should be in array', () => {
    expect(CPU).toContain(hardware.cpu());
  });

  it('should be formated string', () => {
    expect(hardware.cpuFrequency()).toMatch(/^[0-9]{1}.[0-9]{1}(GHz)|[0-9]{1}(GHz)$/)
  })

  it('should be in array', () => {
    expect(GENERATION).toContain(hardware.generation({abbr: false}));
    expect(GENERATION_ABBR).toContain(hardware.generation({abbr: true}));
  });

  it('should be in array', () => {
    expect(CPU_CODENAMES).toContain(hardware.cpuCodename());
  });

  it('should be in array', () => {
    expect(['DDR2', 'DDR3', 'DDR4']).toContain(hardware.ramType());
  });

  it('should be in array', () => {
    expect(['4', '6', '8', '16', '32', '64']).toContain(hardware.ramSize().replace('GB', ''));
    expect(hardware.ramSize()).toMatch(/^[0-9]{1,2}(GB)$/)
  });

  it('should be in array', () => {
    expect(HDD_SSD).toContain(hardware.ssdOrHdd());
  });

  it('should be in array', () => {
    expect(GRAPHICS).toContain(hardware.graphics());
  });

  it('should be in array', () => {
    expect(MANUFACTURERS).toContain(hardware.manufacturer());
  });

  it('should be in array', () => {
    expect(PHONE_MODELS).toContain(hardware.phoneModel());
  });
  
});
