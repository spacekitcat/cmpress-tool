import { CompressorTransformer } from '../src/compressor-transformer';
import { Readable, Writable } from 'stream';
import fs from 'fs';

describe('CompressorTransformer', () => {
  it('wood', () => {
    let inputStream = new Readable({
      highWaterMark: 4
    });
    inputStream._read = () => {};
    let compressorTransformer = new CompressorTransformer({
      objectMode: true,
      highWaterMark: 4
    });

    let outputStream = new Writable({
      objectMode: true
    });
    outputStream._write = data => {};

    inputStream.pipe(compressorTransformer).pipe(outputStream);

    compressorTransformer.on('data', chunk => {
      console.log(chunk);
    });

    inputStream.push('aaba');
    inputStream.push(null);
  });
});
