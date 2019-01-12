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
- [X] Use the new header to implement variable byte width prefix addressing. It should be 8-bit from 0 to 255, 16-bit from 256 etc.
- [ ] The token locate code needs to be several times faster. The code needs to deal with a window size of 65000. I think it would need a window size in this sort of ballpark to actually have the ability to compress above the compression packet storage overhead. See next bullet point:
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
 PASS  __tests__/decompressor-transformer.test.spec.js
 PASS  __tests__/compressor-transformer.test.spec.js
 PASS  __tests__/serialization/packet-header-generator.test.spec.js
 PASS  __tests__/serialization/packet-header-to-binary.test.spec.js
 PASS  __tests__/find-index-of-subarray.test.spec.js
 PASS  __tests__/serialization/serialize-packet-to-binary.test.spec.js
 PASS  __tests__/consume-input.test.spec.js
 PASS  __tests__/locate-token.test.spec.js
 PASS  __tests__/serialization/unpack-integer-to-byte.test.spec.js
 PASS  __tests__/serialization/packet-header-from-binary.test.spec.js
 PASS  __tests__/sliding-window.test.spec.js
 PASS  __tests__/serialization/deserialize-packet-from-binary.test.spec.js
------------------------------------|----------|----------|----------|----------|-------------------|
File                                |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
------------------------------------|----------|----------|----------|----------|-------------------|
All files                           |      100 |    99.08 |      100 |      100 |                   |
 src                                |      100 |    98.21 |      100 |      100 |                   |
  compressor-transformer.js         |      100 |      100 |      100 |      100 |                   |
  consume-input.js                  |      100 |      100 |      100 |      100 |                   |
  decompressor-transformer.js       |      100 |    91.67 |      100 |      100 |                74 |
  find-index-of-subarray.js         |      100 |      100 |      100 |      100 |                   |
  locate-token.js                   |      100 |      100 |      100 |      100 |                   |
  sliding-window.js                 |      100 |      100 |      100 |      100 |                   |
 src/serialization                  |      100 |      100 |      100 |      100 |                   |
  deserialize-packet-from-binary.js |      100 |      100 |      100 |      100 |                   |
  header-flags-enum.js              |      100 |      100 |      100 |      100 |                   |
  packet-header-from-binary.js      |      100 |      100 |      100 |      100 |                   |
  packet-header-generator.js        |      100 |      100 |      100 |      100 |                   |
  packet-header-to-binary.js        |      100 |      100 |      100 |      100 |                   |
  serialize-packet-to-binary.js     |      100 |      100 |      100 |      100 |                   |
  unpack-integer-to-byte.js         |      100 |      100 |      100 |      100 |                   |
------------------------------------|----------|----------|----------|----------|-------------------|

Test Suites: 12 passed, 12 total
Tests:       120 passed, 120 total
Snapshots:   0 total
Time:        1.452s
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
|   1   | Add an additional byte to the size field (partially implemented) |
|   2   | Add an additional byte to the size field (partially implemented) |
|   3   | Add an additional byte to the size field (partially implemented) |
|   4   | Pure packet mode, a special packed format for small packets (partially implemented) |
|   5   | Future  |
|   6   | Future  |
|   7   | Packet has a prefix field (default is 2 16-bit fields) |

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
    Ouput size: 116
    IO   ratio: 0.08238636363636363

        0.15 real         0.12 user         0.03 sys
0.13
I inflated the devil outta ./resources/testinput01.txt.bzz
0.09

afc36de9b6fa04d767b3fd3823507d76f1ef86c2  ./resources/testinput01.txt
afc36de9b6fa04d767b3fd3823507d76f1ef86c2  ./resources/testinput01.txt.bzz.inflate

--

I compressed the devil outta ./resources/testinput02.txt

    Input size: 11380
    Ouput size: 159
    IO   ratio: 0.01397188049209139

        0.18 real         0.16 user         0.03 sys
0.17
I inflated the devil outta ./resources/testinput02.txt.bzz
0.07

014c2644798763fe3ed176602addfe7b7edf1b6a  ./resources/testinput02.txt
014c2644798763fe3ed176602addfe7b7edf1b6a  ./resources/testinput02.txt.bzz.inflate

