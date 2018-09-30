import serializePacket from '../src/serialize-packet.js';

describe('serializePacket()', () => {
  describe('and no arguments are provided', () => {
    let testTargetResult;
    beforeAll(() => {
      testTargetResult = serializePacket();
    });

    it('returns an empty string', () => {
      expect(testTargetResult).toEqual('');
    });
  });

  describe('and a null arguments are provided', () => {
    let testTargetResult;
    beforeAll(() => {
      testTargetResult = serializePacket(null);
    });

    it('returns an empty string', () => {
      expect(testTargetResult).toEqual('');
    });
  });

  describe('and a compression packet with only a token is provided', () => {
    let testTargetResult;
    beforeAll(() => {
      testTargetResult = serializePacket({ t: 'a' });
    });

    it('returns correct encoding', () => {
      expect(Buffer.from(testTargetResult, 'ucs2').toString('hex')).toEqual(
        '0e00000002740002000000610000'
      );
    });
  });
});
