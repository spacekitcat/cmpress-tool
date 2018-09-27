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
    expect(extractToken(['61'], 4, 0, 0)).toEqual(['61']);
  });

  it('full dictionary 0,0', () => {
    expect(extractToken(['64', '63', '62', '61'], 4, 0, 0)).toEqual(['61']);
  });

  it('full dictionary 0, 3', () => {
    expect(extractToken(['64', '63', '62', '61'], 4, 0, 3)).toEqual([
      '63',
      '62',
      '61'
    ]);
  });

  it('full dictionary 3, 2', () => {
    expect(extractToken(['d', 'c', 'b', 'a', 'x', 'z'], 6, 3, 2)).toEqual([
      'c',
      'b'
    ]);
  });
});
