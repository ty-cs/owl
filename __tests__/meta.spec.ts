import { rep } from '../src/lib/repl';

describe('Meta', () => {
  const strs = [
    ['(= "something bogus" *host-language*)', 'false'],
    ['(meta (fn* (a) a))', 'nil'],
    ['(meta (with-meta (fn* (a) a) {"b" 1}))', '{"b" 1}'],
    ['(meta (with-meta (fn* (a) a) "abc"))', '"abc"'],
    ['(def! l-wm (with-meta (fn* (a) a) {"b" 2}))', '(meta l-wm)', '{"b" 2}'],
    ['(meta (with-meta l-wm {"new_meta" 123}))', '{"new_meta" 123}'],
    ['(meta l-wm)', '{"b" 2}'],
    [
      '(def! f-wm (with-meta (fn* [a] (+ 1 a)) {"abc" 1}))',
      '(meta f-wm)',
      '{"abc" 1}',
    ],
    ['(meta (with-meta f-wm {"new_meta" 123}))', '{"new_meta" 123}'],
    ['(meta f-wm)', '{"abc" 1}'],
    ['(def! f-wm2 ^{"abc" 1} (fn* [a] (+ 1 a)))', '(meta f-wm2)', '{"abc" 1}'],
    ['(meta +)', 'nil'],
    [
      '(def! gen-plusX (fn* (x) (with-meta (fn* (b) (+ x b)) {"meta" 1})))',
      '(def! plus7 (gen-plusX 7))',
      '(def! plus8 (gen-plusX 8))',
      '(plus7 8)',
      '15',
    ],
    ['(meta plus7)', '{"meta" 1}'],
    ['(meta plus8)', '{"meta" 1}'],
    ['(meta (with-meta plus7 {"meta" 2}))', '{"meta" 2}'],
    ['(meta plus8)', '{"meta" 1}'],
    [
      '(def! e (atom {"+" +}))',
      '(swap! e assoc "-" -)',
      '( (get @e "+") 7 8)',
      '15',
    ],
    ['( (get @e "-") 11 8)', '3'],
    ['(swap! e assoc "foo" (list))', '(get @e "foo")', '()'],
    [`(swap! e assoc "bar" '(1 2 3))`, '(get @e "bar")', '(1 2 3)'],
    ['(string? "")', 'true'],
    ["(string? 'abc)", 'false'],
    ['(string? "abc")', 'true'],
    ['(string? :abc)', 'false'],
    ['(string? (keyword "abc"))', 'false'],
    ['(string? 234)', 'false'],
    ['(string? nil)', 'false'],
    ['(number? 123)', 'true'],
    ['(number? -1)', 'true'],
    ['(number? nil)', 'false'],
    ['(number? false)', 'false'],
    ['(number? "123")', 'false'],
    ['(def! add1 (fn* (x) (+ x 1)))', '(fn? +)', 'true'],
    ['(fn? add1)', 'true'],
    ['(fn? cond)', 'false'],
    ['(fn? "+")', 'false'],
    ['(fn? :+)', 'false'],
    ['(macro? cond)', 'true'],
    ['(macro? +)', 'false'],
    ['(macro? add1)', 'false'],
    ['(macro? "+")', 'false'],
    ['(macro? :+)', 'false'],
    ['(conj (list) 1)', '(1)'],
    ['(conj (list 1) 2)', '(2 1)'],
    ['(conj (list 2 3) 4)', '(4 2 3)'],
    ['(conj (list 2 3) 4 5 6)', '(6 5 4 2 3)'],
    ['(conj (list 1) (list 2 3))', '((2 3) 1)'],
    ['(conj [] 1)', '[1]'],
    ['(conj [1] 2)', '[1 2]'],
    ['(conj [2 3] 4)', '[2 3 4]'],
    ['(conj [2 3] 4 5 6)', '[2 3 4 5 6]'],
    ['(conj [1] [2 3])', '[1 [2 3]]'],
    ['(seq "abc")', '("a" "b" "c")'],
    ['(apply str (seq "this is a test"))', '"this is a test"'],
    ["(seq '(2 3 4))", '(2 3 4)'],
    ['(seq [2 3 4])', '(2 3 4)'],
    ['(seq "")', 'nil'],
    ["(seq '())", 'nil'],
    ['(seq [])', 'nil'],
    ['(seq nil)', 'nil'],
    ['(meta [1 2 3])', 'nil'],
    ['(with-meta [1 2 3] {"a" 1})', '[1 2 3]'],
    ['(meta (with-meta [1 2 3] {"a" 1}))', '{"a" 1}'],
    ['(vector? (with-meta [1 2 3] {"a" 1}))', 'true'],
    ['(meta (with-meta [1 2 3] "abc"))', '"abc"'],
    ['(meta (with-meta (list 1 2 3) {"a" 1}))', '{"a" 1}'],
    ['(list? (with-meta (list 1 2 3) {"a" 1}))', 'true'],
    ['(meta (with-meta {"abc" 123} {"a" 1}))', '{"a" 1}'],
    ['(map? (with-meta {"abc" 123} {"a" 1}))', 'true'],
    ['(def! l-wm (with-meta [4 5 6] {"b" 2}))', '[4 5 6]'],
    ['(meta l-wm)', '{"b" 2}'],
    ['(meta (with-meta l-wm {"new_meta" 123}))', '{"new_meta" 123}'],
    ['(meta l-wm)', '{"b" 2}'],
    ['(meta +)', 'nil'],
    ['(def! f-wm3 ^{"def" 2} +)', '(meta f-wm3)', '{"def" 2}'],
    ['(meta +)', 'nil'],
    ['(= (gensym) (gensym))', 'false'],
    ['(let* [or_FIXME 23] (or false (+ or_FIXME 100)))', '123'],
    ['(def! start-time (time-ms))', '(= start-time 0)', 'false'],
    [
      '(let* [sumdown (fn* (N) (if (> N 0) (+ N (sumdown (- N 1))) 0))] (sumdown 10)) ; Waste some time',
      '55',
    ],
    // sometime they can be equal... < 1ms
    ['(>= (time-ms) start-time)', 'true'],
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
