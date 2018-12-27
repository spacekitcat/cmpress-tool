const unpackIntegerByte = (integer, fixedWidth) => {
    let bytes = [];

    do {
        bytes.push(0x000000FF & integer);
        integer = integer >> 8;
        if (bytes.length >= fixedWidth) {
            break;
        }
    } while (integer > 0);
  
    while (bytes.length < fixedWidth) {
        bytes.push(0x00);
    }

    return Buffer.from(bytes);
}

export default unpackIntegerByte;
