import unpackIntegerToByte from '../src/unpack-integer-to-byte';

describe('The unpackIntegerByte function', () => {
    it('should convert 0 (1 byte) to little endian equivilent bytes', () => {
        expect(unpackIntegerToByte(0)).toMatchObject(Buffer.from([0x00]));
    });

    it('should convert 1 (1 byte) to little endian equivilent bytes', () => {
        expect(unpackIntegerToByte(1)).toMatchObject(Buffer.from([0x01]));
    });

    it('should convert 255 (1 byte) to little endian equivilent bytes', () => {
        expect(unpackIntegerToByte(255)).toMatchObject(Buffer.from([0xFF]));
    });

    it('should convert 256 (2 byte) to little endian equivilent bytes', () => {
        expect(unpackIntegerToByte(256)).toMatchObject(Buffer.from([0x00, 0x01]));
    });

    it('should convert 65535 (2 byte) to little endian equivilent bytes', () => {
        expect(unpackIntegerToByte(65535)).toMatchObject(Buffer.from([0xFF, 0xFF]));
    });

    it('should convert 65536 (3 byte) to little endian equivilent bytes', () => {
        expect(unpackIntegerToByte(65536)).toMatchObject(Buffer.from([0x00, 0x00, 0x01]));
    });

    it('should convert 16777215 (3 byte) to little endian equivilent bytes', () => {
        expect(unpackIntegerToByte(16777215)).toMatchObject(Buffer.from([0xFF, 0xFF, 0xFF]));
    });

    it('should convert 16777216 (4 byte) to little endian equivilent bytes', () => {
        expect(unpackIntegerToByte(16777216)).toMatchObject(Buffer.from([0x00, 0x00, 0x00, 0x01]));
    });

    describe('and a fixed width is provided', () => {
        it('should convert 1 (1 byte) to little endian equivilent bytes and pad to 2 bytes', () => {
            expect(unpackIntegerToByte(1, 2)).toMatchObject(Buffer.from([0x01, 0x00]));
        });

        it('should truncate the 2 byte number to 1', () => {
            expect(unpackIntegerToByte(65535, 1)).toMatchObject(Buffer.from([0xFF]));
        });

        it('should pad the 2 byte number to 4', () => {
            expect(unpackIntegerToByte(65535, 4)).toMatchObject(Buffer.from([0xFF, 0xFF, 0x00, 0x00]));
        });
    })
});
