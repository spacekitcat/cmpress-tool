import deserializePacket from '../src/deserialize-packet.js';

describe('serializePacket()', () => {
  describe('and no arguments are provided', () => {
    let testTargetResult;
    beforeAll(() => {
      testTargetResult = deserializePacket();
    });

    it('returns an empty string', () => {
      expect(testTargetResult).toEqual('');
    });
  });

  describe('and a null arguments are provided', () => {
    let testTargetResult;
    beforeAll(() => {
      testTargetResult = deserializePacket(null);
    });

    it('returns an empty string', () => {
      expect(testTargetResult).toEqual('');
    });
  });

  describe('and a compression packet with only a token is provided', () => {
    let testTargetResult;
    beforeAll(() => {
      testTargetResult = deserializePacket(
        Buffer.from('0e00000002740002000000610000', 'hex').toString('ucs2')
      );
    });

    it('returns correct encoding', () => {
      expect(testTargetResult).toEqual({ t: 'a' });
    });
  });
});
