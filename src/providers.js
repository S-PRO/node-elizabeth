import os from 'os';
import path from 'path';

import _ from 'lodash';
import fmt from 'string-template';
import generator from 'creditcard-generator';

import {
  pull,
  uniform,
  luhnChecksum,
  asciiUpperCase,
  asciiLetters,
  digits,
} from './util';

import * as ADDRESS from './locales/int/address';
import * as BUSINESS from './locales/int/business';
import * as CODE from './locales/int/code';
import * as DATETIME from './locales/int/datetime';
import * as DEVELOPMENT from './locales/int/development';
import * as PERSONAL from './locales/int/personal';
import * as FILE from './locales/int/file';
import * as HARDWARE from './locales/int/hardware';
import * as NETWORK from './locales/int/network';
import * as SCIENTIFIC from './locales/int/scientific';
import * as TRANSPORT from './locales/int/transport';

/**
 * Class for generate the fake data that you can use for
 * working with date and time.
 */
export class DateTime {

  constructor(props = {}) {
    const { locale = 'en' } = props;
    this.locale = locale;
    this.data = pull('datetime.json', locale);
  }

  /**
   * Get a random day of week.
   * @param opts Options
   * @param opts.abbr {boolean} Abbreviated name of the day.
   */
  dayOfWeek(opts = {}) {
    const { abbr = false } = opts;
    const key = abbr ? 'abbr' : 'name';
    return _.sample(this.data.day[key]);
  }

  /**
   * Get a random month.
   * @param opts Options
   * @param opts.abbr {boolean} if True then will be returned abbreviated month name.
   */
  month(opts = {}) {
    const { abbr = false } = opts;
    const key = abbr ? 'abbr' : 'name';
    return _.sample(this.data.month[key]);
  }

  /**
   * Generate a random year.
   * @param opts Options
   * @param opts.minimum {number} Minimum value.
   * @param opts.maximum {number} Maximum value
   */
  year(opts = {}) {
    const { minimum = 1990, maximum = 2050 } = opts;
    return _.random(minimum, maximum);
  }

  /**
   * Get a random value from list of centuries (roman format).
   */
  century() {
    return _.sample(DATETIME.ROMAN_NUMS)
  }

  /**
   * Get a random periodicity string.
   */
  periodicity() {
    return _.sample(this.data.periodicity)
  }
}

/**
 * Class for generating codes;
 */
export class Code {

  /**
   * @param props Options
   * @param props.locale Current locale
   */
  constructor(props = {}) {
    const { locale = 'en' } = props;
    this.locale = locale;
  }

  /**
   * Generate custom code using ascii uppercase and random integers.
   * @param opts Options;
   * @param opts.mask {string} Mask of code.
   * @param opts.char {string} Placeholder for characters.
   * @param opts.digit {string} Placeholder for digits.
   */
  customCode(opts = {}) {
    const { mask = '@###', char = '@', digit = '#'} = opts;
    return mask.split('').map((character) => {
      if (character === char) {
        return _.sample(asciiUpperCase);
      } else if (character === digit) {
        return _.sample(digits);
      } else {
        return character;
      }
    }).join('')
  }

  /**
   * Get a random locale code (MS-LCID).
   * See Windows Language Code Identifier Reference for more information.
   */
  localeCode() {
    return _.sample(CODE.LOCALE_CODES);
  }

  /**
   * Generate a random International Standard Serial Number (ISSN).
   * @param opts.mask Code mask
   */
  issn(opts = {}) {
    const { mask = '####-####' } = opts;
    return this.customCode(mask)
  }

  /**
   * Generate ISBN for current locale. Default is ISBN 10,
   * but you also can use ISBN-13
   * @param opts Options
   * @param opts.format ISBN format.
   */
  isbn(opts = {}) {
    const { format = 'isbn-10' } = opts;
    const groups = CODE.ISBN_GROUPS;
    let mask = format === 'isbn-13' ?
      '###-{0}-#####-###-#' :
      '{0}-#####-###-#';
    if (Object.keys(groups).includes(this.locale)) {
      mask = fmt(mask, groups[this.locale]);
    } else {
      mask = fmt(mask, groups.default);
    }
    return this.customCode(mask);
  }

  /**
   * Generate EAN (European Article Number) code. Default is
   * EAN-13, but you also can use EAN-8.
   * @param opts Options
   * @param opts.format Format of EAN.
   */
  ean(opts = {}) {
    const { format = 'ean-13' } = opts;
    const mask = format === 'ean-8' ?
      '########' :
      '#############';
    return this.customCode(mask);
  }

  /**
   * Generate a random IMEI (International Mobile Station Equipment Identity).
   */
  imei() {
    const num = _.sample(CODE.IMEI_TACS) + this.customCode('######');
    return num + luhnChecksum(num);
  }

  /**
   * Generate a random PIN code.
   * @param opts Options
   * @param opts.mask Mask for PIN code.
   */
  pin(opts = {}) {
    const { mask = '####' } = opts;
    return this.customCode(mask);
  }
}

/**
 * Class for generate text data, i.e text, lorem ipsum and another.
 */
export class Text {

  constructor(opts = {}) {
    const { locale = 'en' } = opts;
    this.locale = locale;
    this.data = pull('text.json', locale);
  }

