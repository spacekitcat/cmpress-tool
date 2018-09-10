import compress from '../src/compress';

describe('inflate', () => {
  describe('when the compression string is aaba', () => {
    let result;
    beforeAll(() => {
      result = compress('aabaab');
    });

    it('frame 1', () => {
      expect(result[0]).toEqual(
        expect.objectContaining({ token: 'a', prefix: undefined })
      );
    });

    it('frame 2', () => {
      expect(result[1]).toEqual(
        expect.objectContaining({ token: 'b', prefix: [1, 1] })
      );
    });

    it('frame 3', () => {
      expect(result[2]).toEqual(
        expect.objectContaining({ token: 'b', prefix: [2, 2] })
      );
    });
  });

  describe('when the compression string is aaba', () => {
    let result;
    beforeAll(() => {
      result = compress('xxxxyxyy');
    });

    it('frame 1', () => {
      expect(result[0]).toEqual(
        expect.objectContaining({ token: 'x', prefix: undefined })
      );
    });

    it('frame 2', () => {
      expect(result[1]).toEqual(
        expect.objectContaining({ token: 'x', prefix: [1, 1] })
      );
    });

    it('frame 3', () => {
      expect(result[2]).toEqual(
        expect.objectContaining({ token: 'y', prefix: [1, 1] })
      );
    });

    it('frame 4', () => {
      expect(result[3]).toEqual(
        expect.objectContaining({ token: 'y', prefix: [1, 2] })
      );
    });
  });

  describe('when the compression string is helloworld', () => {
    let result;
    beforeAll(() => {
      result = compress('helloworld', 32, 32);
    });

    it('frame 1', () => {
      expect(result[0]).toEqual(
        expect.objectContaining({ token: 'h', prefix: undefined })
      );
    });

    it('frame 2', () => {
      expect(result[1]).toEqual(
        expect.objectContaining({ token: 'e', prefix: undefined })
      );
    });

    it('frame 3', () => {
      expect(result[2]).toEqual(
        expect.objectContaining({ token: 'l', prefix: undefined })
      );
    });

    it('frame 4', () => {
      expect(result[3]).toEqual(
        expect.objectContaining({ token: 'o', prefix: [1, 1] })
      );
    });

    it('frame 5', () => {
      expect(result[4]).toEqual(
        expect.objectContaining({ token: 'w', prefix: undefined })
      );
    });

    it('frame 6', () => {
      expect(result[5]).toEqual(
        expect.objectContaining({ token: 'r', prefix: [2, 1] })
      );
    });

    it('frame 7', () => {
      expect(result[6]).toEqual(
        expect.objectContaining({ token: 'd', prefix: [5, 1] })
      );
    });
  });
});
