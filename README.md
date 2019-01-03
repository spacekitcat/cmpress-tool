# libz77 implementation of LZ77

Theory vs practice rating: Research nuclear fusion reactor (as in, consumes more than it generates, but the gap is closing) .   

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

- [X] Refactor the decompression stream, it can be reduced to one step which should also make it slightly faster. I don't care much about this right now, the decompression process is approximately 90 times faster than compression.
- [X] Remove the 4 byte threshold code. It overcomplicates everything for a neglegible impact on the storage requirements of real files, it also complicates testing.
- [X] The current packet header is just an 8-bit integer representing the packet length in bytes. The prefix detection is tied to a size of 5. The prefix value needs to be seperated from the packet size so that the program can deal with variable length packets with variable length tokens. The new header should start with a 1-byte field of packet mode modifier switches. The last bit indicates the presence of a 4-byte prefix field at the end of the field and the other bit fields will be used to describe the packet field byte widths. This will allow it to use a minimual number of bytes to represent a packet while still providing flexibility larger files will benefit from.
- [ ] 
- [ ] The token locate code needs to be several times faster. The code needs to deal with a window size of 65000. I think it would need a window size in this sort of ballpark to actually have the ability to compress above the compression packet storage overhead. See next bullet point:
- [ ] If we have four prefixless packets with 8-bit tokens, it would technically be possible to store them as a single packet with a 32-bit token, saving 3 bytes of overhead.
- [ ] Substring code is O(NlogN) (was O(n^2)), but a suffix tree would be O(m + n). ~~The dynamic solution for a 4096 byte dictionary could theoretically perform 16777216 (4096^2) operations per cycle (it starts a new cycle every single time it finds a new token), in comparison to 8192 with a suffix tree.~~ See above.
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

| Field | Bytes | Use |
|-------|-------|-----|
|   1   |1 byte |Packet mode modifier switches|
|   2   |1 byte |Packet byte width|
|   3   |1 byte |Packet token|
|   4   |2 bytes|Prefix start|
|   5   |2 bytes|Prefix end|

**Field 1**  
An 8-bit bit field of packet mode modifier switches.

| Index | Meaning |
|-------|---------|
|   0   | Future  |
|   1   | Future  |
|   2   | Future  |
|   3   | Future  |
|   4   | Future  |
|   5   | Future  |
|   6   | Future  |
|   7   | Packet ends with a 16-bit prefix field |

**Field 2**  
An 8-bit field representing the packet size.

**Field 3**  
An 8-bit value representing the token  

**Field 4**  
*(Only required for a packets with the prefix bit field (7) enabled)*  
Indicates the start index of a prefix value in the history window.  

**Field 5**  
*(Only required for a packets with the prefix bit field (7) enabled)*  
Indicates the length of the prefix value in the history window.

# Examples

The **./sampletarget** folder contains small demonstration scripts which demonstrate interaction with the compress and inflate methods.

### Integration test (integrationtest.sh)

```bash
I compressed the devil outta ./resources/testinput01.txt

    Input size: 1408
    Ouput size: 144
    IO   ratio: 0.10227272727272728

        0.14 real         0.12 user         0.03 sys
0.13
I inflated the devil outta ./resources/testinput01.txt.bzz
0.10

afc36de9b6fa04d767b3fd3823507d76f1ef86c2  ./resources/testinput01.txt
afc36de9b6fa04d767b3fd3823507d76f1ef86c2  ./resources/testinput01.txt.bzz.inflate

--

I compressed the devil outta ./resources/testinput02.txt

    Input size: 11380
    Ouput size: 167
    IO   ratio: 0.014674868189806678

        0.19 real         0.17 user         0.03 sys
0.17
I inflated the devil outta ./resources/testinput02.txt.bzz
0.38

014c2644798763fe3ed176602addfe7b7edf1b6a  ./resources/testinput02.txt
014c2644798763fe3ed176602addfe7b7edf1b6a  ./resources/testinput02.txt.bzz.inflate

--

I compressed the devil outta ./resources/blue.jpg

    Input size: 65879
    Ouput size: 213050
    IO   ratio: 3.2339592282821537

       20.33 real        20.07 user         1.74 sys
20.07
I inflated the devil outta ./resources/blue.jpg.bzz
3.59

15566f7c74f6db40da040312100d89345beebdc8  ./resources/blue.jpg
15566f7c74f6db40da040312100d89345beebdc8  ./resources/blue.jpg.bzz.inflate

--

I compressed the devil outta ./resources/sample-ppp.pptx

    Input size: 47372
    Ouput size: 114720
    IO   ratio: 2.4216836950097105

       11.47 real        11.49 user         0.73 sys
11.49
I inflated the devil outta ./resources/sample-ppp.pptx.bzz
2.34

955b6d57c0ffa8ba129d01abbf91988e298a8445  ./resources/sample-ppp.pptx
955b6d57c0ffa8ba129d01abbf91988e298a8445  ./resources/sample-ppp.pptx.bzz.inflate

--

I compressed the devil outta ./resources/sails.bmp

    Input size: 394294
    Ouput size: 770185
    IO   ratio: 1.9533267054532912

       79.63 real        76.82 user        11.88 sys
76.83
I inflated the devil outta ./resources/sails.bmp.bzz
46.60

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
