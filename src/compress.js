import _ from 'lodash';
import console from './console';
import locateToken from './locate-token';
import { SlidingWindow } from './sliding-window';

const compressSlideImpl = (lookAhead, lookBack, lookBackLength) => {
  return locateToken(lookBack, lookBackLength, lookAhead);
};

const compress = (stream, dictionarySize, windowSize) => {
  let compressedStream = [];

  let slidingWindow = new SlidingWindow(stream, dictionarySize, windowSize);
  while (slidingWindow.lookAhead()) {
    compressedStream.push(slidingWindow.slide(compressSlideImpl));
  }

  let compact = compressedStream.map(item => item.token).join('');

  console.log(compact);

  return compressedStream;
};

export default compress;
