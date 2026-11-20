// Prints the adminPasswordHash to paste into storefront.config.js.
// The password comes from a hidden prompt (TTY) or stdin, never from argv,
// so it stays out of shell history.
//   npm run admin:hash
//   printf '%s' "$PW" | npm run admin:hash --silent
import { hashPassword } from "../app/composables/adminAuth.js";

const readHidden = (prompt) =>
  new Promise((resolve, reject) => {
    const { stdin, stderr } = process;
    stderr.write(prompt);
    let value = "";
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === "\r" || ch === "\n" || ch === "\u0004") {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.off("data", onData);
          stderr.write("\n");
          return resolve(value);
        }
        if (ch === "\u0003") {
          stdin.setRawMode(false);
          stderr.write("\n");
          return reject(new Error("cancelled"));
        }
        if (ch === "\u007f" || ch === "\b") value = value.slice(0, -1);
        else value += ch;
      }
    };
    stdin.on("data", onData);
  });

const readStdin = async () => {
  let data = "";
  for await (const chunk of process.stdin) data += chunk;
  return data.replace(/\r?\n$/, "");
};

try {
  const password = process.stdin.isTTY
    ? await readHidden("Admin password (hidden): ")
    : await readStdin();
  if (!password) {
    console.error("Empty password. Nothing to hash.");
    process.exit(1);
  }
  console.log(hashPassword(password));
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
