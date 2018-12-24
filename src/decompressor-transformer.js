import { Transform } from 'stream';
import consumeInput from './consume-input';
import deserializePacketFromBinary from './deserialize-packet-from-binary';

class DecompressorTransformer extends Transform {
  constructor(options) {
    super(options);
    this.reset();
    this.globalUnpackedCount = 0;
    this.globalChunkCounter = 0;

  }

  reset() {
    this.historyBufferSize = 255;
    this.history_buffer = consumeInput([], this.historyBufferSize, []);
    this.awaitingNextTokenRegister = true;
    this.missingPackets = 0;
    this.buffer = Buffer.from([]);
    this.lastPacketSize = 0;
    this.currentChunkPointer = 0;
    this.packets = [];
  }

  dumpTabulatedBuffer(buffer, label) {
    const rowSize = 16;
    const showLastLineCount = 16;
    console.log();
    console.log();
    console.log('☂   ☂   ☂    DATA   ☂    ☂   ☂   ☂    DUMP    ☂   ☂   ☂');
    console.log();
    console.log(label, ':');
    if (buffer.slice) {
      for (let i = 0; i < showLastLineCount; i++) {
        const nextOffset = i * rowSize;
        if (nextOffset >= buffer.length) {
          break;
        }
    
        console.log(buffer.slice(nextOffset, nextOffset + rowSize));
      }
    } else {
      console.log(buffer);
      console.log(typeof buffer);
    }
  }

  crashreport(error, chunk, currentChunkPointer) {
    console.log();
    console.log();
    console.log(' ');
    console.log(' 🔨    🤕    ⛏    IT\'s    ⛏   🤕   ⛏   RAINING    ⛏   🤕   ⛏   HAMMERS  ⛏   🤕   ⛏');
    console.log(' ');
    console.log('                       parsed token XXXXXX', this.chunk.slice(this.globalChunkCounter, this.globalChunkCounter + 2));
    console.log('                        parsed cmd XXXXXXXX', this.chunk.slice(this.globalChunkCounter+2, this.globalChunkCounter + 4).toString('hex'));
    console.log('          awtng next token regstr XXXXXXXXXX', this.awaitingNextTokenRegister);
    console.log('            current chunk uint16 XXXXXXXXXXXX', this.chunk.readUInt16LE(this.globalChunkCounter+1));
    console.log('            current chunk pointer XXXXXXXXXX', currentChunkPointer);
    console.log('              global chunk counter XXXXXXXX', this.globalChunkCounter);
    console.log('                global unpack count XXXXX', this.globalUnpackedCount);
    console.log('                    last packet size XXX', this.lastPacketSize);
    console.log('                      missing packets X', this.missingPackets);
    console.log('                            ');
    console.log(error.message);
    
    this.dumpTabulatedBuffer(this.packets, 'packets');
    this.dumpTabulatedBuffer(chunk, 'chunk');
    this.dumpTabulatedBuffer(this.history_buffer.buffer, 'history_buffer');
    
  }

  _transform(chunk, encoding, callback) {
    this.packets = [];
    this.currentChunkPointer = 0;
    this.chunk = chunk;
    while (this.currentChunkPointer < chunk.length) {
      if (this.awaitingNextTokenRegister) {
        this.missingPackets = chunk.readUInt16LE(this.currentChunkPointer);
        this.lastPacketSize = this.missingPackets;

        this.awaitingNextTokenRegister = false;
        this.currentChunkPointer += 2;
      }

      this.buffer = Buffer.concat([
        this.buffer,
        chunk.slice(this.currentChunkPointer, this.currentChunkPointer + 1)
      ]);
      this.missingPackets -= 1;
      this.currentChunkPointer += 1;

      if (this.missingPackets === 0) {
        try {
          let packet = deserializePacketFromBinary(this.buffer);
          this.packets.push(packet);
          this.awaitingNextTokenRegister = true;
          this.buffer = Buffer.from([]);
        } catch (error) {
          this.crashreport(error, chunk, this.currentChunkPointer, this.packets);
        }
      }
    }

    this.packets.forEach(packet => {
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
          this.globalUnpackedCount += result.length;
          this.push(result[i]);          
        }
        this.push(packet.t);
      } else {
        this.push(packet.t);
      }
      this.globalUnpackedCount += 1;

      this.history_buffer = consumeInput(
        this.history_buffer.buffer,
        this.historyBufferSize,
        packet.t
      );
    });

    this.globalChunkCounter += 1;
    callback();
  }
}

export { DecompressorTransformer };
