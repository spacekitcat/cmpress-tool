#!/usr/bin/env node
const compress = require('./lib/compress');

require('cli').withInput(function(lines, newline) {
  this.output(compress('aabaabaab'));
});
