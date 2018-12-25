import { rep } from '../src/lib/repl';

describe('Macros', () => {
  const strs = [
    ['(defmacro! one (fn* () 1))', '(one)', '1'],
    ['(defmacro! two (fn* () 2))', '(two)', '2'],
    [
      '(defmacro! unless (fn* (pred a b) `(if ~pred ~b ~a)))',
      '(unless false 7 8)',
      '7',
    ],
    ['(unless true 7 8)', '8'],
    [
      '(defmacro! unless2 (fn* (pred a b) `(if (not ~pred) ~a ~b)))',
      '(unless2 false 7 8)',
      '7',
    ],
    ['(unless2 true 7 8)', '8'],
    ['(macroexpand (unless2 2 3 4))', '(if (not 2) 3 4)'],
    ['(defmacro! identity (fn* (x) x))', '(let* (a 123) (identity a))', '123'],
    ['(not (= 1 1))', 'false'],
    ['(not (= 1 2))', 'true'],
    ['(nth (list 1) 0)', '1'],
    ['(nth (list 1 2) 1)', '2'],
    ['(def! x "x")', '(def! x (nth (list 1 2) 2))', 'x', '"x"'],
    ['(first (list))', 'nil'],
    ['(first (list 6))', '6'],
    ['(first (list 7 8 9))', '7'],
    ['(rest (list))', '()'],
    ['(rest (list 6))', '()'],
    ['(rest (list 7 8 9))', '(8 9)'],
    ['(or)', 'nil'],
    ['(or 1)', '1'],
    ['(or 1 2 3 4)', '1'],
    ['(or false 2)', '2'],
    ['(or false nil 3)', '3'],
    ['(or false nil false false nil 4)', '4'],
    ['(or false nil 3 false nil 4)', '3'],
    ['(or (or false 4))', '4'],
    ['(cond)', 'nil'],
    ['(cond true 7)', '7'],
    ['(cond true 7 true 8)', '7'],
    ['(cond false 7 true 8)', '8'],
    ['(cond false 7 false 8 "else" 9)', '9'],
    ['(cond false 7 (= 2 2) 8 "else" 9)', '8'],
    ['(cond false 7 false 8 false 9)', 'nil'],
    ['(let* (x (or nil "yes")) x)', '"yes"'],
    ['(nth [1] 0)', '1'],
    ['(nth [1 2] 1)', '2'],
    ['(def! x "x")', '(def! x (nth [1 2] 2))', 'x', '"x"'],
    ['(first [])', 'nil'],
    ['(first nil)', 'nil'],
    ['(first [10])', '10'],
    ['(first [10 11 12])', '10'],
    ['(rest [])', '()'],
    ['(rest nil)', '()'],
    ['(rest [10])', '()'],
    ['(rest [10 11 12])', '(11 12)'],
    ['(let* [x (or nil "yes")] x)', '"yes"'],
    ['(load-file "./tests/core.owl")', '(-> 7)', '7'],
    ['(-> (list 7 8 9) first)', '7'],
    ['(-> (list 7 8 9) (first))', '7'],
    ['(-> (list 7 8 9) first (+ 7))', '14'],
    ['(-> (list 7 8 9) rest (rest) first (+ 7))', '16'],
    ['(->> "L")', '"L"'],
    ['(->> "L" (str "W") (str "O"))', '"OWL"'],
    ['(->> [4] (concat [3]) (concat [2]) rest (concat [1]))', '(1 3 4)'],
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
