// import packetHeaderFromBinary from '../../src/serialization/packet-from-binary';

const packetHeaderEventHandler = (currentStreamChunk, currentHeaderBuffer) => {
    let headerSourceData = {};

    let newHeaderBuffer = Buffer.concat([currentHeaderBuffer, currentStreamChunk], currentStreamChunk.length + currentHeaderBuffer.length);
    if (newHeaderBuffer.length === 0) {
        headerSourceData.headerReadComplete = true;
        headerSourceData.updatedHeaderBuffer = newHeaderBuffer;
    } else {
        if (newHeaderBuffer.length < 2) {
            headerSourceData.headerReadComplete = false;
            headerSourceData.updatedHeaderBuffer = Buffer.from(newHeaderBuffer.slice(0, 1));
        } else {
            headerSourceData.headerReadComplete = true;
            headerSourceData.updatedHeaderBuffer = Buffer.from(newHeaderBuffer.slice(0, 2));
        }
    }
    
    return headerSourceData;
};

export default packetHeaderEventHandler;
