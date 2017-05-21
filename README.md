Description
===========
node-elizabeth is a port of Python library for
generating dummy data for a variety of purposes.
This data can be particularly useful during
software development and testing.
For example, it could be used to populate
a testing database for a web application
with user information such as email
addresses, usernames, first names, last names, etc.

Installation
============
```$~ yarn add node-elizabeth -D```

Basic Usage
===========

```javascript
import { Personal } from 'node-elizabeth';
// default locale is 'en'
const person = new Personal();
const fullName = person.fullName({ gender: 'male' });
// Antonetta Garrison
