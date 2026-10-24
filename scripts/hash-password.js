// Prints a bcrypt hash to paste into .env.local as AUTH_PASSWORD_HASH.
//   npm run hash-password -- "mypassword"
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error('Usage: npm run hash-password -- "your password"');
  process.exit(1);
}
const hash = bcrypt.hashSync(password, 12);
console.log(hash);
console.log("\nPaste this line into .env.local (each $ is escaped, because Next.js expands $ in env files):");
console.log(`AUTH_PASSWORD_HASH=${hash.split("$").join("\\$")}`);
