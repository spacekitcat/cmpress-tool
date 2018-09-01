import compress from '../src/compress';

describe('compress', () => {
  it('returns the input str, s, s + s', () => {
    let result = compress('test');

    expect(result).toBe('testtest');
  });
});
