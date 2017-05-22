import { Food } from '../providers.js';
import { pull } from './../util';

const data = pull('food.json', 'en');
const food = new Food();

describe('Test food provider', () => {

  it('should be in array', () => {
    expect(data.vegetables).toContain(food.vegetable());
  });

  it('should be in array', () => {
    expect(data.fruits).toContain(food.fruit());
  });

  it('should be in array', () => {
    expect(data.dishes).toContain(food.dish());
  });

  it('should be in array', () => {
    expect(data.spices).toContain(food.spices());
  });

  it('should be in array', () => {
    expect(data.drinks).toContain(food.drink());
  });

})
