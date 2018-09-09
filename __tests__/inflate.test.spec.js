import inflate from '../src/inflate';

describe('inflate', () => {
  describe('4 decompression frames', () => {
    let result;
    it('Decompresses back to abcabc', () => {
      result = inflate([
        { token: 'a', length: 0, position: 0 },
        { token: 'b', length: 0, position: 0 },
        { token: 'c', length: 0, position: 0 },
        { token: '', length: 3, position: 0 }
      ]);
      expect(result).toEqual('abcabc');
    });
  });
});
