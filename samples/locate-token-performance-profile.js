#!/usr/bin/env time node --prof
import locateToken from '../lib/locate-token.js';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

let history = [];
let buffer = [];

for (let i = 0; i < 16000; ++i) {
  history.push(String.fromCharCode(Math.random() * 254));
}

for (let i = 0; i < 128; ++i) {
  buffer.push(String.fromCharCode(Math.random() * 254));
}

locateToken(history, buffer);
