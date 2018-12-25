import { Env } from './env';

export type OwlType =
  | OwlList
  | OwlVector
  | OwlNumber
  | OwlString
  | OwlBoolean
  | OwlNil
  | OwlSymbol
  | OwlKeyword
  | OwlHashMap
  | OwlFunction
  | OwlAtom;

export const enum Types {
  List = 1,
  Vector,
  Number,
  String,
  Boolean,
  Nil,
  Symbol,
  Keyword,
  HashMap,
  Function,
  Atom,
}

export const isOwlType = (arg: any): arg is OwlType => !!arg.type;

export const isListOrVector = (arg: OwlType): arg is OwlList | OwlVector =>
  arg.type === Types.List || arg.type === Types.Vector;
export const equals = (a: OwlType, b: OwlType): boolean => {
  // same object
  if (a === b) return true;

  // Nil
  if (a.type === Types.Nil && b.type === Types.Nil) {
    return true;
  }

  // List and Vector
  if (isListOrVector(a) && isListOrVector(b)) {
    if (a.list.length !== b.list.length) {
      return false;
    }
    for (let i = 0; i < a.list.length; i++) {
      if (!equals(a.list[i], b.list[i])) {
        return false;
      }
    }
    return true;
  }

  if (a.type !== b.type) return false;

  // Map
  if (a.type === Types.HashMap && b.type === Types.HashMap) {
    if (a.map.size !== b.map.size) {
      return false;
    }
    if (Object.keys(a.map).length !== Object.keys(b.map).length) {
      return false;
    }
    for (const [k, v] of a.entries()) {
      const bV = b.get(k);
      if (bV === undefined) return false;

      if (!equals(v, bV)) return false;
    }
    return true;
  }

  //  Symbol
  if (a.type === Types.Symbol && b.type === Types.Symbol) {
    return Symbol.keyFor(a.val) === Symbol.keyFor(b.val);
  }

  //  Number
  //  String
  //  Boolean
  //  Keyword
  if (
    (a.type === Types.Number && b.type === Types.Number) ||
    (a.type === Types.String && b.type === Types.String) ||
    (a.type === Types.Boolean && b.type === Types.Boolean) ||
    (a.type === Types.Keyword && b.type === Types.Keyword)
  ) {
    return a.val === b.val;
  }

  //  Function,
  return false;
};

export class OwlList {
  public type: Types.List = Types.List;
  public meta?: OwlType;

  constructor(public list: OwlType[]) {}

  public withMeta(meta: OwlType) {
    const val = new OwlList(this.list);
    val.meta = meta;
    return val;
  }
}

export class OwlVector {
  public type: Types.Vector = Types.Vector;
  public meta?: OwlType;

  constructor(public list: OwlType[]) {}

  public withMeta(meta: OwlType) {
    const val = new OwlVector(this.list);
    val.meta = meta;
    return val;
  }
}

export class OwlNumber {
  public type: Types.Number = Types.Number;
  public meta?: OwlType;

  constructor(public val: number) {}

  public withMeta(meta: OwlType) {
    const num = new OwlNumber(this.val);
    num.meta = meta;
    return num;
  }
}

export class OwlString {
  public type: Types.String = Types.String;
  public meta?: OwlType;

  constructor(public val: string) {}

  public withMeta(meta: OwlType) {
    const val = new OwlString(this.val);
    val.meta = meta;
    return val;
  }
}

export class OwlBoolean {
  public type: Types.Boolean = Types.Boolean;
  public meta?: OwlType;

  constructor(public val: boolean) {}

  public withMeta(meta: OwlType) {
    const val = new OwlBoolean(this.val);
    val.meta = meta;
    return val;
  }
}

export class OwlNil {
  public type: Types.Nil = Types.Nil;
  public meta?: OwlType;

  public withMeta(_meta: OwlType): OwlNil {
    throw new Error(`not supported`);
  }
}

export class OwlSymbol {
  public type: Types.Symbol = Types.Symbol;
  public val: symbol;
  public meta?: OwlType;

  constructor(val: string) {
    // The Symbol.for(key) method searches for existing symbols in a runtime-wide symbol registry with the given key
    // and returns it if found. Otherwise a new symbol gets created in the global symbol registry with this key.
    this.val = Symbol.for(val);
  }

  public withMeta(_meta: OwlType): OwlSymbol {
    throw new Error(`not supported`);
  }
}

export class OwlKeyword {
  public type: Types.Keyword = Types.Keyword;
  public meta?: OwlType;

