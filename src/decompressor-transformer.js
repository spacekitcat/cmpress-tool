import { Transform } from 'stream';
import extractToken from './extract-token.js';
import consumeInput from './consume-input';
import deserializePacketFromBinary from './deserialize-packet-from-binary';

class DecompressorTransformer extends Transform {
  constructor(options) {
    super(options);
    this.historyBufferSize = 256;
    this.history_buffer = consumeInput([], this.historyBufferSize, []);
    this.expectingNewToken = true;
    this.missingPackets = 0;
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    let packets = [];
    let currentChunkPointer = 0;
    while (currentChunkPointer < chunk.length) {
      if (this.expectingNewToken) {
        this.missingPackets = parseInt(
          chunk.toString('ascii').charAt(currentChunkPointer)
        );

        this.expectingNewToken = false;
        currentChunkPointer += 1;
      }

      this.buffer += chunk.toString('ascii').charAt(currentChunkPointer);
      this.missingPackets -= 1;
      currentChunkPointer += 1;

      if (this.missingPackets === 0) {
        let packet = deserializePacketFromBinary(this.buffer);
        packets.push(packet);
        this.expectingNewToken = true;
        this.buffer = '';
      }
    }

    packets.forEach(packet => {
      if (packet.p) {
        let result = extractToken(
          this.history_buffer.buffer,
          this.historyBufferSize,
          packet.p[0] - 1,
          packet.p[1]
        );
        this.history_buffer = consumeInput(
          this.history_buffer.buffer,
          this.historyBufferSize,
          result
        );
        result.forEach(token => {
          this.push(token);
        });
        this.push(packet.t);
      } else {
        this.push(packet.t);
      }

      this.history_buffer = consumeInput(
        this.history_buffer.buffer,
        this.historyBufferSize,
        packet.t
      );
    });

    callback();
  }
}

export { DecompressorTransformer };
