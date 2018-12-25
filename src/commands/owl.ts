import { readline } from '../lib/node_readline';
import { BlankException } from '../lib/reader';

const { rep } = require('../lib/repl.ts');

module.exports = {
  name: 'owl',
  run: async toolbox => {
    // const { print } = toolbox;
    while (true) {
      const line = readline('> ');
      if (line == null || line === '(exit)') {
        break;
      }
      if (line === '') {
        continue;
      }
      try {
        console.log(rep(line));
      } catch (exc) {
        if (exc instanceof BlankException) {
          continue;
        }

        exc && console.log(exc.message);
        // if (exc.stack) {
        //   console.log(exc.stack);
        // } else {
        //   console.log(`Error: ${exc}`);
        // }
      }
    }
  },
};
