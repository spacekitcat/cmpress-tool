import { CompressorTransformer } from '../src/compressor-transformer';
import { SlidingWindow } from '../src/sliding-window.js';

const PREFIX_COMMAND_CHAR_CODE = 0x50;
const COMMA_CHAR_CODE = 0x2c;

describe('CompressorTransformer', () => {
  const defaultHistoryBufferSize = 255;
  const defaultCurrentBufferSize = 255;

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
      expect(outputAccumulator).toMatchObject(Buffer.from([0x01, 97]));
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
          0x01, 97,  // [a]
          0x01, 97,  // [a,a]
          0x01, 98,  // [a,a,b]
          0x01, 97]) // [a,a,b,a]
      );
    });

    compressorTransformer.write(Buffer.from([97, 97, 98, 97]));
    compressorTransformer.end();
  });

  it('compresses aaaa', () => {
    let compressorTransformer = new CompressorTransformer();

    let outputAccumulator = Buffer.from([]);
    compressorTransformer.on('data', compressedPacket => {
      outputAccumulator = Buffer.concat([outputAccumulator, compressedPacket]);
    });

    compressorTransformer.on('finish', () => {
      expect(outputAccumulator).toMatchObject(
        Buffer.from([
          0x01, 97,  // [a]
          0x01, 97,  // [a,a]
          0x01, 97,  // [a,a,a]
          0x01, 97]) // [a,a,a,a]
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
          0x01, 97,  // [a]
          0x01, 97,  // [a,a]
          0x01, 97,  // [a,a,a]
          0x01, 97,  // [a,a,a,a]
          0x05, 98, PREFIX_COMMAND_CHAR_CODE, 0x01, 44, 0x04]) // [4a,3a,2a,1a, [ 4, 3, 2, 1 ]+0a
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
          1, 97,  // [a]
          1, 97,  // [a,a]
          1, 97,  // [a,a,a]
          1, 97,  // [a,a,a,a]
          5, 97, PREFIX_COMMAND_CHAR_CODE, 0x01, COMMA_CHAR_CODE, 0x04,  // [4a,3a,2a,1a, [ 4, 3, 2, 1 ]+0a
          5, 97, PREFIX_COMMAND_CHAR_CODE, 0x01, COMMA_CHAR_CODE, 0x05]  // [5a,4a,3a,2a, [ 4, 3, 2, 1 ]+1a, [ 5, 4, 3, 2, 1 ]+0a
        )
      );
    });

    compressorTransformer.write(
      Buffer.from([97,97,97,97,97,97,97,97,97,97,97,97,97,97,97])
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
          1, 0x6c,    // [l]
          1, 0x69,    // [l,i]
          1, 0x73,    // [l,i,s]
          1, 0x61,    // [l,i,s,a]
          5, 0x6c, PREFIX_COMMAND_CHAR_CODE, 0x01, COMMA_CHAR_CODE, 0x04,  // [4l,3i,2s,1a, [ 4l, 3i, 2s, 1a ]+0l
          1, 0x69,    // [5l,4i,3s,2a, [ 5l, 4i, 3s, 2a ]+1l, 0i
          1, 0x73,    // [6l,5i,4s,3a, [ 6l, 5i, 4s, 3a ]+2l, 1i, 0s
          1, 0x61]    // [7l,6i,5s,4a, [ 7l, 6i, 5s, 4a ]+3l, 2i, 1s, 0a
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
          1, 0x6c,    // [l]
          1, 0x69,    // [l,i]
          1, 0x73,    // [l,i,s]
          1, 0x61,    // [l,i,s,a]
          5, 0x6c, PREFIX_COMMAND_CHAR_CODE, 0x01, COMMA_CHAR_CODE, 0x04,   // [4l,3i,2s,1a, [ 4l, 3i, 2s, 1a ]+0l
          5, 0x61, PREFIX_COMMAND_CHAR_CODE, 0x03, COMMA_CHAR_CODE, 0x06]   // [9l,8i,7s,6a,5l,4i,3s,2a,1l], [8i, 7s, 6a, 5l, 4i, 3s]+0a
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
        Buffer.from([1, 97, 1, 97, 1, 97, 1, 98, 1, 98, 1, 99])
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
      expect(outputAccumulator).toMatchObject(Buffer.from([1, 194, 1, 163]));
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
          Buffer.from([1, 97, 1, 97, 1, 97, 1, 97, 1, 97, 1, 97, 1, 97])
        );
      });

      compressorTransformer.write(Buffer.from([97, 97, 97, 97, 97]));
      compressorTransformer.write(Buffer.from([97, 97]));

      compressorTransformer.end();
    });
  });
});
