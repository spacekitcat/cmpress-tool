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
        this.missingPackets = chunk[currentChunkPointer++] - 1;
        this.expectingNewToken = false;
      }

      if (this.missingPackets === 0) {
        packets.push(deserializePacketFromBinary(this.buffer));
        this.expectingNewToken = true;
      } else {
        ++currentChunkPointer;
        this.buffer += chunk[currentChunkPointer];
      }
    }

    packets.forEach(packet => {
      this.push(packets);
    });
    //   let result = extractToken(
    //     this.history_buffer.buffer,
    //     this.historyBufferSize,
    //     chunk.p[0] - 1,
    //     chunk.p[1]
    //   );
    //   if (result) {
    //     this.history_buffer = consumeInput(
    //       this.history_buffer.buffer,
    //       this.historyBufferSize,
    //       result
    //     );
    //     result.forEach(token => {
    //       if (token) {
    //         this.push(token);
    //       }
    //     });
    //     this.push(chunk.t);
    //   }
    // } else {
    //   this.push(chunk.t);
    // }

    // this.history_buffer = consumeInput(
    //   this.history_buffer.buffer,
    //   this.historyBufferSize,
    //   chunk.t
    // );

    callback();
  }
}

export { DecompressorTransformer };
