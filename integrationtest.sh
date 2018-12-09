#!/bin/bash

RESOURCE_DIR='./resources';
SCRIPT_DIR='./samplestarget';

declare -a VERIFICATION_TARGETS=($RESOURCE_DIR/testinput01.txt $RESOURCE_DIR/testinput02.txt)

function verifyFileCompressDecompress() {
  $SCRIPT_DIR/filecompress.js $1
  $SCRIPT_DIR/fileinflate.js $1.bzz
  shasum $1
  shasum $1.bzz.inflate
}

for i in "${VERIFICATION_TARGETS[@]}"
do
  echo --
  verifyFileCompressDecompress $i;
done
echo --


