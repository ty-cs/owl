import * as fs from 'fs';
import { prStr } from './printer';
import { readStr } from './reader';
import { readline } from './node_readline';
import {
  equals,
  isListOrVector,
  OwlAtom,
  OwlBoolean,
  OwlFunction,
  OwlHashMap,
  OwlKeyword,
  OwlList,
  OwlNil,
  OwlNumber,
  OwlString,
  OwlSymbol,
  OwlType,
  OwlVector,
  Types,
} from './types';
import * as path from 'path';

export const ns: Map<OwlSymbol, OwlFunction> = (() => {
  const funcs: { [symbol: string]: typeof OwlFunction.prototype.func } = {
    '+': (a: OwlType, b: OwlType): OwlNumber => {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlNumber(a.val + b.val);
    },
    '-': (a: OwlType, b: OwlType): OwlNumber => {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlNumber(a.val - b.val);
    },
    // tslint:disable-next-line:object-literal-sort-keys
    '*': (a: OwlType, b: OwlType): OwlNumber => {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlNumber(a.val * b.val);
    },
    '/': (a: OwlType, b: OwlType): OwlNumber => {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlNumber(a.val / b.val);
    },
    list: (...args: OwlType[]): OwlList => new OwlList(args),
    'list?': (arg: OwlType): OwlBoolean =>
      new OwlBoolean(arg.type === Types.List),
    'empty?': (arg: OwlType): OwlBoolean => {
      if (!isListOrVector(arg)) return new OwlBoolean(false);
      return new OwlBoolean(arg.list.length === 0);
    },
    count: (arg: OwlType): OwlNumber => {
      if (!isListOrVector(arg)) {
        return new OwlNumber(0);
      }
      return new OwlNumber(arg.list.length);
    },
    '=': (a: OwlType, b: OwlType): OwlBoolean => new OwlBoolean(equals(a, b)),
    '<': (a: OwlType, b: OwlType): OwlBoolean => {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlBoolean(a.val < b.val);
    },
    '<=': (a: OwlType, b: OwlType): OwlBoolean => {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlBoolean(a.val <= b.val);
    },
    '>': (a: OwlType, b: OwlType): OwlBoolean => {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlBoolean(a.val > b.val);
    },
    '>=': (a: OwlType, b: OwlType): OwlBoolean => {
      if (a.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${a.type}, expected: number`);
      }
      if (b.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${b.type}, expected: number`);
      }
      return new OwlBoolean(a.val >= b.val);
    },
    'pr-str': (...args: OwlType[]): OwlString =>
      new OwlString(args.map(el => prStr(el, true)).join(' ')),
    prn: (...args: OwlType[]): OwlNil => {
      console.log(args.map(el => prStr(el, true)).join(' '));
      return new OwlNil();
    },
    str: (...args: OwlType[]): OwlString =>
      new OwlString(args.map(el => prStr(el, false)).join('')),
    println: (...args: OwlType[]): OwlNil => {
      console.log(args.map(el => prStr(el, false)).join(' '));
      return new OwlNil();
    },
    add: (...args: OwlNumber[]): OwlNumber =>
      args.reduce((a, b) => new OwlNumber(a.val + b.val), new OwlNumber(0)),
    'read-string': (str: OwlType): OwlType => {
      if (str.type !== Types.String) {
        throw new Error(`unexpected symbol: ${str.type}, expected: string`);
      }
      return readStr(str.val);
    },
    slurp: (filename: OwlType): OwlString => {
      if (filename.type !== Types.String) {
        throw new Error(
          `unexpected symbol: ${filename.type}, expected: string`,
        );
      }
      return new OwlString(fs.readFileSync(path.resolve(__dirname,filename.val), 'UTF-8'));
    },
    atom: (arg: OwlType): OwlAtom => new OwlAtom(arg),
    'atom?': (arg: OwlType): OwlBoolean =>
      new OwlBoolean(arg.type === Types.Atom),
    deref: (arg: OwlType): OwlType => {
      if (arg.type !== Types.Atom) {
        throw new Error(`unexpected symbol: ${arg.type}, expected: atom`);
      }
      return arg.val;
    },
    'reset!': (atom: OwlType, value: OwlType): OwlType => {
      if (atom.type !== Types.Atom) {
        throw new Error(`unexpected symbol: ${atom.type}, expected: atom`);
      }
      atom.val = value;
      return atom.val;
    },
    'swap!': (atom: OwlType, func: OwlType, ...args: OwlType[]): OwlType => {
      if (atom.type !== Types.Atom) {
        throw new Error(`unexpected symbol: ${atom.type}, expected: atom`);
      }
      if (func.type !== Types.Function) {
        throw new Error(`unexpected symbol: ${func.type}, expected: function`);
      }
      atom.val = func.func(...[atom.val, ...args]);
      return atom.val;
    },
    cons: (arg: OwlType, list: OwlType): OwlList => {
      if (!isListOrVector(list)) {
        throw new Error(
          `unexpected symbol: ${list.type}, expected: list or vector`,
        );
      }
      return new OwlList([arg, ...list.list]);
    },
    concat: (...args: OwlType[]): OwlList => {
      const lists = args.map(list => {
        if (!isListOrVector(list)) {
          throw new Error(
            `unexpected symbol: ${list.type}, expected: list or vector`,
          );
        }
        return list;
      });
      return new OwlList(
        lists.reduce((a, b) => a.concat(b.list), [] as OwlType[]),
      );
    },
    nth: (list: OwlType, idx: OwlNumber): OwlType => {
      if (!isListOrVector(list)) {
        throw new Error(
          `unexpected symbol: ${list.type}, expected: list or vector`,
        );
      }
      if (idx.type !== Types.Number) {
        throw new Error(`unexpected symbol: ${idx.type}, expected: number`);
      }
      const v = idx.val;
      if (v < 0 || v >= list.list.length) {
        throw new Error(`${v}:index out of range`);
      }
      return list.list[v];
    },
    first: (list: OwlType): OwlType => {
      if (list.type === Types.Nil) {
        return new OwlNil();
      }
      if (!isListOrVector(list)) {
        throw new Error(
          `unexpected symbol: ${list.type}, expected: list or vector`,
        );
      }
      // maybe []
      return list.list[0] || new OwlNil();
    },
    rest: (list: OwlType): OwlType => {
      if (list.type === Types.Nil) {
        return new OwlList([]);
      }
      if (!isListOrVector(list)) {
        throw new Error(
          `unexpected symbol: ${list.type}, expected: list or vector`,
        );
      }
      const [, ...rest] = list.list;
      return new OwlList(rest);
    },
    throw: (arg: OwlType): OwlType => {
      throw arg;
    },
    apply: (fn: OwlType, ...args: OwlType[]): OwlType => {
      if (fn.type !== Types.Function) {
        throw new Error(`unexpected symbol: ${fn.type}, expected: function`);
      }
      const list = args[args.length - 1];
      if (!isListOrVector(list)) {
        throw new Error(
          `unexpected symbol: ${list.type}, expected: list or vector`,
        );
      }
      const res = [...args.slice(0, -1), ...list.list];
      return fn.func(...res);
    },
    map: (fn: OwlType, list: OwlType): OwlList => {
      if (fn.type !== Types.Function) {
        throw new Error(`unexpected symbol: ${fn.type}, expected: function`);
      }
      if (!isListOrVector(list)) {
        throw new Error(
          `unexpected symbol: ${list.type}, expected: list or vector`,
        );
      }
      return new OwlList(list.list.map(x => fn.func(x)));
    },
    'nil?': (arg: OwlType): OwlBoolean =>
      new OwlBoolean(arg.type === Types.Nil),
    'true?': (arg: OwlType): OwlBoolean =>
      new OwlBoolean(arg.type === Types.Boolean && arg.val),
    'false?': (arg: OwlType): OwlBoolean =>
      new OwlBoolean(arg.type === Types.Boolean && !arg.val),
    'symbol?': (arg: OwlType): OwlBoolean =>
      new OwlBoolean(arg.type === Types.Symbol),
    symbol: (arg: OwlType): OwlSymbol => {
      if (arg.type !== Types.String) {
        throw new Error(`unexpected symbol: ${arg.type}, expected: string`);
      }
      return new OwlSymbol(arg.val);
    },
    keyword: (arg: OwlType): OwlKeyword => {
      if (arg.type === Types.Keyword) {
        return arg;
      }
      if (arg.type !== Types.String) {
        throw new Error(`unexpected symbol: ${arg.type}, expected: string`);
      }
      return new OwlKeyword(arg.val);
    },
    'keyword?': (arg: OwlType): OwlBoolean =>
      new OwlBoolean(arg.type === Types.Keyword),
    vector: (...args: OwlType[]): OwlVector => new OwlVector(args),
    'vector?': (arg: OwlType): OwlBoolean =>
      new OwlBoolean(arg.type === Types.Vector),
    'hash-map': (...args: OwlType[]): OwlHashMap => new OwlHashMap(args),
    'map?': (arg: OwlType): OwlBoolean =>
      new OwlBoolean(arg.type === Types.HashMap),
    assoc: (m: OwlType, ...args: OwlType[]): OwlHashMap => {
      if (m.type !== Types.HashMap) {
        throw new Error(`unexpected symbol: ${m.type}, expected: hash-map`);
      }
      return m.assoc(args);
    },

    dissoc: (m: OwlType, ...args: OwlType[]) => {
      if (m.type !== Types.HashMap) {
        throw new Error(`unexpected symbol: ${m.type}, expected: hash-map`);
      }
      return m.dissoc(args);
    },
    get: (m: OwlType, key: OwlType): OwlType => {
      if (m.type === Types.Nil) {
        return new OwlNil();
      }
      if (m.type !== Types.HashMap) {
        throw new Error(`unexpected symbol: ${m.type}, expected: hash-map`);
      }
      if (key.type !== Types.String && key.type !== Types.Keyword) {
        throw new Error(
          `unexpected symbol: ${key.type}, expected: string or keyword`,
        );
      }
      return m.get(key);
    },
    'contains?': (m: OwlType, key: OwlType): OwlBoolean => {
      if (m.type !== Types.HashMap) {
        throw new Error(`unexpected symbol: ${m.type}, expected: hash-map`);
      }
      if (key.type !== Types.String && key.type !== Types.Keyword) {
        throw new Error(
          `unexpected symbol: ${key.type}, expected: string or keyword`,
        );
      }
      return new OwlBoolean(m.contains(key));
    },
    keys: (m: OwlType): OwlList => {
      if (m.type !== Types.HashMap) {
        throw new Error(`unexpected symbol: ${m.type}, expected: hash-map`);
      }
      return m.keys();
    },
    vals: (m: OwlType): OwlList => {
      if (m.type !== Types.HashMap) {
        throw new Error(`unexpected symbol: ${m.type}, expected: hash-map`);
      }
      return m.vals();
    },
    'sequential?': (arg: OwlType): OwlBoolean =>
      new OwlBoolean(isListOrVector(arg)),
    readline: (arg: OwlType): OwlType => {
      if (arg.type !== Types.String) {
        throw new Error(`unexpected symbol: ${arg.type}, expected: string`);
      }
      const ret = readline(arg.val);
      if (ret == null) {
        return new OwlNil();
      } else return new OwlString(ret);
    },
    meta: (arg: OwlType): OwlType => arg.meta || new OwlNil(),
    'with-meta': (arg: OwlType, meta: OwlType) => arg.withMeta(meta),
    'time-ms': (): OwlNumber => new OwlNumber(Date.now()),
    'string?': (arg: OwlType): OwlBoolean =>
      new OwlBoolean(arg.type === Types.String),
    'number?': (arg: OwlType): OwlBoolean =>
      new OwlBoolean(arg.type === Types.Number),
    'fn?': (arg: OwlType): OwlBoolean =>
      new OwlBoolean(arg.type === Types.Function && !arg.isMacro),
    'macro?': (arg: OwlType): OwlBoolean =>
      new OwlBoolean(arg.type === Types.Function && arg.isMacro),
    seq: (arg: OwlType): OwlList | OwlNil => {
      if (arg.type === Types.List) {
        return arg.list.length === 0 ? new OwlNil() : arg;
      } else if (arg.type === Types.Vector) {
        return arg.list.length === 0 ? new OwlNil() : new OwlList(arg.list);
      } else if (arg.type === Types.String) {
        return arg.val === ''
          ? new OwlNil()
          : new OwlList(arg.val.split('').map(str => new OwlString(str)));
      } else if (arg.type === Types.Nil) {
        return new OwlNil();
      } else {
        throw new Error(
          `unexpected symbol: ${arg.type}, expected: list or vector or string`,
        );
      }
    },

    conj: (list: OwlType, ...args: OwlType[]): OwlList | OwlVector => {
      if (list.type === Types.List) {
        return new OwlList([...args.reverse(), ...list.list]);
      } else if (list.type === Types.Vector) {
        return new OwlVector([...list.list, ...args]);
      }
      throw new Error(
        `unexpected symbol: ${list.type}, expected: list or vector`,
      );
    },
  };
  const map = new Map<OwlSymbol, OwlFunction>();
  Object.keys(funcs).map(key =>
    map.set(new OwlSymbol(key), OwlFunction.simpleFunc(funcs[key])),
  );
  return map;
})();
