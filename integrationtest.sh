#!/bin/bash

RESOURCE_DIR='./resources';
SCRIPT_DIR='./samplestarget';

declare -a VERIFICATION_TARGETS=($RESOURCE_DIR/testinput01.txt $RESOURCE_DIR/testinput02.txt $RESOURCE_DIR/blue.jpg $RESOURCE_DIR/sample-ppp.pptx $RESOURCE_DIR/sails.bmp)

function printSeperator() {
  printf '\n%s\n\n' '--'
}

function verifyFileCompressDecompress() {
  TIMEFORMAT="%2U"
  time $SCRIPT_DIR/filecompress.js $1
  time $SCRIPT_DIR/fileinflate.js $1.bzz
  echo
  shasum $1
  shasum $1.bzz.inflate
}

for i in "${VERIFICATION_TARGETS[@]}"
do
  printSeperator
  verifyFileCompressDecompress $i;
done
printSeperator




