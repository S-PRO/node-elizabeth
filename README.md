![logo](logo.png)

[![NPM](https://nodei.co/npm/node-elizabeth.png)](https://npmjs.org/package/node-elizabeth)

[![Build Status](https://travis-ci.org/S-PRO/node-elizabeth.svg?branch=master)](https://travis-ci.org/S-PRO/node-elizabeth)
[![Coverage Status](https://coveralls.io/repos/github/S-PRO/node-elizabeth/badge.svg?branch=master)](https://coveralls.io/github/S-PRO/node-elizabeth?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/13b3096bd026452a9b856c5bab8fb2a5)](https://www.codacy.com/app/aybb/node-elizabeth_2?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=S-PRO/node-elizabeth&amp;utm_campaign=Badge_Grade)

Description
===========
node-elizabeth is a port of Python library
[elizabeth](https://github.com/lk-geimfari/elizabeth) for
generating dummy data for a variety of purposes.
This data can be particularly useful during
software development and testing.
For example, it could be used to populate
a testing database for a web application
with user information such as email
addresses, usernames, first names, last names, etc.

Installation
============
`yarn add node-elizabeth -D`

Documentation
=============
[Github pages](https://s-pro.github.io/node-elizabeth/)

Basic Usage
===========

```javascript
import { Personal } from 'node-elizabeth';
// default locale is 'en'
const person = new Personal();
person.fullName({ gender: 'male' });
// Inell Britt
```

Locales
=======
You can specify a locale when creating providers and
they will return data that is appropriate for
the language or country associated
with that locale. `elizabeth` currently includes support
for 30 different locales.

| №  | Flag  | Code       | Name                 | Native name |
|--- |---   |---       |---                 |---         |
| 1  | 🇨🇿   |  `cs`      | Czech                | Česky       |
| 2  | 🇩🇰   |  `da`      | Danish               | Dansk       |
| 3  | 🇩🇪   |  `de`      | German               | Deutsch     |
| 4  | 🇦🇹   |  `de-at`   | Austrian German      | Deutsch     |
| 5  | 🇨🇭   |  `de-ch`   | Swiss German         | Deutsch     |
| 6  | 🇺🇸   |  `en`      | English              | English     |
| 7  | 🇦🇺   |  `en-au`   | Australian English   | English     |
| 8  | 🇨🇦   |  `en-ca`   | Canadian English     | English     |
| 9  | 🇬🇧   |  `en-gb`   | British English      | English     |
| 10 | 🇪🇸   |  `es`      | Spanish              | Español     |
| 11 | 🇲🇽   |  `es-mx`   | Mexican Spanish      | Español     |
| 12 | 🇮🇷   |  `fa`      | Farsi                |      فارسی  |
| 13 | 🇫🇮   |  `fi`      | Finnish              | Suomi       |
| 14 | 🇫🇷   |  `fr`      | French               | Français    |
| 15 | 🇭🇺   |  `hu`      | Hungarian            | Magyar      |
| 16 | 🇮🇸   |  `is`      | Icelandic            | Íslenska    |
| 17 | 🇮🇹   |  `it`      | Italian              | Italiano    |
| 18 | 🇯🇵   |  `ja`      | Japanese             | 日本語       |
| 19 | 🇰🇷   |  `ko`      | Korean               | 한국어       |
| 20 | 🇳🇱   |  `nl`      | Dutch                | Nederlands  |
| 21 | 🇧🇪   |  `nl-be`   | Belgium Dutch        | Nederlands  |
| 22 | 🇳🇴   |  `no`      | Norwegian            | Norsk       |
| 23 | 🇵🇱   |  `pl`      | Polish               | Polski      |
| 24 | 🇵🇹   |  `pt`      | Portuguese           | Português   |
| 25 | 🇧🇷   |  `pt-br`   | Brazilian Portuguese | Português Brasileiro |
| 26 | 🇷🇺   |  `ru`      | Russian              | Русский     |
| 27 | 🇸🇪   |  `sv`      | Swedish              | Svenska     |
| 28 | 🇹🇷   |  `tr`      | Turkish              | Türkçe      |
| 29 | 🇺🇦   |  `uk`      | Ukrainian            | Український |
| 30 | 🇨🇳   |  `zh`      | Chinese              | 汉语         |


Using locales:
```javascript
import { Personal } from 'node-elizabeth';

const en = new Personal();
const de = new Personal({ locale: 'de' });

en.fullName();
// Inell Britt
de.fullName();
//Sabrina Gutermuth
```

Port limitations
================
Due to JavaScript limitations there's specific method signatures -
all methods take `opts` object as their single argument.
Also first release don't include all the providers,
custom providers and decorators from original library.

Running tests
=============
`npm run test`

Upcoming
========
* `Generic` provider from original library
* Custom providers


