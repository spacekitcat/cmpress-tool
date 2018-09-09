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
      position: 0,
      length: 0,
      token: 'a'
    });
  });

  it('one element dictionary', () => {
    expect(locateToken('a', 4, 'babc')).toMatchObject({
      position: 0,
      length: 0,
      token: 'b'
    });
  });

  it('[] [] -> tuple(x, x, x)', () => {
    expect(locateToken('ab', 4, 'abcb')).toMatchObject({
      position: 1,
      length: 1,
      token: 'c'
    });
  });

  it('[] [] -> tuple(x, x, x)', () => {
    expect(locateToken('babc', 4, 'baba')).toMatchObject({
      position: 1,
      length: 2,
      token: 'a'
    });
  });

  it('[] [] -> tuple(x, x, x)', () => {
    expect(locateToken('baba', 4, 'baaa')).toMatchObject({
      position: 1,
      length: 1,
      token: 'a'
    });
  });

  it('Empty dictionary, new buffer', () => {
    expect(locateToken('', 6, 'aaca')).toMatchObject({
      position: 0,
      length: 0,
      token: 'a'
    });
  });
});
