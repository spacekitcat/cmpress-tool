import packetHeaderEventHandler from '../../src/decompressor/packet-header-event-handler';
import packetHeaderFromBinary from '../../src/serialization/packet-from-binary';

jest.mock('../../src/serialization/packet-from-binary');

const verifyCall = (
  currentStreamChunkSpecifiedArg,
  currentHeaderBufferSpecifiedArg,
  expectedReturnObject
) => {
  expect(
    packetHeaderEventHandler(
      Buffer.from(currentStreamChunkSpecifiedArg),
      Buffer.from(currentHeaderBufferSpecifiedArg)
    )
  ).toMatchObject(expectedReturnObject);
};

describe('The `packetHeaderEventHandler` function', () => {
  describe('When both lists are empty', () => {
    beforeEach(() => {
      packetHeaderFromBinary.mockReturnValueOnce({
        unreadByteCount: 0
      });
    });

    it('should return the expected response', () => {
      verifyCall(Buffer.from([]), Buffer.from([]), {
        updatedHeaderBuffer: Buffer.from([]),
        headerReadComplete: true
      });
    });
  });
    
  describe('When the next unread header is 2-bytes', () => {
    describe('and all of the required bytes are in `currentStreamChunk`', () => {
      beforeEach(() => {
        packetHeaderFromBinary.mockReturnValueOnce({
          unreadByteCount: 2
        });
      });

      it('should return the expected response', () => {
        verifyCall(Buffer.from([0x00, 0x01, 0xff, 0xff]), Buffer.from([]), {
          updatedHeaderBuffer: Buffer.from([0x00, 0x01]),
          headerReadComplete: true
        });
      });

      it('should return the expected response (varied values, equivalent scenario)', () => {
        verifyCall(Buffer.from([0x01, 0x02, 0xff]), Buffer.from([]), {
          updatedHeaderBuffer: Buffer.from([0x01, 0x02]),
          headerReadComplete: true
        });
      });
    });

    describe('and only the 1st (of two) byte is in `currentStreamChunk`', () => {
      beforeEach(() => {
        packetHeaderFromBinary.mockReturnValueOnce({
          unreadByteCount: 1
        });
      });

      it('should return the expected response', () => {
        verifyCall(Buffer.from([0x00]), Buffer.from([]), {
          updatedHeaderBuffer: Buffer.from([0x00]),
          headerReadComplete: false
        });
      });

      it('should return the expected response (varied values, equivalent scenario)', () => {
        verifyCall(Buffer.from([0x12]), Buffer.from([]), {
          updatedHeaderBuffer: Buffer.from([0x12]),
          headerReadComplete: false
        });
      });
    });

    describe('and the 2nd (of two) byte is in `currentStreamChunk`', () => {
      beforeEach(() => {
        packetHeaderFromBinary.mockReturnValueOnce({
          unreadByteCount: 1
        });
      });

      it('should return the expected response', () => {
        verifyCall(Buffer.from([0x01, 0xff, 0xff, 0xff]), Buffer.from([0x00]), {
          updatedHeaderBuffer: Buffer.from([0x00, 0x01]),
          headerReadComplete: true
        });
      });

      it('should return the expected response (varied values, equivalent scenario)', () => {
        verifyCall(Buffer.from([0x11, 0xff, 0xff]), Buffer.from([0x33]), {
          updatedHeaderBuffer: Buffer.from([0x33, 0x11]),
          headerReadComplete: true
        });
      });
    });
  });

  describe('When the 2-byte header is already in `currentHeaderBuffer`', () => {
    beforeEach(() => {
      packetHeaderFromBinary.mockReturnValueOnce({
        unreadByteCount: 0
      });
    });

    it('should return the expected response', () => {
      verifyCall(Buffer.from([0xff, 0xff]), Buffer.from([0x01, 0x01]), {
        updatedHeaderBuffer: Buffer.from([0x01, 0x01]),
        headerReadComplete: true
      });
    });
  });

  describe('When the next unread header is 3-bytes', () => {
    beforeEach(() => {
      packetHeaderFromBinary.mockReturnValueOnce({
        unreadByteCount: 3
      });
    });

    it('should return the expected response', () => {
      verifyCall(Buffer.from([0x34, 0x45, 0x76]), Buffer.from([]), {
        updatedHeaderBuffer: Buffer.from([0x34, 0x45, 0x76]),
        headerReadComplete: true
      });
    });

    it('should return the expected response (varied values, equivalent scenario)', () => {
      verifyCall(Buffer.from([0x11, 0x22, 0x33]), Buffer.from([]), {
        updatedHeaderBuffer: Buffer.from([0x11, 0x22, 0x33]),
        headerReadComplete: true
      });
    });
  });
});
