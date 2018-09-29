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
‹master*› % npm run test

> libz7@0.1.0 test /libz7
> jest --coverage

 PASS  __tests__/compressor-transformer.test.spec.js
 PASS  __tests__/locate-token.test.spec.js
 PASS  __tests__/consume-input.test.spec.js
 PASS  __tests__/decompressor-transformer.test.spec.js
 PASS  __tests__/find-index-of-subarray.test.spec.js
 PASS  __tests__/extract-token.spec.js
 PASS  __tests__/sliding-window.test.spec.js
-----------------------------|----------|----------|----------|----------|-------------------|
File                         |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
-----------------------------|----------|----------|----------|----------|-------------------|
All files                    |    83.33 |    79.63 |    84.21 |    83.33 |                   |
 compressor-transformer.js   |       60 |       75 |       50 |       60 | 29,31,32,33,34,38 |
 consume-input.js            |      100 |      100 |      100 |      100 |                   |
 decompressor-transformer.js |    26.67 |        0 |    33.33 |    26.67 |... 30,33,36,39,45 |
 extract-token.js            |      100 |      100 |      100 |      100 |                   |
 find-index-of-subarray.js   |      100 |      100 |      100 |      100 |                   |
 locate-token.js             |      100 |    84.62 |      100 |      100 |             17,25 |
 sliding-window.js           |    93.33 |       50 |      100 |    93.33 |                38 |
-----------------------------|----------|----------|----------|----------|-------------------|

Test Suites: 7 passed, 7 total
Tests:       74 passed, 74 total
Snapshots:   0 total
Time:        1.269s
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
{ prefix: undefined, token: '69' }
{ prefix: undefined, token: '6c' }
{ prefix: undefined, token: '6f' }
{ prefix: undefined, token: '76' }
{ prefix: undefined, token: '65' }
{ prefix: undefined, token: '6d' }
{ prefix: undefined, token: '61' }
{ prefix: undefined, token: '74' }
{ prefix: undefined, token: '74' }
{ prefix: undefined, token: '68' }
{ prefix: undefined, token: '65' }
{ prefix: undefined, token: '77' }
{ prefix: undefined, token: '72' }
{ prefix: undefined, token: '6f' }
{ prefix: undefined, token: '6d' }
{ prefix: undefined, token: '61' }
{ prefix: undefined, token: '6e' }
{ prefix: undefined, token: '6f' }
{ prefix: [ 1, 18 ], token: '69' }
{ prefix: [ 3, 16 ], token: '6f' }
Compression process complete.
Inflation process complete.
  📥  input:       ilovematthewromanoilovematthewromanoilovematthewromano
  🙌  ratio:       37.04%
  💤  compressed:  69,6c,6f,76,65,6d,61,74,74,68,65,77,72,6f,6d,61,6e,6f,69,6f
```

### filecompress.js

```
libz7 ‹master› % samplestarget/filecompress.js ~/Pictures/2843_regular_show.jpg
Compression complete.
```

### Interesting observations

LZ77 is a very old compression algorithm. It isn't the most optimal, but it's the spark for a whole generation of compression systems and a very nice one to look at for a side project. I thought I'd list some observations I found interesting.

- Compressing jpeg files with this implementation of LZ77 actually make it larger than the original file! It makes sense when you think about it. The sliding window is equivilent to a look up table (LZ78 showed this, citations when I have the spoons), so the thing making it compress like it does is Run Length Encodings (RLEs). The overhead for each compression packet will always be larger than the token assigned to the packet, so you only start to get returns once the prefix entries reference RLEs larger than storage overhead for each packet. I calculate the overhead for an 8 bit token to amount to a minimum overhead 48 bits, which means the prefix must be above 4 characters to actually give a reduction in storage requirements. Calculations are based on the assumption that each compression packet is stored as "T,S,E" where T is the token (8 bits), S (8 bits) is the prefix start index in the current sliding window frame and E (8 bits) is end index offset from S of the prefix. Those three pieces of data give 24 bits, the other 24 bits are the comma seperators and the terminator for each packet (newline, space etc). Anyway, the point I'm making is that JPEGs use much _much_ more sophisticated compression strategies (plural!) in comparison to LZ77 which means the compressed output contains virtually no RLE blocks. I don't know a great deal about JPEG so far, but what I've read is exciting and I hope I can start taking those algorithms apart too.
