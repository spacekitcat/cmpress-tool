import { Transform } from 'stream';
import extractToken from './extract-token.js';
import consumeInput from './consume-input';
import deserializePacket from './deserialize-packet';

class DecompressorTransformer extends Transform {
  constructor(options) {
    super(options);
    this.historyBufferSize = 256;
    this.history_buffer = consumeInput([], this.historyBufferSize, []);
  }

  _transform(chunk, encoding, callback) {
    chunk = deserializePacket(chunk);
    if (chunk.p) {
      let result = extractToken(
        this.history_buffer.buffer,
        this.historyBufferSize,
        chunk.p[0] - 1,
        chunk.p[1]
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
        this.push(chunk.t);
      }
    } else {
      this.push(chunk.t);
    }

    this.history_buffer = consumeInput(
      this.history_buffer.buffer,
      this.historyBufferSize,
      chunk.t
    );

    callback();
  }
}

export { DecompressorTransformer };
