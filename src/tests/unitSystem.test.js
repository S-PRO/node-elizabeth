import { UnitSystem } from '../providers.js';
import { SI_PREFIXES } from "../locales/int/scientific.js";

const unitSystem = new UnitSystem();

describe('Test unitSystem provider', () => {
  it('should be symbol or word', () => {
    expect(unitSystem.mass()).toBe('gram');
    expect(unitSystem.mass({symbol: true})).toBe('gr');
  });

  it('should be symbol or word', () => {
    expect(unitSystem.information()).toBe('byte');
    expect(unitSystem.information({symbol: true})).toBe('b');
  });

  it('should be symbol or word', () => {
    expect(unitSystem.thermodynamicTemperature()).toBe('kelvin');
    expect(unitSystem.thermodynamicTemperature({symbol: true})).toBe('K');
  });

  it('should be symbol or word', () => {
    expect(unitSystem.amountOfSubstance()).toBe('mole');
    expect(unitSystem.amountOfSubstance({symbol: true})).toBe('mol');
  });

  it('should be symbol or word', () => {
    expect(unitSystem.angle()).toBe('radian');
    expect(unitSystem.angle({symbol: true})).toBe('r');
  });

  it('should be symbol or word', () => {
    expect(unitSystem.solidAngle()).toBe('steradian');
    expect(unitSystem.solidAngle({symbol: true})).toBe('㏛');
  });

  it('should be symbol or word', () => {
    expect(unitSystem.frequency()).toBe('hertz');
    expect(unitSystem.frequency({symbol: true})).toBe('Hz');
  });

  it('should be symbol or word', () => {
    expect(unitSystem.force()).toBe('newton');
    expect(unitSystem.force({symbol: true})).toBe('N');
  });

  it('should be symbol or word', () => {
    expect(unitSystem.pressure()).toBe('pascal');
    expect(unitSystem.pressure({symbol: true})).toBe('P');
  });

  it('should be symbol or word', () => {
    expect(unitSystem.energy()).toBe('joule');
    expect(unitSystem.energy({symbol: true})).toBe('J');
  });

  it('should be symbol or word', () => {
    expect(unitSystem.power()).toBe('watt');
    expect(unitSystem.power({symbol: true})).toBe('W');
  });

  it('should be symbol or word', () => {
    expect(unitSystem.flux()).toBe(unitSystem.power({symbol: true}));
    expect(unitSystem.flux({symbol: false})).toBe(unitSystem.power());
  });

  it('should be symbol or word', () => {
    expect(unitSystem.electricCharge()).toBe('coulomb');
    expect(unitSystem.electricCharge({symbol: true})).toBe('C');
  });

  it('should be symbol or word', () => {
    expect(unitSystem.voltage()).toBe('volt');
    expect(unitSystem.voltage({symbol: true})).toBe('V');
  });

  it('should be symbol or word', () => {
    expect(unitSystem.electricCapacitance()).toBe('farad');
    expect(unitSystem.electricCapacitance({symbol: true})).toBe('F');
  });

  it('should be symbol or word', () => {
    expect(unitSystem.electricResistance()).toBe('ohm');
    expect(unitSystem.electricResistance({symbol: true})).toBe('Ω');
  });

  it('should be symbol or word', () => {
    expect(unitSystem.impedance()).toBe(unitSystem.electricResistance());
    expect(unitSystem.impedance({symbol: true})).toBe(unitSystem.electricResistance({symbol: true}));
  });

  it('should be symbol or word', () => {
    expect(unitSystem.reactance()).toBe(unitSystem.electricResistance());
    expect(unitSystem.reactance({symbol: true})).toBe(unitSystem.electricResistance({symbol: true}));
  });

  it('should be symbol or word', () => {
    expect(unitSystem.electricalConductance()).toBe('siemens');
    expect(unitSystem.electricalConductance({symbol: true})).toBe('S');
  });

  it('should be symbol or word', () => {
    expect(unitSystem.magnetic_flux()).toBe('weber');
    expect(unitSystem.magnetic_flux({symbol: true})).toBe('Wb');
  });

  it('should be symbol or word', () => {
    expect(unitSystem.magneticFluxDensity()).toBe('tesla');
    expect(unitSystem.magneticFluxDensity({symbol: true})).toBe('T');
  });

  it('should be symbol or word', () => {
    expect(unitSystem.inductance()).toBe('henry');
    expect(unitSystem.inductance({symbol: true})).toBe('H');
  });

  it('should be symbol or word', () => {
    expect(unitSystem.temperature()).toBe('Celsius');
    expect(unitSystem.temperature({symbol: true})).toBe('°C');
  });

  it('should be symbol or word', () => {
    expect(unitSystem.radioactivity()).toBe('becquerel');
    expect(unitSystem.radioactivity({symbol: true})).toBe('Bq');
  });

  it('should be in array or throw error', () => {
    function showError() {
      unitSystem.prefix({sign: "none"});
    }
    expect(showError).toThrowError(`Unsupported sign. Use: 'positive' or 'negative'`);
    expect(SI_PREFIXES._sym_.positive).toContain(unitSystem.prefix({ sign: 'positive', symbol: true }));
    expect(SI_PREFIXES._sym_.negative).toContain(unitSystem.prefix({ sign: 'negative', symbol: true }));
    expect(SI_PREFIXES.positive).toContain(unitSystem.prefix({ sign: 'positive', symbol: false }));
    expect(SI_PREFIXES.negative).toContain(unitSystem.prefix({ sign: 'negative', symbol: false }));

  })
});
