import { rep, replEnv } from '../lib/repl';
import { OwlList, OwlString, OwlSymbol } from '../lib/types';

module.exports = {
  name: 'scripts',
  alias: ['s'],
  run: async toolbox => {
    if (typeof process !== 'undefined' && 2 < process.argv.length) {
      replEnv.set(
        new OwlSymbol('*ARGV*'),
        new OwlList(process.argv.slice(4).map(s => new OwlString(s))),
      );
      rep(`(load-file "${process.argv[3]}")`);
      process.exit(0);
    }
  },
};
