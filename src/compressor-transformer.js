import { Transform } from 'stream';
import { SlidingWindow } from './sliding-window.js';
import locateToken from './locate-token.js';
import serializePacketToBinary from './serialize-packet-to-binary';
import unpackIntegerByte from './unpack-integer-to-byte';

class CompressorTransformer extends Transform {
  constructor(options) {
    super(options);

    this.dictionarySize = 1024;

    if (options) {
      if (options.dictionarySize) {
        this.dictionarySize = options.dictionarySize;
      }
    }

    this.slidingWindow = new SlidingWindow(
      this.dictionarySize,
      this.dictionarySize
    );
  }

  _transform(chunk, encoding, callback) {
    this.slidingWindow.setInput(chunk);

    while (this.slidingWindow.lookAhead().length > 0) {
      let nextBytes = this.slidingWindow.slide(locateToken);
      let serialized = serializePacketToBinary(nextBytes);
      this.push(Buffer.concat([unpackIntegerByte(serialized.length, 1), serialized]));
    }

    callback();
  }
}

export { CompressorTransformer };
