#!/usr/bin/env node
import { CompressorTransformer } from '../lib/compressor-transformer';
import { DecompressorTransformer } from '../lib/decompressor-transformer';

let rawInput = process.argv[2];
if (!rawInput) {
  console.log('No input');
  process.exit(-1);
}

let compressorTransformer = new CompressorTransformer();
let decompressorTransformer = new DecompressorTransformer();

let accumulator = Buffer.from([]);
compressorTransformer.on('data', chunk => {
  console.log(chunk);
  accumulator = Buffer.concat([accumulator, chunk]);
});

compressorTransformer.on('finish', () => {
  let ratio = (accumulator.length / rawInput.length) * 100;
  console.log(`📥         input : ${rawInput}`);
  console.log(`💤    compressed : ${accumulator}`);
  console.log(`🙌         ratio : ${ratio}%`);
});

let deaccumulator = Buffer.from([]);
decompressorTransformer.on('data', chunk => {
  deaccumulator = Buffer.concat([deaccumulator, chunk]);
});

decompressorTransformer.on('finish', () => {
  let ratio = (deaccumulator.length / accumulator.length) * 100;
  console.log();
  console.log(`📥         input : ${accumulator}`);
  console.log(`💤  decompressed : ${deaccumulator}`);
  console.log(`🙌         ratio : ${ratio}%`);
});

compressorTransformer.pipe(decompressorTransformer);
compressorTransformer.write(rawInput);
compressorTransformer.end();
