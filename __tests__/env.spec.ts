import { rep } from '../src/lib/repl';

describe('ENV', () => {
  const strs = [
    ['(+ 1 2)', '3'],
    ['(/ (- (+ 5 (* 2 3)) 3) 4)', '2'],
    ['(def! x 3)', '3'],
    ['x', '3'],
    ['(def! x 4)', '4'],
    ['x', '4'],
    ['(def! y (+ 1 7))', '8'],
    ['y', '8'],
    ['(def! mynum 111)', '111'],
    ['(def! MYNUM 222)', '222'],
    ['mynum', '111'],
    ['MYNUM', '222'],
    ['(let* (z 9) z)', '9'],
    ['(let* (x 9) x)', '9'],
    ['x', '4'],
    ['(let* (z (+ 2 3)) (+ 1 z))', '6'],
    ['(let* (p (+ 2 3) q (+ 2 p)) (+ p q))', '12'],
    ['(def! a 4)', '4'],
    ['(let* (q 9) q)', '9'],
    ['(let* (q 9) a)', '4'],
    ['(let* (z 2) (let* (q 9) a))', '4'],
    ['(let* (x 4) (def! a 5))', '5'],
    ['a', '4'],
    ['(let* [z 9] z)', '9'],
    ['(let* [p (+ 2 3) q (+ 2 p)] (+ p q))', '12'],
    ['(let* (a 5 b 6) [3 4 a [b 7] 8])', '[3 4 5 [6 7] 8]'],
  ];

  it.each(strs.map(([a, b]) => [a, b]))(
    'Testing string -> %s',
    (strIn, strOut) => {
      expect(rep(strIn)).toBe(strOut);
    },
  );

  it('should return 7', function() {
    rep('(def! y (let* (z 7) z))');
    expect(rep('y')).toBe('7');
  });
});
