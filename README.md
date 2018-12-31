# libz77 implementation of LZ77

Theory vs practice rating: Research nuclear fusion reactor (as in, consumes more than it generates) .   

This is a project in progress. The `samplestarget` folder (created during the trasnspile stage of the build) provides some file I/O examples and some string compression examples.

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
- [x] Custom iterator for the dictionary to abstract some of the dictionary lookup operations.
- [x] Proper, unit tested sliding window system
- [x] The compression streams resets after every read chunk. This shouldn't have too big an impact for most cases, but it's still rubbish.
- [x] Make everything use arrays instead of strings. This will improve data intergrity because it will use explicit unicode charcodes. It should also make it faster by eliminating string conversions.
- [x] A sample program that can compress and save a file.
- [x] A sample program that can decompress the above
- [X] 16-bit integer support (n.b. 2^16 = 65536)
- [X] The packet can only ever be 1 or 6, so the packet structure can be modified to eliminate the P marker and recieve the instruction instead from the packet header size. This brings the overall output size down.
- [ ] The token locate code needs to be several times faster. The code needs to deal with a window size of 65000. I think it would need a window size in this sort of ballpark to actually have the ability to compress above the compression packet storage overhead. See next bullet point:
- [ ] Substring code is O(nm), but a suffix tree would be O(m + n). The dynamic solution for a 4096 byte dictionary could theoretically perform 16777216 (4096^2) operations per cycle (it starts a new cycle every single time it finds a new token), in comparison to 8192 with a suffix tree. See above.
- [ ] If we have four prefixless packets with 8-bit tokens, it would technically be possible to store them as a single packet with a 32-bit token, saving 3 bytes of overhead.
- [ ] Refactor the decompression stream, it can be reduced to one step which should also make it slightly faster. I don't care much about this right now, the decompression process is approximately 90 times faster than compression.
- [ ] The sliding window doesn't have any kind back pressure or ability to queue stream data
- [ ] Release system


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
> npm run test


> libz7@0.1.0 test /Users/burtol86/lisa-workspace/libz7
> jest --coverage

 PASS  __tests__/deserialize-packet-from-binary.test.spec.js
 PASS  __tests__/compressor-transformer.test.spec.js
 PASS  __tests__/decompressor-transformer.test.spec.js
 PASS  __tests__/consume-input.test.spec.js
 PASS  __tests__/sliding-window.test.spec.js
 PASS  __tests__/serialize-packet-to-binary.test.spec.js
 PASS  __tests__/find-index-of-subarray.test.spec.js
 PASS  __tests__/locate-token.test.spec.js
 PASS  __tests__/unpack-integer-to-byte.test.spec.js
-----------------------------------|----------|----------|----------|----------|-------------------|
File                               |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
-----------------------------------|----------|----------|----------|----------|-------------------|
All files                          |      100 |      100 |      100 |      100 |                   |
 compressor-transformer.js         |      100 |      100 |      100 |      100 |                   |
 consume-input.js                  |      100 |      100 |      100 |      100 |                   |
 decompressor-transformer.js       |      100 |      100 |      100 |      100 |                   |
 deserialize-packet-from-binary.js |      100 |      100 |      100 |      100 |                   |
 find-index-of-subarray.js         |      100 |      100 |      100 |      100 |                   |
 locate-token.js                   |      100 |      100 |      100 |      100 |                   |
 serialize-packet-to-binary.js     |      100 |      100 |      100 |      100 |                   |
 sliding-window.js                 |      100 |      100 |      100 |      100 |                   |
 unpack-integer-to-byte.js         |      100 |      100 |      100 |      100 |                   |
-----------------------------------|----------|----------|----------|----------|-------------------|

Test Suites: 9 passed, 9 total
Tests:       103 passed, 103 total
Snapshots:   0 total
Time:        2.197s
Ran all test suites.
```

# Serialisation format

Field 1 **[8_ bits]**  
Field 2 **[8_ bits]**  
Field 3 **[16 bits]**  
Field 4 **[16 bits]**

**Field 1**  
An 8-bit value representing the packet size. A packet size of 1 signals a token with no prefix; A packet size of 5 signals a token with a prefix.  

**Field 2**  
An 8-bit value representing the token  

**Field 3**  
*(Only required for a packet size >1)*  
Indicates the start index of a prefix value in the history window.  

**Field 4**  
*(Only required for a packet size >1)*  
Indicates the length of the prefix value in the history window.

# Examples

The **./sampletarget** folder contains small demonstration scripts which demonstrate interaction with the compress and inflate methods.

### Integration test (integrationtest.sh)

```bash
libz7 ‹master*› % ./integrationtest.sh

I compressed the devil outta ./resources/testinput01.txt

    Input size: 1408
    Ouput size: 1704
    IO   ratio: 0.8262910798122066

        0.17 real         0.14 user         0.03 sys
0.15
I inflated the devil outta ./resources/testinput01.txt.bzz
0.10

