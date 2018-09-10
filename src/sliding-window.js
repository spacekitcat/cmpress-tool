class SlidingWindow {
  constructor(stream, lookBackLength = 4, lookAheadLength = 4) {
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
    return this.compressedStream;
  }

  saveCompressedStreamPacket(symbol) {
    this.compressedStream.push(symbol);
  }

  slideBy(amount) {
    this.cursor += amount;
  }

  slide(operation) {
    let token = operation(
      this.lookAhead(),
      this.lookBack(),
      this.lookBackLength
    );

    if (token.prefix !== undefined) {
      this.slideBy(token.prefix[1] + 1);
    } else {
      this.slideBy(1);
    }
    this.saveCompressedStreamPacket(token);
  }
}

export { SlidingWindow };
