const unpackIntegerByte = (integer, fixedWidth) => {
    let bytes = [];

    const requiresAnotherPaddingByte = () => fixedWidth && bytes.length < fixedWidth;
    do {
        bytes.push(0x000000FF & integer);
        integer = integer >> 8;
        if (bytes.length >= fixedWidth) {
            break;
        }
    } while (integer > 0 || requiresAnotherPaddingByte());
  
    return Buffer.from(bytes);
}

export default unpackIntegerByte;
