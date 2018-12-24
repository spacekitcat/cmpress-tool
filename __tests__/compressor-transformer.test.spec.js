import { CompressorTransformer } from '../src/compressor-transformer';
import { SlidingWindow } from '../src/sliding-window.js';

const PREFIX_COMMAND_CHAR_CODE = 0x50;

describe('CompressorTransformer', () => {
  const defaultDictionarySize = 255;

  let testTarget;
  beforeAll(() => {
    testTarget = new CompressorTransformer({
      historyBufferSize: defaultDictionarySize,
      currentBufferSize: defaultDictionarySize
    });
  });

  describe('and a custom dictionarySize is provided', () => {
    beforeAll(() => {
      testTarget = new CompressorTransformer({ dictionarySize: 512 });
    });

    it('uses the expected value', () => {
      expect(testTarget).toHaveProperty('dictionarySize', 512);
    });

    it('constructs the SlidingWindow with the expected parameters', () => {
      expect(testTarget).toHaveProperty(
        'slidingWindow',
        new SlidingWindow(512, 512)
      );
    });
  });

  it('compresses `` to ``', () => {
    let compressorTransformer = new CompressorTransformer();

    let outputAccumulator = Buffer.from([]);
    compressorTransformer.on('data', compressedPacket => {
      outputAccumulator = Buffer.concat([outputAccumulator, compressedPacket]);
    });

    compressorTransformer.on('finish', () => {
      expect(outputAccumulator).toMatchObject(Buffer.from([]));
    });

    compressorTransformer.write(Buffer.from([]));
    compressorTransformer.end();
  });

  it('compresses a to a', () => {
    let compressorTransformer = new CompressorTransformer();

    let outputAccumulator = Buffer.from([]);
    compressorTransformer.on('data', compressedPacket => {
      outputAccumulator = Buffer.concat([outputAccumulator, compressedPacket]);
    });

    compressorTransformer.on('finish', () => {
      expect(outputAccumulator).toMatchObject(Buffer.from([0x01, 0x00, 97]));
    });

    compressorTransformer.write(Buffer.from([97]));
    compressorTransformer.end();
  });

  it('compresses aaba', () => {
    let compressorTransformer = new CompressorTransformer();

    let outputAccumulator = Buffer.from([]);
    compressorTransformer.on('data', compressedPacket => {
      outputAccumulator = Buffer.concat([outputAccumulator, compressedPacket]);
    });

    compressorTransformer.on('finish', () => {
      expect(outputAccumulator).toMatchObject(
        Buffer.from([
          0x01, 0x00, 97,  // [a]
          0x06, 0x00, 98, PREFIX_COMMAND_CHAR_CODE, 0x01, 0x00, 0x01, 0x00,  // [a,b]
          0x01, 0x00, 97]) // [a]
      );
    });

    compressorTransformer.write(Buffer.from([97, 97, 98, 97]));
    compressorTransformer.end();
  });

  it.only('compresses aaaa', () => {
    let compressorTransformer = new CompressorTransformer();

    let outputAccumulator = Buffer.from([]);
    compressorTransformer.on('data', compressedPacket => {
      outputAccumulator = Buffer.concat([outputAccumulator, compressedPacket]);
    });

    compressorTransformer.on('finish', () => {
      expect(outputAccumulator).toMatchObject(
        Buffer.from([
          0x01, 0x00, 97,  // [a]
          0x06, 0x00, 97, PREFIX_COMMAND_CHAR_CODE, 0x01, 0x00, 0x01, 0x00,  // [a,a]
          0x01, 0x00, 97]) // [a]
      );
    });

    compressorTransformer.write(Buffer.from([97, 97, 97, 97]));
    compressorTransformer.end();
  });

  it('compresses aaaaaaaab', () => {
    let compressorTransformer = new CompressorTransformer();

    let outputAccumulator = Buffer.from([]);
    compressorTransformer.on('data', compressedPacket => {
      outputAccumulator = Buffer.concat([outputAccumulator, compressedPacket]);
    });

    compressorTransformer.on('finish', () => {
      expect(outputAccumulator).toMatchObject(
        Buffer.from([
          0x01, 0x00, 97,  // [a]
          0x06, 0x00, 97, PREFIX_COMMAND_CHAR_CODE, 0x01, 0x00, 0x01, 0x00, // [a,a]
          0x06, 0x00, 97, PREFIX_COMMAND_CHAR_CODE, 0x01, 0x00, 0x03, 0x00, // [a,a,a,a]
          0x06, 0x00, 98, PREFIX_COMMAND_CHAR_CODE, 0x01, 0x00, 0x01, 0x00]) // [a, b]
      );
    });

    compressorTransformer.write(
      Buffer.from([
        97, 97, 97, 97, 97, 97, 97, 97, 98])
    );
    compressorTransformer.end();
  });

  it('compresses aaaaaaaaaaaaaaaa', () => {
    let compressorTransformer = new CompressorTransformer();

    let outputAccumulator = Buffer.from([]);
    compressorTransformer.on('data', compressedPacket => {
      outputAccumulator = Buffer.concat([outputAccumulator, compressedPacket]);
    });

    compressorTransformer.on('finish', () => {
      expect(outputAccumulator).toMatchObject(
        Buffer.from([
          0x01, 0x00, 97,  // [a]
          0x06, 0x00, 97, PREFIX_COMMAND_CHAR_CODE, 0x01, 0x00, 0x01, 0x00,  // [a,a]
          0x06, 0x00, 97, PREFIX_COMMAND_CHAR_CODE, 0x01, 0x00, 0x03, 0x00,  // [a, a, a, a]
          0x06, 0x00, 97, PREFIX_COMMAND_CHAR_CODE, 0x01, 0x00, 0x07, 0x00]  // [a, a, a, a, a, a, a, a]
        )
      );
    });

    compressorTransformer.write(
      Buffer.from([97,97,97,97,97,97,97, 97,97,97,97,97,97,97,97])
    );
    compressorTransformer.end();
  });


  it('compresses lisalisalisa', () => {
    let compressorTransformer = new CompressorTransformer();

    let outputAccumulator = Buffer.from([]);
    compressorTransformer.on('data', compressedPacket => {
      outputAccumulator = Buffer.concat([outputAccumulator, compressedPacket]);
    });

    compressorTransformer.on('finish', () => {
      expect(outputAccumulator).toMatchObject(
        Buffer.from([
          0x01, 0x00, 0x6c,    // [l]
          0x01, 0x00, 0x69,    // [i]
          0x01, 0x00, 0x73,    // [s]
          0x01, 0x00, 0x61,    // [a]
          0x06, 0x00, 0x6c, PREFIX_COMMAND_CHAR_CODE, 0x01, 0x00, 0x04, 0x00,  // [l, i, s, a, l]
          0x06, 0x00, 0x61, PREFIX_COMMAND_CHAR_CODE, 0x03, 0x00, 0x02, 0x00,  // [i, s, a]
          ]
        )
      );
    });

    compressorTransformer.write(
      Buffer.from([0x6c, 0x69, 0x73, 0x61, 0x6c, 0x69, 0x73, 0x61, 0x6c, 0x69, 0x73, 0x61])
    );
    compressorTransformer.end();
  });


  it('compresses lisalisalisalisa', () => {
    let compressorTransformer = new CompressorTransformer();

    let outputAccumulator = Buffer.from([]);
    compressorTransformer.on('data', compressedPacket => {
      outputAccumulator = Buffer.concat([outputAccumulator, compressedPacket]);
    });

    compressorTransformer.on('finish', () => {
      expect(outputAccumulator).toMatchObject(
        Buffer.from([
          0x01, 0x00, 0x6c,    // [l]
          0x01, 0x00, 0x69,    // [i]
          0x01, 0x00, 0x73,    // [s]
          0x01, 0x00, 0x61,    // [a]
          0x06, 0x00, 0x6c, PREFIX_COMMAND_CHAR_CODE, 0x01, 0x00, 0x04, 0x00,   // [l, i, s, a, l]
          0x06, 0x00, 0x61, PREFIX_COMMAND_CHAR_CODE, 0x03, 0x00, 0x06, 0x00]   // [i, s, a, l, i, s, a]
        )
      );
    });

    compressorTransformer.write(
      Buffer.from([0x6c, 0x69, 0x73, 0x61, 0x6c, 0x69, 0x73, 0x61, 0x6c, 0x69, 0x73, 0x61, 0x6c, 0x69, 0x73, 0x61])
    );
    compressorTransformer.end();
  });

  it('compresses aaabbc', () => {
    let compressorTransformer = new CompressorTransformer();

    let outputAccumulator = Buffer.from([]);
    compressorTransformer.on('data', compressedPacket => {
      outputAccumulator = Buffer.concat([outputAccumulator, compressedPacket]);
    });

    compressorTransformer.on('finish', () => {
      expect(outputAccumulator).toMatchObject(
        Buffer.from([
          0x01, 0x00, 97, // [a]
          0x06, 0x00, 97, PREFIX_COMMAND_CHAR_CODE, 0x01, 0x00, 0x01, 0x00, // [a, a]
          0x01, 0x00, 98, // [b]
          0x06, 0x00, 99, PREFIX_COMMAND_CHAR_CODE, 0x01, 0x00, 0x01, 0x00])  //  [b, c]
      );
    });

    compressorTransformer.write(Buffer.from([97, 97, 97, 98, 98, 99]));
    compressorTransformer.end();
  });

  it('compresses £ (UTF-8, 2 byte representation))', () => {
    let compressorTransformer = new CompressorTransformer();

    let outputAccumulator = Buffer.from([]);
    compressorTransformer.on('data', compressedPacket => {
      outputAccumulator = Buffer.concat([outputAccumulator, compressedPacket]);
    });

    compressorTransformer.on('finish', () => {
      expect(outputAccumulator).toMatchObject(Buffer.from([0x01, 0x00, 194, 0x01, 0x00, 163]));
    });

    compressorTransformer.write('£');
    compressorTransformer.end();
  });

  describe('where the stream transform involves multiple calls', () => {
    /** The sliding window needs to maintain state between 'chunks' (the argument passed to the transformer) */
    it('does not reset the sliding window', () => {
      let compressorTransformer = new CompressorTransformer();

      let outputAccumulator = Buffer.from([]);
      compressorTransformer.on('data', compressedPacket => {
        outputAccumulator = Buffer.concat([
          outputAccumulator,
          compressedPacket
        ]);
      });

      compressorTransformer.on('finish', () => {
        expect(outputAccumulator).toMatchObject(
          Buffer.from([
            0x01, 0x00, 97, //  [a]
            0x06, 0x00, 97, PREFIX_COMMAND_CHAR_CODE, 0x01, 0x00, 0x01, 0x00, // [a, a]
            0x01, 0x00, 97  //  [a]
          ])
        );
      });

      compressorTransformer.write(Buffer.from([97, 97, 97, 97]));
      compressorTransformer.write(Buffer.from([97]));
      compressorTransformer.write(Buffer.from([97]));
      compressorTransformer.write(Buffer.from([97]));

      compressorTransformer.end();
    });
  });
});