--

I compressed the devil outta ./resources/blue.jpg

    Input size: 65879
    Ouput size: 180250
    IO   ratio: 2.736076746763005

       19.93 real        19.79 user         1.65 sys
19.80
I inflated the devil outta ./resources/blue.jpg.bzz
1.93

15566f7c74f6db40da040312100d89345beebdc8  ./resources/blue.jpg
15566f7c74f6db40da040312100d89345beebdc8  ./resources/blue.jpg.bzz.inflate

--

I compressed the devil outta ./resources/sample-ppp.pptx

    Input size: 47372
    Ouput size: 98329
    IO   ratio: 2.0756776154690533

       10.72 real        10.79 user         0.61 sys
10.80
I inflated the devil outta ./resources/sample-ppp.pptx.bzz
0.90

955b6d57c0ffa8ba129d01abbf91988e298a8445  ./resources/sample-ppp.pptx
955b6d57c0ffa8ba129d01abbf91988e298a8445  ./resources/sample-ppp.pptx.bzz.inflate

--

I compressed the devil outta ./resources/sails.bmp

    Input size: 394294
    Ouput size: 688269
    IO   ratio: 1.745573100275429

       80.38 real        77.68 user        11.49 sys
77.69
I inflated the devil outta ./resources/sails.bmp.bzz
20.55

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

### bzz-decompress-debug.js

Generates a human readable packet list for a given *.bzz file (output from filecompress.js)

