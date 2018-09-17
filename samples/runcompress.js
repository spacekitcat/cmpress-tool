#!/usr/bin/env node
import compress from '../lib/compress';
import inflate from '../lib/inflate';

let dictionaryLen = 32;
let windowLen = 32;

let calculateReductionPercentage = (compressedPackets, originalInput) =>
  ((compressedPackets.length / rawInput.length) * 100).toFixed(2);

let extractCompressedPacketsTokenString = compressedPackets =>
  compressedPackets
    .map(item => {
      return item.token;
    })
    .join('');

let rawInput = process.argv[2];
if (rawInput) {
  compress(rawInput, dictionaryLen, windowLen).then(compressedPackets => {
    inflate(compressedPackets, dictionaryLen, windowLen).then(decompressed => {
      console.log(`  📥  input: ${rawInput}`);
      console.log(
        `  🙌  ratio: ${calculateReductionPercentage(
          compressedPackets,
          rawInput
        )}%`
      );
      console.log(
        `  💤  compressed: ${extractCompressedPacketsTokenString(
          compressedPackets
        )}`
      );
      console.log(`  💣  deecompressed: ${decompressed.join('')}`);
    });
  });
} else {
  console.log('No input');
}
