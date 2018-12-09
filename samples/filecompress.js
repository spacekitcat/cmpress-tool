#!/usr/bin/env node
import { CompressorTransformer } from '../lib/compressor-transformer';
import deserializePacketFromBinary from '../lib/deserialize-packet-from-binary';

import fs from 'fs';

let filePath = process.argv[2];

if (!filePath) {
  console.log('No input file path specified. Please provide a file path.');
  process.exit(-1);
}

let fileReadStream = fs.createReadStream(filePath, 'UTF-8');

let compressorTransformer = new CompressorTransformer();

compressorTransformer.on('data', (data) => {
  console.log(`${deserializePacketFromBinary(data)}`);
});

let fileWriteStream = fs.createWriteStream(filePath + '.bzz', 'UTF-8');
fileReadStream.pipe(compressorTransformer).pipe(fileWriteStream);
