Project in progress. It's a first pass at this stage. The samples can compress and decompress string values and the one can simulate file compression (WARNING: works in memory, so large files will likely crash it, depending on how your nodejs install is configured).

## synopsis

This is my implementation of the LZ77 compression algorithm described by Yaakov Ziv and Abraham Lempel in thier 1977 paper. LZ77 utilises a structure often described as a sliding window. I like to view the sliding window as a variation of the Cursor (Iterator in _Design Patterns: Elements of Reusable Object-Oriented Software_) pattern, where instead of describing a single index, the current position describes a range of elements and the traversal rate has no connection to the cursor size. The sliding window designates the bottom half of the cursor as the dictionary and the top half as the input stream. So far I've learned that getting the compresison algorithm working is where the fight begins, encoding and streaming is tricky.

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
- [x] Make everything use arrays instead of strings. This will improve data intergrity because it will use explicit unicode charcodes. It should also make it faster by eliminating string conversions.
- [ ] A sample program that can compress and save a file. the sample `filecompresssimulate` keeps it in memory because I'd need to define an actual file format for serialising the compressed stream. The file format needs to strip each packet down to the essentials to reduce size overhead and its header needs to define all of the settings used to ensure decompression will know what to do.
- [ ] A sample program that can decompress the above
- [ ] Allow an explicit character encoing and for this to be consistent everywhere
- [ ] User configuratble window size and history buffer size
- [ ] Consistent domain language. The 'dictionary' (from the original paper, it's a different world) should be call the history_buffer everywhere and the window should be called the window or frame.
- [ ] The sliding window doesn't have any kind back pressure or ability to queue stream data
- [x] The compressor should output encoded bytes (UTF-8/ASCII codeset) rather than utf8 values

# Building

```bash
$ npm install
```

```bash
ibz7 ‹master*› % npm run build

> libz7@0.1.0 prebuild /Users/burtol86/lisa-workspace/libz7
> babel src --out-dir lib --source-maps && babel samples --out-dir samplestarget --source-maps

Successfully compiled 10 files with Babel.
Successfully compiled 3 files with Babel.
```

# Unit tests

```
libz7
> jest --coverage

 PASS  __tests__/extract-token.spec.js
 PASS  __tests__/find-index-of-subarray.test.spec.js
 PASS  __tests__/consume-input.test.spec.js
 PASS  __tests__/compressor-transformer.test.spec.js
 PASS  __tests__/locate-token.test.spec.js
 PASS  __tests__/decompressor-transformer.test.spec.js
 PASS  __tests__/sliding-window.test.spec.js
-----------------------------|----------|----------|----------|----------|-------------------|
File                         |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
-----------------------------|----------|----------|----------|----------|-------------------|
All files                    |    82.52 |    81.25 |    84.21 |    82.52 |                   |
 compressor-transformer.js   |       40 |        0 |       50 |       40 | 18,20,21,22,23,27 |
 consume-input.js            |      100 |      100 |      100 |      100 |                   |
 decompressor-transformer.js |    26.67 |        0 |    33.33 |    26.67 |... 30,33,36,39,45 |
 extract-token.js            |      100 |      100 |      100 |      100 |                   |
 find-index-of-subarray.js   |      100 |      100 |      100 |      100 |                   |
 locate-token.js             |      100 |      100 |      100 |      100 |                   |
 sliding-window.js           |    93.33 |       50 |      100 |    93.33 |                38 |
-----------------------------|----------|----------|----------|----------|-------------------|

Test Suites: 7 passed, 7 total
Tests:       62 passed, 62 total
Snapshots:   0 total
Time:        1.408s
Ran all test suites.
```

# Examples

The **./sampletarget** folder contains small demonstration scripts which demonstrate interaction with the compress and inflate methods.

### Filecompresssimulate.js

```bash
libz7 ‹master*› % samplestarget/filecompresssimulate.js ~/Downloads/Wireshark\ 2.6.1\ Intel\ 64.dmg
   ->MUST<-   ->COMPRESS<-   33416 160073045     🐱  🐱  🐱  🐱  🐱  🐱  🐱  🐱  🐱
```

### runcompress.js

```bash
libz7 ‹master*› % samplestarget/runcompress.js ilovematthewromanoilovematthewromanoilovematthewromano
{ prefix: undefined, token: '69' }
{ prefix: undefined, token: '6c' }
{ prefix: undefined, token: '6f' }
{ prefix: undefined, token: '76' }
{ prefix: undefined, token: '65' }
{ prefix: undefined, token: '6d' }
{ prefix: undefined, token: '61' }
{ prefix: undefined, token: '74' }
{ prefix: [ 1, 1 ], token: '68' }
{ prefix: [ 6, 1 ], token: '77' }
{ prefix: undefined, token: '72' }
{ prefix: [ 11, 1 ], token: '6d' }
{ prefix: [ 9, 1 ], token: '6e' }
{ prefix: [ 4, 1 ], token: '69' }
{ prefix: [ 1, 18 ], token: '6c' }
{ prefix: [ 4, 15 ], token: '6f' }
Compression process complete.
Inflation process complete.
  📥  input:       ilovematthewromanoilovematthewromanoilovematthewromano
  🙌  ratio:       29.63%
  💤  compressed:  69,6c,6f,76,65,6d,61,74,68,77,72,6d,6e,69,6c,6f
  💣  inflated:    ilovematthewromanoilovematthewromanoilovematthewromano
```

### filecompress.js

```
libz7 ‹master› % samplestarget/filecompress.js ~/Pictures/2843_regular_show.jpg
Compression complete.
```
### Interesting observations
LZ77 is a very old compression algorithm. It isn't the most optimal, but it's the spark for a whole generation of compression systems and a very nice one to look at for a side project. I thought I'd list some observations I found interesting.

- Compressing jpeg files with this implementation of LZ77 actually make it larger than the original file! It makes sense when you think about it. The sliding window is equivilent to a look up table (LZ78 showed this, citations when I have the spoons), so the thing making it compress like it does is Run Length Encodings (RLEs). The overhead for each compression packet will always be larger than the token assigned to the packet, so you only start to get returns once the prefix entries reference RLEs larger than storage overhead for each packet. I calculate the overhead for an 8 bit token to amount to a minimum overhead 48 bits, which means the prefix must be above 4 characters to actually give a reduction in storage requirements. Calculations are based on the assumption that each compression packet is stored as "T,S,E" where T is the token (8 bits), S (8 bits) is the prefix start index in the current sliding window frame and E (8 bits) is end index offset from S of the prefix. Those throw pieces of data give 24 bits, the other 24 bits are the comma seperators and the terminator for each packet (newline, space etc).
