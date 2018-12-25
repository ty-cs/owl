import {
  OwlBoolean,
  OwlHashMap,
  OwlKeyword,
  OwlList,
  OwlNil,
  OwlNumber,
  OwlString,
  OwlSymbol,
  OwlType,
  OwlVector,
} from './types';

export class BlankException extends Error {}

/**
 *  This object will store the tokens and a position.
 *  The Reader object will have two methods: next and peek.
 *  next(): string => returns the token at the current position and increments the position.
 *  peek(): string => just returns the token at the current position.
 */
class Reader {
  private position = 0;

  constructor(private tokens: string[]) {}

  public next(): string {
    const ret = this.peek();
    this.position += 1;
    return ret;
  }

  public peek(): string {
    return this.tokens[this.position];
  }
}

/**
 * This function will look at the contents of the token and return the appropriate scalar (simple/single) data type
 * value.
 * @param reader
 */
const readAtom = (reader: Reader): OwlType => {
  const token: string = reader.next();
  if (token === undefined) {
    throw new Error('SyntaxError: Invalid or unexpected token');
  }
  // int
  if (/^-?[0-9]+$/.test(token)) {
    return new OwlNumber(Number.parseInt(token, 10));
  }
  // float
  if (/^-?[0-9]\.[0-9]+$/.test(token)) {
    return new OwlNumber(Number.parseFloat(token));
  }
  // string
  if (token[0] === '"') {
    return new OwlString(
      token
        .slice(1, token.length - 1)
        .replace(/\\(.)/g, (_, c: string) => (c === 'n' ? '\n' : c)),
    );
  }
  // keyword
  if (token[0] === ':') {
    return new OwlKeyword(token.substr(1));
  }

  switch (token) {
    case 'nil':
      return new OwlNil();
    case 'true':
      return new OwlBoolean(true);
    case 'false':
      return new OwlBoolean(false);
  }

  return new OwlSymbol(token);
};

/**
 * This function will peek at the first token in the Reader object and switch on the first character of that token. If
 * the character is a left paren then read_list is called with the Reader object. Otherwise, read_atom is called with
 * the Reader Object.
 * @param reader
 */
const readForm = (reader: Reader): OwlType => {
  const token = reader.peek();
  switch (token) {
    case "'":
      reader.next();
      return new OwlList([new OwlSymbol('quote'), readForm(reader)]);
    case '`':
      reader.next();
      return new OwlList([new OwlSymbol('quasiquote'), readForm(reader)]);
    case '~':
      reader.next();
      return new OwlList([new OwlSymbol('unquote'), readForm(reader)]);
    case '~@':
      reader.next();
      return new OwlList([new OwlSymbol('splice-unquote'), readForm(reader)]);
    case '@':
      reader.next();
      return new OwlList([new OwlSymbol('deref'), readForm(reader)]);
    case '^':
      reader.next();
      const meta = readForm(reader);
      return new OwlList([new OwlSymbol('with-meta'), readForm(reader), meta]);
    // case '^':
    //   reader.next();
    //   return new OwlList([new OwlSymbol('with-meta'), readForm(reader)]);
    // case '^': reader.next()
    //               var meta = read_form(reader)
    //               return [Symbol.for('with-meta'), read_form(reader), meta]
    case '(':
      return readList(reader);
    case '[':
      return readVector(reader);
    case '{':
      return readHashMap(reader);
    default:
      return readAtom(reader);
  }
};

/**
 * This function will take a single string and return an array/list of all the tokens (strings) in it.
 *
 * [\s,]*: Matches any number of whitespaces or commas. This is not captured so it will be ignored and not tokenized.
 *
 * ~@: Captures the special two-characters ~@ (tokenized).
 *
 * [\[\]{}()'`~^@]: Captures any special single character, one of []{}()'`~^@ (tokenized).
 *
 * "(?:\\.|[^\\"])*": Starts capturing at a double-quote and stops at the next double-quote unless it was proceeded
 * by a backslash in which case it includes it until the next double-quote (tokenized).
 *
 * ;.*: Captures any sequence of characters starting with ; (tokenized).
 *
 * [^\s\[\]{}('"`,;)]*: Captures a sequence of zero or more non special characters (e.g. symbols, numbers, "true",
 * "false", and "nil") and is sort of the inverse of the one above that captures special characters (tokenized).
 *
 * @param input: string
 */
const tokenizer = (input: string): string[] => {
  if (!input || input[0] === ';') return [];
  const re = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"|;.*|[^\s\[\]{}('"`,;)]*)/g;
  const tokens: string[] = [];
  while (true) {
    const matches = re.exec(input);
    if (!matches) break;
    const match = matches[1];
    if (match === '') {
      break;
    }
    if (match[0] !== ';') {
      // Ignore comments.
      tokens.push(match);
    }
  }

  return tokens;
};

/**
 * This function will call tokenizer and then create a new Reader object instance with the tokens.
 * @param input
 */
export function readStr(input: string): OwlType {
  const tokens = tokenizer(input);
  if (tokens.length === 0) {
    throw new BlankException();
  }

  const reader = new Reader(tokens);
  return readForm(reader);
}

const readParen = (
  constructor: { new (list: OwlType[]): OwlType },
  open: string,
  close: string,
) => {
  return (reader: Reader): OwlType => {
    const token = reader.next(); // open paren
    if (token !== open) {
      throw new Error(`Unexpected token ${token}, expected ${open}.`);
    }
    const list: OwlType[] = [];
    while (true) {
      const next = reader.peek();
      if (!next) throw new Error('unexpected EOF');
      else if (next === close) break;
      list.push(readForm(reader));
    }
    reader.next(); // close paren
    return new constructor(list);
  };
};

const readList: (reader: Reader) => OwlType = readParen(OwlList, '(', ')');
const readVector: (reader: Reader) => OwlType = readParen(OwlVector, '[', ']');
const readHashMap: (reader: Reader) => OwlType = readParen(
  OwlHashMap,
  '{',
  '}',
);
