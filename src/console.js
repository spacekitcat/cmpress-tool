const { Console } = require('console');
const console = new Console(process.stderr, process.stderr);

/**
 * This is a workaround for a weird console.log issue in Jest.
 * Probably won't be needed after a few updates of Jest
 */

export default console;
