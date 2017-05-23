import { Science } from '../providers.js';
import { MATH_FORMULAS } from "../locales/int/scientific.js";
import { pull } from './../util';

const science = new Science();
const data = pull('science.json', 'en');


describe('Test science provider', () => {

  it('should be in array', () => {
    expect(MATH_FORMULAS).toContain(science.mathFormula());
  });

  it('should be in array', () => {
    const result = science.chemicalElement({nameOnly: false});
    const result_ = result.name + '|' + result.symbol + '|' + result.number
    expect(data.chemical_element).toContain(result_);
    expect(science.chemicalElement()).toMatch(/^[A-Z]{1}[a-z]{1,}$/);
  });

  it('should be in array', () => {
    expect(data.article).toContain(science.scientificArticle());
  });

})
