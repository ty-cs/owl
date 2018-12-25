import { OwlList, OwlSymbol, OwlType } from './types';

export class Env {
  public data: Map<symbol, OwlType>;

  constructor(
    public outer?: Env,
    binds: OwlSymbol[] = [],
    exprs: OwlType[] = [],
  ) {
    this.data = new Map();

    for (let i = 0; i < binds.length; i++) {
      const sym = binds[i];
      if (Symbol.keyFor(sym.val) === '&') {
        this.set(binds[i + 1], new OwlList(exprs.slice(i)));
        break;
      }
      this.set(sym, exprs[i]);
    }
  }

  public set(key: OwlSymbol, value: OwlType): OwlType {
    // use OwlSymbol.val as [key] for map instead of key itself!
    // because (new OwlSymbol("+") !== new OwlSymbol("+")), as a result you cannot get value from key.

    // The Symbol.for(key) method searches for existing symbols in a runtime-wide symbol registry with the given key
    // and returns it if found. Otherwise a new symbol gets created in the global symbol registry with this key.
    // As a result you can use this mechanism to get the correct value.

    this.data.set(key.val, value);
    return value;
  }

  public find(key: OwlSymbol): Env | undefined {
    if (this.data.has(key.val)) return this;
    if (this.outer) return this.outer.find(key);
    return;
  }

  public get(key: OwlSymbol): OwlType {
    const env = this.find(key);
    if (!env) {
      // throw new Error(
      //   `environment not found for key: "${Symbol.keyFor(key.val)}"`,
      // );
      throw new Error(`'${Symbol.keyFor(key.val)}' not found`);
    }

    const res = env.data.get(key.val);
    if (!res) {
      // throw new Error(`value not found for key: "${Symbol.keyFor(key.val)}"`);
      throw new Error(`'${Symbol.keyFor(key.val)}' not found`);
    }

    return res;
  }
}
