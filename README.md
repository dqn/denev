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
# => .env.enc will be created

$ npx denev -d .env.enc # Decrypt .env.enc
# => .env will be created

# Multiple files
$ npx denev -e .env -e secret.json
$ npx denev -d .env.enc -d secret.json.enc
```

## License

MIT
