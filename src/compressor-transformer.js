import { Transform } from 'stream';
import consumeInput from './consume-input.js';
import { SlidingWindow } from './sliding-window.js';
import locateToken from './locate-token.js';

class CompressorTransformer extends Transform {
  constructor(options) {
    super(options);
    this.historyBufferSize = 4;
    this.currentWindowBufferSize = 4;
    this.historyBuffer = consumeInput([], this.historyBufferSize, []);
    this.currentWindowBuffer = consumeInput(
      [],
      this.currentWindowBufferSize,
      []
    );
  }

  frontLoadBuffer(chunk, encoding) {
    let idx = 0;
    while (idx < chunk.length) {
      this.currentWindowBuffer = consumeInput(
        this.currentWindowBuffer.buffer,
        this.historyBufferSize,
        chunk.toString('utf8').charAt([idx])
      );

      ++idx;
    }
  }

  _transform(chunk, encoding, callback) {
    this.frontLoadBuffer(chunk, encoding);

    let stop = 0;
    let index = this.currentWindowBufferSize;

    let uncompressedStream = chunk.toString('utf8').split('');
    let compressedStream = [];

    let slidingWindow = new SlidingWindow(
      { read: n => uncompressedStream },
      4,
      4
    );
    while (slidingWindow.lookAhead().length > 0) {
      this.push(slidingWindow.slide(locateToken));
    }

    callback();
  }
}

export { CompressorTransformer };
