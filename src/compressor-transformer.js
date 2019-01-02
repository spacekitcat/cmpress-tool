import { Transform } from 'stream';
import { SlidingWindow } from './sliding-window.js';
import locateToken from './locate-token.js';
import serializePacketToBinary from './serialization/serialize-packet-to-binary';
import packetHeaderToBinary from './serialization/packet-header-to-binary';

class CompressorTransformer extends Transform {
  constructor(options) {
    super(options);

    this.dictionarySize = 2600;

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
      this.push(Buffer.concat([packetHeaderToBinary({size: serialized.length, hasPrefix: nextBytes.p !== undefined}), serialized]));
    }

    callback();
  }
}

export { CompressorTransformer };
