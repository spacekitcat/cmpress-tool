import consumeInput from './consume-input';

class SlidingWindow {
  constructor(dictionarySize) {
    this.dictionarySize = dictionarySize;
    this.dictionaryBuffer = Buffer.alloc(this.dictionarySize, 0x00);
    this.newInputBytes = Buffer.alloc(this.dictionarySize, 0x00);
    this.cursor = 0;
  }

  setInput(newInputBytes) {
    this.newInputBytes.copy(this.newInputBytes, 0, newInputBytes.length, this.newInputBytes.length);
    newInputBytes.copy(this.newInputBytes, this.newInputBytes.length - newInputBytes.length , 0)
    this.cursor = 0;
  }

  slideBy(amount) {
    //console.log(this.dictionaryBuffer);
    //console.log(this.newInputBytes); 
    //this.dictionaryBuffer.copy(this.dictionaryBuffer, 0, amount, this.dictionaryBuffer.length);
    
    console.log(this.dictionaryBuffer); 
    console.log(this.newInputBytes); 
    console.log(amount);
    //this.newInputBytes.copy(this.dictionaryBuffer, 0, 0, this.newInputBytes.length);
    
    console.log(this.dictionaryBuffer);
    console.log(this.newInputBytes);     
    
    //this.dictionaryBuffer.copy(this.newInputBytes, 0, amount, this.newInputBytes.length);
    //this.newInputBytes.copy(this.newInputBytes, 0, amount, this.newInputBytes.length);
  }

  lookAhead() {
    return this.newInputBytes;
  }

  lookBack() {
    return this.dictionaryBuffer;
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
