import locateToken from '../src/locate-token';
import console from '../src/console';

describe('locateToken()', () => {
  it('returns undefined for zero arguments', () => {
    expect(locateToken()).toEqual(undefined);
  });

  it('returns undefined for (null, null) arguments', () => {
    expect(locateToken(null, 4, null)).toEqual(undefined);
  });

  it('Empty dictionary, new buffer', () => {
    expect(locateToken('', 4, 'abab')).toMatchObject({
      prefix: undefined,
      token: 'a'
    });
  });

  it('one element dictionary', () => {
    expect(locateToken('a', 4, 'babc')).toMatchObject({
      prefix: undefined,
      token: 'b'
    });
  });

  it('[] [] -> tuple(x, x, x)', () => {
    expect(locateToken('ab', 4, 'abcb')).toMatchObject({
      prefix: [1, 2],
      token: 'c'
    });
  });

  it('[] [] -> tuple(x, x, x)', () => {
    expect(locateToken('babc', 4, 'baba')).toMatchObject({
      prefix: [2, 3],
      token: 'a'
    });
  });

  it('[] [] -> tuple(x, x, x)', () => {
    expect(locateToken('baba', 4, 'baaa')).toMatchObject({
      prefix: [1, 2],
      token: 'a'
    });
  });

  it('Empty dictionary, new buffer', () => {
    expect(locateToken('', 6, 'aaca')).toMatchObject({
      prefix: undefined,

      token: 'a'
    });
  });

  it('a -> abaa', () => {
    expect(locateToken('a', 4, 'abaa')).toMatchObject({
      prefix: [1, 1],
      token: 'b'
    });
  });

  it('ab -> aab', () => {
    expect(locateToken('ab', 4, 'aab')).toMatchObject({
      prefix: [2, 1],
      token: 'a'
    });
  });
});
