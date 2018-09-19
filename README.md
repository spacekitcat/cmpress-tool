Project in progress...

## synopsis

This is my implementation of the LZ77 compression algorithm described by Yaakov Ziv and Abraham Lempel in thier 1977 paper. LZ77 utilises a structure often described as a sliding window. I like to view the sliding window as a variation of the Cursor (Iterator in _Design Patterns: Elements of Reusable Object-Oriented Software_) pattern, where instead of describing a single index, the current position describes a range of elements and the traversal rate has no connection to the cursor size. The sliding window designates the bottom half of the cursor as the dictionary and the top half as the input stream.

The compression process produces a series of compressed frames, each one describing a single token and a pointer onto a range in the dictionary, relative to the current cursor position.

- [x] Skeleton with tests, jests, vests, babel and npm build and test scripts.
- [x] Basic sliding window with lookahead and lookbehind.
- [x] Dynamic window slider for recognising tokens in the lookahead that the lookbehind doesn't know about.
- [x] Basic compression algorithm
- [x] Basic inflate algorithm
- [x] Seperate the slide logic from the SlidingWindow (pass an external function)
- [x] Seperate the compression frame storage from the SlidingWindow
- [x] Make this work with nodejs streams
- [ ] Integration tests to verify the integrity of compress to decompress relationship (combined with the unit tests seems appropriate for the size of the project)
- [x] Custom iterator for the dictionary to abstract some of the dictionary lookup operations.
- [x] Proper, unit tested sliding window system
- [ ] Release system
- [x] The compression streams resets after every read chunk. This shouldn't have too big an impact for most cases, but it's still rubbish.

# Building

```bash
$ npm run build

> cmpress-tool@0.1.0 prebuild /Users/burtol86/lisa-workspace/cmpress-tool
> babel src --out-dir lib

Successfully compiled 7 files with Babel.

> cmpress-tool@0.1.0 build /Users/burtol86/lisa-workspace/cmpress-tool
> babel runners --out-dir sampletarget

Successfully compiled 1 file with Babel.
```

# Unit tests

```
$ npm run test
Test Suites: 7 passed, 7 total
Tests:       52 passed, 52 total
Snapshots:   0 total
Time:        1.221s
Ran all test suites.
```

# Examples

The **./sampletarget** folder contains small demonstration scripts which demonstrate interaction with the compress and inflate methods.

### Filecompresssimulate

```bash
libz7 ‹master*› % samplestarget/filecompresssimulate.js ~/Downloads/Wireshark\ 2.6.1\ Intel\ 64.dmg
   ->MUST<-   ->COMPRESS<-   33416 160073045     🐱  🐱  🐱  🐱  🐱  🐱  🐱  🐱  🐱
```

### Runcompress

```bash
Compression process complete.
Inflation process complete.
  📥  input: ilovemathewromanilvemathewromano
  🙌  ratio: 46.88%
  💤  compressed: ilovemathwrmnvo
  💣  deecompressed: ilovemathewrlmenvilovemathwro
```
