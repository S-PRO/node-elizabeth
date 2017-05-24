import { Path, Personal } from '../providers.js';
import { FOLDERS, PROGRAMMING_LANGS, PROJECT_NAMES } from "../locales/int/development.js";
import os from 'os';
import path_ from 'path';

const path = new Path();

describe('Test path provider', () => {

  it('should be root string', ()=> {
    expect(path.root()).toMatch(/^(C\\\\\\\\)|(\/)/)
  });

  it('should be root string', ()=> {
    expect(path.user()).toMatch(/^(C\\\\\\\\Users\\\\\\\\)|(\/home\/)/)
  });

  it('should be root string', ()=> {
    expect(path.user().split(path_.sep)).toHaveLength(3);
  });

  it('should be string length === 4 and be in array', () => {
    let result = path.usersFolder({ gender: 'female' }).split(path_.sep)
    expect(result).toHaveLength(4);
    expect(FOLDERS).toContain(result[3]);
  });

  it('should be string length === 4 and be in array', () => {
    let result = path.devDir({ gender: 'female' }).split(path_.sep)
    expect(result).toHaveLength(5);
    expect(PROGRAMMING_LANGS).toContain(result[4]);
  });

  it('should be string length === 4 and be in array', () => {
    let result = path.projectDir({ gender: 'female' }).split(path_.sep)
    expect(result).toHaveLength(6);
    expect(PROJECT_NAMES).toContain(result[5]);
  });

})
