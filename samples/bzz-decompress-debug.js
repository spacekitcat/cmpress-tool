#!/usr/bin/env node
import { DecompressorTransformer } from '../lib/decompressor-transformer';
import fs from 'fs';
import { createStream } from 'table';
import colors from 'ansi-colors';

let filePath = process.argv[2];

if (!filePath) {
  console.log('No input file path specified. Please provide a file path.');
  process.exit(-1);
}

let fileReadStream = fs.createReadStream(filePath);
let fileWriteStream = fs.createWriteStream('/dev/null');

let decompressorTransformer = new DecompressorTransformer();

let tableData = [];
let tableConfig = {
  columnDefault: {
    width: 25
},
columnCount: 5
};

let statusStream = createStream(tableConfig);
statusStream.write(['Token field', 'Prefix field', 'Packet header', 'Packet raw source buffer', 'History buffer' ]);
decompressorTransformer.on('packet-unpack', data => {
  let historyBuffer = data.history_buffer.buffer;
  let prefix = data.packet.p ? data.packet.p : 'N/A';

  statusStream.write([
    data.packet.t.toString('hex'),
    prefix,
    `size=${data.header.size}, prefix=${data.header.hasPrefix ? data.header.hasPrefix : 'N/A'} prefixByteExtOne=${data.header.prefixByteExtOne ? data.header.prefixByteExtOne : 'N/A'}`,
    data.buffer.toString('hex'),
    historyBuffer.toString('hex')
  ]);
});

decompressorTransformer.on('finish', () => {
  process.stdout.write(`\n${colors.red('Boom, done.')}\n`);
});

fileReadStream.pipe(decompressorTransformer).pipe(fileWriteStream);
