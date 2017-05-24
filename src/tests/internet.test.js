import { Internet } from '../providers.js';
import { pull } from './../util';

import { MIME_TYPES } from '../locales/int/file';
import * as NETWORK from '../locales/int/network';

const internet = new Internet();


describe('Test internet provider', () => {

  it('should return random status code', () => {
    const [ct, mimeType_] = internet.contentType().split(': ');
    expect(ct).toEqual(ct);
    expect(MIME_TYPES.application).toContain(mimeType_);
  });

  it('should return random status code', () => {
    expect(internet.httpStatusCode()).toMatch(/\d{3}/g);
    expect(NETWORK.HTTP_STATUS_CODES).toContain(internet.httpStatusCode({ codeOnly: false }))
  });

  it('should return random http method', () => {
    expect(NETWORK.HTTP_METHODS).toContain(internet.httpMethod());
  });

  it('should return random ipv4 address', () => {
    // TODO: Check regexp
    //expect(internet.ipv4()).toMatch(/\d{1,3}\.d{1,3}\.d{1,3}\.d{1,3}/g)
    expect(internet.ipv4().split('.')).toHaveLength(4);
  });

  it('should return random ipv6 address', () => {
    // TODO: Add regexp check;
    expect(internet.ipv6().split(':')).toHaveLength(8);
  });

  it('should return random mac address', () => {
    // TODO: Add regexp;
    const result = internet.macAddress();
    expect(result.split(':')).toHaveLength(6);
  });

  it('should return random emoji code', () => {
    expect(NETWORK.EMOJI).toContain(internet.emoji());
  });

  it('should return random image placeholder', () => {
    expect(internet.imagePlaceholder()).toEqual('http://placehold.it/400x300');
  });

  it('should return random stock image', () => {
    expect(internet.stockImage()).toMatch(
      /^(.*)\/category\/?(buildings|food|nature|people|technology|objects)\/1900x1080$/
    );
    expect(internet.stockImage({ category: 'no category' })).toMatch(
      /^(.*)\/category\/?(buildings|food|nature|people|technology|objects)\/1900x1080$/
    );
    expect(internet.stockImage({ category: 'food'})).toMatch(
      /^(.*)\/category\/food\/1900x1080$/
    );
  });

  it('should return random image by keyword', () => {
    expect(internet.imageByKeyword()).toMatch(
      /^(.*)?(|cat|girl|boy|beauty|nature|woman|man|tech|space)$/
    );
    expect(internet.imageByKeyword({ keyword: 'man'})).toMatch(
      /^(.*)man$/
    );
  });

  it('should return array of random hashtags', () => {
    const result = internet.hashtags();
    expect(result).toHaveLength(4);
    expect(result.every(ht => NETWORK.HASHTAGS.general.includes(ht))).toEqual(true);
    const result_ = internet.hashtags({ quantity: 10, category: 'cars'});
    expect(result_).toHaveLength(10);
    expect(result_.every(ht => NETWORK.HASHTAGS.cars.includes(ht))).toEqual(true);
  });

  it('should return random homepage', () => {
    const result = internet.homePage();
    expect(result).toMatch(/^http\:\/\/www\.(.*)/);
    expect(NETWORK.DOMAINS).toContain('.' + result.split('.')[2]);
  });

  it('should return random subreddit', () => {
    expect(NETWORK.SUBREDDITS).toContain(internet.subReddit());
    expect(NETWORK.SUBREDDITS_NSFW).toContain(internet.subReddit({ nsfw: true }));
    const nsfwFull = internet.subReddit({ nsfw: true, fullUrl: true });
    expect(nsfwFull).toMatch(/^http\:\/\/www\.(.*)/);
    let sub = nsfwFull.match(/\/r\/(.*)/g);
    expect(NETWORK.SUBREDDITS_NSFW).toContain(sub[0]);
    const noNsfwFull = internet.subReddit({ fullUrl: true });
    expect(noNsfwFull).toMatch(/^http\:\/\/www\.(.*)/);
    sub = noNsfwFull.match(/\/r\/(.*)/g);
    expect(NETWORK.SUBREDDITS).toContain(sub[0]);
  });

  it('should return random user agent', () => {
    expect(NETWORK.USER_AGENTS).toContain(internet.userAgent());
  })
});