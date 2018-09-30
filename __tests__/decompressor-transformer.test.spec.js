import { DecompressorTransformer } from '../src/decompressor-transformer';
import serializePacket from '../src/serialize-packet.js';

const encodeCompressionPacket = (t, from, to) => {
  let encoded = {};
  encoded = { t: t };
  if (from && to) {
    encoded = { p: [from, to], t: t };
  }

  return serializePacket(encoded);
};

describe('DecompressorTransformer', () => {
  it('inflates aaba', () => {
    let decompressorTransformer = new DecompressorTransformer();

    let outputAccumulator = '';
    decompressorTransformer.on('data', decompressedPacket => {
      outputAccumulator += decompressedPacket;
    });

    decompressorTransformer.on('finish', () => {
      expect(outputAccumulator.toString('utf8')).toEqual('aaba');
    });

    decompressorTransformer.write(encodeCompressionPacket('a'));
    decompressorTransformer.write(encodeCompressionPacket('b', 1, 1));
    decompressorTransformer.write(encodeCompressionPacket('a'));
    decompressorTransformer.end();
  });

  it('inflates hellohello (multi-character history buffer results)', () => {
    let decompressorTransformer = new DecompressorTransformer();

    let outputAccumulator = '';
    decompressorTransformer.on('data', decompressedPacket => {
      outputAccumulator += decompressedPacket;
    });

    decompressorTransformer.on('finish', () => {
      expect(outputAccumulator).toEqual('hellohello');
    });

    decompressorTransformer.write(encodeCompressionPacket('h'));
    decompressorTransformer.write(encodeCompressionPacket('e'));
    decompressorTransformer.write(encodeCompressionPacket('l'));
    decompressorTransformer.write(encodeCompressionPacket('o', 1, 1));
    decompressorTransformer.write(encodeCompressionPacket('o', 2, 4));
    decompressorTransformer.end();
  });
});
