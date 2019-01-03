import { DecompressorTransformer } from '../src/decompressor-transformer';

const COMMA_CHAR_CODE = 0x2c;

describe('DecompressorTransformer', () => {
  describe('A blank input string', () => {
    it('inflates ``', () => {
      let decompressorTransformer = new DecompressorTransformer();

      let outputAccumulator = Buffer.from([]);
      decompressorTransformer.on('data', decompressedPacket => {
        outputAccumulator = Buffer.concat([
          outputAccumulator,
          decompressedPacket
        ]);
      });

      decompressorTransformer.on('finish', () => {
        expect(outputAccumulator).toMatchObject(Buffer.from([]));
      });

      decompressorTransformer.write(Buffer.from([]));
      decompressorTransformer.end();
    });
  });

  describe('The input is a run of repeat characters finished by a new character', () => {
    it('decompresses aaaaaaaab', () => {
      let decompressorTransformer = new DecompressorTransformer();

      let outputAccumulator = Buffer.from([]);
      decompressorTransformer.on('data', compressedPacket => {
        outputAccumulator = Buffer.concat([
          outputAccumulator,
          compressedPacket
        ]);
      });

      decompressorTransformer.on('finish', () => {
        expect(outputAccumulator).toMatchObject(
          Buffer.from([0x61, 0x61, 0x61, 0x61, 0x61, 0x61, 0x61, 0x61, 0x62])
        );
      });

      decompressorTransformer.write(
        Buffer.from([
          0x00,
          0x01,
          ////
          0x61,

          0x01,
          0x05,
          ////
          0x61,
          0x01,
          0x00,
          0x01,
          0x00,

          0x01,
          0x05,
          ////
          0x61,
          0x01,
          0x00,
          0x03,
          0x00,

          0x01,
          0x05,
          ////
          0x62,
          0x01,
          0x00,
          0x01,
          0x00
        ])
      );
      decompressorTransformer.end();
    });
  });
  describe('The input is a run of repeat characters', () => {
    it('inflates `aaaaaaaaaaaaaaaa`', () => {
      let decompressorTransformer = new DecompressorTransformer();

      let outputAccumulator = Buffer.from([]);
      decompressorTransformer.on('data', decompressedPacket => {
        outputAccumulator = Buffer.concat([
          outputAccumulator,
          decompressedPacket
        ]);
      });

      decompressorTransformer.on('finish', () => {
        expect(outputAccumulator).toMatchObject(
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
      });

      decompressorTransformer.write(
        Buffer.from([
          0x00,
          0x01,
          ////
          0x61,

          0x01,
          0x05,
          ////
          0x61,
          0x01,
          0x00,
          0x01,
          0x00,

          0x01,
          0x05,
          ////
          0x61,
          0x01,
          0x00,
          0x03,
          0x00,

          0x01,
          0x05,
          ////
          0x61,
          0x01,
          0x00,
          0x07,
          0x00
        ])
      );
      decompressorTransformer.end();
    });
  });

  describe('The input is a run of repeated words', () => {
    it('inflates `lisalisalisalisa`', () => {
      let decompressorTransformer = new DecompressorTransformer();

      let outputAccumulator = Buffer.from([]);
      decompressorTransformer.on('data', decompressedPacket => {
        outputAccumulator = Buffer.concat([
          outputAccumulator,
          decompressedPacket
        ]);
      });

      decompressorTransformer.on('finish', () => {
        expect(outputAccumulator).toMatchObject(
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
      });

      decompressorTransformer.write(
        Buffer.from([
          0x00,
          0x04,
          ////
          0x6c,
          0x69,
          0x73,
          0x61,

          0x01,
          0x05,
          ////
          0x6c,
          0x01,
          0x00,
          0x04,
          0x00,

          0x01,
          0x05,
          ////
          0x61,
          0x03,
          0x00,
          0x06,
          0x00
        ])
      );
      decompressorTransformer.end();
    });
  });
});
