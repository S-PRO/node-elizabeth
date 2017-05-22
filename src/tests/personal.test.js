import { Personal } from './../providers';
import { pull } from './../util';
import {
  GENDER_SYMBOLS,
  BLOOD_GROUPS,
  SEXUALITY_SYMBOLS,
  FAVORITE_MUSIC_GENRE,
  ENGLISH_LEVEL,
} from './../locales/int/personal';

const data = pull('personal.json', 'en');
const ruData = pull('personal.json', 'ru');

const personal = new Personal();

describe('Test personal provider', () => {

  it('should return random age', () => {
    const res = personal.age({minimum: 20, maximum: 60});
    expect(res).toBeGreaterThanOrEqual(20);
    expect(res).toBeLessThanOrEqual(60);
    expect(personal._store.age).toEqual(res);
  });

  it('should return random child count', () => {
    const personal = new Personal();
    personal._store.age = 17;
    expect(personal.childCount()).toEqual(0);
    personal._store.age = 50;
    const result = personal.childCount({ maxChildren: 10});
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(10);
  });

  it('should return random working experience', () => {
    const personal = new Personal();
    personal._store.age = 18;
    expect(personal.workExperience()).toEqual(0);
    personal._store.age = 40;
    expect(personal.workExperience({ startFrom: 30 })).toEqual(10);
  });

  it('should return random name for current locale and gender', () => {
    expect(data.names.female).toContain(personal.name());
    expect(data.names.male).toContain(personal.name({ gender: 'male' }))
  });

  it('should return random name for current locale and gender', () => {
    expect(data.surnames).toContain(personal.surname());
    expect(data.surnames).toContain(personal.surname({ gender: 'male' }));
    const personal_ = new Personal({ locale: 'ru' });
    expect(ruData.surnames.female).toContain(personal_.surname());
    expect(ruData.surnames.male).toContain(personal_.surname({ gender: 'male' }));
  });

  it('should return random title', () => {
    expect(data.title.female.typical).toContain(personal.title());
    expect(data.title.female.academic).toContain(personal.title({ titleType: 'academic' }));
    expect(data.title.male.typical).toContain(personal.title({ gender: 'male' }));
    expect(data.title.male.academic).toContain(personal.title({ gender: 'male', titleType: 'academic'}));
  });

  it('should return full name', () => {
    let [firstName, lastName] = personal.fullName().split(' ');
    expect(data.names.female).toContain(firstName);
    expect(data.surnames).toContain(lastName);
    [lastName, firstName] = personal.fullName({ reversed: true }).split(' ');
    expect(data.names.female).toContain(firstName);
    expect(data.surnames).toContain(lastName);
    [firstName, lastName] = personal.fullName({ gender: 'male' }).split(' ');
    expect(data.names.male).toContain(firstName);
    expect(data.surnames).toContain(lastName);
    [lastName, firstName] = personal.fullName({ gender: 'male', reversed: true }).split(' ');
    expect(data.names.male).toContain(firstName);
    expect(data.surnames).toContain(lastName);
  });

  // TODO: Check regexp;
  it('should return random username', () => {
    expect(personal.username()).toMatch(new RegExp(/[a-z]+?(_|-|.*)[0-9]{1,4}/g));
  });

  it('should return random email address', () => {
    expect(personal.email()).toMatch(
      new RegExp(/[a-z]+?(_|-|.*)[0-9]{1,4}\@?(@gmail.com|@yandex.com|@yahoo.com|@live.com|@outlook.com)/g)
    );
  });

  it('should return random bitcoin address', () => {
    expect(personal.bitcoin()).toMatch(new RegExp(/^([13])[A-z0-9]{33}/g));
  });

  it('should return random cvv', () => {
    const result = personal.cvv();
    expect(result).toBeGreaterThanOrEqual(100);
    expect(result).toBeLessThanOrEqual(999);
  });

  it('should return random CC number', () => {
    const visa = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$');
    const amex = new RegExp('^3[47][0-9]{13}$');
    const mastercard = new RegExp('^5[1-5][0-9]{14}$');
    expect(personal.creditCardNumber({ cardType: 'v' })).toMatch(visa);
    expect(personal.creditCardNumber({ cardType: 'a' })).toMatch(amex);
    expect(personal.creditCardNumber({ cardType: 'm' })).toMatch(mastercard);
  });

  it('should return random CC expiration date', () => {
    expect(personal.creditCardExpirationDate()).toMatch(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/);
  });

  it('should return random CID code', () => {
    const result = personal.cid();
    expect(result).toBeGreaterThanOrEqual(1000);
    expect(result).toBeLessThanOrEqual(9999);
  });

  it('should return random paypall account', () => {
    expect(personal.paypal()).toMatch(
      new RegExp(/[a-z]+?(_|-|.*)[0-9]{1,4}\@?(@gmail.com|@yandex.com|@yahoo.com|@live.com|@outlook.com)/g)
    );
  });

  it('should return random social media profile', () => {
    expect(personal.socialMediaProfile()).toMatch(
      new RegExp(/^(http:\/\/facebook.com\/|http:\/\/twitter.com\/|http:\/\/medium.com\/@)[a-z]+?(_|-|.*)[0-9]{1,4}/g)
    );
  });

  it('should return random gender', () => {
    expect([0, 1, 2, 9]).toContain(personal.gender({ iso5218: true }));
    expect(GENDER_SYMBOLS).toContain(personal.gender({ symbol: true }));
    expect(data.gender).toContain(personal.gender());
  });

  it('should return random height', () => {
    const result = personal.height({ minimum: 1, maximum: 2.5});
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(2.5);
  });

  it('should return random weight', () => {
    const result = personal.weight({ minimum: 40, maximum: 120 });
    expect(result).toBeGreaterThanOrEqual(40);
    expect(result).toBeLessThanOrEqual(120);
  });

  it('should return random blood group', () => {
    expect(BLOOD_GROUPS).toContain(personal.bloodType());
  });

  it('should return random sexual orientation', () => {
    expect(SEXUALITY_SYMBOLS).toContain(personal.sexualOrientation({ symbol: true }));
    expect(data.sexuality).toContain(personal.sexualOrientation());
  });

  it('should return random occupation', () => {
    expect(data.occupation).toContain(personal.occupation());
  });

  it('should return random political views', () => {
    expect(data.political_views).toContain(personal.politicalViews());
  });

  it('should return random world view', () => {
    expect(data.worldview).toContain(personal.worldView());
  });

  it('should return random view on', () => {
    expect(data.views_on).toContain(personal.viewOn());
  });

  it('should return random nationality', () => {
    expect(data.nationality).toContain(personal.nationality());
    const personal_ = new Personal({ locale: 'ru' });
    expect(ruData.nationality.male).toContain(personal_.nationality({ gender: 'male' }));
    expect(ruData.nationality.female).toContain(personal_.nationality());
  });

  it('should return random university', () => {
    expect(data.university).toContain(personal.university());
  });

  it('should return random academic degree', () => {
    expect(data.academic_degree).toContain(personal.academicDegree());
  });

  it('should return random language', () => {
    expect(data.language).toContain(personal.language());
  });

  it('should return random favorite movie', () => {
    expect(data.favorite_movie).toContain(personal.favoriteMovie());
  });

  it('should return random favorite music genre', () => {
    expect(FAVORITE_MUSIC_GENRE).toContain(personal.favoriteMusicGenre());
  });

  //TODO: implement personal.telephone();

  it('should return random identifier', () => {
    expect(personal.identifier()).toMatch(
      new RegExp(/[0-9]{2}-[0-9]{2}\/[0-9]{2}/g)
    )
  });

  it('should return random level of english', () => {
    expect(ENGLISH_LEVEL).toContain(personal.levelOfEnglish());
  });
});