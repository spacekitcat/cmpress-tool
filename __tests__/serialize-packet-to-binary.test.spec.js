import serializePacketToBinary from '../src/serialize-packet-to-binary';
describe('serializePacketToBinary', () => {
  let result;
  let argument;
  beforeEach(() => {
    result = serializePacketToBinary(argument);
  });

  describe('when the input is undefined', () => {
    beforeAll(() => {
      argument = undefined;
    });

    it('should return a blank string', () => {
      expect(result).toBe('');
    });
  });

  describe('when the input is null', () => {
    beforeAll(() => {
      argument = null;
    });

    it('should return a blank string', () => {
      expect(result).toBe('');
    });
  });

  describe('when the input is an empty object', () => {
    beforeAll(() => {
      argument = {};
    });

    it('should return a blank string', () => {
      expect(result).toBe('');
    });
  });

  describe('when the input is a non-empty string (wrong type)', () => {
    beforeAll(() => {
      argument = undefined;
    });

    it('should throw an Error', () => {
      expect(() => serializePacketToBinary('invalid-arg')).toThrowError(
        'Error: Invalid compression packet format.'
      );
    });
  });

  describe('when the input has the wrong datatype for the token, `t`', () => {
    beforeAll(() => {
      argument = undefined;
    });

    it('should throw an Error', () => {
      expect(() => serializePacketToBinary({ t: {} })).toThrowError(
        /Error: Invalid compression packet format./
      );
    });
  });

  describe('when the input has the correct datatype for the token, `t`', () => {
    beforeAll(() => {
      argument = { t: 'g' };
    });

    it('should return a binary representation of the packet', () => {
      expect(result).toBe('1g');
    });
  });
});
