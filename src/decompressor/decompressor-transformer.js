import { Transform } from 'stream';
import consumeInput from '../consume-input';
import packetFromBinary from '../serialization/packet-from-binary';
import { packetHeaderFromBinary } from '../serialization/packet-header-from-binary';

const MODE = {
  READ_HEADER: 0,
  READ_PACKET: 1
};

class DecompressorTransformer extends Transform {
  constructor(options) {
    super(options);
    this.historyBufferSize = 2600;
    this.history_buffer = consumeInput(
      Buffer.from([]),
      this.historyBufferSize,
      Buffer.from([])
    );
    this.missingPackets = 0;
    this.buffer = Buffer.from([]);
    this.headerBuffer = Buffer.from([]);
    this.mode = MODE.READ_HEADER;
  }

  expandPacket(packet) {
    if (packet.p) {
      let startPosition = this.history_buffer.buffer.length - (packet.p[0] - 1);
      let result = this.history_buffer.buffer.slice(
        startPosition - packet.p[1],
        startPosition
      );

      this.history_buffer = consumeInput(
        this.history_buffer.buffer,
        this.historyBufferSize,
        Buffer.from(result)
      );
      this.push(Buffer.from(result));
    }

    this.push(packet.t);

    this.history_buffer = consumeInput(
      this.history_buffer.buffer,
      this.historyBufferSize,
      packet.t
    );
  }

  _transform(chunk, encoding, callback) {
    let currentChunkPointer = 0;
    while (currentChunkPointer < chunk.length) {
      switch (this.mode) {
        case MODE.READ_HEADER:
          this.headerBuffer = Buffer.concat([
            this.headerBuffer,
            chunk.slice(currentChunkPointer, currentChunkPointer + 1)
          ]);

          if (packetHeaderFromBinary(this.headerBuffer).unreadByteCount > 0) {
            currentChunkPointer += 1;
          }

          if (packetHeaderFromBinary(this.headerBuffer).unreadByteCount === 0) {
            this.header = packetHeaderFromBinary(this.headerBuffer);
            this.headerBuffer = Buffer.from([]);
            this.missingPackets = this.header.size;
            this.mode = MODE.READ_PACKET;
            ++currentChunkPointer;
          }
          break;

        case MODE.READ_PACKET:
          if (currentChunkPointer < chunk.length) {
            this.buffer = Buffer.concat([
              this.buffer,
              chunk.slice(currentChunkPointer, currentChunkPointer + 1)
            ]);
            this.missingPackets -= 1;
            currentChunkPointer += 1;
          }

          if (this.missingPackets === 0) {
            let packet = packetFromBinary(this.buffer, this.header);
            this.emit('packet-unpack', {
              history_buffer: this.history_buffer,
              header: this.header,
              packet: packet,
              buffer: this.buffer
            });
            this.expandPacket(packet);
            this.buffer = Buffer.from([]);
            this.mode = MODE.READ_HEADER;
          }
          break;
      }
    }

    callback();
  }
}

export { DecompressorTransformer };
