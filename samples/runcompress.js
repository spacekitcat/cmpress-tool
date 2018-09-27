#!/usr/bin/env node
import compress from '../lib/compress';
import inflate from '../lib/inflate';

const { StringDecoder } = require('string_decoder');

let dictionaryLen = 32;
let windowLen = 32;

let calculateReductionPercentage = (compressedPackets, originalInput) =>
  ((compressedPackets.length / rawInput.length) * 100).toFixed(2);

let extractCompressedPacketsTokenString = compressedPackets =>
  compressedPackets.map(item => item.token);

let hexArrayToString = hexArray =>
  hexArray
    .map(item => {
      if (item) return Buffer.from(item, 'hex').toString('utf8');
    })
    .join('');

let rawInput = process.argv[2];
if (rawInput) {
  compress(rawInput, dictionaryLen, windowLen).then(compressedPackets => {
    inflate(compressedPackets, dictionaryLen, windowLen).then(decompressed => {
      console.log(`  📥  input:       ${rawInput}`);
      console.log(
        `  🙌  ratio:       ${calculateReductionPercentage(
          compressedPackets,
          rawInput
        )}%`
      );
      console.log(
        `  💤  compressed:  ${extractCompressedPacketsTokenString(
          compressedPackets
        )}`
      );
      console.log(`  💣  inflated:    ${hexArrayToString(decompressed)}`);
    });
  });
} else {
  console.log('No input');
}
