import _ from 'lodash';
import console from './console';
import locateToken from './locate-token';

/** I'll put this in it's own class with unit tests once I work out the exact specs.
 *  I think the slide mechanism can be controlled by a callback that's able to
 *  determine when the look ahead contains new tokens.
 */
class SlidingWindow {
  constructor(stream, lookBackLength = 6, lookAheadLength = 4) {
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
    this.compressedStream.push({ symbol });
  }

  slideBy(amount) {
    this.cursor += amount;
  }

  slide() {
    let token = locateToken(
      this.lookBack(),
      this.lookBackLength,
      this.lookAhead()
    );

    this.slideBy(
      token.position + token.length > 0 ? token.position + token.length : 1
    );
    this.saveCompressedStreamPacket(token);
  }
}

const compress = stream => {
  console.log('currentmethod: compress');
  let slidingWindow = new SlidingWindow(stream);
  while (slidingWindow.lookAhead()) {
    slidingWindow.slide();
  }

  slidingWindow.getCompressedStream().forEach(item => {
    console.log(item);
  });

  return slidingWindow.getCompressedStream();
};

export default compress;
