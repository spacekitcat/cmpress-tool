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

  mergeSerializePackets(packetList) {
    let mergedPacket = Buffer.from([]);
    let mergedPacketToken = Buffer.from([]);

    packetList.forEach(packet => {
      mergedPacketToken = Buffer.concat([mergedPacketToken, packet.t], mergedPacketToken.length + packet.t.length)
    });

    if (mergedPacketToken.length > 0) {
      let serializedPacket = serializePacketToBinary({ t: mergedPacketToken });
      mergedPacket = Buffer.concat([packetHeaderToBinary({ size: serializedPacket.length, hasPrefix: false }), serializedPacket]);
    }

    return mergedPacket;
  }

  _transform(chunk, encoding, callback) {
    this.slidingWindow.setInput(chunk);

    let packetBuffer = [];
    while (this.slidingWindow.lookAhead().length > 0) {
      let nextPacket = this.slidingWindow.slide(locateToken);
      
      if ((nextPacket.p && nextPacket.p.length > 0)) {
        this.push(this.mergeSerializePackets(packetBuffer));
        packetBuffer = [];

        let serialized = serializePacketToBinary(nextPacket);
        this.push(Buffer.concat([packetHeaderToBinary({ size: serialized.length, hasPrefix: nextPacket.p !== undefined }), serialized]));
      } else {
        packetBuffer.push(nextPacket);
      }
    }

    this.push(this.mergeSerializePackets(packetBuffer));
    callback();
  }
}

export { CompressorTransformer };
