import _ from 'lodash';
import locateToken from './locate-token';
import { SlidingWindow } from './sliding-window';

const compress = (stream, dictionarySize = 64, windowSize = 32) => {
  let uncompressedStream = stream.split('');
  let compressedStream = [];

  let slidingWindow = new SlidingWindow(
    uncompressedStream,
    dictionarySize,
    windowSize,
    {
      read: n => stream.split('')
    }
  );
  while (slidingWindow.lookAhead().length > 0) {
    compressedStream.push(slidingWindow.slide(locateToken));
  }

  return compressedStream;
};

export default compress;
