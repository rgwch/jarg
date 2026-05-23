import { json } from "@sveltejs/kit";
import { r as runRestic } from "../../../../../chunks/restic.js";
const POST = async ({ request }) => {
  const { repo, password } = await request.json();
  if (!repo || !password) {
    return json({ success: false, error: "repo and password are required" }, { status: 400 });
  }
  const result = await runRestic(["-r", repo, "unlock"], password);
  return json({
    success: result.success,
    stdout: result.stdout,
    stderr: result.stderr
  });
};
export {
  POST
};
