Project in progress. It's a first pass at this stage. The samples can compress and decompress string values and the one can simulate file compression (WARNING: works in memory, so large files will likely crash it, depending on how your nodejs install is configured).

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
- [ ] Make everything use arrays instead of strings. This will improve data intergrity because it will use explicit unicode charcodes. It should also make it faster by eliminating string conversions.
- [ ] A sample program that can compress and save a file. the sample `filecompresssimulate` keeps it in memory because I'd need to define an actual file format for serialising the compressed stream. The file format needs to strip each packet down to the essentials to reduce size overhead and its header needs to define all of the settings used to ensure decompression will know what to do.
- [ ] A sample program that can decompress the above
- [ ] Allow an explicit character encoing and for this to be consistent everywhere
- [ ] User configuratble window size and history buffer size
- [ ] Consistent domain language. The 'dictionary' (from the original paper, it's a different world) should be call the history_buffer everywhere and the window should be called the window or frame.

# Building

```bash
$ npm install
```

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
libz7 ‹master› % npm run test

> libz7@0.1.0 test /Users/burtol86/lisa-workspace/libz7
> jest --coverage

 PASS  __tests__/extract-token.spec.js
 PASS  __tests__/decompressor-transformer.test.spec.js
 PASS  __tests__/consume-input.test.spec.js
 PASS  __tests__/locate-token.test.spec.js
 PASS  __tests__/sliding-window.test.spec.js
 PASS  __tests__/reverse-string.test.spec.js
 PASS  __tests__/compressor-transformer.test.spec.js
-----------------------------|----------|----------|----------|----------|-------------------|
File                         |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
-----------------------------|----------|----------|----------|----------|-------------------|
All files                    |    81.11 |    85.29 |       80 |    81.82 |                   |
 compressor-transformer.js   |    44.44 |      100 |       50 |    44.44 |    19,20,22,23,26 |
 consume-input.js            |      100 |      100 |      100 |      100 |                   |
 decompressor-transformer.js |    28.57 |        0 |    33.33 |    30.77 |... 30,31,34,37,43 |
 extract-token.js            |      100 |      100 |      100 |      100 |                   |
 locate-token.js             |      100 |      100 |      100 |      100 |                   |
 reverse-string.js           |      100 |      100 |      100 |      100 |                   |
 sliding-window.js           |     87.5 |       50 |    83.33 |     87.5 |             10,37 |
-----------------------------|----------|----------|----------|----------|-------------------|

Test Suites: 7 passed, 7 total
Tests:       54 passed, 54 total
Snapshots:   0 total
Time:        2.266s
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
libz7 ‹master› % samplestarget/runcompress.js ilovematthewromanoilovematthewromanoilovematthewromano
{ prefix: undefined, token: 'i' }
{ prefix: undefined, token: 'l' }
{ prefix: undefined, token: 'o' }
{ prefix: undefined, token: 'v' }
{ prefix: undefined, token: 'e' }
{ prefix: undefined, token: 'm' }
{ prefix: undefined, token: 'a' }
{ prefix: undefined, token: 't' }
{ prefix: [ 1, 1 ], token: 'h' }
{ prefix: [ 6, 1 ], token: 'w' }
{ prefix: undefined, token: 'r' }
{ prefix: [ 11, 1 ], token: 'm' }
{ prefix: [ 9, 1 ], token: 'n' }
{ prefix: [ 4, 1 ], token: 'i' }
{ prefix: [ 1, 18 ], token: 'l' }
{ prefix: [ 4, 15 ], token: 'o' }
Compression process complete.
Inflation process complete.
  📥  input: ilovematthewromanoilovematthewromanoilovematthewromano
  🙌  ratio: 29.63%
  💤  compressed: ilovemathwrmnilo
  💣  decompressed: ilovematthewromanoilovematthewromanoilovematthewromano
```
