# denev

Encrypt and decrypt .env and others.

## Installation

```bash
$ npm install denev
# or
$ yarn add denev
# or
$ pnpm add denev
```

## Usage

```bash
$ npx denev -g -p <password> -s <salt>
# => Key will be generated

$ npx denev -e .env # encrypt .env
# => .env.aes will be created

$ npx denev -d .env.aes
# => .env will be created

# Multiple files
$ npx denev -e .env -e secret.json
$ npx denev -d .env.aes -d secret.json.aes
```

## License

MIT
