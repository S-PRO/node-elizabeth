import { File } from '../providers.js';
import { EXTENSIONS, MIME_TYPES } from "../locales/int/file.js";

const file = new File();

describe('Test address provider', () => {

  it('should be in array', () => {
    expect(EXTENSIONS['text']).toContain(file.extension({fileType: 'text'}))
  });

  it('should be in array or throw error', () => {
    function showError() {
      file.mimeType({type: "none"});
    }
    
    expect(MIME_TYPES['application']).toContain(file.mimeType({type: 'application'}));
    expect(showError).toThrowError('Unsupported mime type!');
  });

});
