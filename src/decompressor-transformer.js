import { Transform } from 'stream';
import consumeInput from './consume-input';
import deserializePacketFromBinary from './deserialize-packet-from-binary';

class DecompressorTransformer extends Transform {
  constructor(options) {
    super(options);
    this.historyBufferSize = 512;
    this.history_buffer = consumeInput([], this.historyBufferSize, []);
    this.expectingNewToken = true;
    this.missingPackets = 0;
    this.buffer = Buffer.from([]);
    this.last_chunk = null;
  }

  _transform(chunk, encoding, callback) {
    let packets = [];
    let currentChunkPointer = 0;
    while (currentChunkPointer < chunk.length) {
      if (this.expectingNewToken) {
        this.missingPackets = chunk.readUInt8(currentChunkPointer);
        this.expectingNewToken = false;
        currentChunkPointer += 1;
      }

      if (currentChunkPointer < chunk.length) {
        this.buffer = Buffer.concat([
          this.buffer,
          chunk.slice(currentChunkPointer, currentChunkPointer + 1)
        ]);
        this.missingPackets -= 1;
        currentChunkPointer += 1;
      }

      if (this.missingPackets === 0) {
        let packet = deserializePacketFromBinary(this.buffer);
        packets.push(packet);
        this.expectingNewToken = true;
        this.buffer = Buffer.from([]);
      }
    }

    packets.forEach(packet => {
      if (packet.p) {
        let startPosition = this.history_buffer.buffer.length - (packet.p[0] - 1);
        let result = this.history_buffer.buffer.slice(
          startPosition - packet.p[1],
          startPosition
        );

        for (let i = 0; i < result.length; ++i) {
          this.history_buffer = consumeInput(
            this.history_buffer.buffer,
            this.historyBufferSize,
            result[i]
          );
          this.push(result[i]);          
        }
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

    this.last_chunk = chunk;
    callback();
  }
}

export { DecompressorTransformer };
