import { CompressorTransformer } from '../src/compressor-transformer';
import { Readable } from 'stream';

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

  it('compresses aaba', () => {
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
      expect(outputAccumulator).toEqual([
        { token: 'a', prefix: undefined },
        { token: 'b', prefix: [1, 1] },
        { token: 'a', prefix: undefined }
      ]);
    });

    inputStream.push('aaba');
    inputStream.push(null);
  });

  it('compresses aaaa', () => {
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
      expect(outputAccumulator).toEqual([
        { token: 'a', prefix: undefined },
        { token: 'a', prefix: [1, 1] },
        { token: 'a', prefix: undefined }
      ]);
    });

    inputStream.push('aaaa');
    inputStream.push(null);
  });

  it('compresses aaabbc', () => {
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
      expect(outputAccumulator).toEqual([
        { token: 'a', prefix: undefined },
        { token: 'a', prefix: [1, 1] },
        { token: 'b', prefix: undefined },
        { token: 'c', prefix: [1, 1] }
      ]);
    });

    inputStream.push('aaabbc');
    inputStream.push(null);
  });
});
