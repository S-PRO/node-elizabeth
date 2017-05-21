'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _providers = require('./lib/providers');

Object.keys(_providers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _providers[key];
    }
  });
});