  /**
   * Get an alphabet for current locale.
   * @param opts Options
   * @param opts.letterCase
   */
  alphabet(opts  = {}) {
    const { letterCase = 'uppercase' } = opts;
    return this.data.alphabet[letterCase];
  }

  /**
   * Generate a random level of danger or something else.
   */
  level() {
    return _.sample(this.data.level)
  }

  /**
   * Generate the text.
   * @param opts Options
   * @param opts.quantity Quantity of sentences.
   */
  text(opts = {}) {
    const { quantity = 5 } = opts;
    let text = '';
    [...Array(quantity)].forEach(() => {
      text += _.sample(this.data.text)
    });
    return text
  }

  /**
   * Get a random sentence from text.
   */
  sentence() {
    return this.text(1)
  }

  /**
   * Get the random words.
   * @param opts Options
   * @param opts.quantity Quantity of words. Default is 5.
   */
  words(opts = {}) {
    const { quantity = 5 } = opts;
    return [...Array(quantity)].map(() => _.sample(this.data.words.normal))
  }

  /**
   * Get a random word.
   */
  word() {
    return this.words(1)[0]
  }

  /**
   * Get a random swear word.
   */
  swearWord() {
    return _.sample(this.data.words.bad)
  }

  /**
   * Get a random quote.
   */
  quote() {
    return _.sample(this.data.quotes)
  }

  /**
   * Get a random color
   */
  color() {
    return _.sample(this.data.color)
  }

  /**
   * Generate a random hex color.
   */
  hexColor() {
    const letters = '0123456789ABCDEF';
    return '#' + _.sampleSize(letters, 6).join('');
  }

  /**
   * Get a random answer in current language.
   */
  answer() {
    return _.sample(this.data.answers);
  }
}

/**
 * Class for generate fake address data.
 */
export class Address {

  constructor(opts = {}) {
    const { locale = 'en' } = opts;
    this.locale = locale;
    this.data = pull('address.json', locale);
  }

  /**
   * Generate a random street number.
   */
  streetNumber() {
    return _.random(1, 1400)
  }

  /**
   * Get a random street name.
   */
  streetName() {
    return _.sample(this.data.street.name)
  }

  /**
   * Get a random street suffix.
   */
  streetSuffix() {
    return _.sample(this.data.street.suffix)
  }

  /**
   * Get a random full address (include Street number, suffix and name).
   */
  address() {
    if (ADDRESS.SHORTENED_ADDRESS_FMT.includes(this.locale)) {
      if (this.locale !== 'ko') {
        return fmt(this.data.address_fmt, {
          st_num: this.streetNumber(),
          st_name: this.streetName(),
        })
      }
    }
    if (this.locale === 'ja') {
      const cities = this.data.city;
      return fmt(this.data.address_fmt, {
        city: _.sample(cities),
        n: _.random(1, 100),
        nn: _.random(1, 100),
        nnn: _.random(1, 100),
      })
    }
    return fmt(this.data.address_fmt, {
      st_num: this.streetNumber(),
      st_name: this.streetName(),
      st_sfx: this.streetSuffix(),
    })
  }

  /**
   * Get a random states or subject of country.
   * @param opts Options
   * @param opts.abbr If True then return ISO (ISO 3166-2)
   * code of state/region/province/subject.
   */
  state(opts = {}) {
    const { abbr = false } = opts;
    const key = abbr ? 'abbr' : 'name';
    return _.sample(this.data.state[key])
  }

  // /**
  //  * Generate a postal code for current locale.
  //  */
  // postalCode() {
  //
  // }

  /**
   * Get a random ISO code of country.
   * @param opts Options
   * @param opts.format Format of code (iso2, iso3, numeric).
   */
  countryISO(opts = {}) {
    const { format = 'iso2' } = opts;
    const supported = Object.keys(ADDRESS.COUNTRIES_ISO);
    if (!supported.includes(format)) {
      throw new Error(fmt('Unsupported format. Use: {0}', supported.toString()))
    }
    return _.sample(ADDRESS.COUNTRIES_ISO[format])
  }

  /**
   * Get a random country.
   */
  country() {
    return _.sample(this.data.country.name)
  }

  /**
   * Get a random city for current locale.
   */
  city() {
    return _.sample(this.data.city)
  }

  /**
   * Generate a random value of latitude (-90 to +90).
   */
  latitude() {
    return uniform(-90, 90, 10)
  }

  /**
   * Generate a random value of longitude (-180 to +180).
   */
  longitude() {
    return uniform(-180, 180, 10)
  }

  /**
   * Generate random geo coordinates.
   */
  coordinates() {
    return {
      latitude: this.latitude(),
      longitude: this.longitude(),
    }
  }

  /**
   * Get a random continent name or continent
   * code (code in international format)
   * @param opts Options
   * @param opts.code If true returns code.
   */
  continent(opts = {}) {
    const { code = false } = opts;
    if (code) {
      return _.sample(ADDRESS.CONTINENT_CODES)
    }
    return _.sample(this.data.continent)
  }
}

/**
 * Class for generating data for business.
 */
export class Business {

  constructor(props = {}) {
    const { locale = 'en' } = props;
    this.locale = locale;
    this.data = pull('business.json', locale);
  }

