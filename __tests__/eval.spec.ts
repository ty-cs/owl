import { rep } from '../src/lib/repl';

describe('EVAL', () => {
  const strs = [
    ['(+ 1 2)', '3'],
    ['(+ 5 (* 2 3))', '11'],
    ['(- (+ 5 (* 2 3)) 3)', '8'],
    ['(/ (- (+ 5 (* 2 3)) 3) 4)', '2'],
    ['(/ (- (+ 515 (* 87 311)) 302) 27)', '1010'],
    ['(* -3 6)', '-18'],
    ['(/ (- (+ 515 (* -87 311)) 296) 27)', '-994'],
    ['()', '()'],
    ['(add 1 2 3 4 5 6 7 8 9 10)', '55'],
    ['[1 2 (+ 1 2)]', '[1 2 3]'],
    ['{"a" (+ 7 8)}', '{"a" 15}'],
    ['{:a (+ 7 8)}', '{:a 15}'],
  ];

  it.each(strs.map(([a, b]) => [a, b]))(
    'Testing string -> %s',
    (strIn, strOut) => {
      expect(rep(strIn)).toBe(strOut);
    },
  );

  it('should throw Error when not found', () => {
    expect(() => rep('(abc 1 2 3)')).toThrowError(Error);
  });
  it('should throw Error when meet wrong types', function() {
    expect(() => rep('(+ "1" 2)')).toThrowError(Error);
    expect(() => rep('(- "1" 2)')).toThrowError(Error);
    expect(() => rep('(* "1" 2)')).toThrowError(Error);
    expect(() => rep('(/ "1" 2)')).toThrowError(Error);
    expect(() => rep('(+ 1 "2")')).toThrowError(Error);
    expect(() => rep('(- 1 "2")')).toThrowError(Error);
    expect(() => rep('(* 1 "2")')).toThrowError(Error);
    expect(() => rep('(/ 1 "2")')).toThrowError(Error);

    expect(() => rep('(> 1 "2")')).toThrowError(Error);
    expect(() => rep('(< 1 "2")')).toThrowError(Error);
    expect(() => rep('(>= 1 "2")')).toThrowError(Error);
    expect(() => rep('(<= 1 "2")')).toThrowError(Error);
    expect(() => rep('(> 1 "2")')).toThrowError(Error);
    expect(() => rep('(< 1 "2")')).toThrowError(Error);
    expect(() => rep('(>= 1 "2")')).toThrowError(Error);
    expect(() => rep('(<= 1 "2")')).toThrowError(Error);
    expect(() => rep('(read-string 1)')).toThrowError(Error);
    expect(() => rep('(slurp 1)')).toThrowError(Error);
    expect(() => rep('(deref 1)')).toThrowError(Error);
    expect(() => rep('(reset! 1)')).toThrowError(Error);
    expect(() => rep('(swap! 1)')).toThrowError(Error);
    expect(() => rep('(swap! (atom 1) 2)')).toThrowError(Error);
    expect(() => rep('(cons 1 2)')).toThrowError(Error);
    expect(() => rep('(concat 1 2)')).toThrowError(Error);
    expect(() => rep('(nth [1 2 3] "2")')).toThrowError(Error);
    expect(() => rep('(nth 2 "2")')).toThrowError(Error);
    expect(() => rep('(first 2)')).toThrowError(Error);
    expect(() => rep('(rest 2)')).toThrowError(Error);
    expect(() => rep('(apply 2)')).toThrowError(Error);
    expect(() => rep('(apply (fn* (a) (+ a 1)) 2)')).toThrowError(Error);
    expect(() => rep('(map 2)')).toThrowError(Error);
    expect(() => rep('(map (fn* (a) (+ a 1)) 2)')).toThrowError(Error);
    expect(() => rep('(keyword 2)')).toThrowError(Error);
    expect(() => rep('(symbol 2)')).toThrowError(Error);
    expect(() => rep('(assoc 2)')).toThrowError(Error);
    expect(() => rep('(dissoc 2)')).toThrowError(Error);
    expect(() => rep('(get 2)')).toThrowError(Error);
    expect(() => rep('(get {"a" 2} 2)')).toThrowError(Error);
    expect(() => rep('(contains? 2)')).toThrowError(Error);
    expect(() => rep('(contains? {"a" 2} 2)')).toThrowError(Error);
    expect(() => rep('(keys 2)')).toThrowError(Error);
    expect(() => rep('(vals 2)')).toThrowError(Error);
    expect(() => rep('(seq 2)')).toThrowError(Error);
    expect(() => rep('(conj 2)')).toThrowError(Error);
    expect(() => rep('(eval)')).toThrowError(Error);
  });

  it('should ', () => {
    expect(rep('(keyword (keyword "2"))')).toBe(':2');
    expect(rep('(string? (keyword "abc"))')).toBe('false');
    rep('(def! a 2)');
    expect(rep('(= a a)')).toBe('true');
  });
});