  constructor(public val: string) {
    this.val = String.fromCharCode(0x29e) + this.val;
  }

  public withMeta(_meta: OwlType): OwlSymbol {
    throw new Error(`not supported`);
  }
}

export class OwlHashMap {
  public type: Types.HashMap = Types.HashMap;
  public map = new Map<string, OwlType>();
  public meta?: OwlType;

  constructor(public list: OwlType[]) {
    if (list.length % 2 !== 0) {
      throw new Error('Odd number of hash map arguments');
    }
    for (let i = 0; i < list.length; i += 2) {
      const k = list[i];
      const v = list[i + 1];
      if (k.type !== Types.String && k.type !== Types.Keyword) {
        throw new Error(
          `unexpected symbol: ${k.type}, expected: string or keyword`,
        );
      }
      this.map.set(k.val, v);
    }
  }

  public assoc(args: OwlType[]): OwlHashMap {
    const list: OwlType[] = [];
    this.map.forEach((v, k) => {
      list.push(new OwlString(k));
      list.push(v);
    });
    return new OwlHashMap([...list, ...args]);
  }

  public dissoc(args: OwlType[]): OwlHashMap {
    const mapCopy = this.assoc([]);
    // const list: OwlType[] = [];

    args.map(arg => {
      if (arg.type !== Types.String && arg.type !== Types.Keyword) {
        throw new Error(
          `unexpected symbol: ${arg.type}, expected: keyword or string`,
        );
      }
      mapCopy.map.delete(arg.val);
    });

    return mapCopy;
  }

  public get(key: OwlKeyword | OwlString): OwlType {
    return this.map.get(key.val) || new OwlNil();
  }

  public contains(key: OwlKeyword | OwlString): boolean {
    return this.map.has(key.val);
  }

  public keys(): OwlList {
    return new OwlList(
      [...this.map.keys()].map(k =>
        k[0] === String.fromCharCode(0x29e)
          ? new OwlKeyword(k.substr(1))
          : new OwlString(k),
      ),
    );
  }

  public vals(): OwlList {
    return new OwlList([...this.map.values()]);
  }

  public entries(): Array<[OwlString | OwlKeyword, OwlType]> {
    const list: Array<[OwlString | OwlKeyword, OwlType]> = [];
    this.map.forEach((v, k) => {
      const key =
        k[0] === String.fromCharCode(0x29e)
          ? new OwlKeyword(k.substr(1))
          : new OwlString(k);
      list.push([key, v]);
    });
    return list;
  }

  public withMeta(meta: OwlType) {
    const map = this.assoc([]);
    map.meta = meta;
    return map;
  }
}

type OwlFunc = (...args: any[]) => OwlType;

export class OwlFunction {
  public static simpleFunc(func: OwlFunc): OwlFunction {
    const fn = new OwlFunction();
    fn.func = func;
    fn.isMacro = false;

    return fn;
  }

  public static fromLisp(
    EVAL: (ast: OwlType, env: Env) => OwlType,
    env: Env,
    params: OwlSymbol[],
    fnBody: OwlType,
  ): OwlFunction {
    const fn = new OwlFunction();
    fn.func = (...args) =>
      EVAL(
        fnBody,
        new Env(
          env,
          params,
          args.map(x => {
            if (!x) {
              throw new Error(`invalid argument`);
            }
            return x;
          }),
        ),
      );
    fn.env = env;
    fn.params = params;
    fn.ast = fnBody;
    fn.isMacro = false;

    return fn;
  }

  public type: Types.Function = Types.Function;
  /**
   * the original function value
   */
  public func: OwlFunc;
  /**
   * the body of the function.
   */
  public ast: OwlType;
  /**
   * the current value of the env parameter of EVAL.
   */
  public env: Env;
  /**
   * the parameter names of the function.
   */
  public params: OwlSymbol[];
  public isMacro: boolean;
  public meta?: OwlType;

  private constructor() {}

  public newEnv(args: OwlType[]): Env {
    return new Env(this.env, this.params, args);
  }

  public withMeta(meta: OwlType) {
    const fn = new OwlFunction();
    fn.func = this.func;
    fn.ast = this.ast;
    fn.env = this.env;
    fn.params = this.params;
    fn.isMacro = this.isMacro;

    fn.meta = meta;

    return fn;
  }
}

export class OwlAtom {
  public type: Types.Atom = Types.Atom;
  public meta?: OwlType;

  constructor(public val: OwlType) {}

  public withMeta(meta: OwlType) {
    const val = new OwlAtom(this.val);
    val.meta = meta;
    return val;
  }
}
