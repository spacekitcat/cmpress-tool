import _ from 'lodash';
import locateToken from './locate-token';
import { SlidingWindow } from './sliding-window';

const compressSlideImpl = (lookAhead, lookBack) => {
  return locateToken(lookBack, lookAhead);
};

const compress = (stream, dictionarySize = 64, windowSize = 32) => {
  let compressedStream = [];

  let slidingWindow = new SlidingWindow(stream, dictionarySize, windowSize);
  while (slidingWindow.lookAhead()) {
    compressedStream.push(slidingWindow.slide(compressSlideImpl));
  }

  return compressedStream;
};

export default compress;
