#! /usr/bin/env node

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "node:crypto";
import { readFile, writeFile, appendFile } from "node:fs/promises";
import { parseArgs } from "node:util";

const keySize = 32;
const ivSize = 16;
const defaultEncryptFilename = "denev.key";

function usage(): void {
  console.log(
    "" +
      "Usage\n" +
      "  $ npx denev --generate --password <password> --salt <salt>  Generate key\n" +
      "  $ npx denev --encrypt <filename>                            Encrypt file\n" +
      "  $ npx denev --decrypt <filename>                            Decrypt file\n" +
      "  $ npx denev --help                                          Display this message",
  );
}

async function generate(
  password: string,
  salt: string,
  keyFilename = defaultEncryptFilename,
): Promise<void> {
  const key = scryptSync(password, salt, keySize);
  await writeFile(keyFilename, key);

  const gitignoreFilename = ".gitignore";
  const file = await readFile(gitignoreFilename, "utf-8").catch((err) => {
    if (
      err instanceof Error &&
      err.message.includes("no such file or directory")
    ) {
      return "";
    } else {
      throw err;
    }
  });

  if (file.includes(keyFilename)) {
    return;
  }

  await appendFile(
    gitignoreFilename,
    (file === "" || file.endsWith("\n") ? "" : "\n") + keyFilename + "\n",
  );
}

async function encrypt(
  targetFilename: string,
  keyFilename = defaultEncryptFilename,
): Promise<void> {
  const [content, key] = await Promise.all([
    readFile(targetFilename),
    readFile(keyFilename),
  ]);

  const iv = randomBytes(ivSize);
  const cipher = createCipheriv("aes-256-cbc", key, iv);

  await writeFile(
    targetFilename + ".enc",
    Buffer.concat([iv, cipher.update(content), cipher.final()]),
  );
}

async function decrypt(
  targetFilename: string,
  keyFilename = defaultEncryptFilename,
): Promise<void> {
  const [contentWithIv, key] = await Promise.all([
    readFile(targetFilename),
    readFile(keyFilename),
  ]);

  const iv = contentWithIv.subarray(0, ivSize);
  const content = contentWithIv.subarray(ivSize);

  const decipher = createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);

  await writeFile(
    targetFilename.replace(/.enc$/, ""),
    decrypted.toString("utf-8"),
  );
}

async function main(): Promise<void> {
  const parsed = parseArgs({
    options: {
      help: {
        type: "boolean",
        short: "h",
      },
      generate: {
        type: "boolean",
        short: "g",
      },
      password: {
        type: "string",
        short: "p",
      },
      salt: {
        type: "string",
        short: "s",
      },
      encrypt: {
        type: "string",
        short: "e",
        multiple: true,
      },
      decrypt: {
        type: "string",
        short: "d",
        multiple: true,
      },
      key: {
        type: "string",
        short: "k",
      },
    },
  });

  if (parsed.values.help === true) {
    usage();
    return;
  }

  if (parsed.values.generate === true) {
    const { password, salt } = parsed.values;

    if (password === undefined) {
      throw new Error("password is required");
    }
    if (salt === undefined) {
      throw new Error("salt is required");
    }

    await generate(password, salt, parsed.values.key);
    console.log("generated: " + (parsed.values.key ?? defaultEncryptFilename));
    return;
  }

  const encrypts = parsed.values.encrypt;
  if (encrypts !== undefined) {
    await Promise.all(encrypts.map((en) => encrypt(en, parsed.values.key)));
    console.log("encrypted: " + encrypts.join(", "));
    return;
  }

  const decrypts = parsed.values.decrypt;
  if (decrypts !== undefined) {
    await Promise.all(decrypts.map((de) => decrypt(de, parsed.values.key)));
    console.log("decrypted: " + decrypts.join(", "));
    return;
  }

  usage();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
