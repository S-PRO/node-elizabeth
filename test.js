import Address from './src/providers/address';

const address = new Address({ locale: 'ru' });

console.log(address.streetName());