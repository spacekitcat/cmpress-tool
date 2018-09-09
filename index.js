#!/usr/bin/env node
import compress from './lib/compress';
import inflate from './lib/inflate';

let rawInput = 'aabaabaab';
console.log(rawInput);
let compressPackets = compress(rawInput);
let decompressed = inflate(compressPackets);
console.log(decompressed);
