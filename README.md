Project in progress. It's a first pass at this stage. The samples do lots of work in memory, so don't do anything stupid, such as feeding it a 16GB string.

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
- [x] ~~The compressor should output encoded bytes (UTF-8/ASCII codeset) rather than utf8 values~~
- [x] The compressor should output UCS2 encoded BISON encoded JSON.

# Building

```bash
$ npm install
```

```bash
ibz7 ‹master*› % npm run build

> libz7@0.1.0 prebuild /Users/burtol86/lisa-workspace/libz7
> babel src --out-dir lib --source-maps && babel samples --out-dir samplestarget --source-maps

Successfully compiled 8 files with Babel.
Successfully compiled 1 file with Babel.
```

# Unit tests

```
/libz7
> jest --coverage

 PASS  __tests__/compressor-transformer.test.spec.js
 PASS  __tests__/sliding-window.test.spec.js
 PASS  __tests__/decompressor-transformer.test.spec.js
 PASS  __tests__/consume-input.test.spec.js
 PASS  __tests__/locate-token.test.spec.js
 PASS  __tests__/serialize-packet.spec.js
 PASS  __tests__/extract-token.spec.js
 PASS  __tests__/find-index-of-subarray.test.spec.js
-----------------------------|----------|----------|----------|----------|-------------------|
File                         |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
-----------------------------|----------|----------|----------|----------|-------------------|
All files                    |      100 |    94.64 |      100 |      100 |                   |
 compressor-transformer.js   |      100 |     87.5 |      100 |      100 |                34 |
 consume-input.js            |      100 |      100 |      100 |      100 |                   |
 decompressor-transformer.js |      100 |    66.67 |      100 |      100 |             27,34 |
 extract-token.js            |      100 |      100 |      100 |      100 |                   |
 find-index-of-subarray.js   |      100 |      100 |      100 |      100 |                   |
 locate-token.js             |      100 |      100 |      100 |      100 |                   |
 serialize-packet.js         |      100 |      100 |      100 |      100 |                   |
 sliding-window.js           |      100 |      100 |      100 |      100 |                   |
-----------------------------|----------|----------|----------|----------|-------------------|

Test Suites: 8 passed, 8 total
Tests:       77 passed, 77 total
Snapshots:   0 total
Time:        2.049s
Ran all test suites.
```

# Examples

The **./sampletarget** folder contains small demonstration scripts which demonstrate interaction with the compress and inflate methods.

### runcompress.js

```bash
libz7 ‹master*› % samplestarget/runcompress.js ilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromano
📥         input : ilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromano
💤    compressed : 琂Ȁ椀琂Ȁ氀琂Ȁ漀琂Ȁ瘀琂Ȁ攀琂Ȁ洀琂Ȁ愀琂Ȁ琀琂Ȁ琀琂Ȁ栀琂Ȁ攀琂Ȁ眀琂Ȁ爀琂Ȁ漀琂Ȁ洀琂Ȁ愀琂Ȁ渀琂Ȁ漀$瀄ጀက0ㄐሀ琂Ȁ椀$瀄ጀက0ㄐ␀琂Ȁ氀$瀄ጀက0ㄐ䠀琂Ȁ漀$瀄ጀက0ㄐ退琂Ȁ瘀$瀄ጀက0ㄐ謀琂Ȁ漀
🙌         ratio : 50%

📥         input : 琂Ȁ椀琂Ȁ氀琂Ȁ漀琂Ȁ瘀琂Ȁ攀琂Ȁ洀琂Ȁ愀琂Ȁ琀琂Ȁ琀琂Ȁ栀琂Ȁ攀琂Ȁ眀琂Ȁ爀琂Ȁ漀琂Ȁ洀琂Ȁ愀琂Ȁ渀琂Ȁ漀$瀄ጀက0ㄐሀ琂Ȁ椀$瀄ጀက0ㄐ␀琂Ȁ氀$瀄ጀက0ㄐ䠀琂Ȁ漀$瀄ጀက0ㄐ退琂Ȁ瘀$瀄ጀက0ㄐ謀琂Ȁ漀
💤  decompressed : ilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromano
🙌         ratio : 200%
```

## Observations

LZ77 is a very old compression algorithm. It isn't the most optimal, but it's the spark for a whole generation of compression systems and a very nice one to look at for a side project. I thought I'd list some observations I found interesting.

- Compressing jpeg files with this implementation of LZ77 actually make it larger than the original file! It makes sense when you think about it. The sliding window is equivilent to a look up table (LZ78 showed this, citations when I have the spoons), so the thing making it compress like it does is Run Length Encodings (RLEs). The overhead for each compression packet will always be larger than the token assigned to the packet, so you only start to get returns once the prefix entries reference RLEs larger than storage overhead for each packet. I calculate the overhead for an 8 bit token to amount to a minimum overhead 48 bits, which means the prefix must be above 4 characters to actually give a reduction in storage requirements. Calculations are based on the assumption that each compression packet is stored as "T,S,E" where T is the token (8 bits), S (8 bits) is the prefix start index in the current sliding window frame and E (8 bits) is end index offset from S of the prefix. Those three pieces of data give 24 bits, the other 24 bits are the comma seperators and the terminator for each packet (newline, space etc). Anyway, the point I'm making is that JPEGs use much _much_ more sophisticated compression strategies (plural!) in comparison to LZ77 which means the compressed output contains virtually no RLE blocks. I don't know a great deal about JPEG so far, but what I've read is exciting and I hope I can start taking those algorithms apart too.
