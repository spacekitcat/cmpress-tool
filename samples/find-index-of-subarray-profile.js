#!/usr/bin/env time node --prof
import findIndexOfSubarray from '../lib/find-index-of-subarray.js';

let history = [];
let buffer = [];

for (let i = 0; i < 1600000; ++i) {
  history.push(String.fromCharCode(Math.random() * 254));
}

for (let i = 0; i < 12800; ++i) {
  buffer.push(String.fromCharCode(Math.random() * 254));
}

findIndexOfSubarray(history, buffer);
