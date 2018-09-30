import { CompressorTransformer } from '../src/compressor-transformer';
import { SlidingWindow } from '../src/sliding-window.js';
import serializePacket from '../src/serialize-packet.js';

describe('CompressorTransformer', () => {
  const defaultHistoryBufferSize = 256;
  const defaultCurrentBufferSize = 256;

  let testTarget;
  beforeAll(() => {
    testTarget = new CompressorTransformer({
      historyBufferSize: defaultHistoryBufferSize,
      currentBufferSize: defaultCurrentBufferSize
    });
  });

  it('uses the expected default historyBufferSize', () => {
    expect(new CompressorTransformer()).toHaveProperty(
      'historyBufferSize',
      defaultHistoryBufferSize
    );
  });

  it('uses the expected default currentBufferSize', () => {
    expect(new CompressorTransformer()).toHaveProperty(
      'currentBufferSize',
      defaultCurrentBufferSize
    );
  });

  it('constructs the SlidingWindow with the expected parameters', () => {
    expect(new CompressorTransformer()).toHaveProperty(
      'slidingWindow',
      new SlidingWindow(defaultHistoryBufferSize, defaultCurrentBufferSize)
    );
  });

  describe('and a custom historyBufferSize is provided', () => {
    beforeAll(() => {
      testTarget = new CompressorTransformer({ historyBufferSize: 512 });
    });

    it('uses the expected value', () => {
      expect(testTarget).toHaveProperty('historyBufferSize', 512);
    });

    it('constructs the SlidingWindow with the expected parameters', () => {
      expect(testTarget).toHaveProperty(
        'slidingWindow',
        new SlidingWindow(512, defaultCurrentBufferSize)
      );
    });
  });

  describe('and a custom currentBufferSize is provided', () => {
    beforeAll(() => {
      testTarget = new CompressorTransformer({ currentBufferSize: 512 });
    });

    it('uses the expected value', () => {
      expect(testTarget).toHaveProperty('currentBufferSize', 512);
    });

    it('constructs the SlidingWindow with the expected parameters', () => {
      expect(testTarget).toHaveProperty(
        'slidingWindow',
        new SlidingWindow(defaultHistoryBufferSize, 512)
      );
    });
  });

  const buildExpectedCompressionPacket = (t, from, to) => {
    let encoded = {};
    encoded = { t: t };
    if (from && to) {
      encoded = { p: [from, to], t: t };
    }

    return serializePacket(encoded);
  };

  it('compresses a to a', () => {
    let compressorTransformer = new CompressorTransformer({
      objectMode: true
    });

    let outputAccumulator = [];
    compressorTransformer.on('data', compressedPacket => {
      outputAccumulator.push(compressedPacket);
    });

    compressorTransformer.on('finish', () => {
      expect(outputAccumulator).toEqual([buildExpectedCompressionPacket('a')]);
    });

    compressorTransformer.write('a');
    compressorTransformer.end();
  });

  it('compresses aaba', () => {
    let compressorTransformer = new CompressorTransformer({
      objectMode: true
    });

    let outputAccumulator = [];
    compressorTransformer.on('data', compressedPacket => {
      outputAccumulator.push(compressedPacket);
    });

    compressorTransformer.on('finish', () => {
      expect(outputAccumulator).toEqual([
        buildExpectedCompressionPacket('a'),
        buildExpectedCompressionPacket('a'),
        buildExpectedCompressionPacket('b'),
        buildExpectedCompressionPacket('a')
      ]);
    });

    compressorTransformer.write('aaba');
    compressorTransformer.end();
  });

  it('compresses aaaa', () => {
    let compressorTransformer = new CompressorTransformer({
      objectMode: true
    });

    let outputAccumulator = [];
    compressorTransformer.on('data', compressedPacket => {
      outputAccumulator.push(compressedPacket);
    });

    compressorTransformer.on('finish', () => {
      expect(outputAccumulator).toEqual([
        buildExpectedCompressionPacket('a'),
        buildExpectedCompressionPacket('a'),
        buildExpectedCompressionPacket('a'),
        buildExpectedCompressionPacket('a')
      ]);
    });

    compressorTransformer.write('aaaa');
    compressorTransformer.end();
  });

  it('compresses aaaaaaaab', () => {
    let compressorTransformer = new CompressorTransformer({
      objectMode: true
    });

    let outputAccumulator = [];
    compressorTransformer.on('data', compressedPacket => {
      outputAccumulator.push(compressedPacket);
    });

    compressorTransformer.on('finish', () => {
      expect(outputAccumulator).toEqual([
        buildExpectedCompressionPacket('a'),
        buildExpectedCompressionPacket('a'),
        buildExpectedCompressionPacket('a'),
        buildExpectedCompressionPacket('a'),
        buildExpectedCompressionPacket('b', 1, 4)
      ]);
    });

    compressorTransformer.write('aaaaaaaab');
    compressorTransformer.end();
  });

  it('compresses aaabbc', () => {
    let compressorTransformer = new CompressorTransformer({
      objectMode: true
    });

    let outputAccumulator = [];
    compressorTransformer.on('data', compressedPacket => {
      outputAccumulator.push(compressedPacket);
    });

    compressorTransformer.on('finish', () => {
      expect(outputAccumulator).toEqual([
        buildExpectedCompressionPacket('a'),
        buildExpectedCompressionPacket('a'),
        buildExpectedCompressionPacket('a'),
        buildExpectedCompressionPacket('b'),
        buildExpectedCompressionPacket('b'),
        buildExpectedCompressionPacket('c')
      ]);
    });

    compressorTransformer.write('aaabbc');
    compressorTransformer.end();
  });

  describe('where the stream transform involves multiple calls', () => {
    /** The sliding window need to maintain state between 'chunks' (the argument passed to the transformer) */
    it('does not reset the sliding window', () => {
      let compressorTransformer = new CompressorTransformer({
        objectMode: true
      });

      let outputAccumulator = [];
      compressorTransformer.on('data', compressedPacket => {
        outputAccumulator.push(compressedPacket);
      });

      compressorTransformer.on('finish', () => {
        expect(outputAccumulator).toEqual([
          buildExpectedCompressionPacket('a'),
          buildExpectedCompressionPacket('a'),
          buildExpectedCompressionPacket('a'),
          buildExpectedCompressionPacket('a'),
          buildExpectedCompressionPacket('a')
        ]);
      });

      compressorTransformer.write('aaaaa');
      compressorTransformer.write('aa');

      compressorTransformer.end();
    });
  });
});
