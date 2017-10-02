# rev-hash-cli

CLI frontend to [rev-hash](https://github.com/sindresorhus/rev-hash).

## Installation

```sh
npm install --global rev-hash-cli
```

## Usage

Run `rev-hash --help` for full usage.

### Printing hashes

```sh
$ rev-hash bin.js package.json test.js
88ae68c495  bin.js
66b045a122  package.json
f58e200b8b  test.js
```

### Renaming files

```sh
$ ls
logo.png

$ rev-hash --rename logo.png
b39ca8c7a0  logo.png

$ ls
logo-b39ca8c7a0.png
```
