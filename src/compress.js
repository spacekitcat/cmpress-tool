import _ from 'lodash';
import console from './console';
import { SlidingWindow, compressSlideImpl } from './sliding-window';

const compress = stream => {
  console.log('currentmethod: compress');
  let slidingWindow = new SlidingWindow(compressSlideImpl, stream);
  while (slidingWindow.lookAhead()) {
    slidingWindow.slide();
  }

  slidingWindow.getCompressedStream().forEach(item => {
    console.log(item);
  });

  return slidingWindow.getCompressedStream();
};

export default compress;
