import { ClothingSizes } from '../providers.js';

const clothingSizes = new ClothingSizes();

describe('Test clothingSizes provider', () => {
  it('should be in array', () => {
    expect([
      'L', 'M', 'S',
      'XL', 'XS', 'XXL',
      'XXS', 'XXXL',
    ]).toContain(clothingSizes.international());
  });

  it('should be in array', () => {
    const sizes = [];
    for (let i = 40; i < 62; i++) {
      if (i % 2 === 0) {
        sizes.push(i);
      }
    }
    expect(sizes).toContain(clothingSizes.european());
  });

  it('should be in range', () => {
    expect(clothingSizes.custom()).toBeGreaterThanOrEqual(40);
    expect(clothingSizes.custom()).toBeLessThanOrEqual(62);
  });
})