  /**
   * Get a random type of business entity.
   * @param opts Options
   * @param opts.abbr If True then return abbreviated company type.
   */
  companyType(opts = {}) {
    const { abbr = false } = opts;
    const key = abbr ? 'abbr' : 'title';
    return _.sample(this.data.company.type[key]);
  }

  /**
   * Get a random company name.
   */
  company() {
    return _.sample(this.data.company.name);
  }

  /**
   * Generate a random copyright.
   */
  copyright() {
    return `© ${this.company()}, ${this.companyType(true)}`
  }

  /**
   * Get a currency code. ISO 4217 format.
   */
  currencyISO() {
    return _.sample(BUSINESS.CURRENCIES);
  }

  /**
   * Generate a random price.
   */
  price(opts = {}) {
    const { minimum = 10, maximum = 1000 } = opts;
    const currencies = BUSINESS.CURRENCY_SYMBOLS;
    if (Object.keys(currencies).includes(this.locale)) {
      return `${uniform(minimum, maximum, 2)} ${currencies[this.locale]}`;
    }
    return `${uniform(minimum, maximum, 2)} ${currencies.default}`;
  }
}

/**
 * Class for generate personal data, i.e names, surnames,
 * age and another.
 */
export class Personal {

  constructor(props = {}) {
    const { locale = 'en' } = props;
    this.locale = locale;
    this.data = pull('personal.json', locale);
    this.userNames = pull('personal.json', 'en').names;
    this._store = {
      age: 0,
    };
    this.customCode = new Code({ locale: 'en' }).customCode;
  }

  /**
   * Get a random integer value.
   */
  age(opts = {}) {
    const { minimum = 16, maximum = 66 } = opts;
    const num = _.random(minimum, maximum);
    this._store.age = num;
    return num
  }

  /**
   * Get a count of child's. Depend on previous generated age.
   * @param opts Options
   * @param opts.maxChildren Maximum count of child's.
   */
  childCount(opts = {}) {
    const { maxChildren = 5 } = opts;
    const age = this._store.age || this.age();
    return age < 18 ? 0 : _.random(0, maxChildren);
  }

  /**
   * Get a work experience. Depend on previous generated age.
   * @param opts Options
   * @param opts.startFrom { number} Age then person start to work.
   */
  workExperience(opts = {}) {
    const { startFrom = 22 } = opts;
    const age = this._store.age || this.age();
    const experience = age - startFrom;
    return experience < 0 ? 0 : experience;
  }

  /**
   * Get a random name.
   * @param opts Options
   * @param opts.gender Person gender;
   */
  name(opts = {}) {
    const { gender = 'female' } = opts;
    return _.sample(this.data.names[gender])
  }

  /**
   * Get a random surname.
   * @param opts Options
   * @param opts.gender Person gender;
   */
  surname(opts = {}) {
    const { gender = 'female' } = opts;
    if (['ru', 'is', 'uk'].includes(this.locale)) {
      return _.sample(this.data.surnames[gender]);
    }
    return _.sample(this.data.surnames)
  }

  /**
   * Get a random title (prefix/suffix) for name.
   * @param opts Options
   * @param opts.gender Person gender;
   * @param opts.titleType The type of title ('typical' and 'academic').
   */
  title(opts = {}) {
    const { gender = 'female', titleType = 'typical' } = opts;
    return _.sample(this.data.title[gender][titleType])
  }

  /**
   * Generate a random full name.
   * @param opts Options
   * @param opts.gender
   * @param opts.reversed if true: surname/name else name/surname
   * @returns {*}
   */
  fullName(opts = {}) {
    const { gender = 'female', reversed = false } = opts;
    const string = reversed ? '{1} {0}' : '{0} {1}';
    return fmt(string, this.name(gender), this.surname(gender));
  }

  /**
   * Get a random username with digits. Username generated
   * from names (en) for all locales.
   * @param opts Options
   * @param opts.gender {string} Person gender;
   */
  username(opts = {}) {
    const { gender = 'female' } = opts;
    const formats = ['{0}{1}', '{0}_{1}', '{0}-{1}'];
    return fmt(
      _.sample(formats), _.sample(this.userNames[gender]).toLowerCase(), _.random(1, 9999)
    );
  };
  /**
   * Generate a random email.
   * @param opts Options
   * @param opts.gender Person gender;
   * @param opts.domains Domains list; Default is gmail, yandex, yahoo, outlook, live;
   */
  email(opts = {}) {
    const { gender = 'female', domains = NETWORK.EMAIL_DOMAINS } = opts;
    return `${this.username(gender)}${_.sample(domains)}`
  };

  /**
   * Generate a random bitcoin address. Currently supported only two
   * address formats that are most popular: 'P2PKH' and 'P2SH'
   */
  bitcoin() {
    const type = _.sample(['1', '3']);
    const lettersAndDigits = [...digits, ...asciiLetters];
    return `${type}${[...Array(33)].map(() => _.sample(lettersAndDigits)).join('')}`
  }

  /**
   * Generate a random card verification value (CVV).
   */
  cvv() {
    return _.random(100, 999)
  }

