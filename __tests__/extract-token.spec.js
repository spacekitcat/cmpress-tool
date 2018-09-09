import extractToken from '../src/extract-token';
import console from '../src/console';

describe('extractToken()', () => {
  it('returns undefined for zero arguments', () => {
    expect(extractToken()).toEqual(undefined);
  });

  it('returns undefined for a null dictionary', () => {
    expect(extractToken(null, null, 0, 0)).toEqual(undefined);
  });

  it('returns undefined for an empty dictionary', () => {
    expect(extractToken('', 4, 0, 0)).toEqual(undefined);
  });

  it('one element dictionary 0,0', () => {
    expect(extractToken('a', 4, 0, 0)).toEqual('a');
  });

  it('full dictionary 0,0', () => {
    expect(extractToken('dcba', 4, 0, 0)).toEqual('a');
  });

  it('full dictionary 0, 3', () => {
    expect(extractToken('dcba', 4, 0, 3)).toEqual('cba');
  });

  it('full dictionary 3, 2', () => {
    expect(extractToken('dcbaxz', 6, 3, 2)).toEqual('cb');
  });
});
