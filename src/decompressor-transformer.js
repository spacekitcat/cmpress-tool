import { Transform } from 'stream';
import extractToken from './extract-token.js';
import consumeInput from './consume-input';

class DecompressorTransformer extends Transform {
  constructor(options) {
    super(options);
    this.historyBufferSize = 32;
    this.currentWindowBufferSize = 32;
    this.history_buffer = consumeInput([], this.historyBufferSize, []);
  }

  _transform(chunk, encoding, callback) {
    if (chunk.prefix) {
      let result = extractToken(
        this.history_buffer.buffer,
        this.historyBufferSize,
        chunk.prefix[0] - 1,
        chunk.prefix[1]
      );

      if (result) {
        this.history_buffer = consumeInput(
          this.history_buffer.buffer,
          this.historyBufferSize,
          result
        );
        result.forEach(token => {
          if (token) {
            this.push(token);
          }
        });
        this.push(chunk.token);
      }
    } else {
      this.push(chunk.token);
    }

    this.history_buffer = consumeInput(
      this.history_buffer.buffer,
      this.historyBufferSize,
      chunk.token
    );

    callback();
  }
}

export { DecompressorTransformer };
