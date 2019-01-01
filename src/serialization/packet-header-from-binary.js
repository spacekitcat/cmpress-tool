const packetHeaderFromBinary = headerBytes => {
    return ({
        size: headerBytes.readUInt32LE(0),
        hasPrefix: headerBytes[4] & 0x0001 ? true : false
    });
}

export default packetHeaderFromBinary;
