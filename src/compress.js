import _ from 'lodash';
import console from './console';
import { SlidingWindow, compressSlideImpl } from './sliding-window';

const compress = (stream, dictionarySize, windowSize) => {
  let slidingWindow = new SlidingWindow(
    compressSlideImpl,
    stream,
    dictionarySize,
    windowSize
  );
  while (slidingWindow.lookAhead()) {
    slidingWindow.slide();
  }

  let compact = slidingWindow
    .getCompressedStream()
    .map(item => item.token)
    .join('');

  console.log(compact);

  return slidingWindow.getCompressedStream();
};

export default compress;
