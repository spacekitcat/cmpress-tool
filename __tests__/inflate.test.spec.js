import inflate from '../src/inflate';

describe('inflate', () => {
  describe('4 decompression frames', () => {
    it('Decompresses back to aab', () => {
      let result = inflate([
        { prefix: undefined, token: 'a' },
        { prefix: [1, 1], token: 'b' }
      ]);
      expect(result).toEqual('aab');
    });

    it('Decompresses back to aabaab', () => {
      let result = inflate([
        { prefix: undefined, token: 'a' },
        { prefix: [1, 1], token: 'b' },
        { prefix: [2, 2], token: 'b' }
      ]);
      expect(result).toEqual('aabaab');
    });
  });
});