```bash
/libz7 ‹master*› % ./samplestarget/bzz-decompress-debug.js resources/testinput01.txt.bzz
╔═══════════════════════════╤═══════════════════════════╤═══════════════════════════╤═══════════════════════════╤═══════════════════════════╗
║ Token field               │ Prefix field              │ Packet header             │ Packet raw source buffer  │ History buffer            ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 74686520717569636b        │ N/A                       │ size=9, prefix=N/A prefix │ 74686520717569636b        │                           ║
║                           │                           │ ByteExtOne=N/A            │                           │                           ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 62                        │ 6,1                       │ size=3, prefix=true prefi │ 620601                    │ 74686520717569636b        ║
║                           │                           │ xByteExtOne=N/A           │                           │                           ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 726f776e                  │ N/A                       │ size=4, prefix=N/A prefix │ 726f776e                  │ 74686520717569636b2062    ║
║                           │                           │ ByteExtOne=N/A            │                           │                           ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 66                        │ 6,1                       │ size=3, prefix=true prefi │ 660601                    │ 74686520717569636b2062726 ║
║                           │                           │ xByteExtOne=N/A           │                           │ f776e                     ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 78                        │ 5,1                       │ size=3, prefix=true prefi │ 780501                    │ 74686520717569636b2062726 ║
║                           │                           │ xByteExtOne=N/A           │                           │ f776e2066                 ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 6a                        │ 4,1                       │ size=3, prefix=true prefi │ 6a0401                    │ 74686520717569636b2062726 ║
║                           │                           │ xByteExtOne=N/A           │                           │ f776e20666f78             ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 6d                        │ 16,1                      │ size=3, prefix=true prefi │ 6d1001                    │ 74686520717569636b2062726 ║
║                           │                           │ xByteExtOne=N/A           │                           │ f776e20666f78206a         ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 7073                      │ N/A                       │ size=2, prefix=N/A prefix │ 7073                      │ 74686520717569636b2062726 ║
║                           │                           │ ByteExtOne=N/A            │                           │ f776e20666f78206a756d     ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 6f                        │ 6,1                       │ size=3, prefix=true prefi │ 6f0601                    │ 74686520717569636b2062726 ║
║                           │                           │ xByteExtOne=N/A           │                           │ f776e20666f78206a756d7073 ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 76                        │ N/A                       │ size=1, prefix=N/A prefix │ 76                        │ 74686520717569636b2062726 ║
║                           │                           │ ByteExtOne=N/A            │                           │ f776e20666f78206a756d7073 ║
║                           │                           │                           │                           │ 206f                      ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 72                        │ 26,1                      │ size=3, prefix=true prefi │ 721a01                    │ 74686520717569636b2062726 ║
║                           │                           │ xByteExtOne=N/A           │                           │ f776e20666f78206a756d7073 ║
║                           │                           │                           │                           │ 206f76                    ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 74                        │ 5,1                       │ size=3, prefix=true prefi │ 740501                    │ 74686520717569636b2062726 ║
║                           │                           │ xByteExtOne=N/A           │                           │ f776e20666f78206a756d7073 ║
║                           │                           │                           │                           │ 206f766572                ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 6c                        │ 29,3                      │ size=3, prefix=true prefi │ 6c1d03                    │ 74686520717569636b2062726 ║
║                           │                           │ xByteExtOne=N/A           │                           │ f776e20666f78206a756d7073 ║
║                           │                           │                           │                           │ 206f7665722074            ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 617a79                    │ N/A                       │ size=3, prefix=N/A prefix │ 617a79                    │ 74686520717569636b2062726 ║
║                           │                           │ ByteExtOne=N/A            │                           │ f776e20666f78206a756d7073 ║
║                           │                           │                           │                           │ 206f76657220746865206c    ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 64                        │ 5,1                       │ size=3, prefix=true prefi │ 640501                    │ 74686520717569636b2062726 ║
║                           │                           │ xByteExtOne=N/A           │                           │ f776e20666f78206a756d7073 ║
║                           │                           │                           │                           │ 206f76657220746865206c617 ║
║                           │                           │                           │                           │ a79                       ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 67                        │ 15,1                      │ size=3, prefix=true prefi │ 670f01                    │ 74686520717569636b2062726 ║
║                           │                           │ xByteExtOne=N/A           │                           │ f776e20666f78206a756d7073 ║
║                           │                           │                           │                           │ 206f76657220746865206c617 ║
║                           │                           │                           │                           │ a792064                   ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 0a                        │ N/A                       │ size=1, prefix=N/A prefix │ 0a                        │ 74686520717569636b2062726 ║
║                           │                           │ ByteExtOne=N/A            │                           │ f776e20666f78206a756d7073 ║
║                           │                           │                           │                           │ 206f76657220746865206c617 ║
║                           │                           │                           │                           │ a7920646f67               ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 74                        │ 1,44                      │ size=3, prefix=true prefi │ 74012c                    │ 74686520717569636b2062726 ║
║                           │                           │ xByteExtOne=N/A           │                           │ f776e20666f78206a756d7073 ║
║                           │                           │                           │                           │ 206f76657220746865206c617 ║
║                           │                           │                           │                           │ a7920646f670a             ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 68                        │ 1,88                      │ size=3, prefix=true prefi │ 680158                    │ 74686520717569636b2062726 ║
║                           │                           │ xByteExtOne=N/A           │                           │ f776e20666f78206a756d7073 ║
║                           │                           │                           │                           │ 206f76657220746865206c617 ║
║                           │                           │                           │                           │ a7920646f670a746865207175 ║
║                           │                           │                           │                           │ 69636b2062726f776e20666f7 ║
║                           │                           │                           │                           │ 8206a756d7073206f76657220 ║
║                           │                           │                           │                           │ 746865206c617a7920646f670 ║
║                           │                           │                           │                           │ a74                       ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 65                        │ 1,176                     │ size=3, prefix=true prefi │ 6501b0                    │ 74686520717569636b2062726 ║
║                           │                           │ xByteExtOne=N/A           │                           │ f776e20666f78206a756d7073 ║
║                           │                           │                           │                           │ 206f76657220746865206c617 ║
║                           │                           │                           │                           │ a7920646f670a746865207175 ║
║                           │                           │                           │                           │ 69636b2062726f776e20666f7 ║
║                           │                           │                           │                           │ 8206a756d7073206f76657220 ║
║                           │                           │                           │                           │ 746865206c617a7920646f670 ║
║                           │                           │                           │                           │ a74686520717569636b206272 ║
║                           │                           │                           │                           │ 6f776e20666f78206a756d707 ║
║                           │                           │                           │                           │ 3206f76657220746865206c61 ║
║                           │                           │                           │                           │ 7a7920646f670a74686520717 ║
║                           │                           │                           │                           │ 569636b2062726f776e20666f ║
║                           │                           │                           │                           │ 78206a756d7073206f7665722 ║
║                           │                           │                           │                           │ 0746865206c617a7920646f67 ║
║                           │                           │                           │                           │ 0a7468                    ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 20                        │ 1,352                     │ size=5, prefix=true prefi │ 2001006001                │ 74686520717569636b2062726 ║
║                           │                           │ xByteExtOne=true          │                           │ f776e20666f78206a756d7073 ║
║                           │                           │                           │                           │ 206f76657220746865206c617 ║
║                           │                           │                           │                           │ a7920646f670a746865207175 ║
║                           │                           │                           │                           │ 69636b2062726f776e20666f7 ║
║                           │                           │                           │                           │ 8206a756d7073206f76657220 ║
║                           │                           │                           │                           │ 746865206c617a7920646f670 ║
║                           │                           │                           │                           │ a74686520717569636b206272 ║
║                           │                           │                           │                           │ 6f776e20666f78206a756d707 ║
║                           │                           │                           │                           │ 3206f76657220746865206c61 ║
║                           │                           │                           │                           │ 7a7920646f670a74686520717 ║
║                           │                           │                           │                           │ 569636b2062726f776e20666f ║
║                           │                           │                           │                           │ 78206a756d7073206f7665722 ║
║                           │                           │                           │                           │ 0746865206c617a7920646f67 ║
║                           │                           │                           │                           │ 0a74686520717569636b20627 ║
║                           │                           │                           │                           │ 26f776e20666f78206a756d70 ║
║                           │                           │                           │                           │ 73206f76657220746865206c6 ║
║                           │                           │                           │                           │ 17a7920646f670a7468652071 ║
║                           │                           │                           │                           │ 7569636b2062726f776e20666 ║
║                           │                           │                           │                           │ f78206a756d7073206f766572 ║
║                           │                           │                           │                           │ 20746865206c617a7920646f6 ║
║                           │                           │                           │                           │ 70a74686520717569636b2062 ║
║                           │                           │                           │                           │ 726f776e20666f78206a756d7 ║
║                           │                           │                           │                           │ 073206f76657220746865206c ║
║                           │                           │                           │                           │ 617a7920646f670a746865207 ║
║                           │                           │                           │                           │ 17569636b2062726f776e2066 ║
║                           │                           │                           │                           │ 6f78206a756d7073206f76657 ║
║                           │                           │                           │                           │ 220746865206c617a7920646f ║
║                           │                           │                           │                           │ 670a746865                ║
╟───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────┼───────────────────────────╢
║ 0a                        │ 6,699                     │ size=5, prefix=true prefi │ 0a0600bb02                │ 74686520717569636b2062726 ║
║                           │                           │ xByteExtOne=true          │                           │ f776e20666f78206a756d7073 ║
║                           │                           │                           │                           │ 206f76657220746865206c617 ║
║                           │                           │                           │                           │ a7920646f670a746865207175 ║
║                           │                           │                           │                           │ 69636b2062726f776e20666f7 ║
║                           │                           │                           │                           │ 8206a756d7073206f76657220 ║
║                           │                           │                           │                           │ 746865206c617a7920646f670 ║
║                           │                           │                           │                           │ a74686520717569636b206272 ║
║                           │                           │                           │                           │ 6f776e20666f78206a756d707 ║
║                           │                           │                           │                           │ 3206f76657220746865206c61 ║
║                           │                           │                           │                           │ 7a7920646f670a74686520717 ║
║                           │                           │                           │                           │ 569636b2062726f776e20666f ║
║                           │                           │                           │                           │ 78206a756d7073206f7665722 ║
║                           │                           │                           │                           │ 0746865206c617a7920646f67 ║
║                           │                           │                           │                           │ 0a74686520717569636b20627 ║
║                           │                           │                           │                           │ 26f776e20666f78206a756d70 ║
║                           │                           │                           │                           │ 73206f76657220746865206c6 ║
║                           │                           │                           │                           │ 17a7920646f670a7468652071 ║
║                           │                           │                           │                           │ 7569636b2062726f776e20666 ║
║                           │                           │                           │                           │ f78206a756d7073206f766572 ║
║                           │                           │                           │                           │ 20746865206c617a7920646f6 ║
║                           │                           │                           │                           │ 70a74686520717569636b2062 ║
║                           │                           │                           │                           │ 726f776e20666f78206a756d7 ║
║                           │                           │                           │                           │ 073206f76657220746865206c ║
║                           │                           │                           │                           │ 617a7920646f670a746865207 ║
║                           │                           │                           │                           │ 17569636b2062726f776e2066 ║
║                           │                           │                           │                           │ 6f78206a756d7073206f76657 ║
║                           │                           │                           │                           │ 220746865206c617a7920646f ║
║                           │                           │                           │                           │ 670a74686520717569636b206 ║
║                           │                           │                           │                           │ 2726f776e20666f78206a756d ║
║                           │                           │                           │                           │ 7073206f76657220746865206 ║
║                           │                           │                           │                           │ c617a7920646f670a74686520 ║
║                           │                           │                           │                           │ 717569636b2062726f776e206 ║
║                           │                           │                           │                           │ 66f78206a756d7073206f7665 ║
║                           │                           │                           │                           │ 7220746865206c617a7920646 ║
║                           │                           │                           │                           │ f670a74686520717569636b20 ║
║                           │                           │                           │                           │ 62726f776e20666f78206a756 ║
║                           │                           │                           │                           │ d7073206f7665722074686520 ║
║                           │                           │                           │                           │ 6c617a7920646f670a7468652 ║
║                           │                           │                           │                           │ 0717569636b2062726f776e20 ║
║                           │                           │                           │                           │ 666f78206a756d7073206f766 ║
║                           │                           │                           │                           │ 57220746865206c617a792064 ║
║                           │                           │                           │                           │ 6f670a74686520717569636b2 ║
║                           │                           │                           │                           │ 062726f776e20666f78206a75 ║
║                           │                           │                           │                           │ 6d7073206f766572207468652 ║
║                           │                           │                           │                           │ 06c617a7920646f670a746865 ║
║                           │                           │                           │                           │ 20717569636b2062726f776e2 ║
║                           │                           │                           │                           │ 0666f78206a756d7073206f76 ║
║                           │                           │                           │                           │ 657220746865206c617a79206 ║
║                           │                           │                           │                           │ 46f670a74686520717569636b ║
║                           │                           │                           │                           │ 2062726f776e20666f78206a7 ║
║                           │                           │                           │                           │ 56d7073206f76657220746865 ║
║                           │                           │                           │                           │ 206c617a7920646f670a74686 ║
║                           │                           │                           │                           │ 520717569636b2062726f776e ║
║                           │                           │                           │                           │ 20666f78206a756d7073206f7 ║
║                           │                           │                           │                           │ 6657220746865206c617a7920 ║
║                           │                           │                           │                           │ 646f670a74686520          ║
╚═══════════════════════════╧═══════════════════════════╧═══════════════════════════╧═══════════════════════════╧═══════════════════════════╝
Boom, done.
```
## Observations

