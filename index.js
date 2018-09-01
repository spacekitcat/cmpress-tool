#!/usr/bin/env node
const compress = require('./src/compress');

require('cli').withStdinLines(function(lines, newline) {
  this.output(lines.sort().join(newline));
});
