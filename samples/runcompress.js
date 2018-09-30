#!/usr/bin/env node
import { CompressorTransformer } from '../lib/compressor-transformer';

let rawInput = process.argv[2];
if (!rawInput) {
  console.log('No input');
  process.exit(-1);
}

let compressorTransformer = new CompressorTransformer({
  objectMode: true
});

let accumulator = '';
compressorTransformer.on('data', chunk => {
  accumulator += chunk;
});

compressorTransformer.on('finish', () => {
  let ratio = (accumulator.length / rawInput.length) * 100;
  console.log(`📥         input : ${rawInput}`);
  console.log(`💤    compressed : ${accumulator}`);
  console.log(`🙌         ratio : ${ratio}%`);
});

compressorTransformer.write(rawInput);
compressorTransformer.end();
