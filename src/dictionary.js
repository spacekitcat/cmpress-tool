import locateToken from './locate-token';

import _ from 'lodash';

export default class Dictionary {
  constructor(initialBuffer = '', size = 4) {
    this.length = size;
    this.buffer = initialBuffer.split('');
  }

  consume(stream, take) {
    this.buffer = this.buffer.concat(_.take(stream, take));
    this.buffer = _.takeRight(this.buffer, this.length);

    return stream
      .split('')
      .slice(take, stream.length)
      .join('');
  }

  getBuffer() {
    return this.buffer.join('');
  }
}
