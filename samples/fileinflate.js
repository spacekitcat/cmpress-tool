#!/usr/bin/env node
import { DecompressorTransformer } from '../lib/decompressor-transformer';

import fs from 'fs';

let filePath = process.argv[2];

if (!filePath) {
  console.log('No input file path specified. Please provide a file path.');
  process.exit(-1);
}

let fileReadStream = fs.createReadStream(filePath);

let compressorTransformer = new DecompressorTransformer();
let fileWriteStream = fs.createWriteStream(filePath + '.inflate');
fileReadStream.pipe(compressorTransformer).pipe(fileWriteStream);
