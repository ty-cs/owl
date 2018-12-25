import { rep } from '../src/lib/repl';

describe('File', () => {
  const strs = [
    ['(do (do 1 2))', '2'],
    ['(read-string "(1 2 (3 4) nil)")', '(1 2 (3 4) nil)'],
    ['(read-string "(+ 2 3)")', '(+ 2 3)'],
    ['(read-string "7 ;; comment")', '7'],
    ['(read-string ";; comment")', '(eval (read-string "(+ 2 3)"))', '5'],
    ['(slurp "./tests/test.txt")', '"A line of text\\n"'],
    ['(load-file "./tests/inc.owl")', '(inc1 7)', '8'],
    ['(inc2 7)', '9'],
    ['(inc3 9)', '12'],
    ['(list? *ARGV*)', 'true'],
    ['*ARGV*', '()'],
    ['(def! inc3 (fn* (a) (+ 3 a)))', '(def! a (atom 2))', '(atom 2)'],
    ['(atom? a)', 'true'],
    ['(atom? 1)', 'false'],
    ['(deref a)', '2'],
    ['(reset! a 3)', '3'],
    ['(deref a)', '3'],
    ['(swap! a inc3)', '6'],
    ['(deref a)', '6'],
    ['(swap! a (fn* (a) a))', '6'],
    ['(swap! a (fn* (a) (* 2 a)))', '12'],
    ['(swap! a (fn* (a b) (* a b)) 10)', '120'],
    ['(swap! a + 3)', '123'],
    [
      '(def! inc-it (fn* (a) (+ 1 a)))',
      '(def! atm (atom 7))',
      '(def! f (fn* () (swap! atm inc-it)))',
      '(f)',
      '8',
    ],
    ['(f)', '9'],
    ['(load-file "./tests/incB.owl")', '"incB.owl return string"'],
    ['(inc4 7)', '11'],
    ['(inc5 7)', '12'],
    ['(load-file "./tests/incC.owl")', 'mymap', '{"a" 1}'],
    ['(def! atm (atom 9))', '@atm', '9'],
    ['(def! g (fn* [] 78))', '(g)', '78'],
    ['(def! g (fn* [a] (+ a 78)))', '(g 3)', '81'],
  ];

  it.each(strs)('Testing string: %s', (...strs) => {
    if (strs.length === 2) {
      expect(rep(strs[0])).toBe(strs[1]);
      return; // ...... fixed now I realized why else matters lol...
    } else {
      const ins = strs.slice(0, strs.length - 2);
      const [last, res] = strs.slice(strs.length - 2);
      try {
        ins.map(rep);
      } catch (exc) {
      } finally {
        expect(rep(last)).toBe(res);
      }
    }
  });


});
