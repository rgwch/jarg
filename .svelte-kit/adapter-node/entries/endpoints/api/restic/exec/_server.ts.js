import { json } from "@sveltejs/kit";
import { r as runRestic } from "../../../../../chunks/restic.js";
function parseArgs(input) {
  const args = [];
  let current = "";
  let quote = null;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quote) {
      if (ch === quote) {
        quote = null;
      } else {
        current += ch;
      }
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (ch === " " || ch === "	") {
      if (current) {
        args.push(current);
        current = "";
      }
    } else {
      current += ch;
    }
  }
  if (current) args.push(current);
  return args;
}
const POST = async ({ request }) => {
  const { repo, password, command } = await request.json();
  if (!repo || !password) {
    return json({ success: false, error: "repo and password are required" }, { status: 400 });
  }
  if (!command || !command.trim()) {
    return json({ success: false, error: "command is required" }, { status: 400 });
  }
  const userArgs = parseArgs(command.trim());
  const result = await runRestic(["-r", repo, ...userArgs], password);
  return json({
    success: result.success,
    stdout: result.stdout,
    stderr: result.stderr
  });
};
export {
  POST
};
