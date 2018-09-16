import consumeInput from '../src/consume-input';

describe('cosumeInput', () => {
  describe('Buffer is empty', () => {
    const bufferContent = [];
    describe('Input is undefined', () => {
      it('should return an empty buffer copy', () => {
        expect(consumeInput(bufferContent, 4, undefined)).toEqual({
          buffer: [],
          discard: []
        });
      });
    });

    describe('Input is null', () => {
      it('should return an empty buffer copy', () => {
        expect(consumeInput(bufferContent, 4, null)).toEqual({
          buffer: [],
          discard: []
        });
      });
    });

    describe('Input is empty', () => {
      it('should return an empty buffer copy', () => {
        expect(consumeInput(bufferContent, 4, [])).toEqual({
          buffer: [],
          discard: []
        });
      });
    });

    describe('Input has two elements', () => {
      it('should append the input to the buffer copy', () => {
        expect(consumeInput(bufferContent, 4, ['a', 'b'])).toEqual({
          buffer: ['a', 'b'],
          discard: []
        });
      });
    });
  });

  describe('Buffer is undefined', () => {
    const bufferContent = undefined;
    describe('Input is undefined', () => {
      it('should return an empty buffer copy', () => {
        expect(consumeInput(bufferContent, 4, undefined)).toEqual({
          buffer: [],
          discard: []
        });
      });
    });

    describe('Input is null', () => {
      it('should return an empty buffer copy', () => {
        expect(consumeInput(bufferContent, 4, null)).toEqual({
          buffer: [],
          discard: []
        });
      });
    });

    describe('Input is empty', () => {
      it('should return an empty buffer copy', () => {
        expect(consumeInput(bufferContent, 4, [])).toEqual({
          buffer: [],
          discard: []
        });
      });
    });

    describe('Input has two elements', () => {
      it('should append the input to the buffer copy', () => {
        expect(consumeInput(bufferContent, 4, ['a', 'b'])).toEqual({
          buffer: ['a', 'b'],
          discard: []
        });
      });
    });
  });

  describe('Buffer is null', () => {
    const bufferContent = null;
    describe('Input is undefined', () => {
      it('should return an empty buffer copy', () => {
        expect(consumeInput(bufferContent, 4, undefined)).toEqual({
          buffer: [],
          discard: []
        });
      });
    });

    describe('Input is null', () => {
      it('should return an empty buffer copy', () => {
        expect(consumeInput(bufferContent, 4, null)).toEqual({
          buffer: [],
          discard: []
        });
      });
    });

    describe('Input is empty', () => {
      it('should return an empty buffer copy', () => {
        expect(consumeInput(bufferContent, 4, [])).toEqual({
          buffer: [],
          discard: []
        });
      });
    });

    describe('Input has two elements', () => {
      it('should append the input to the buffer copy', () => {
        expect(consumeInput(bufferContent, 4, ['a', 'b'])).toEqual({
          buffer: ['a', 'b'],
          discard: []
        });
      });
    });
  });

  describe('Buffer has four elements', () => {
    const bufferContent = ['a', 'b', 'c', 'd'];
    describe('Input is undefined', () => {
      it('should advance the buffer by 1', () => {
        expect(consumeInput(bufferContent, 4, undefined)).toEqual({
          buffer: ['b', 'c', 'd'],
          discard: ['a']
        });
      });
    });

    describe('Input is null', () => {
      it('should advance the buffer by 1', () => {
        expect(consumeInput(bufferContent, 4, undefined)).toEqual({
          buffer: ['b', 'c', 'd'],
          discard: ['a']
        });
      });
    });

    describe('Input is empty', () => {
      it('should advance the buffer by 1', () => {
        expect(consumeInput(bufferContent, 4, [])).toEqual({
          buffer: ['b', 'c', 'd'],
          discard: ['a']
        });
      });

      describe('Second input is empty', () => {
        it('should advance the buffer by 1', () => {
          let result = consumeInput(bufferContent, 4, []);
          result = consumeInput(result.buffer, 4, []);

          expect(result).toEqual({
            buffer: ['c', 'd'],
            discard: ['b']
          });
        });
      });
    });

    describe('Input has two elements', () => {
      it('should append the input to the buffer copy', () => {
        expect(consumeInput(bufferContent, 4, ['x', 'y'])).toEqual({
          buffer: ['c', 'd', 'x', 'y'],
          discard: ['a', 'b']
        });
      });
    });

    describe('Input has four elements', () => {
      it('should append the input to the buffer copy', () => {
        expect(consumeInput(bufferContent, 4, ['x', 'y', 'w', 'v'])).toEqual({
          buffer: ['x', 'y', 'w', 'v'],
          discard: ['a', 'b', 'c', 'd']
        });
      });
    });
  });
});
