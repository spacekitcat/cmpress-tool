import extractToken from '../src/extract-token';
import console from '../src/console';

describe('extractToken()', () => {
  it('returns undefined for zero arguments', () => {
    expect(extractToken()).toEqual(undefined);
  });

  it('returns undefined for (null, null) arguments', () => {
    expect(extractToken(null, 4, null)).toEqual(undefined);
  });

  it('Empty dictionary, new buffer', () => {
    expect(extractToken('', 4, 'abab')).toEqual('a');
  });

  it('one element dictionary', () => {
    expect(extractToken('a', 4, 'babc')).toEqual({
      position: 0,
      length: 0,
      token: 'b'
    });
  });

  it('[] [] -> tuple(x, x, x)', () => {
    expect(extractToken('ab', 4, 'abcb')).toEqual({
      position: 2,
      length: 2,
      token: 'c'
    });
  });

  it('[] [] -> tuple(x, x, x)', () => {
    expect(extractToken('babc', 4, 'baba')).toEqual({
      position: 0,
      length: 3,
      token: 'a'
    });
  });

  it('[] [] -> tuple(x, x, x)', () => {
    expect(extractToken('baba', 4, 'baaa')).toEqual({
      position: 0,
      length: 2,
      token: 'a'
    });
  });
});
