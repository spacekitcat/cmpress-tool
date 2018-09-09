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
        expect.objectContaining({ token: 'a', position: 0, length: 0 })
      );
    });

    // it('frame 2', () => {
    //   expect(result[1]).toEqual(
    //     expect.objectContaining({ token: 'b', position: 0, length: 1 })
    //   );
    // });

    // it('frame 3', () => {
    //   expect(result[2]).toEqual(
    //     expect.objectContaining({ token: 'b', position: 1, length: 2 })
    //   );
    // });
  });
});
