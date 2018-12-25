import { rep } from '../src/lib/repl';

describe('TCO', () => {
  const strs = [
    [
      '(def! sum2 (fn* (n acc) (if (= n 0) acc (sum2 (- n 1) (+ n acc)))))',
      '(sum2 10 0)',
      '55',
    ],
    ['(def! res2 nil)', 'nil'],
    ['(def! res2 (sum2 10000 0))', 'res2', '50005000'],
    [
      '(def! foo (fn* (n) (if (= n 0) 0 (bar (- n 1)))))',
      '(def! bar (fn* (n) (if (= n 0) 0 (foo (- n 1)))))',
      '(foo 10000)',
      '0',
    ],
  ];

  it.each(strs)('Testing string: %s', (...strs) => {
    if (strs.length === 2) {
      expect(rep(strs[0])).toBe(strs[1]);
      return;
    } else {
      const ins = strs.slice(0, strs.length - 2);
      const [last, res] = strs.slice(strs.length - 2);
      ins.map(rep);
      expect(rep(last)).toBe(res);
    }
  });
});
