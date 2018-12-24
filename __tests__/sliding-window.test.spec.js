import { SlidingWindow } from '../src/sliding-window';

//describe('SlidingWindow', () => {
//   let inputStream = new Buffer([97, 97, 98, 97]);

//   let slidingWindow;
//   describe('intial cursor', () => {
//     beforeAll(() => {
//       slidingWindow = new SlidingWindow(4);
//       slidingWindow.setInput(inputStream);
//     });

//     it('has the correct lookAhead contents', () => {
//       expect(slidingWindow.lookAhead()).toMatchObject(Buffer.from('aaba'));
//     });

//     it('has the correct lookBack contents', () => {
//       expect(slidingWindow.lookBack()).toEqual(Buffer.from(''));
//     });
//   });

//   describe('slide 2', () => {
//     beforeAll(() => {
//       slidingWindow = new SlidingWindow(4);
//       slidingWindow.setInput(inputStream);
//       slidingWindow.slideBy(2);
//     });

//     it('has the correct lookAhead contents', () => {
//       expect(slidingWindow.lookAhead()).toEqual(Buffer.from('ba'));
//     });

//     it('has the correct lookBack contents', () => {
//       expect(slidingWindow.lookBack()).toEqual(Buffer.from('aa'));
//     });
//   });

//   describe('slide callback 2', () => {
//     beforeAll(() => {
//       slidingWindow = new SlidingWindow(4);
//       slidingWindow.setInput(inputStream);
//       slidingWindow.slide((lookAhead, lookbackLength) => ({
//         prefix: [0, 0]
//       }));
//     });

//     it('has the correct lookAhead contents', () => {
//       expect(slidingWindow.lookAhead()).toEqual(Buffer.from('aba'));
//     });

//     it('has the correct lookBack contents', () => {
//       expect(slidingWindow.lookBack()).toEqual(Buffer.from('a'));
//     });
//   });
// });

describe('The `setInput` method', () => {
  // it('should have the provided buffer contents after two calls', () => {
  //   const slidingWindow = new SlidingWindow(4);
  //   slidingWindow.setInput(Buffer.from([0x61]));
  //   slidingWindow.setInput(Buffer.from([0x63]));
  //   expect(slidingWindow.lookAhead()).toEqual(Buffer.from([0x00, 0x00, 0x61, 0x63]));
  // });

  // it('should have the provided buffer contents after three calls', () => {
  //   const slidingWindow = new SlidingWindow(4);
  //   slidingWindow.setInput(Buffer.from([0x61]));
  //   slidingWindow.setInput(Buffer.from([0x63]));
  //   slidingWindow.setInput(Buffer.from([0x67]));
  //   slidingWindow.setInput(Buffer.from([0x69]));
  //   expect(slidingWindow.lookAhead()).toEqual(Buffer.from([0x61, 0x63, 0x67, 0x69]));
  // });

  it.only('should have the provided buffer contents after two calls and a slide operation', () => {
    const slidingWindow = new SlidingWindow(4);
    slidingWindow.setInput(Buffer.from([0x61]));
    slidingWindow.setInput(Buffer.from([0x63]));
    slidingWindow.slideBy(1);
    expect(slidingWindow.lookAhead()).toEqual(Buffer.from([0x00, 0x00, 0x00, 0x63]));
  });
})
