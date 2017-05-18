import _ from 'lodash';
import fmt from 'string-template';
import {
  pull,
  uniform,
  luhnChecksum,
  asciiLowerCase,
  asciiUpperCase,
  asciiLetters,
  digits,
} from './util';

import * as ADDRESS from './locales/int/address';
import * as BUSINESS from './locales/int/business';
import * as CODE from './locales/int/code';
import * as DATETIME from './locales/int/datetime';
import * as DECORATOR from './locales/int/decorator';
import * as DEVELOPMENT from './locales/int/development';
import * as PERSONAL from './locales/int/personal';
import * as FILE from './locales/int/file';
import * as HARDWARE from './locales/int/hardware';
import * as NETWORK from './locales/int/network';
import * as SCIENTIFIC from './locales/int/scientific';
import * as TRANSPORT from './locales/int/transport';


// TODO: IMPLEMENT;
/**
 * Provider for structured text data such as CSS, Delimited, HTML, etc.
 */
export class Structured {

  constructor(props = {}) {
    const { locale = 'en' } = props;
    this.internet = 'Internet()';
    this.text = new Text({ locale })
  }
}


export class Code {

  constructor(props = {}) {
    const { locale = 'en' } = props;
    this.locale = locale;
  }

  /**
   * Generate custom code using ascii uppercase and random integers.
   * @param mask Mask of code.
   * @param char Placeholder for characters.
   * @param digit Placeholder for digits.
   * @returns {string}
   */
  customCode(mask = '@###', char = '@', digit = '#') {
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
   */
  issn(mask = '####-####') {
    return this.customCode(mask)
  }

  /**
   * Generate ISBN for current locale. Default is ISBN 10,
   * but you also can use ISBN-13
   * @param format ISBN format.
   */
  isbn(format = 'isbn-10') {
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
   * @param format Format of EAN.
   */
  ean(format = 'ean-13') {
    const mask = format === 'ean-8' ?
      '########' :
      '#############';
    return this.customCode(mask);
  }

  // TODO: IMPROVE THIS SHIT
  /**
   * Generate a random IMEI (International Mobile Station Equipment Identity).
   */
  imei() {
    const num = _.sample(CODE.IMEI_TACS) + this.customCode('######');
    return num + luhnChecksum(num);
  }

  /**
   * Generate a random PIN code.
   * @param mask Mask for PIN code.
   */
  pin(mask = '####') {
    return this.customCode(mask);
  }
}

/**
 * Class for generate text data, i.e text, lorem ipsum and another.
 */
export class Text {

  constructor(props) {
    this.locale = props.locale;
    this.data = pull('text.json', props.locale);
  }

  /**
   * Get an alphabet for current locale.
   * @param letterCase
   */
  alphabet(letterCase = 'uppercase') {
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
   * @param quantity Quantity of sentences.
   */
  text(quantity = 5) {
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
   * @param quantity Quantity of words. Default is 5.
   */
  words(quantity = 5) {
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
   * @returns {*}
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

  constructor(props) {
    this.locale = props.locale;
    this.data = pull('address.json', props.locale);
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
   * @param abbr If True then return ISO (ISO 3166-2)
   * code of state/region/province/subject.
   */
  state(abbr = false) {
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
   * @param format Format of code (iso2, iso3, numeric).
   * @returns {*}
   */
  countryISO(format = 'iso2') {
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
   code (code in international format)
   * @param code
   */
  continent(code = false) {
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

  constructor(props) {
    this.locale = props.locale;
    this.data = pull('business.json', props.locale);
  }

  /**
   * Get a random type of business entity.
   * @param abbr If True then return abbreviated company type.
   */
  companyType(abbr = false) {
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
  price(minimum = 10, maximum = 1000) {
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

  constructor(props) {
    this.locale = props.locale;
    this.data = pull('personal.json', props.locale);
    this.userNames = pull('personal.json', 'en').names;
    this._store = {
      age: 0,
    };
    this.customCode = new Code({ locale: 'en' }).customCode;
  }

  /**
   * Get a random integer value.
   */
  age(minimum = 16, maximum = 66) {
    const num = _.random(minimum, maximum);
    this._store.age = num;
    return num
  }

  /**
   * Get a count of child's. Depend on previous generated age.
   * @param maxChildren Maximum count of child's.
   */
  childCount(maxChildren = 5) {
    const age = this._store.age || this.age();
    return age < 18 ? 0 : _.random(0, maxChildren);
  }

  // TODO: Fix negative exp;
  /**
   * Get a work experience. Depend on previous generated age.
   * @param startFrom Age then person start to work.
   */
  workExperience(startFrom = 22) {
    const age = this._store.age || this.age();
    return age - startFrom || 0;
  }

  /**
   * Get a random name.
   * @param gender
   */
  name(gender = 'female') {
    return _.sample(this.data.names[gender])
  }

  /**
   * Get a random surname.
   * @param gender
   */
  surname(gender = 'female') {
    if (['ru', 'is', 'uk'].includes(this.locale)) {
      return _.sample(this.data.surnames[gender]);
    }
    return _.sample(this.data.surnames)
  }

  /**
   * Get a random title (prefix/suffix) for name.
   * @param gender
   * @param titleType The type of title ('typical' and 'academic').
   */
  title(gender = 'female', titleType = 'typical') {
    return _.sample(this.data.title[gender][titleType])
  }

  /**
   * Generate a random full name.
   * @param gender
   * @param reversed if true: surname/name else name/surname
   * @returns {*}
   */
  fullName(gender = 'female', reversed = false) {
    const string = reversed ? '{1} {0}' : '{0} {1}';
    return fmt(string, this.name(gender), this.surname(gender));
  }

  // TODO: username in lowercase;
  /**
   * Get a random username with digits. Username generated
   * from names (en) for all locales.
   * @param gender
   * @returns {*}
   */
  username(gender = 'female') {
    const formats = ['{0}{1}', '{0}_{1}', '{0}-{1}'];
    return fmt(
      _.sample(formats), _.sample(this.userNames[gender]), _.random(1, 9999)
    );
  };

  // TODO: implement password; https://github.com/lk-geimfari/elizabeth/blob/master/elizabeth/core/providers.py#L1009

  /**
   * Generate a random email.
   * @param gender
   * @param domains
   */
  email(gender = 'female', domains = NETWORK.EMAIL_DOMAINS) {
    return `${this.username(gender)}${_.sample(domains)}`
  };

  // TODO: Refactor this shit
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

  // TODO: Implement
  creditCardNumber() {}

  /**
   * Generate a random expiration date for credit card.
   * @param minimum Date of issue.
   * @param maximum Maximum of expiration_date.
   * @returns {string}
   */
  creditCardExpirationDate(minimum = 16, maximum = 25) {
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

  /**
   * Generate profile for random social network.
   * @param gender Gender of user.
   */
  socialMediaProfile(gender = 'female') {
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
   * @param iso5218
   * @param symbol
   */
  gender(iso5218 = false, symbol = false) {
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
   * @returns {*}
   */
  height(minimum = 1.5, maximum = 2) {
    return uniform(minimum, maximum, 2)
  }

  /**
   * Generate a random weight in Kg.
   * @returns {*}
   */
  weight(minimum = 38, maximum = 90) {
    return uniform(minimum, maximum, 2)
  }

  /**
   * Get a random blood type.
   * @returns {*}
   */
  bloodType() {
    return _.sample(PERSONAL.BLOOD_GROUPS);
  }

  /**
   * Get a random (LOL) sexual orientation.
   * @param symbol Unicode symbol.
   */
  sexualOrientation(symbol = false) {
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
   * @param gender
   */
  nationality(gender = 'female') {
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

  // TODO: Implement after password
  /**
   * Generate a random avatar (link to avatar) using API of  Adorable.io.
   *
   */
  avatar(opts = {}) {
    const { size = 256 } = opts;

  }

  /**
   * Generate a random identifier by mask. With this method you can generate
   * any identifiers that you need. Simply select the mask that you need.
   * @param opts
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
   * @param opts Method options
   * @param opts.fileType File type (source, text, data, audio, video, image,
   * executable, compressed).
   */
  extension(opts = {}) {
    const { fileType = 'text' } = opts;
    return _.sample(FILE.EXTENSIONS[fileType]);
  }

  /**
   * Get a random mime type from list.
   * @param opts Method options
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
   * @param opts Method options
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
   * @param opts Method options
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

  // TODO: Check options
  /**
   * Get a random generation.
   * @param opts
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

const address = new Hardware({ locale: 'ru'});
console.log(address.ssdOrHdd({ noSQL: true}))