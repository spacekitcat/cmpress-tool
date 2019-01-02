import { Transform } from 'stream';
import consumeInput from './consume-input';
import deserializePacketFromBinary from './serialization/deserialize-packet-from-binary';
import { packetHeaderFromBinary, packetHeaderSizeFieldWidth } from './serialization/packet-header-from-binary';

class DecompressorTransformer extends Transform {
  constructor(options) {
    super(options);
    this.historyBufferSize = 2600;
    this.history_buffer = consumeInput([], this.historyBufferSize, []);
    this.expectingNewToken = true;
    this.missingPackets = 0;
    this.buffer = Buffer.from([]);
    this.headerBuffer = Buffer.from([]);
  }

  expandPacket(packet) {
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
  }

  _transform(chunk, encoding, callback) {
    let currentChunkPointer = 0;
    while (currentChunkPointer < chunk.length) {
      if (this.expectingNewToken) {
        this.missingHeaderBytes = packetHeaderSizeFieldWidth(currentChunkPointer) + 1;
        this.expectingNewToken = false;
      }
      
      if (this.missingHeaderBytes > 0) {
        this.headerBuffer = Buffer.concat([
          this.headerBuffer,
          chunk.slice(currentChunkPointer, currentChunkPointer + 1)
        ]);
        currentChunkPointer += 1;
        this.missingHeaderBytes -= 1;
      
        if (this.missingHeaderBytes === 0) {
          this.header = packetHeaderFromBinary(this.headerBuffer);
          this.headerBuffer = Buffer.from([]);
          this.missingPackets = this.header.size;
        } else {
          continue;
        }
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
        let packet = deserializePacketFromBinary(this.buffer, this.header);
        this.expandPacket(packet);
        this.expectingNewToken = true;
        this.buffer = Buffer.from([]);
      }
    }

    callback();
  }
}

export { DecompressorTransformer };
