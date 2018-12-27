import { CompressorTransformer } from '../src/compressor-transformer';
import { SlidingWindow } from '../src/sliding-window.js';

describe('CompressorTransformer', () => {
  const defaultDictionarySize = 2048;

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
      testTarget = new CompressorTransformer({ dictionarySize: 2048 });
    });

    it('uses the expected value', () => {
      expect(testTarget).toHaveProperty('dictionarySize', 2048);
    });

    it('constructs the SlidingWindow with the expected parameters', () => {
      expect(testTarget).toHaveProperty(
        'slidingWindow',
        new SlidingWindow(2048, 2048)
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
          0x05, 98, 0x01, 0x00, 0x04, 0x00]) // [4a,3a,2a,1a, [ 4, 3, 2, 1 ]+0a
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
          0x01, 97,  // [a]
          0x01, 97,  // [a,a]
          0x01, 97,  // [a,a,a]
          0x01, 97,  // [a,a,a,a]
          0x05, 97, 0x01, 0x00, 0x04, 0x00,  // [4a,3a,2a,1a, [ 4, 3, 2, 1 ]+0a
          0x05, 97, 0x01, 0x00, 0x05, 0x00]  // [5a,4a,3a,2a, [ 4, 3, 2, 1 ]+1a, [ 5, 4, 3, 2, 1 ]+0a
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
          0x01, 0x6c,    // [l]
          0x01, 0x69,    // [l,i]
          0x01, 0x73,    // [l,i,s]
          0x01, 0x61,    // [l,i,s,a]
          0x05, 0x6c, 0x01, 0x00, 0x04, 0x00,  // [4l,3i,2s,1a, [ 4l, 3i, 2s, 1a ]+0l
          0x01, 0x69,    // [5l,4i,3s,2a, [ 5l, 4i, 3s, 2a ]+1l, 0i
          0x01, 0x73,    // [6l,5i,4s,3a, [ 6l, 5i, 4s, 3a ]+2l, 1i, 0s
          0x01, 0x61]    // [7l,6i,5s,4a, [ 7l, 6i, 5s, 4a ]+3l, 2i, 1s, 0a
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
          0x01, 0x6c,    // [l]
          0x01, 0x69,    // [l,i]
          0x01, 0x73,    // [l,i,s]
          0x01, 0x61,    // [l,i,s,a]
          0x05, 0x6c, 0x01, 0x00, 0x04, 0x00,   // [4l,3i,2s,1a, [ 4l, 3i, 2s, 1a ]+0l
          0x05, 0x61, 0x03, 0x00, 0x06, 0x00]   // [9l,8i,7s,6a,5l,4i,3s,2a,1l], [8i, 7s, 6a, 5l, 4i, 3s]+0a
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
          0x01, 97,
          0x01, 97,
          0x01, 97,
          0x01, 98,
          0x01, 98,
          0x01, 99])
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
      
      expect(outputAccumulator).toMatchObject(Buffer.from([
        0x01, 194,
        0x01, 163]));
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
            0x01, 97,
            0x01, 97,
            0x01, 97,
            0x01, 97,
            0x01, 97,
            0x01, 97,
            0x01, 97])
        );
      });

      compressorTransformer.write(Buffer.from([97, 97, 97, 97, 97]));
      compressorTransformer.write(Buffer.from([97, 97]));

      compressorTransformer.end();
    });
  });
});
