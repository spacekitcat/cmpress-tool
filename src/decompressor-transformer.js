import { Transform } from 'stream';
import { SlidingWindow } from './sliding-window.js';
import locateToken from './locate-token.js';
import extractToken from './extract-token.js';
import consumeInput from './consume-input';

class DecompressorTransformer extends Transform {
  constructor(options) {
    super(options);
    this.historyBufferSize = 4;
    this.currentWindowBufferSize = 4;
    this.history_buffer = consumeInput([], this.historyBufferSize, []);
  }

  _transform(chunk, encoding, callback) {
    this.history_buffer = consumeInput(
      this.history_buffer.buffer,
      this.historyBufferSize,
      chunk.token
    );

    if (chunk.prefix) {
      let result = extractToken(
        this.history_buffer.buffer.join(''),
        this.historyBufferSize,
        chunk.prefix[0],
        chunk.prefix[1]
      );

      //this.push(this.history_buffer.buffer);
      if (result) {
        this.push(result);
      }
    }

    this.push(chunk.token);

    callback();

    // this.history_buffer = consumeInput(
    //   this.history_buffer.buffer,
    //   this.historyBufferSize,
    //   chunk.token
    // );

    // let uncompressedStream = chunk.toString(encoding).split('');
    // chunk.prefix === undefined ? '' : this.push(chunk.token);
  }
}

export { DecompressorTransformer };
