import { Transform } from 'stream';
import extractToken from './extract-token.js';
import consumeInput from './consume-input';
import BSON from 'bson';

class DecompressorTransformer extends Transform {
  constructor(options) {
    super(options);
    this.historyBufferSize = 256;
    this.history_buffer = consumeInput([], this.historyBufferSize, []);
    this.bson = new BSON();
  }

  decodeCompressionPacket(packet) {
    return this.bson.deserialize(Buffer.from(packet.toString('utf8'), 'ucs2'));
  }

  _transform(chunk, encoding, callback) {
    chunk = this.decodeCompressionPacket(chunk);
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
