export default {
    OFF: 0x00000000,

    HAS_PREFIX: 0x00000001,
    
    /** Adds an extra byte to the prefix from field; adds an extra byte to the prefix to field */
    PREFIX_EXTRA_INT_BYTE_1: 0x00000010,

    /** Adds up to 3 extra bytes to the packet size field */
    SIZE_FIELD_EXTRA_INT_BYTE_1: 0x10000000,
    SIZE_FIELD_EXTRA_INT_BYTE_2: 0x01000000,
    SIZE_FIELD_EXTRA_INT_BYTE_3: 0x00100000,
}
