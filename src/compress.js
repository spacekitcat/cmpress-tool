import _ from 'lodash';
import console from './console';
import locateToken from './locate-token';
import { SlidingWindow } from './sliding-window';

const compressSlideImpl = (lookAhead, lookBack, lookBackLength) => {
  return locateToken(lookBack, lookBackLength, lookAhead);
};

const compress = (stream, dictionarySize, windowSize) => {
  let slidingWindow = new SlidingWindow(stream, dictionarySize, windowSize);
  while (slidingWindow.lookAhead()) {
    slidingWindow.slide(compressSlideImpl);
  }

  let compact = slidingWindow
    .getCompressedStream()
    .map(item => item.token)
    .join('');

  console.log(compact);

  return slidingWindow.getCompressedStream();
};

export default compress;
