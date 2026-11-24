// Regenerates src/db/ddl.ts from db/schema.sql (runtime auto-migration source).
import { readFileSync, writeFileSync } from "node:fs";
const sql = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");
writeFileSync(new URL("../src/db/ddl.ts", import.meta.url), `// AUTO-GENERATED from db/schema.sql by scripts/gen-ddl.mjs — do not edit.\nexport const DDL = ${JSON.stringify(sql)};\n`);
console.log("ddl.ts generated");
