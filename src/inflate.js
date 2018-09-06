import _ from 'lodash';
import console from './console';

const inflate = input => {
  console.log('currentmethod: inflate');
  input.forEach(item => {
    console.log(item.symbol);
  });
  return input;
};

export default inflate;
