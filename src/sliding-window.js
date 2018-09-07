import locateToken from './locate-token';

const compressSlideImpl = (lookAhead, lookBack, lookBackLength) => {
  return locateToken(lookBack, lookBackLength, lookAhead);
};

export default class SlidingWindow {
  constructor(stream, lookBackLength = 10, lookAheadLength = 4) {
    this.stream = stream;
    this.lookBackLength = lookBackLength;
    this.lookAheadLength = lookAheadLength;
    this.cursor = 0;
    this.compressedStream = [];
  }

  lookAhead() {
    const forwardBuffer = this.stream.substring(
      this.cursor,
      this.cursor + this.lookAheadLength
    );
    return forwardBuffer;
  }

  lookBack() {
    let from = Math.max(this.cursor - this.lookBackLength, 0);
    const backwardBuffer = this.stream.substring(from, this.cursor);
    return backwardBuffer;
  }

  getCompressedStream() {
    return this.compressedStream.reverse();
  }

  saveCompressedStreamPacket(symbol) {
    this.compressedStream.push(symbol);
  }

  slideBy(amount) {
    this.cursor += amount;
  }

  slide() {
    let token = compressSlideImpl(
      this.lookAhead(),
      this.lookBack(),
      this.lookBackLength
    );
    this.slideBy(
      token.position + token.length > 0 ? token.position + token.length : 1
    );
    this.saveCompressedStreamPacket(token);
  }
}
