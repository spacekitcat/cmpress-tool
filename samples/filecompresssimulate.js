#!/usr/bin/env node
import { CompressorTransformer } from '../lib/compressor-transformer';

import fs from 'fs';

let dictionaryLen = 32;
let windowLen = 32;

let calculateReductionPercentage = (compressedPackets, originalInput) =>
  ((compressedPackets.length / originalInput.length) * 100).toFixed(2);

let extractCompressedPacketsTokenString = compressedPackets =>
  compressedPackets
    .map(item => {
      return item.token;
    })
    .join('');

let filePath = process.argv[2];

if (!filePath) {
  console.log('No input file path specified. Please provide a file path.');
  process.exit(-1);
}

let fileReadStream = fs.createReadStream(filePath, 'utf8');
let data = '';

let compressorTransformer = new CompressorTransformer({
  objectMode: true
});

let rawBytes;
fileReadStream.on('data', input => {
  rawBytes += input;
});

fileReadStream.pipe(compressorTransformer);

let outputAccumulator = [];
let alt = 0;
compressorTransformer.on('data', compressedPacket => {
  if (alt >= 10000) {
    alt = 0;
  } else if (alt >= 5000) {
    process.stdout.write(
      '   ->MUST<-   ->COMPRESS<-   ' +
        `${outputAccumulator.length} ${rawBytes.length}` +
        '    🦊  🦊  🦊  🦊  🦊  🦊  🦊  🦊  🦊  🦊  🦊  🦊  🦊  🦊  🦊  🦊  🦊  🦊  🦊  🦊  🦊' +
        ' \r'
    );
    alt++;
  } else {
    process.stdout.write(
      '   ->MUST<-   ->COMPRESS<-   ' +
        `${outputAccumulator.length} ${rawBytes.length}` +
        '      🐱  🐱  🐱  🐱  🐱  🐱  🐱  🐱  🐱  🐱  🐱  🐱  🐱  🐱  🐱  🐱  🐱  🐱  🐱  🐱 ' +
        ' \r'
    );
    alt++;
  }
  outputAccumulator.push(compressedPacket);
});

compressorTransformer.on('end', () => {
  process.stdout.write(
    '   ->MUST<-   ->COMPRESS<-   ' +
      `${outputAccumulator.length} ${rawBytes.length}` +
      '' +
      '\n'
  );

  outputAccumulator.forEach(item => {
    console.log(item);
  });
});

fileReadStream
  .on('data', function(chunk) {
    data += chunk;
  })
  .on('end', function() {
    //console.log(data);
  });
