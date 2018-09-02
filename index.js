#!/usr/bin/env node
const compress = require('./src/compress');

require('cli').withInput(function(line, newline, eof) {
  if (!eof) {
    this.output(line + newline);
  }
});
