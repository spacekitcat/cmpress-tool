Project in progress...

## synopsis

A basic implementation of the LZ77 streaming compression algorithm. I quite admire the sliding window mechanism as it's used in streaming compression algorithms (LZ77, LZW etc).

- [x] Skeleton with tests, jests, vests, babel and npm build and test scripts.
- [x] Basic sliding window with lookahead and lookbehind.
- [x] Dynamic window slider for recognising tokens in the lookahead that the lookbehind doesn't know about.
- [x] Basic compression algorithm
- [x] Basic inflate algorithm
- [ ] Custom iterator for the dictionary to abstract some of the dictionary lookup operations.
- [ ] Proper, unit tested sliding window system