afc36de9b6fa04d767b3fd3823507d76f1ef86c2  ./resources/testinput01.txt
afc36de9b6fa04d767b3fd3823507d76f1ef86c2  ./resources/testinput01.txt.bzz.inflate

--

I compressed the devil outta ./resources/testinput02.txt

    Input size: 11380
    Ouput size: 13722
    IO   ratio: 0.8293251712578341

        0.41 real         0.40 user         0.04 sys
0.41
I inflated the devil outta ./resources/testinput02.txt.bzz
0.25

014c2644798763fe3ed176602addfe7b7edf1b6a  ./resources/testinput02.txt
014c2644798763fe3ed176602addfe7b7edf1b6a  ./resources/testinput02.txt.bzz.inflate

--

I compressed the devil outta ./resources/blue.jpg

    Input size: 65879
    Ouput size: 98306
    IO   ratio: 0.6701422090208126

        9.80 real        10.17 user         1.77 sys
10.17
I inflated the devil outta ./resources/blue.jpg.bzz
2.00

15566f7c74f6db40da040312100d89345beebdc8  ./resources/blue.jpg
15566f7c74f6db40da040312100d89345beebdc8  ./resources/blue.jpg.bzz.inflate

--

I compressed the devil outta ./resources/sample-ppp.pptx

    Input size: 47372
    Ouput size: 16384
    IO   ratio: 2.891357421875

        5.01 real         5.09 user         0.71 sys
5.10
I inflated the devil outta ./resources/sample-ppp.pptx.bzz
1.23

955b6d57c0ffa8ba129d01abbf91988e298a8445  ./resources/sample-ppp.pptx
955b6d57c0ffa8ba129d01abbf91988e298a8445  ./resources/sample-ppp.pptx.bzz.inflate

--

I compressed the devil outta ./resources/sails.bmp

    Input size: 394294
    Ouput size: 671766
    IO   ratio: 0.5869514086750446

       79.32 real        79.26 user        23.78 sys
79.27
I inflated the devil outta ./resources/sails.bmp.bzz
40.57

65fb675d23b2dd658e4f43f143988579e76fe515  ./resources/sails.bmp
65fb675d23b2dd658e4f43f143988579e76fe515  ./resources/sails.bmp.bzz.inflate
```

### runcompress.js

```bash
/libz7 ‹master*› % samplestarget/runcompress.js ilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewroma
noilovematthew
<Buffer 01 69>
<Buffer 01 6c>
<Buffer 01 6f>
<Buffer 01 76>
<Buffer 01 65>
<Buffer 01 6d>
<Buffer 01 61>
<Buffer 01 74>
<Buffer 01 74>
<Buffer 01 68>
<Buffer 01 65>
<Buffer 01 77>
<Buffer 01 72>
<Buffer 01 6f>
<Buffer 01 6d>
<Buffer 01 61>
<Buffer 01 6e>
<Buffer 01 6f>
<Buffer 05 69 01 00 12 00>
<Buffer 05 6c 01 00 24 00>
<Buffer 05 77 0a 00 1b 00>
📥         input : ilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthew
💤    compressed : ilovematthewromanoil$w

         ratio : 52.94117647058824%

📥         input : ilovematthewromanoil$w

  decompressed : ilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthewromanoilovematthew
🙌         ratio : 188.88888888888889%
```

### filecompress.js

```bash
/libz7 ‹master*› % samplestarget/filecompress.js resources/testinput01.txt
I compressed the devil outta resources/testinput01.txt
        0.18 real         0.13 user         0.05 sys
```

### fileinflate.js

```bash
samplestarget/fileinflate.js resources/testinput01.txt.bzz
I inflated the devil outta resources/testinput01.txt.bzz
```

## Observations

LZ77 is a very old compression algorithm. It isn't the most optimal, but it's the spark for a whole generation of compression systems and a very nice one to look at for a side project. I thought I'd list some observations I found interesting.

- Compressing jpeg files with this implementation of LZ77 actually make it larger than the original file! It makes sense when you think about it. The sliding window is equivilent to a look up table (LZ78 showed this, citations when I have the spoons), so the thing making it compress like it does is Run Length Encodings (RLEs). The overhead for each compression packet will always be larger than the token assigned to the packet, so you only start to get returns once the prefix entries reference RLEs larger than storage overhead for each packet. I calculate the overhead for an 8 bit token to amount to a minimum overhead 48 bits, which means the prefix must be above 4 characters to actually give a reduction in storage requirements. Calculations are based on the assumption that each compression packet is stored as "T,S,E" where T is the token (8 bits), S (8 bits) is the prefix start index in the current sliding window frame and E (8 bits) is end index offset from S of the prefix. Those three pieces of data give 24 bits, the other 24 bits are the comma seperators and the terminator for each packet (newline, space etc). Anyway, the point I'm making is that JPEGs use much _much_ more sophisticated compression strategies (plural!) in comparison to LZ77 which means the compressed output contains virtually no RLE blocks. I don't know a great deal about JPEG so far, but what I've read is exciting and I hope I can start taking those algorithms apart too.
