const { Console } = require('console');
const console = new Console(process.stderr, process.stderr);

/**
 * This is a workaround for a weird console.log issue in Jest;
 * Jest doesn't output to the console with this exact combo of
 * dependency versions. Probably won't be needed after a few
 * updates. It might even be Babel.
 */

export default console;
