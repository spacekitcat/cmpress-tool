import locateToken from './locate-token';

const compressSlideImpl = (lookAhead, lookBack, lookBackLength) => {
  return locateToken(lookBack, lookBackLength, lookAhead);
};

const deflateSlideImpl = (lookAhead, lookBack, lookBackLength) => {
  return locateToken(lookBack, lookBackLength, lookAhead);
};

class SlidingWindow {
  constructor(operation, stream, lookBackLength = 4, lookAheadLength = 4) {
    this.stream = stream;
    this.lookBackLength = lookBackLength;
    this.lookAheadLength = lookAheadLength;
    this.cursor = 0;
    this.compressedStream = [];
    this.operation = operation;
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
    let token = this.operation(
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

export { SlidingWindow, compressSlideImpl, deflateSlideImpl };
