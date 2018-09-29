import { Transform } from 'stream';
import { SlidingWindow } from './sliding-window.js';
import locateToken from './locate-token.js';

class CompressorTransformer extends Transform {
  constructor(options) {
    super(options);

    this.historyBufferSize = 256;
    this.currentBufferSize = 256;

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
  }

  _transform(chunk, encoding, callback) {
    this.slidingWindow.setInput(chunk);

    while (this.slidingWindow.lookAhead().length > 0) {
      let nextBytes = this.slidingWindow.slide(locateToken);
      if (nextBytes) {
        this.push(nextBytes);
      }
    }

    callback();
  }
}

export { CompressorTransformer };
