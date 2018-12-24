import CircularBufferQueue from '../src/circular-buffer-queue';

describe("The `CircularBufferQueue` structure", () => {
    describe('Its initial state', () => {
        it('should initialise a blank queue, padded to the queue size', () => {
            const circularBufferQueue = new CircularBufferQueue(4);
            expect(circularBufferQueue.contents()).toMatchObject(new Buffer([0x00, 0x00, 0x00, 0x00]))
        });
    });

    describe('After pushing a new, one item Buffer', () => {
        it('should initialise a blank queue, padded to the queue size', () => {
            const circularBufferQueue = new CircularBufferQueue(4);
            circularBufferQueue.push(new Buffer([0x01]));
            expect(circularBufferQueue.contents()).toMatchObject(new Buffer([0x00, 0x00, 0x00, 0x01]))
        });
    });

    describe('After pushing a new, two item Buffer', () => {
        it('should initialise a blank queue, padded to the queue size', () => {
            const circularBufferQueue = new CircularBufferQueue(4);
            circularBufferQueue.push(new Buffer([0x01]));
            circularBufferQueue.push(new Buffer([0x02]));
            expect(circularBufferQueue.contents()).toMatchObject(new Buffer([0x00, 0x00, 0x02, 0x01]))
        });
    });
});
