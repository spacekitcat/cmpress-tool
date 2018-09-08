import _ from 'lodash';
import console from './console';
import { SlidingWindow, deflateSlideImpl } from './sliding-window';

const inflate = stream => {
  let slidingWindow = new SlidingWindow(deflateSlideImpl, stream);
  stream.forEach(item => {
    console.log(item);
  });
  while (slidingWindow.lookAhead()) {
    slidingWindow.slide();
  }
  // console.log('currentmethod: inflate');
  // let slidingWindow = new SlidingWindow(deflateSlideImpl, stream);
  // while (slidingWindow.lookAhead()) {
  //   slidingWindow.slide();
  // }
  // slidingWindow.getCompressedStream().forEach(item => {
  //   console.log(item);
  // });
  // return slidingWindow.getCompressedStream();
};

export default inflate;
