class SlidingWindow {
  constructor(inputStream, lookBackLength, lookAheadLength) {
    this.inputStream = inputStream;
    this.lookBackLength = lookBackLength;
    this.lookAheadLength = lookAheadLength;
    this.cursor = 0;
  }

  setInput(inputStream) {
    this.inputStream = inputStream.toString('utf8').split('');
  }

  lookAhead() {
    const forwardBuffer = this.inputStream.slice(
      this.cursor,
      this.cursor + this.lookAheadLength
    );
    return forwardBuffer;
  }

  lookBack() {
    let from = Math.max(this.cursor - this.lookBackLength, 0);
    const backwardBuffer = this.inputStream.slice(from, this.cursor);
    return backwardBuffer;
  }

  slideBy(amount) {
    this.cursor += amount;
  }

  slide(operation) {
    let token = operation(this.lookBack(), this.lookAhead());

    if (token.prefix !== undefined) {
      this.slideBy(token.prefix[1] + 1);
    } else {
      this.slideBy(1);
    }
    return token;
  }
}

export { SlidingWindow };
