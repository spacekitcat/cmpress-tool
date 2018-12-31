#!/usr/bin/env time node --prof
import { CompressorTransformer } from '../lib/compressor-transformer';
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

compressorTransformer.on('end', () => {
  console.log(`I compressed the devil outta ${filePath}`);
  const statsBefore = fs.statSync(filePath);
  const statsAfter = fs.statSync(`${filePath}.bzz`);
  console.log();
  console.log(`    Input size: ${statsBefore.size}`);
  console.log(`    Ouput size: ${statsAfter.size}`);
  console.log(`    IO   ratio: ${statsAfter.size / statsBefore.size}`)
  console.log();
});

fileReadStream.pipe(compressorTransformer).pipe(fileWriteStream);
