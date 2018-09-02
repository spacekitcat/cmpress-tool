import _ from 'lodash';
import console from './console';

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
  }

  lookAhead() {
    const forwardBuffer = this.stream.substring(
      this.cursor,
      this.cursor + this.lookAheadLength
    );
    return forwardBuffer;
  }

  lookBack() {
    let from =
      this.cursor > this.lookBackLength ? this.cursor - this.lookBackLength : 0;
    const backwardBuffer = this.stream.substring(from, this.cursor);
    return backwardBuffer;
  }

  slide() {
    console.log(`${this.lookBack()}\t|${this.lookAhead()}`);
    this.cursor += 1;
  }
}

const compress = stream => {
  console.log('currentmethod: compress');
  let slidingWindow = new SlidingWindow(stream);
  while (slidingWindow.lookAhead()) {
    slidingWindow.slide();
  }
  return stream;
};

export default compress;
