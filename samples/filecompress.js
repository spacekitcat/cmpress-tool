#!/usr/bin/env node
import { CompressorTransformer } from '../lib/compressor-transformer';
import { DecompressorTransformer } from '../lib/decompressor-transformer';

import fs from 'fs';

let filePath = process.argv[2];

if (!filePath) {
  console.log('No input file path specified. Please provide a file path.');
  process.exit(-1);
}

let fileReadStream = fs.createReadStream(filePath);
let fileWriteStream = fs.createWriteStream(`${filePath}.bzz`);

let compressorTransformer = new CompressorTransformer();

let accumulator = Buffer.from([]);
compressorTransformer.on('data', chunk => {
  accumulator = Buffer.concat([accumulator, chunk]);
});

compressorTransformer.on('finish', () => {
  console.log(`I compressed the heck outta ${filePath}`);
});

fileReadStream.pipe(compressorTransformer).pipe(fileWriteStream);
