import compress from '../src/compress';
import inflate from '../src/inflate';
import console from '../src/console';

describe('inflate', () => {
  it('returns the input str, s, s + s', () => {
    let result = compress('iquitelikecorvids');
    let inflatwResult = inflate(result);

    //expect(result).toBe('abcd');
  });
});
