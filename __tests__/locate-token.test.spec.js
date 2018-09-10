import locateToken from '../src/locate-token';

describe('locateToken()', () => {
  it('returns undefined for zero arguments', () => {
    expect(locateToken()).toEqual(undefined);
  });

  it('returns undefined for (null, null) arguments', () => {
    expect(locateToken(null, null)).toEqual(undefined);
  });

  it('Empty dictionary, new buffer', () => {
    expect(locateToken('', 'abab')).toMatchObject({
      prefix: undefined,
      token: 'a'
    });
  });

  it('one element dictionary', () => {
    expect(locateToken('a', 'babc')).toMatchObject({
      prefix: undefined,
      token: 'b'
    });
  });

  it('[] [] -> tuple(x, x, x)', () => {
    expect(locateToken('ab', 'abcb')).toMatchObject({
      prefix: [1, 2],
      token: 'c'
    });
  });

  it('[] [] -> tuple(x, x, x)', () => {
    expect(locateToken('babc', 'baba')).toMatchObject({
      prefix: [2, 3],
      token: 'a'
    });
  });

  it('[] [] -> tuple(x, x, x)', () => {
    expect(locateToken('baba', 'baaa')).toMatchObject({
      prefix: [1, 2],
      token: 'a'
    });
  });

  it('Empty dictionary, new buffer', () => {
    expect(locateToken('', 'aaca')).toMatchObject({
      prefix: undefined,

      token: 'a'
    });
  });

  it('a -> abaa', () => {
    expect(locateToken('a', 'abaa')).toMatchObject({
      prefix: [1, 1],
      token: 'b'
    });
  });

  it('ab -> aab', () => {
    expect(locateToken('ab', 'aab')).toMatchObject({
      prefix: [2, 1],
      token: 'a'
    });
  });
});
