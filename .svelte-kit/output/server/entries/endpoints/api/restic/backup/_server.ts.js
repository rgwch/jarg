import { json } from "@sveltejs/kit";
import { r as runRestic } from "../../../../../chunks/restic.js";
const POST = async ({ request }) => {
  const { repo, password, dirs } = await request.json();
  if (!repo || !password || !Array.isArray(dirs) || dirs.length === 0) {
    return json(
      { success: false, error: "repo, password, and at least one dir are required" },
      { status: 400 }
    );
  }
  const validDirs = dirs.filter((d) => typeof d === "string" && d.trim());
  if (validDirs.length === 0) {
    return json({ success: false, error: "No valid directories provided" }, { status: 400 });
  }
  const result = await runRestic(["-r", repo, "backup", ...validDirs], password);
  return json({
    success: result.success,
    stdout: result.stdout,
    stderr: result.stderr
  });
};
export {
  POST
};
