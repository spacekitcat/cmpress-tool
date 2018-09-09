import compress from '../src/compress';
import inflate from '../src/inflate';
import console from '../src/console';

describe('inflate', () => {
  describe('when the compression string is aaba', () => {
    let result;
    beforeAll(() => {
      result = compress('aabaab');
    });

    it('frame 1', () => {
      expect(result[0]).toEqual(
        expect.objectContaining({ token: 'a', prefix: undefined })
      );
    });

    it('frame 2', () => {
      expect(result[1]).toEqual(
        expect.objectContaining({ token: 'b', prefix: [1, 1] })
      );
    });

    it('frame 3', () => {
      expect(result[2]).toEqual(
        expect.objectContaining({ token: 'b', prefix: [2, 2] })
      );
    });
  });

  describe('when the compression string is aaba', () => {
    let result;
    beforeAll(() => {
      result = compress('xxxxyxyy');
    });

    it('frame 1', () => {
      expect(result[0]).toEqual(
        expect.objectContaining({ token: 'x', prefix: undefined })
      );
    });

    it('frame 2', () => {
      expect(result[1]).toEqual(
        expect.objectContaining({ token: 'x', prefix: [1, 1] })
      );
    });

    it('frame 3', () => {
      expect(result[2]).toEqual(
        expect.objectContaining({ token: 'y', prefix: [1, 1] })
      );
    });

    it('frame 4', () => {
      expect(result[3]).toEqual(
        expect.objectContaining({ token: 'y', prefix: [1, 2] })
      );
    });
  });
});
