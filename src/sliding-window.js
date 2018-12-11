class SlidingWindow {
  constructor(dictionarySize) {
    this.dictionarySize = dictionarySize;
    this.cursor = 0;
  }

  setInput(inputStream) {
    this.inputStream = Buffer.from(inputStream);
    this.cursor = 0;
  }

  lookAhead() {
    const forwardBuffer = this.inputStream.slice(
      this.cursor,
      this.cursor + this.dictionarySize
    );
    return forwardBuffer;
  }

  lookBack() {
    let from = Math.max(this.cursor - this.dictionarySize, 0);
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
