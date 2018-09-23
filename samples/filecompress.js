#!/usr/bin/env node
import { CompressorTransformer } from '../lib/compressor-transformer';

import fs from 'fs';

let dictionaryLen = 32;
let windowLen = 32;

let calculateReductionPercentage = (compressedPackets, originalInput) =>
  ((compressedPackets.length / originalInput.length) * 100).toFixed(2);

let filePath = process.argv[2];

if (!filePath) {
  console.log('No input file path specified. Please provide a file path.');
  process.exit(-1);
}

let fileReadStream = fs.createReadStream(filePath, 'utf8');

let compressorTransformer = new CompressorTransformer({
  objectMode: true
});

let fileWriteStream = fs.createWriteStream(`${filePath}.77z`);

compressorTransformer.on('data', input => {
  if (input.prefix) {
    fileWriteStream.write(
      `${input.token},${input.prefix[0]},${input.prefix[1]}\n`
    );
  } else {
    fileWriteStream.write(`${input.token}\n`);
  }
});

//compressorTransformer.pipe(process.stdout);
fileReadStream.pipe(compressorTransformer);

const progressOutput = 'Compressing file: ';
let packets = 0;
compressorTransformer.on('data', compressedPacket => {
  packets++;
  process.stdout.write(progressOutput + packets + '              \r');
});

compressorTransformer.on('end', () => {
  process.stdout.write('Compression complete.                    \n');
});
