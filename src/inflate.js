import _ from 'lodash';
import { DecompressorTransformer } from './decompressor-transformer';
import { Readable } from 'stream';

let buildTestInputStream = () => {
  let inputStream = new Readable({ objectMode: true });
  inputStream._read = () => {};
  return inputStream;
};

const inflate = (stream, dictionarySize = 64, windowSize = 32) => {
  let compressedStream = [];
  let inputStream = buildTestInputStream();

  let decompressorTransformer = new DecompressorTransformer({
    objectMode: true
  });

  inputStream.pipe(decompressorTransformer);

  let outputAccumulator = [];
  decompressorTransformer.on('data', decompressedPacket => {
    outputAccumulator.push(decompressedPacket);
  });

  let val = new Promise((resolve, reject) => {
    decompressorTransformer.on('finish', () => {
      console.log('Inflation process complete.');
      resolve(outputAccumulator);
    });
  });

  stream.forEach(item => {
    inputStream.push(item);
  });

  inputStream.push(null);

  return val;
};

export default inflate;
