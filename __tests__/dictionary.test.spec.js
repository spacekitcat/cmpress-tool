import Dictionary from '../src/dictionary';

describe('consume operation', () => {
  it('consumes 1 onto empty list', () => {
    let sut = new Dictionary();

    expect(sut.consume('a', 1)).toEqual('');
    expect(sut.getBuffer()).toEqual('a');
  });

  it('consumes 1 onto list of size 1', () => {
    let sut = new Dictionary('b');

    expect(sut.consume('a', 1)).toEqual('');
    expect(sut.getBuffer()).toEqual('ba');
  });

  it('consumes 1 onto list of size 1', () => {
    let sut = new Dictionary('b');

    expect(sut.consume('a', 1)).toEqual('');
    expect(sut.getBuffer()).toEqual('ba');
  });

  it('consumes 2 from token of 4 into list of size 4', () => {
    let sut = new Dictionary('abcd');

    expect(sut.consume('wxyz', 2)).toEqual('yz');
    expect(sut.getBuffer()).toEqual('cdwx');
  });
});
