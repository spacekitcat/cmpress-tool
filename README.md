Project in progress...

## synopsis

A basic implementation of the Lz77 streaming compression algorithm. Each compression frame describes the next token and may also contain a pointer for a prefix for the current token. A prefix address describes a position and length relative to the currently visible dictionary. The dictionary view changes after each compression frame. The dictionary addresses assume the current token as at the front of the dictionary (this is an important detail for how the prefix pointer code works).

- [x] Skeleton with tests, jests, vests, babel and npm build and test scripts.
- [x] Basic sliding window with lookahead and lookbehind.
- [x] Dynamic window slider for recognising tokens in the lookahead that the lookbehind doesn't know about.
- [x] Basic compression algorithm
- [x] Basic inflate algorithm
- [x] Seperate the slide logic from the SlidingWindow (pass an external function)
- [x] Seperate the compression frame storage from the SlidingWindow
- [ ] Integration tests to verify the integrity of compress to decompress relationship (combined with the unit tests seems appropriate for the size of the project)
- [ ] Custom iterator for the dictionary to abstract some of the dictionary lookup operations.
- [ ] Proper, unit tested sliding window system
- [ ] Release system

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
Test Suites: 5 passed, 5 total
Tests:       37 passed, 37 total
Snapshots:   0 total
Time:        1.259s
Ran all test suites.
```

# Examples

The **./sampletarget** folder contains small demonstration scripts which demonstrate interaction with the compress and inflate methods.

### Runcompress

```bash
$ npm run build
$ cd ./sampletarget
$ ./runcompress.js ilovematthewromanoilovematthewromano
ilovemathwrmnio
41.67% of original size.
ilovematthewromanoilovematthewromano
```
