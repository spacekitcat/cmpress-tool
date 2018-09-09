require('@babel/polyfill');

import _ from 'lodash';
import console from './console';
import { SlidingWindow, deflateSlideImpl } from './sliding-window';

const inflate = stream => {
  let dictionary = '';
  let slidingWindow = new SlidingWindow(deflateSlideImpl, stream);
  stream.forEach(item => {
    dictionary += dictionary.substring(item.position, item.length) + item.token;
  });

  return dictionary;
};

export default inflate;
