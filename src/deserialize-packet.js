import BSON from 'bson';

const bson = new BSON();

const deserializePacket = packet => {
  if (!packet) {
    return '';
  }

  return bson.deserialize(Buffer.from(packet.toString('utf8'), 'ucs2'));
};

export default deserializePacket;
