import { CompressorTransformer } from '../src/compressor-transformer';
import { SlidingWindow } from '../src/sliding-window.js';

describe('CompressorTransformer', () => {
  const defaultDictionarySize = 2600;

  let testTarget;
  beforeAll(() => {
    testTarget = new CompressorTransformer({
      historyBufferSize: defaultDictionarySize,
      currentBufferSize: defaultDictionarySize
    });
  });

  it('constructs the SlidingWindow with the expected parameters', () => {
    expect(new CompressorTransformer()).toHaveProperty(
      'slidingWindow',
      new SlidingWindow(defaultDictionarySize, defaultDictionarySize)
    );
  });

  describe('and a custom dictionarySize is provided', () => {
    beforeAll(() => {
      testTarget = new CompressorTransformer({ dictionarySize: 2600 });
    });

    it('uses the expected value', () => {
      expect(testTarget).toHaveProperty('dictionarySize', 2600);
    });

    it('constructs the SlidingWindow with the expected parameters', () => {
      expect(testTarget).toHaveProperty(
        'slidingWindow',
        new SlidingWindow(2600, 2600)
      );
    });
  });

  describe('A blank input string', () => {
    it('compresses `` to ``', () => {
      let compressorTransformer = new CompressorTransformer();

      let outputAccumulator = Buffer.from([]);
      compressorTransformer.on('data', compressedPacket => {
        outputAccumulator = Buffer.concat([
          outputAccumulator,
          compressedPacket
        ]);
      });

      compressorTransformer.on('finish', () => {
        expect(outputAccumulator).toMatchObject(Buffer.from([]));
      });

      compressorTransformer.write(Buffer.from([]));
      compressorTransformer.end();
    });
  });

  describe('The input is a run of repeat characters finished by a new character', () => {
    it('compresses aaaaaaaab', () => {
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
            0x00,
            0x01,
            ////
            0x61,

            0x01,
            0x03,
            ////
            0x61,
            0x01,
            0x01,

            0x01,
            0x03,
            ////
            0x61,
            0x01,
            0x03,

            0x01,
            0x03,
            ////
            0x62,
            0x01,
            0x01,
          ])
        );
      });

      compressorTransformer.write(
        Buffer.from([0x61, 0x61, 0x61, 0x61, 0x61, 0x61, 0x61, 0x61, 0x62])
      );
      compressorTransformer.end();
    });
  });

  describe('The input is a run of repeat characters', () => {
    it('compresses aaaaaaaaaaaaaaaa', () => {
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
            0x00,
            0x01,
            ////
            0x61,

            0x01,
            0x03,
            ////
            0x61,
            0x01,
            0x01,

            0x01,
            0x03,
            ////
            0x61,
            0x01,
            0x03,

            0x01,
            0x03,
            ////
            0x61,
            0x01,
            0x07,
          ])
        );
      });

      compressorTransformer.write(
        Buffer.from([
          0x61,
          0x61,
          0x61,
          0x61,
          0x61,
          0x61,
          0x61,
          0x61,
          0x61,
          0x61,
          0x61,
          0x61,
          0x61,
          0x61,
          0x61
        ])
      );
      compressorTransformer.end();
    });
  });

  describe('The input is a run of repeated words', () => {
    it('compresses lisalisalisalisa', () => {
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
            0x00,
            0x04,
            ////
            0x6c,
            0x69,
            0x73,
            0x61,

            0x01,
            0x03,
            ////
            0x6c,
            0x01,
            0x04,

            0x01,
            0x03,
            ////
            0x61,
            0x03,
            0x06,
          ])
        );
      });

      compressorTransformer.write(
        Buffer.from([
          0x6c,
          0x69,
          0x73,
          0x61,
          0x6c,
          0x69,
          0x73,
          0x61,
          0x6c,
          0x69,
          0x73,
          0x61,
          0x6c,
          0x69,
          0x73,
          0x61
        ])
      );
      compressorTransformer.end();
    });
  });

  it('compresses £ (UTF-8, 2 byte representation))', () => {
    let compressorTransformer = new CompressorTransformer();

    let outputAccumulator = Buffer.from([]);
    compressorTransformer.on('data', compressedPacket => {
      outputAccumulator = Buffer.concat([outputAccumulator, compressedPacket]);
    });

    compressorTransformer.on('finish', () => {
      expect(outputAccumulator).toMatchObject(
        Buffer.from([
          0x00,
          0x02,
          ////
          194,
          163
        ])
      );
    });

    compressorTransformer.write('£');
    compressorTransformer.end();
  });

  describe('where the stream transform involves multiple calls', () => {
    /** The sliding window need to maintain state between 'chunks' (the argument passed to the transformer) */
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
            0x00,
            0x01,
            ////
            0x61,

            0x01,
            0x03,
            ////
            0x61,
            0x01,
            0x01,

            0x01,
            0x03,
            ////
            0x61,
            0x01,
            0x01,

            0x00,
            0x02,
            ////
            0x61,
            0x61
          ])
        );
      });

      compressorTransformer.write(Buffer.from([0x61, 0x61, 0x61, 0x61, 0x61]));
      compressorTransformer.write(Buffer.from([0x61, 0x61]));

      compressorTransformer.end();
    });
  });
});
