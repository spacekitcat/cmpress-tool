import BSON from 'bson';

const bson = new BSON();

const serializePacket = packet => {
  if (!packet) {
    return '';
  }
  return bson.serialize(packet).toString('ucs2');
};

export default serializePacket;
