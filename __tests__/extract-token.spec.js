import extractToken from '../src/extract-token';

describe('extractToken()', () => {
  it('returns undefined for zero arguments', () => {
    expect(extractToken()).toEqual(undefined);
  });

  it('returns undefined for a null dictionary', () => {
    expect(extractToken(null, null, 0, 0)).toEqual(undefined);
  });

  it('returns undefined for an empty dictionary', () => {
    expect(extractToken([], 4, 0, 0)).toEqual(undefined);
  });

  it('one element dictionary 0,0', () => {
    expect(extractToken(['a'], 4, 0, 0)).toEqual(['a']);
  });

  it('full dictionary 0,0', () => {
    expect(extractToken(['d', 'c', 'b', 'a'], 4, 0, 0)).toEqual(['a']);
  });

  it('full dictionary 0, 3', () => {
    expect(extractToken(['d', 'c', 'b', 'a'], 4, 0, 3)).toEqual([
      'c',
      'b',
      'a'
    ]);
  });

  it('full dictionary 3, 2', () => {
    expect(extractToken(['d', 'c', 'b', 'a', 'x', 'z'], 6, 3, 2)).toEqual([
      'c',
      'b'
    ]);
  });
});
