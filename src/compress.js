import _ from 'lodash';
import { CompressorTransformer } from './compressor-transformer';
import { Readable } from 'stream';

const compress = (stream, dictionarySize = 64, windowSize = 32) => {
  let compressedStream = [];

  let inputStream = new Readable();
  inputStream._read = () => {};

  let compressorTransformer = new CompressorTransformer({
    objectMode: true
  });

  inputStream.pipe(compressorTransformer);

  compressorTransformer.on('data', compressedPacket => {
    console.log(compressedPacket);
    compressedStream.push(compressedPacket);
  });

  let val = new Promise((resolve, reject) => {
    compressorTransformer.on('finish', () => {
      console.log('Compression process complete.');
      resolve(compressedStream);
    });
  });

  inputStream.push(stream);
  inputStream.push(null);

  return val;
};

export default compress;
