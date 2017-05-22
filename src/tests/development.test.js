import { Development } from '../providers.js';
import { LICENSES, NOSQL, SQL, CONTAINER, PROGRAMMING_LANGS, BACKEND, FRONTEND, OS } from "../locales/int/development.js";
import { pull } from './../util';

const development = new Development();
const data = pull('science.json', 'en');


describe('Test development provider', () => {

  it('should be in array', ()=> {
    expect(LICENSES).toContain(development.softwareLicense());
  });

  it('should be format {0}.{1}.{2}', () => {
    expect(development.version()).toMatch(/^[0-9]{1,2}.[0-9]{1,2}.[0-9]{1,2}$/);
  });

  it('should be in array', () => {
    expect(NOSQL).toContain(development.database({noSQL: true}));
    expect(SQL).toContain(development.database({noSQL: false}));
  });

  it('should be in array', () => {
    expect(CONTAINER).toContain(development.container());
  });

  it('should be in array', () => {
    expect(['Git', 'Subversion']).toContain(development.versionControlSystem());
  });

  it('should be in array', () => {
    expect(PROGRAMMING_LANGS).toContain(development.programmingLanguage());
  });

  it('should be in array', () => {
    expect(BACKEND).toContain(development.backend());
  });

  it('should be in array', () => {
    expect(FRONTEND).toContain(development.frontend());
  });

  it('should be in array', () => {
    expect(OS).toContain(development.os());
  });

  it('should return link', () => {
    expect(development.stackOverflowQuestion()).toMatch(
      new RegExp(/^(http:\/\/stackoverflow.com\/questions\/)[0-9]{7}$/)
    );
  });

})
