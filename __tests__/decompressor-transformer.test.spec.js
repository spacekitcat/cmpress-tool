import { DecompressorTransformer } from '../src/decompressor-transformer';
import serializePacket from '../src/serialize-packet.js';

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

    decompressorTransformer.write('1a5bP1,11a');
    decompressorTransformer.end();
  });

  it('inflates hellohello (multi-character history buffer results)', () => {
    let decompressorTransformer = new DecompressorTransformer();

    let outputAccumulator = '';
    decompressorTransformer.on('data', decompressedPacket => {
      outputAccumulator += decompressedPacket;
    });

    decompressorTransformer.on('finish', () => {
      expect(outputAccumulator.toString('utf8')).toEqual('hellohello');
    });

    decompressorTransformer.write('1h1e1l5oP1,15oP2,4');
    decompressorTransformer.end();
  });
});
