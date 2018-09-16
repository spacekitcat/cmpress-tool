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

  next(chunk, idx) {
    return idx > chunk.length ? undefined : chunk.charAt(idx);
  }

  _transform(chunk, encoding, callback) {
    this.frontLoadBuffer(chunk, encoding);

    let idx = this.currentWindowBufferSize - 1;
    while (this.currentWindowBuffer.buffer.length > 0) {
      let nextToken = locateToken(
        this.historyBuffer.buffer.join(''),
        this.currentWindowBuffer.buffer.join('')
      );

      this.push(nextToken);

      let advanceBy = nextToken.prefix
        ? nextToken.prefix[0] + nextToken.prefix[1]
        : 1;
      for (let i = 0; i < advanceBy; ++i) {
        this.currentWindowBuffer = consumeInput(
          this.currentWindowBuffer.buffer,
          this.historyBufferSize,
          this.next(chunk.toString('utf8'), idx++)
        );
      }
      this.historyBuffer = consumeInput(
        this.historyBuffer.buffer,
        this.historyBufferSize,
        nextToken.token
      );
    }

    callback();
  }
}

export { CompressorTransformer };
