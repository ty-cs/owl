# Owl

![](./badges/badge-branches.svg)
![](./badges/badge-functions.svg)
![](./badges/badge-lines.svg)
![](./badges/badge-statements.svg)
[![Build Status](https://img.shields.io/travis/com/lty96117/owl/master.svg?style=flat-square)](https://travis-ci.com/lty96117/owl)
[![jest](https://jestjs.io/img/jest-badge.svg)](https://github.com/facebook/jest)

Owl is a naïve Lisp interpreter written in TypeScript.

# Features

- TCO (Tail call optimization).
- Macros
- Try/catch style exception handling
- Basic data structures and utils like `list`,`vector`,`hash-map`,`atom` etc.
- File operations.
- And more...

# Installation

```bash
npm install
npm link
```

If you prefer yarn:

```bash
yarn && yarn link
```

# Testing

```bash
npm test
```

or

```bash
yarn test
```

# References

- http://www.yinwang.org/blog-cn/2012/08/01/interpreter
- https://github.com/kanaka/mal

# Known Issues

- https://github.com/facebook/jest/issues/6389

- https://github.com/facebook/jest/issues/3552

- https://github.com/facebook/jest/issues/8069

  ```
  for those facing this issue: this happened after Node v11.11. the quickest fix is to downgrade Node to 11.10.1 in your CI lock file until further investigation
  ```
