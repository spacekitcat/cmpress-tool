import serializePacketToBinary from '../src/serialize-packet-to-binary';
describe('serializePacketToBinary', () => {
  let result;
  let argument;
  beforeEach(() => {
    result = serializePacketToBinary(argument);
  });

  describe('when the input is a blank string', () => {
    beforeAll(() => {
      argument = undefined;
    });

    it('should throw an Error', () => {
      expect(() => serializePacketToBinary('')).toThrowError(
        'Error: Invalid compression packet format.'
      );
    });
  });

  describe('when the input is undefined', () => {
    beforeAll(() => {
      argument = null;
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

  describe('when the input has a valid token value, `t`', () => {
    beforeAll(() => {
      argument = { t: 'g' };
    });

    it('should return a binary representation of the packet', () => {
      expect(result).toBe('g');
    });
  });

  describe('when the input has a blank token value, `t`', () => {
    beforeAll(() => {
      argument = { t: '' };
    });

    it('should return a blank string', () => {
      expect(result).toBe('');
    });
  });

  describe('when the input has a valid prefix value, `p`', () => {
    beforeAll(() => {
      argument = { t: 'e', p: [1, 3] };
    });

    it('should return a binary representation of the packet', () => {
      expect(result).toBe('eP1,3');
    });
  });

  describe('when the input only has 1 position for the prefix value, `p`', () => {
    beforeAll(() => {
      argument = undefined;
    });

    it('should throw an Error', () => {
      expect(() => serializePacketToBinary({ t: 'b', p: [4] })).toThrowError(
        /Error: Invalid compression packet format./
      );
    });
  });
});
