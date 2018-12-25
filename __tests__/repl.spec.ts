import { rep } from '../src/lib/repl';

describe('REPL', () => {
  const strs = [
    `"abcABC123"`,
    `"Hello World"`,
    `"[]{}\\"'* ;:()"`,
    `"hello world abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789 (;:() []{}\\"'* ;:() []{}\\"'* ;:() []{}\\"'*)"`,
  ];

  it.each(strs.map(str => [str, str]))(
    'Testing string -> %s',
    (strIn, strOut) => {
      expect(rep(strIn)).toBe(strOut);
    },
  );
});