  /**
   * Generate a random credit card number.
   * @param opts Options
   * @param opts.cardType Issuing Network. Default is Visa.
   */
  creditCardNumber(opts = {}) {
    const { cardType = 'visa'} = opts;
    if (['visa', 'vi', 'v'].includes(cardType)) {
      return generator.GenCC('VISA')
    }
    if (['mastercard', 'm', 'mc', 'master'].includes(cardType)) {
      return generator.GenCC('Mastercard')
    }
    if (['american_express', 'amex', 'ax', 'a'].includes(cardType)) {
      return generator.GenCC('Amex')
    }
    throw new Error('Unsupported card type')
  }

  /**
   * Generate a random expiration date for credit card.
   * @param opts Options
   * @param opts.minimum Date of issue.
   * @param opts.maximum Maximum of expiration_date.
   * @returns {string}
   */
  creditCardExpirationDate(opts = {}) {
    const { minimum = 16, maximum = 25 } = opts;
    const month = _.random(1, 12);
    const year = _.random(minimum, maximum);
    return `${month < 10 ? '0' + month : month}/${year}`
  }

  /**
   * Generate a random CID code.
   */
  cid() {
    return _.random(1000, 9999)
  }

  /**
   * Generate a random PayPal account.
   */
  paypal() {
    return this.email();
  }

  // TODO : Add more socials;
  /**
   * Generate profile for random social network.
   * @param opts Options
   * @param opts.gender Gender of user.
   */
  socialMediaProfile(opts = {}) {
    const { gender = 'female' } = opts;
    const urls = [
      'http://facebook.com/{0}',
      'http://twitter.com/{0}',
      'http://medium.com/@{0}',
    ];
    return fmt(_.sample(urls), this.username(gender))
  }

  /**
   * Get a random title of gender, code for the representation
   * of human sexes is an international standard that defines a
   * representation of human sexes through a language-neutral single-digit
   * code or symbol of gender.
   * @param opts Options
   * @param opts.iso5218
   * @param opts.symbol
   */
  gender(opts = {}) {
    const { iso5218 = false, symbol = false } = opts;
    // The four codes specified in ISO/IEC 5218 are:
    // 0 = not known,
    // 1 = male,
    // 2 = female,
    // 9 = not applicable.
    if (iso5218) {
      return _.sample([0, 1, 2, 9])
    }
    if (symbol) {
      return _.sample(PERSONAL.GENDER_SYMBOLS)
    }
    return _.sample(this.data.gender)
  }

  /**
   * Generate a random height in M (Meter).
   * @param opts Options
   * @param opts.minimum
   * @param opts.maximum
   */
  height(opts = {}) {
    const { minimum = 1.5, maximum = 2 } = opts;
    return uniform(minimum, maximum, 2)
  }

  /**
   * Generate a random weight in Kg.
   * @param opts Options
   * @param opts.minimum
   * @param opts.maximum
   */
  weight(opts = {}) {
    const { minimum = 38, maximum = 90 } = opts;
    return uniform(minimum, maximum, 2)
  }

  /**
   * Get a random blood type.
   */
  bloodType() {
    return _.sample(PERSONAL.BLOOD_GROUPS);
  }

  /**
   * Get a random (LOL) sexual orientation.
   * @param opts Options
   * @param opts.symbol Unicode symbol.
   */
  sexualOrientation(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return _.sample(PERSONAL.SEXUALITY_SYMBOLS);
    }
    return _.sample(this.data.sexuality)
  }

  /**
   * Get a random job.
   */
  occupation() {
    return _.sample(this.data.occupation)
  }

  /**
   * Get a random political views.
   */
  politicalViews() {
    return _.sample(this.data.political_views)
  }

  /**
   * Get a random worldview.
   */
  worldView() {
    return _.sample(this.data.worldview)
  }

  /**
   * Get a random view on.
   */
  viewOn() {
    return _.sample(this.data.views_on)
  }

  /**
   * Get a random nationality.
   * @param opts Options
   * @param opts.gender Person gender;
    */
  nationality(opts = {}) {
    const { gender = 'female' } = opts;
    const separatedLocales = ['ru', 'uk'];
    if (separatedLocales.includes(this.locale)) {
      return _.sample(this.data.nationality[gender]);
    }
    return _.sample(this.data.nationality);
  }

  /**
   * Get a random university.
   */
  university() {
    return _.sample(this.data.university);
  }

  /**
   * Get a random academic degree.
   */
  academicDegree() {
    return _.sample(this.data.academic_degree);
  }

  /**
   * Get a random language.
   */
  language() {
    return _.sample(this.data.language);
  }

  /**
   * Get a random movie for current locale.
   */
  favoriteMovie() {
    return _.sample(this.data.favorite_movie)
  }

  /**
   * Get a random music genre.
   */
  favoriteMusicGenre() {
    return _.sample(PERSONAL.FAVORITE_MUSIC_GENRE);
  }

  /**
   * Generate a random phone number.
   */
  telephone(opts = {}) {
    let {
      mask = null,
      placeholder = '#'
    } = opts;
    if (!mask) {
      mask = _.sample(this.data.telephone_fmt);
    }
    return this.customCode(mask, '@', placeholder)
  }

  /**
   * Generate a random identifier by mask. With this method you can generate
   * any identifiers that you need. Simply select the mask that you need.
   * @param opts Options
   * @param opts.mask
   */
  identifier(opts = {}) {
    const { mask = '##-##/##'} = opts;
    return this.customCode(mask)
  }

  /**
   * Get a random level of English.
   */
  levelOfEnglish() {
    return _.sample(PERSONAL.ENGLISH_LEVEL);
  }
}