LZ77 is a very old compression algorithm. It isn't the most optimal, but it's the spark for a whole generation of compression systems and a very nice one to look at for a side project. I thought I'd list some observations I found interesting.

- Compressing jpeg files with this implementation of LZ77 actually make it larger than the original file! It makes sense when you think about it. The sliding window is equivilent to a look up table (LZ78 showed this, citations when I have the spoons), so the thing making it compress like it does is Run Length Encodings (RLEs). The overhead for each compression packet will always be larger than the token assigned to the packet, so you only start to get returns once the prefix entries reference RLEs larger than storage overhead for each packet. I calculate the overhead for an 8 bit token to amount to a minimum overhead 48 bits, which means the prefix must be above 4 characters to actually give a reduction in storage requirements. Calculations are based on the assumption that each compression packet is stored as "T,S,E" where T is the token (8 bits), S (8 bits) is the prefix start index in the current sliding window frame and E (8 bits) is end index offset from S of the prefix. Those three pieces of data give 24 bits, the other 24 bits are the comma seperators and the terminator for each packet (newline, space etc). Anyway, the point I'm making is that JPEGs use much _much_ more sophisticated compression strategies (plural!) in comparison to LZ77 which means the compressed output contains virtually no RLE blocks. I don't know a great deal about JPEG so far, but what I've read is exciting and I hope I can start taking those algorithms apart too.
