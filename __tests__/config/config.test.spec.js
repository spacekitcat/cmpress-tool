import { getCompressionConfig } from '../../src/config/config';

describe('getCompressionConfig', () => {
    it('should return the expected config object', () => {
        expect(getCompressionConfig()).toMatchObject({});
    })
});
