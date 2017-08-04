import _ from 'lodash';
import { Structured } from '../providers';

const structured = new Structured();

//TODO: provide more tests w/o adding new dependencies;

describe('Test structured provider', () => {

  it('Should return valid css snippet', () => {
    const result = structured.css();
    expect(result).toContain(':');
    expect(result[result.length - 1]).toEqual('}');
    expect(result.split(' ')[1][0]).toEqual('{');
  });

  it('Should return valid css property', () => {
    const result = structured.cssProperty();
    expect(result.split(' ')).toHaveLength(2);
    expect(result).toContain(':');
  });

  it('Should return valid html attribute value', () => {
    const result = structured.htmlAttrValue({ tag: 'a', attr: 'href'});
    expect(result).toMatch(/^http/);
    expect(
      () => structured.htmlAttrValue({ tag: 'a', attr: 'zzz' })
    ).toThrow(new Error('Tag a or attribute zzz not supported'));
  });

  it('Should return valid html snippet', () => {
    const result = structured.html();
    expect(result[0]).toEqual('<');
    expect(result[result.length - 1]).toEqual('>');
  });

  it('Should return valid json', () => {
    let result = structured.json({ items: 3, maxDepth: 4 });
    expect(_.isString(result)).toEqual(true);
    result = JSON.parse(result);
    expect([_.isArray(result), _.isObject(result)]).toContain(true);
    if (_.isArray(result)) {
      expect(result).toHaveLength(3);
    } else {
      expect(Object.keys(result)).toHaveLength(3);
    }
  });
});