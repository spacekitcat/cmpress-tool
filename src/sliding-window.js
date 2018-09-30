class SlidingWindow {
  constructor(lookBackLength, lookAheadLength) {
    this.lookBackLength = lookBackLength;
    this.lookAheadLength = lookAheadLength;
    this.cursor = 0;
  }

  setInput(inputStream) {
    this.inputStream = Buffer.from(inputStream).toString('utf8').split('')
      //.toString('hex')
      //.match(/.{1,2}/g);
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

    if (token.p !== undefined) {
      this.slideBy(token.p[1] + 1);
    } else {
      this.slideBy(1);
    }
    return token;
  }
}

export { SlidingWindow };
