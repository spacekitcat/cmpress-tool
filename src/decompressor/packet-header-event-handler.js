import packetHeaderFromBinary from '../../src/serialization/packet-from-binary';

const packetHeaderEventHandler = (currentStreamChunk, currentHeaderBuffer) => {
    let headerSourceData = {};

    let expectedSize = packetHeaderFromBinary(currentHeaderBuffer).unreadByteCount;
    let newHeaderBuffer = Buffer.concat([currentHeaderBuffer, currentStreamChunk], currentHeaderBuffer.length + expectedSize);
    if (newHeaderBuffer.length === 0) {
        headerSourceData.headerReadComplete = true;
        headerSourceData.updatedHeaderBuffer = newHeaderBuffer;
    } else {
        if (newHeaderBuffer.length < 2) {
            headerSourceData.headerReadComplete = false;
            headerSourceData.updatedHeaderBuffer = Buffer.from(newHeaderBuffer);
        } else {
            headerSourceData.headerReadComplete = true;
            headerSourceData.updatedHeaderBuffer = Buffer.from(newHeaderBuffer);
        }
    }
    
    return headerSourceData;
};

export default packetHeaderEventHandler;
