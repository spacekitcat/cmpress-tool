import { DecompressorTransformer } from '../src/decompressor-transformer';

const COMMA_CHAR_CODE = 0x2c;
const PREFIX_COMMAND_CHAR_CODE = 0x50;

describe('DecompressorTransformer', () => {
  
  it('inflates a to a', () => {
    let decompressorTransformer = new DecompressorTransformer();

    let outputAccumulator = Buffer.from([]);
    decompressorTransformer.on('data', decompressedPacket => {
      outputAccumulator = Buffer.concat([outputAccumulator, decompressedPacket]);
    });

    decompressorTransformer.on('finish', () => {
      expect(outputAccumulator).toMatchObject(Buffer.from([97]));
    });

    decompressorTransformer.write(Buffer.from([1, 97]));
    decompressorTransformer.end();
  });

  it('inflates aaba', () => {
    let decompressorTransformer = new DecompressorTransformer();

    let outputAccumulator = Buffer.from([]);
    decompressorTransformer.on('data', decompressedPacket => {
      outputAccumulator = Buffer.concat([
        outputAccumulator,
        decompressedPacket
      ]);
    });

    decompressorTransformer.on('finish', () => {
      expect(outputAccumulator).toEqual(Buffer.from([97, 97, 98, 97]));
    });

    decompressorTransformer.write(
      Buffer.from([1, 97, 1, 97, 1, 98, 1, 97])
    );
    decompressorTransformer.end();
  });

  it('inflates aaaa', () => {
    let decompressorTransformer = new DecompressorTransformer();

    let outputAccumulator = Buffer.from([]);
    decompressorTransformer.on('data', decompressedPacket => {
      outputAccumulator = Buffer.concat([outputAccumulator, decompressedPacket]);
    });

    decompressorTransformer.on('finish', () => {
      expect(outputAccumulator).toMatchObject(
        Buffer.from([97, 97, 97, 97]));
    });

    decompressorTransformer.write(Buffer.from([
      1, 97,  // [a]
      1, 97,  // [a,a]
      1, 97,  // [a,a,a]
      1, 97]) // [a,a,a,a]
    );
    decompressorTransformer.end();
  });

  it('inflates aaaaaaaab', () => {
    let decompressorTransformer = new DecompressorTransformer();

    let outputAccumulator = Buffer.from([]);
    decompressorTransformer.on('data', decompressedPacket => {
      outputAccumulator = Buffer.concat([outputAccumulator, decompressedPacket]);
    });

    decompressorTransformer.on('finish', () => {
      expect(outputAccumulator).toMatchObject(
        Buffer.from([97, 97, 97, 97, 97, 97, 97, 97, 98])
      );

      decompressorTransformer.write(
        Buffer.from([
          1, 97,  // [a]
          1, 97,  // [a,a]
          1, 97,  // [a,a,a]
          1, 97,  // [a,a,a,a]
          5, 98, PREFIX_COMMAND_CHAR_CODE, 49, COMMA_CHAR_CODE, 52]) // [4a,3a,2a,1a, [ 4, 3, 2, 1 ]+0a
      );
    
      decompressorTransformer.end();
    });
  });

  it('inflates aaaaaaaaaaaaaaaa', () => {
    let decompressorTransformer = new DecompressorTransformer();

    let outputAccumulator = Buffer.from([]);
    decompressorTransformer.on('data', decompressedPacket => {
      outputAccumulator = Buffer.concat([outputAccumulator, decompressedPacket]);
    });

    decompressorTransformer.on('finish', () => {
      expect(outputAccumulator).toMatchObject(
        Buffer.from([97,97,97,97, 97,97,97,97, 97, 97,97,97,97,97, 97])
      );
    });

    decompressorTransformer.write(
      Buffer.from([
        1, 97,  // [a]
        1, 97,  // [a,a]
        1, 97,  // [a,a,a]
        1, 97,  // [a,a,a,a]
        5, 97, PREFIX_COMMAND_CHAR_CODE, 0x01, COMMA_CHAR_CODE, 0x04,  // [4a,3a,2a,1a, [ 4, 3, 2, 1 ]+0a
        5, 97, PREFIX_COMMAND_CHAR_CODE, 0x01, COMMA_CHAR_CODE, 0x05]  // [5a,4a,3a,2a, [ 4, 3, 2, 1 ]+1a, [ 5a, 4a, 3a, 2a, 1a ]+0a
      )
    );
    decompressorTransformer.end();
  });

  it('inflates lisalisalisa', () => {
    let decompressorTransformer = new DecompressorTransformer();

    let outputAccumulator = Buffer.from([]);
    decompressorTransformer.on('data', decompressedPacket => {
      outputAccumulator = Buffer.concat([outputAccumulator, decompressedPacket]);
    });

    decompressorTransformer.on('finish', () => {
      expect(outputAccumulator).toMatchObject(
        Buffer.from([0x6c, 0x69, 0x73, 0x61, 0x6c, 0x69, 0x73, 0x61, 0x6c, 0x69, 0x73, 0x61])
      );
    });

    decompressorTransformer.write(
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
    decompressorTransformer.end();
  });

  it('inflates lisalisalisalisa', () => {
    let decompressorTransformer = new DecompressorTransformer();

    let outputAccumulator = Buffer.from([]);
    decompressorTransformer.on('data', decompressedPacket => {
      outputAccumulator = Buffer.concat([outputAccumulator, decompressedPacket]);
    });

    decompressorTransformer.on('finish', () => {
      expect(outputAccumulator).toMatchObject(
        Buffer.from([0x6c, 0x69, 0x73, 0x61, 0x6c, 0x69, 0x73, 0x61, 0x6c, 0x69, 0x73, 0x61, 0x6c, 0x69, 0x73, 0x61])
      );
    });

    decompressorTransformer.write(
        Buffer.from([
          1, 0x6c,    // [l]
          1, 0x69,    // [l,i]
          1, 0x73,    // [l,i,s]
          1, 0x61,    // [l,i,s,a]
          5, 0x6c, PREFIX_COMMAND_CHAR_CODE, 0x01, COMMA_CHAR_CODE, 0x04,   // [4l,3i,2s,1a, [ 4l, 3i, 2s, 1a ]+0l
          5, 0x61, PREFIX_COMMAND_CHAR_CODE, 0x03, COMMA_CHAR_CODE, 0x06]   // [9l,8i,7s,6a,5l,4i,3s,2a,1l], [8i, 7s, 6a, 5l, 4i, 3s]+0a
    ));
    decompressorTransformer.end();
  });

  it('inflates hellohello (multi-character history buffer results)', () => {
    let decompressorTransformer = new DecompressorTransformer();

    let outputAccumulator = Buffer.from([]);
    decompressorTransformer.on('data', decompressedPacket => {
      outputAccumulator = Buffer.concat([
        outputAccumulator,
        decompressedPacket
      ]);
    });

    decompressorTransformer.on('finish', () => {
      expect(outputAccumulator).toEqual(Buffer.from([97, 97, 97, 97, 98, 99]));
    });

    decompressorTransformer.write(
      Buffer.from([1, 97, 1, 97, 1, 97, 1, 97, 1, 98, 1, 99])
    );
    decompressorTransformer.end();
  });
});
