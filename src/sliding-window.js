class SlidingWindow {
  constructor(stream, lookBackLength, lookAheadLength, inputStream) {
    this.stream = stream;
    this.lookBackLength = lookBackLength;
    this.lookAheadLength = lookAheadLength;
    this.cursor = 0;
  }

  lookAhead() {
    const forwardBuffer = this.stream.slice(
      this.cursor,
      this.cursor + this.lookAheadLength
    );
    return forwardBuffer;
  }

  lookBack() {
    let from = Math.max(this.cursor - this.lookBackLength, 0);
    const backwardBuffer = this.stream.slice(from, this.cursor);
    return backwardBuffer;
  }

  slideBy(amount) {
    this.cursor += amount;
  }

  slide(operation) {
    let token = operation(this.lookBack().join(''), this.lookAhead().join(''));

    if (token.prefix !== undefined) {
      this.slideBy(token.prefix[1] + 1);
    } else {
      this.slideBy(1);
    }
    return token;
  }
}

export { SlidingWindow };