/**
 * Class for generate fake data for files.
 */
export class File {

  /**
   * Get a random file extension from list.
   * @param opts Options
   * @param opts.fileType File type (source, text, data, audio, video, image,
   * executable, compressed).
   */
  extension(opts = {}) {
    const { fileType = 'text' } = opts;
    return _.sample(FILE.EXTENSIONS[fileType]);
  }

  /**
   * Get a random mime type from list.
   * @param opts Options
   * @param opts.type Type of media: (application,
   * image, video, audio, text, message).
   */
  mimeType(opts = {}) {
    const { type = 'application' } = opts;
    if (!Object.keys(FILE.MIME_TYPES).includes(type)) {
      throw new Error('Unsupported mime type!')
    }
    return _.sample(FILE.MIME_TYPES[type])
  }
}

/**
 * Class for getting scientific data
 */
export class Science {

  constructor(props = {}) {
    const { locale = 'en' } = props;
    this.locale = locale;
    this.data = pull('science.json', locale);
  }

  /**
   * Get a random mathematical formula.
   */
  mathFormula() {
    return _.sample(SCIENTIFIC.MATH_FORMULAS);
  }

  /**
   * Generate a random chemical element.
   * @param opts Options
   * @param opts.nameOnly If false then will be returned dict.
   */
  chemicalElement(opts = {}) {
    const { nameOnly = true } = opts;
    const [name, symbol, number] = _.sample(this.data.chemical_element).split('|');
    if (!nameOnly) {
      return {name, symbol, number};
    }
    return name;
  }

  /**
   * Generate a random link to scientific article on Wikipedia.
   */
  scientificArticle() {
    return _.sample(this.data.article)
  }
}

/**
 * Class for getting fake data for Developers.
 */
export class Development {

  /**
   * Get a random software license from list.
   */
  softwareLicense() {
    return _.sample(DEVELOPMENT.LICENSES);
  }

  /**
   * Generate a random version information.
   */
  version() {
    return fmt('{0}.{1}.{2}', _.random(0, 11), _.random(0, 11), _.random(0, 11))
  }

  /**
   * Get a random database name.
   * @param opts Options
   * @param opts.noSQL only NoSQL databases.
   */
  database(opts = {}) {
    const { noSQL = false } = opts;
    if (noSQL) {
      return _.sample(DEVELOPMENT.NOSQL);
    }
    return _.sample(DEVELOPMENT.SQL)
  }

  /**
   * Get a random containerization system.
   */
  container() {
    return _.sample(DEVELOPMENT.CONTAINER)
  }

  /**
   * Get a random version control system.
   */
  versionControlSystem() {
    return _.sample(['Git', 'Subversion'])
  }

  /**
   * Get a random programming language from the list.
   */
  programmingLanguage() {
    return _.sample(DEVELOPMENT.PROGRAMMING_LANGS);
  }

  /**
   * Get a random backend stack.
   */
  backend() {
    return _.sample(DEVELOPMENT.BACKEND);
  }

  /**
   * Get a random frontend stack.
   */
  frontend() {
    return _.sample(DEVELOPMENT.FRONTEND);
  }

  /**
   * Get a random operating system or distributive name.
   */
  os() {
    return _.sample(DEVELOPMENT.OS)
  }

  /**
   * Generate a random question id for StackOverFlow
   * and return url to a question.
   */
  stackOverflowQuestion() {
    return `http://stackoverflow.com/questions/${_.random(1000000, 9999999)}`
  }


}

/**
 * Class for Food, i.e fruits, vegetables, berries and other.
 */
export class Food {

  constructor(props = {}) {
    const { locale = 'en' } = props;
    this.locale = locale;
    this.data = pull('food.json', locale);
  }

  /**
   * Get a random vegetable.
   */
  vegetable() {
    return _.sample(this.data.vegetables)
  }

  /**
   * Get a random name of fruit or berry .
   */
  fruit() {
    return _.sample(this.data.fruits)
  }

  /**
   * Get a random dish for current locale.
   */
  dish() {
    return _.sample(this.data.dishes)
  }

  /**
   * Get a random spices or herbs.
   */
  spices() {
    return _.sample(this.data.spices)
  }

  /**
   * Get a random alcoholic drink.
   */
  drink() {
    return _.sample(this.data.drinks)
  }
}

/**
 * Class for generate data about hardware.
 */
export class Hardware {

  /**
   * Get a random screen resolution.
   */
  resolution() {
    return _.sample(HARDWARE.RESOLUTIONS);
  }

  /**
   * Get a random size of screen in inch.
   */
  screenSize() {
    return _.sample(HARDWARE.SCREEN_SIZES);
  }

  /**
   * Get a random CPU name.
   */
  cpu() {
    return _.sample(HARDWARE.CPU);
  }

  /**
   * Get a random frequency of CPU.
   */
  cpuFrequency() {
    return `${uniform(1.5, 4.3, 1)}GHz`
  }

