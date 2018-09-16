import { CompressorTransformer } from '../src/compressor-transformer';
import { Readable, Writable } from 'stream';
import fs from 'fs';

let buildTestInputStream = () => {
  let inputStream = new Readable();
  inputStream._read = () => {};
  return inputStream;
};

describe('CompressorTransformer', () => {
  it('it compresses a to a', () => {
    let inputStream = buildTestInputStream();

    let compressorTransformer = new CompressorTransformer({
      objectMode: true
    });

    inputStream.pipe(compressorTransformer);

    let outputAccumulator = [];
    compressorTransformer.on('data', compressedPacket => {
      outputAccumulator.push(compressedPacket);
    });

    compressorTransformer.on('finish', () => {
      expect(outputAccumulator).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ token: 'a', prefix: undefined })
        ])
      );
    });

    inputStream.push('a');
    inputStream.push(null);
  });
  it('it compresses aaba to aba', () => {
    let inputStream = buildTestInputStream();

    let compressorTransformer = new CompressorTransformer({
      objectMode: true
    });

    inputStream.pipe(compressorTransformer);

    let outputAccumulator = [];
    compressorTransformer.on('data', compressedPacket => {
      outputAccumulator.push(compressedPacket);
    });

    compressorTransformer.on('finish', () => {
      expect(outputAccumulator).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ token: 'a', prefix: undefined }),
          expect.objectContaining({ token: 'b', prefix: [1, 1] }),
          expect.objectContaining({ token: 'a', prefix: undefined })
        ])
      );
    });

    inputStream.push('aaba');
    inputStream.push(null);
  });

  it('it compresses aaa to aa', () => {
    let inputStream = buildTestInputStream();

    let compressorTransformer = new CompressorTransformer({
      objectMode: true
    });

    inputStream.pipe(compressorTransformer);

    let outputAccumulator = [];
    compressorTransformer.on('data', compressedPacket => {
      outputAccumulator.push(compressedPacket);
    });

    compressorTransformer.on('finish', () => {
      expect(outputAccumulator).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ token: 'a', prefix: undefined }),
          expect.objectContaining({ token: 'a', prefix: [1, 1] })
        ])
      );
    });

    inputStream.push('aaa');
    inputStream.push(null);
  });
});
