import consumeInput from '../src/consume-input';

describe('cosumeInput', () => {
  describe('Buffer is empty', () => {
    const bufferContent = Buffer.from([]);
    describe('Input is undefined', () => {
      it('should return an empty buffer copy', () => {
        expect(consumeInput(bufferContent, 4, undefined)).toEqual({
          buffer: Buffer.from([]),
          discard: Buffer.from([])
        });
      });
    });

    describe('Input is null', () => {
      it('should return an empty buffer copy', () => {
        expect(consumeInput(bufferContent, 4, null)).toEqual({
          buffer: Buffer.from([]),
          discard: Buffer.from([])
        });
      });
    });

    describe('Input is empty', () => {
      it('should return an empty buffer copy', () => {
        expect(consumeInput(bufferContent, 4, Buffer.from([]))).toEqual({
          buffer: Buffer.from([]),
          discard: Buffer.from([])
        });
      });
    });

    describe('Input has two elements', () => {
      it('should append the input to the buffer copy', () => {
        expect(consumeInput(bufferContent, 4, Buffer.from([0x61, 0x62]))).toEqual({
          buffer: Buffer.from([0x61, 0x62]),
          discard: Buffer.from([])
        });
      });
    });
  });

  describe('Buffer is undefined', () => {
    const bufferContent = undefined;
    describe('Input is undefined', () => {
      it('should return an empty buffer copy', () => {
        expect(consumeInput(bufferContent, 4, undefined)).toEqual({
          buffer: Buffer.from([]),
          discard: Buffer.from([])
        });
      });
    });

    describe('Input is null', () => {
      it('should return an empty buffer copy', () => {
        expect(consumeInput(bufferContent, 4, null)).toEqual({
          buffer: Buffer.from([]),
          discard: Buffer.from([])
        });
      });
    });

    describe('Input is empty', () => {
      it('should return an empty buffer copy', () => {
        expect(consumeInput(bufferContent, 4, Buffer.from([]))).toEqual({
          buffer: Buffer.from([]),
          discard: Buffer.from([])
        });
      });
    });

    describe('Input has two elements', () => {
      it('should append the input to the buffer copy', () => {
        expect(consumeInput(bufferContent, 4, Buffer.from([0x61, 0x62]))).toEqual({
          buffer: Buffer.from([0x61, 0x62]),
          discard: Buffer.from([])
        });
      });
    });
  });

  describe('Buffer is null', () => {
    const bufferContent = null;
    describe('Input is undefined', () => {
      it('should return an empty buffer copy', () => {
        expect(consumeInput(bufferContent, 4, undefined)).toEqual({
          buffer: Buffer.from([]),
          discard: Buffer.from([])
        });
      });
    });

    describe('Input is null', () => {
      it('should return an empty buffer copy', () => {
        expect(consumeInput(bufferContent, 4, null)).toEqual({
          buffer: Buffer.from([]),
          discard: Buffer.from([])
        });
      });
    });

    describe('Input is empty', () => {
      it('should return an empty buffer copy', () => {
        expect(consumeInput(bufferContent, 4, Buffer.from([]))).toEqual({
          buffer: Buffer.from([]),
          discard: Buffer.from([])
        });
      });
    });

    describe('Input has two elements', () => {
      it('should append the input to the buffer copy', () => {
        expect(consumeInput(bufferContent, 4, Buffer.from([0x61, 0x62]))).toEqual({
          buffer: Buffer.from([0x61, 0x62]),
          discard: Buffer.from([])
        });
      });
    });
  });

  describe('Buffer has four elements', () => {
    const bufferContent = Buffer.from([0x61, 0x62, 0x63, 0x64]);
    describe('Input is undefined', () => {
      it('should advance the buffer by 1', () => {
        expect(consumeInput(bufferContent, 4, undefined)).toEqual({
          buffer: Buffer.from([0x62, 0x63, 0x64]),
          discard: Buffer.from([0x61])
        });
      });
    });

    describe('Input is null', () => {
      it('should advance the buffer by 1', () => {
        expect(consumeInput(bufferContent, 4, undefined)).toEqual({
          buffer: Buffer.from([0x62, 0x63, 0x64]),
          discard: Buffer.from([0x61])
        });
      });
    });

    describe('Input is empty', () => {
      it('should advance the buffer by 1', () => {
        expect(consumeInput(bufferContent, 4, Buffer.from([]))).toEqual({
          buffer: Buffer.from([0x62, 0x63, 0x64]),
          discard: Buffer.from([0x61])
        });
      });

      describe('Second input is empty', () => {
        it('should advance the buffer by 1', () => {
          let result = consumeInput(bufferContent, 4, Buffer.from([]));
          result = consumeInput(result.buffer, 4, Buffer.from([]));

          expect(result).toEqual({
            buffer: Buffer.from([0x63, 0x64]),
            discard: Buffer.from([0x62])
          });
        });
      });
    });

    describe('Input has two elements', () => {
      it('should append the input to the buffer copy', () => {
        expect(consumeInput(bufferContent, 4, Buffer.from(['x', 'y']))).toEqual({
          buffer: Buffer.from([0x63, 0x64, 'x', 'y']),
          discard: Buffer.from([0x61, 0x62])
        });
      });
    });

    describe('Input has four elements', () => {
      it('should append the input to the buffer copy', () => {
        expect(consumeInput(bufferContent, 4, Buffer.from(['x', 'y', 'w', 'v']))).toEqual({
          buffer: Buffer.from(['x', 'y', 'w', 'v']),
          discard: Buffer.from([0x61, 0x62, 0x63, 0x64])
        });
      });
    });
  });
});
