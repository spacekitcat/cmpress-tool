import compress from '../src/compress';
import inflate from '../src/inflate';
import console from '../src/console';

describe('inflate', () => {
  describe('when the compression string is abcabc', () => {
    let result;
    beforeAll(() => {
      result = compress('abcabc');
    });

    it('frame 1', () => {
      expect(result[0]).toEqual(
        expect.objectContaining({ token: 'a', length: 0, position: 0 })
      );
    });

    it('frame 2', () => {
      expect(result[1]).toEqual(
        expect.objectContaining({ token: 'b', length: 0, position: 0 })
      );
    });

    it('frame 3', () => {
      expect(result[2]).toEqual(
        expect.objectContaining({ token: 'c', length: 0, position: 0 })
      );
    });

    it('frame 4', () => {
      expect(result[3]).toEqual(
        expect.objectContaining({ token: '', length: 3, position: 0 })
      );
    });
  });
});