  /**
   * Get a random generation.
   * @param opts Options
   * @param opts.abbr {boolean}
   */
  generation(opts = {}) {
    const { abbr = false } = opts;
    if (abbr) {
      return _.sample(HARDWARE.GENERATION_ABBR);
    }
    return _.sample(HARDWARE.GENERATION);
  }

  /**
   * Get a random CPU code name.
   */
  cpuCodename() {
    return _.sample(HARDWARE.CPU_CODENAMES);
  }

  /**
   * Get a random RAM type.
   */
  ramType() {
    return _.sample(['DDR2', 'DDR3', 'DDR4']);
  }

  /**
   * Get a random size of RAM.
   */
  ramSize() {
    return `${_.sample(['4', '6', '8', '16', '32', '64'])}GB`;
  }

  /**
   * Get a random value from list.
   */
  ssdOrHdd() {
    return _.sample(HARDWARE.HDD_SSD);
  }

  /**
   * Get a random graphics.
   */
  graphics() {
    return _.sample(HARDWARE.GRAPHICS);
  }

  /**
   * Get a random manufacturer.
   */
  manufacturer() {
    return _.sample(HARDWARE.MANUFACTURERS);
  }

  /**
   * Get a random phone model.
   */
  phoneModel() {
    return _.sample(HARDWARE.PHONE_MODELS);
  }
}

/**
 * Class for generate clothing sizes data
 */
export class ClothingSizes {

  /**
   * Get a random size in international format.
   */
  international() {
    return _.sample([
      'L', 'M', 'S',
      'XL', 'XS', 'XXL',
      'XXS', 'XXXL',
    ])
  }

  /**
   * Generate a random clothing size in European format.
   */
  european() {
    const sizes = [];
    for (let i = 40; i < 62; i++) {
      if (i % 2 === 0) {
        sizes.push(i);
      }
    }
    return _.sample(sizes);
  }

  /**
   * Generate clothing size using custom format.
   * @param opts Options
   * @param opts.minimum Min value.
   * @param opts.maximum Max value.
   */
  custom(opts = {}) {
    const { minimum = 40, maximum = 62 } = opts;
    return _.random(minimum, maximum);
  }
}

/**
 * Class for generate the internet data.
 */
export class Internet {

  /**
   * Get a random HTTP content type.
   * @param opts Options
   * @param opts.mimeType {string} mime type;
   */
  contentType(opts = {}) {
    const { mimeType = 'application' } = opts;
    return fmt('Content-Type: {0}', new File().mimeType({ type: mimeType }));
  }

  /**
   * Get a random HTTP status.
   * @param opts Options
   * @param opts.codeOnly {boolean} Return only http status code.
   */
  httpStatusCode(opts = {}) {
    const { codeOnly = true } = opts;
    const status = _.sample(NETWORK.HTTP_STATUS_CODES);
    if (codeOnly) {
      return status.split(' ')[0];
    }
    return status;
  }

  /**
   * Get a random HTTP method.
   */
  httpMethod() {
    return _.sample(NETWORK.HTTP_METHODS);
  }

  /**
   * Generate a random IPv4 address.
   */
  ipv4() {
    return [...Array(4)].map(() => (_.random(0, 255))).join('.')
  }

  /**
   * Generate a random IPv6 address.
   */
  ipv6() {
    return fmt('2001:{0}',
      [...Array(7)].map(() => _.random(0, Math.pow(16, 4)).toString(16)).join(':')
    )
  }

  /**
   * Generate a random MAC address.
   */
  macAddress() {
    return 'XX:XX:XX:XX:XX:XX'.replace(/X/g, () => (
      '0123456789ABCDEF'.charAt(Math.floor(Math.random() * 16))
    ));
  }

  /**
   * Get a random emoji shortcut code.
   */
  emoji() {
    return _.sample(NETWORK.EMOJI);
  }

  /**
   * Generate a link to the image placeholder.
   * @param opts Options
   * @param opts.width {number} Image width
   * @param opts.height {number} Image height
   */
  imagePlaceholder(opts = {}) {
    const { width = 400, height = 300} = opts;
    return fmt('http://placehold.it/{width}x{height}', { width, height })
  }

  /**
   * Get a random beautiful stock image that hosted on Unsplash.com
   * @param opts Options
   * @param opts.category {string} Category of image. Available: 'buildings', 'food',
   * 'nature', 'people', 'technology', 'objects'.
   * @param opts.width {number} Image width
   * @param opts.height {number} Image height
   */
  stockImage(opts = {}) {
    let { category = null, width = 1900, height = 1080} = opts;
    const categories = [
      'buildings', 'food', 'nature', 'people', 'technology', 'objects'
    ];
    if (!category || !categories.includes(category)) {
      category = _.sample(categories);
    }
    return fmt(
      'https://source.unsplash.com/category/{category}/{width}x{height}',
      { category, width, height }
    );
  }

  /**
   * Get image by keyword;
   * @param opts Options
   * @param opts.keyword {string} Image keyword. Available: 'cat', 'girl', 'boy', 'beauty', 'nature',
   * 'woman', 'man', 'tech', 'space'
   */
  imageByKeyword(opts = {}) {
    let { keyword = null } = opts;
    const keywords = [
      'cat', 'girl', 'boy', 'beauty', 'nature',
      'woman', 'man', 'tech', 'space'
    ];
    if (!keyword) {
      keyword = _.sample(keywords);
    }
    return fmt('https://source.unsplash.com/weekly?{0}', keyword)
  }

