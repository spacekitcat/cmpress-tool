import { CompressorTransformer } from '../src/compressor-transformer';
import { Readable } from 'stream';

let buildTestInputStream = (options = {}) => {
  let inputStream = new Readable(options);
  inputStream._read = () => {};
  inputStream.setEncoding('utf8');
  return inputStream;
};

describe('CompressorTransformer', () => {
  it('compresses a to a', () => {
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

    inputStream.push('a', 'utf8');
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

    inputStream.push('aaba', 'utf8');
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

    inputStream.push('aaaa', 'utf8');
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

    inputStream.push('aaabbc', 'utf8');
    inputStream.push(null);
  });

  describe('where the stream transform involves multiple calls', () => {
    /** The sliding window need to maintain state between 'chunks' (the argument passed to the transformer) */
    it('does not reset the sliding window', () => {
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
          { token: 'a', prefix: [1, 1] }
        ]);
      });

      inputStream.push('aaaaa', 'utf8');
      inputStream.push('aa', 'utf8');

      inputStream.push(null);
    });
  });
});
