import { Transform } from 'stream';
import BSON from 'bson';
import { SlidingWindow } from './sliding-window.js';
import locateToken from './locate-token.js';

class CompressorTransformer extends Transform {
  constructor(options) {
    super(options);

    this.historyBufferSize = 256;
    this.currentBufferSize = 256;
    // this.setDefaultEncoding('utf8');
    if (options) {
      if (options.historyBufferSize) {
        this.historyBufferSize = options.historyBufferSize;
      }

      if (options.currentBufferSize) {
        this.currentBufferSize = options.currentBufferSize;
      }
    }

    this.slidingWindow = new SlidingWindow(
      this.historyBufferSize,
      this.currentBufferSize
    );

    this.bson = new BSON();
  }

  _transform(chunk, encoding, callback) {
    this.slidingWindow.setInput(chunk);

    while (this.slidingWindow.lookAhead().length > 0) {
      let nextBytes = Buffer.from(this.bson.serialize(this.slidingWindow.slide(locateToken))).toString('ucs2');
      if (nextBytes) {
        this.push(nextBytes);
      }
    }

    callback();
  }
}

export { CompressorTransformer };
