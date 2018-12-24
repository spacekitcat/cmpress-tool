class CircularBufferQueue {
    constructor() {
        this.buffer = Buffer.alloc(4, 0x00, 'hex');
    }

    contents() {
        return this.buffer;
    }

    push(content) {
        this.buffer.copy(this.buffer, 0, content.length, content.length);
        content.copy(this.buffer, this.buffer.length - content.length, 0, content.length);        
    }
}

export default CircularBufferQueue;