  // TODO: Add locale option for hashtags;
  /**
   * Create a list of hashtags (for Instagram, Twitter etc.)
   * @param opts Options
   * @param opts.quantity {number} The quantity of hashtags.
   * @param opts.category {string} Available categories: general, girls, love,
   * boys, friends, family, nature, travel, cars, sport, tumblr.
   */
  hashtags(opts = {}) {
    const { quantity = 4, category = 'general'} = opts;
    const hashtags = NETWORK.HASHTAGS[category];
    if (quantity === 1) {
      return _.sample(hashtags);
    }
    return [...Array(quantity)].map(() => (_.sample(hashtags)));
  }

  /**
   * Generate a random home page.
   * @param opts Options
   * @param opts.gender {string} Gender of author of site.
   */
  homePage(opts = {}) {
    const { gender = 'female' } = opts;
    return fmt('http://www.{0}{1}', new Personal().username({ gender }), _.sample(NETWORK.DOMAINS))
  }

  /**
   * Get a random subreddit from the list.
   * @param opts Options
   * @param opts.nsfw {boolean} NSFW subreddit.
   * @param opts.fullUrl {boolean} Full URL address
   */
  subReddit(opts = {}) {
    const { nsfw = false, fullUrl = false } = opts;
    const url = 'http://www.reddit.com';
    if (!nsfw) {
      if (!fullUrl) {
        return _.sample(NETWORK.SUBREDDITS);
      }
      return fmt('{0}{1}', url, _.sample(NETWORK.SUBREDDITS));
    }
    const nsfwSr = _.sample(NETWORK.SUBREDDITS_NSFW);
    return fullUrl ? fmt('{0}{1}', url, nsfwSr) : nsfwSr;
  }

  /**
   * Get a random user agent.
   */
  userAgent() {
    return _.sample(NETWORK.USER_AGENTS);
  }
}

/**
 * Class that provides dummy data about transport.
 */
export class Transport {

  constructor() {
    this._model = new Code().customCode;
  }

  /**
   * Generate a truck model.
   * @param opts Options
   * @param opts.modelMask {string} Mask of truck model. Here '@' is a \
   * placeholder of characters and '#' is a placeholder of digits.
   */
  truck(opts = {}) {
    const { modelMask = '#### @@'} = opts;
    return fmt('{0}-{1}', _.sample(TRANSPORT.TRUCKS), this._model({ mask: modelMask }));
  }

  /**
   * Get a random vehicle.
   */
  car() {
    return _.sample(TRANSPORT.CARS);
  }

  /**
   * Generate a dummy airplane model.
   * @param opts Options
   * @param opts.modelMask {string} Mask of airplane model. Here '@' is a \
   * placeholder of characters and '#' is a placeholder of digits.
   */
  airplane(opts = {}) {
    const { modelMask = '###' } = opts;
    return fmt('{0} {1}', _.sample(TRANSPORT.AIRPLANES), this._model({ mask: modelMask }));
  }
}

/**
 * Class that provides methods and property for generate paths.
 */
export class Path {

  constructor() {
    this._personanl = new Personal();
  };

  /**
   * Generate a root dir path.
   */
  root() {
    if (os.platform() === 'win32') {
      return 'C:\\\\';
    }
    return '/';
  }

  /**
   * Generate a home path.
   */
  home() {
    if (os.platform() === 'win32') {
      return `${this.root()}Users\\\\`
    }
    return `${this.root()}home/`
  }

  /**
   * Generate a random user.
   * @param opts Options
   * @param opts.gender {string} Gender of user.
   */
  user(opts = {}) {
    const { gender = 'female' } = opts;
    const user = this._personanl.name({ gender });
    return `${this.home()}${user}`
  }

  /**
   * Generate a random path to user's folders.
   * @param opts Options
   * @param opts.gender {string} Gender of user
   */
  usersFolder(opts = {}) {
    const { gender = 'female' } = opts;
    return path.join(this.user({ gender }), _.sample(DEVELOPMENT.FOLDERS));
  }

  /**
   * Generate a random path to development directory.
   * @param opts Options
   * @param opts.gender {string} Gender of user
   */
  devDir(opts = {}) {
    const { gender = 'female' } = opts;
    const devFolders = ['dev', 'development'];
    return path.join(
      this.user({ gender }),
      _.sample(devFolders),
      _.sample(DEVELOPMENT.PROGRAMMING_LANGS)
    )
  }

  /**
   * Generate a random path to project directory.
   * @param opts Options
   * @param opts.gender {string} Gender of user
   */
  projectDir(opts = {}) {
    const { gender = 'female' } = opts;
    return path.join(
      this.devDir({ gender }),
      _.sample(DEVELOPMENT.PROJECT_NAMES)
    );
  }
}

/**
 * 11
 */
export class UnitSystem {

