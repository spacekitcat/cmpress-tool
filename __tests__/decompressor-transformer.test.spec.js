import { DecompressorTransformer } from '../src/decompressor-transformer';
import { Readable } from 'stream';

let buildTestInputStream = () => {
  let inputStream = new Readable({ objectMode: true });
  inputStream._read = () => {};
  return inputStream;
};

describe('DecompressorTransformer', () => {
  it('inflates aaba', () => {
    let inputStream = buildTestInputStream();

    let decompressorTransformer = new DecompressorTransformer({
      objectMode: true
    });

    inputStream.pipe(decompressorTransformer);

    let outputAccumulator = [];
    decompressorTransformer.on('data', decompressedPacket => {
      outputAccumulator.push(decompressedPacket);
    });

    decompressorTransformer.on('finish', () => {
      expect(outputAccumulator).toEqual(['a', 'a', 'b', 'a']);
    });

    inputStream.push({ token: 'a', prefix: undefined });
    inputStream.push({ token: 'b', prefix: [1, 1] });
    inputStream.push({ token: 'a', prefix: undefined });
    inputStream.push(null);
  });
});
