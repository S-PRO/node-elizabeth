import { Text } from '../providers.js';
import { pull } from './../util';

const data = pull('text.json', 'en');
const text = new Text();

describe('Test text provider', () => {

  it('should return array', () => {
    expect(text.alphabet()).toBeInstanceOf(Array);
  });

  it('should return string', () => {
    expect(typeof text.level()).toBe('string');
  });

  it('should be string and length >= 4', () => {
    expect(typeof text.text()).toBe('string');
    expect(text.text({quantity: 4})).toMatch(/^[^,]{4,}/);
  });

  it('should be length == 6', () => {
    expect(text.words({quantity: 6})).toHaveLength(6);
  });

  it('should be in array', ()=> {
    expect(data.words.bad).toContain(text.swearWord());
  });

  it('should be in array', ()=> {
    expect(data.words.normal).toContain(text.word());
  });

  it('should be in array', ()=> {
    expect(data.quotes).toContain(text.quote());
  });

  it('should be in array', ()=> {
    expect(data.color).toContain(text.color());
  });

  it('should be format #23A2AA', () => {
    expect(text.hexColor()).toMatch(/^#[0-9A-Z]{6}/);
  });

  it('should be in array', ()=> {
    expect(data.answers).toContain(text.answer());
  });

});