  /**
   * Get a mass unit name.
   * @param opts Options
   * @param opts.symbol {boolean} Symbol of unit.
   */
  mass(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return 'gr'
    }
    return 'gram'
  }

  /**
   * @param opts Options
   * @param opts.symbol {boolean}
   */
  information(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return 'b';
    }
    return 'byte'
  }

  /**
   * Get the thermodynamic temperature unit name.
   * @param opts Options
   * @param opts.symbol {boolean} Symbol of unit.
   */
  thermodynamicTemperature(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return 'K';
    }
    return 'kelvin'
  }

  /**
   * Get unit name of amount of substance.
   * @param opts Options
   * @param opts.symbol {boolean} Symbol of unit
   */
  amountOfSubstance(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return 'mol';
    }
    return 'mole'
  }

  /**
   * Get unit name of angle.
   * @param opts Options
   * @param opts.symbol {boolean} Symbol of unit.
   */
  angle(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return 'r';
    }
    return 'radian';
  }

  /**
   * Get unit name if solid angle
   * @param opts Options
   * @param opts.symbol {boolean} Symbol of unit.
   */
  solidAngle(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return '㏛';
    }
    return 'steradian'
  }

  /**
   * Get unit name of frequency.
   * @param opts Options
   * @param opts.symbol {boolean} Symbol of unit.
   */
  frequency(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return 'Hz';
    }
    return 'hertz'
  }

  /**
   * Get unit name of force.
   * @param opts Options
   * @param opts.symbol {boolean} Symbol of unit.
   */
  force(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return 'N';
    }
    return 'newton';
  }

  /**
   * Get unit name of pressure.
   * @param opts Options
   * @param opts.symbol {boolean} Symbol of unit.
   */
  pressure(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return 'P';
    }
    return 'pascal';
  }

  /**
   * Get unit name of energy.
   * @param opts Options
   * @param opts.symbol {boolean} Symbol of unit.
   */
  energy(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return 'J';
    }
    return 'joule'
  }

  /**
   * Get unit name of power.
   * @param opts Options
   * @param opts.symbol {boolean} Symbol of unit.
   */
  power(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return 'W';
    }
    return 'watt';
  }

  /**
   * @param opts Options
   * @param opts.symbol {boolean}
   */
  flux(opts = {}) {
    const { symbol = true } = opts;
    return this.power({ symbol })
  }

  /**
   * Get unit name of electric charge.
   * @param opts Options
   * @param opts.symbol {boolean} Symbol of unit.
   */
  electricCharge(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return 'C';
    }
    return 'coulomb';
  }

  /**
   * Get unit name of voltage.
   * @param opts Options
   * @param opts.symbol {boolean} Symbol of unit;
   */
  voltage(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return 'V';
    }
    return 'volt';
  }

  /**
   * Get unit name of electric capacitance.
   * @param opts Options
   * @param opts.symbol {boolean} Symbol of unit;
   */
  electricCapacitance(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return 'F';
    }
    return 'farad';
  }

  /**
   * Get name of electric resistance.
   * @param opts Options
   * @param opts.symbol {boolean} Symbol of unit;
   */
  electricResistance(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return 'Ω';
    }
    return 'ohm';
  }

  impedance(opts = {}) {
    const { symbol = false } = opts;
    return this.electricResistance({ symbol });
  }

  reactance(opts = {}) {
    const { symbol = false } = opts;
    return this.electricResistance({ symbol });
  }

  /**
   * Get unit name of electrical conductance.
   * @param opts Options
   * @param opts.symbol {boolean} Symbol of unit.
   */
  electricalConductance(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return 'S';
    }
    return 'siemens'
  }

  /**
   * Get unit name of magnetic flux.
   * @param opts Options
   * @param opts.symbol {boolean} Symbol of unit.
   */
  magnetic_flux(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return 'Wb';
    }
    return 'weber';
  }

  /**
   * Get unit name of magnetic flux density.
   * @param opts Options
   * @param opts.symbol {boolean} Symbol of unit.
   */
  magneticFluxDensity(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return 'T';
    }
    return 'tesla';
  }

  /**
   * Get unit name of inductance.
   * @param opts Options
   * @param opts.symbol {boolean} Symbol of unit.
   */
  inductance(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return 'H';
    }
    return 'henry';
  }

  /**
   * Get unit name of temperature.
   * @param opts Options
   * @param opts.symbol {boolean} Symbol of unit.
   */
  temperature(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return '°C';
    }
    return 'Celsius';
  }

  /**
   * Get unit name of radioactivity.
   * @param opts Options
   * @param opts.symbol {boolean} Symbol of unit.
   */
  radioactivity(opts = {}) {
    const { symbol = false } = opts;
    if (symbol) {
      return 'Bq';
    }
    return 'becquerel';
  }

  /**
   * Get a random prefix for the International System of Units (SI)
   * @param opts Options
   * @param opts.sign {string} Sing of number (positive, negative);
   * @param opts.symbol {boolean} Return symbol of prefix.
   */
  prefix(opts = {}) {
    const { sign = 'positive', symbol = false } = opts;
    if (!['positive', 'negative'].includes(sign)) {
      throw new Error(`Unsupported sign. Use: 'positive' or 'negative'`);
    }
    const prefixes = symbol ?
      SCIENTIFIC.SI_PREFIXES._sym_ :
      SCIENTIFIC.SI_PREFIXES;
    return _.sample(prefixes[sign])
  }
}