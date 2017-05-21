import fs from 'fs';
import path from 'path';

export function pull(file, locale) {
  try {
    const localeFilePath = path.join(__dirname, 'locales', locale, file);
    return JSON.parse(fs.readFileSync(localeFilePath, 'utf-8'))
  } catch (e) {
    throw new Error(`${locale} is unsupported`)
  }
}

export function luhnChecksum(num) {
  let arr = [];
  num = num.toString().replace(/\D\-|\s|\/|\*/g, '');
  for(let i = 0; i < num.length; i++) {
    if(i % 2 === 0) {
      let m = parseInt(num[i]) * 2;
      if(m > 9) {
        arr.push(m - 9);
      } else {
        arr.push(m);
      }
    } else {
        let n = parseInt(num[i]);
        arr.push(n)
      }
  }
  let sum = 0;
  arr.map(item => sum += item)
  return sum % 10;
}

export function uniform(a, b, fixed) {
  return (Math.random() * (b - a) + a).toFixed(fixed) * 1;
}

export const asciiUpperCase = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
export const asciiLowerCase = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
export const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
export const asciiLetters = [...asciiUpperCase, ...asciiLowerCase];
