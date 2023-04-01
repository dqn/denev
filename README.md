# denev

[![CI](https://github.com/dqn/denev/workflows/CI/badge.svg)](https://github.com/dqn/denev/actions)
[![npm version](https://img.shields.io/npm/v/denev.svg)](https://www.npmjs.com/package/denev)

Encrypt and decrypt .env and others.

## Installation

```bash
$ npm install -D denev
# or
$ yarn add -D denev
# or
$ pnpm add -D denev
```

## Usage

```bash
$ npx denev -g -p <password> -s <salt>
# => Key will be generated

$ npx denev -e .env # Encrypt .env
# => .env.aes will be created

$ npx denev -d .env.aes # Decrypt .env.aes
# => .env will be created

# Multiple files
$ npx denev -e .env -e secret.json
$ npx denev -d .env.aes -d secret.json.aes
```

## License

MIT
