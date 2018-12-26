#!/usr/bin/env time node --prof
import findIndexOfSubarray from '../lib/find-index-of-subarray.js';

let history = [];
let buffer = [];

for (let i = 0; i < 160000; ++i) {
  history.push(String.fromCharCode(Math.random() * 254));
}

for (let i = 0; i < 1280; ++i) {
  buffer.push(String.fromCharCode(Math.random() * 254));
}

findIndexOfSubarray(history, buffer);
