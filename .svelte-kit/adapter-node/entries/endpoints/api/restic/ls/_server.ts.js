import { json } from "@sveltejs/kit";
import { r as runRestic } from "../../../../../chunks/restic.js";
const POST = async ({ request }) => {
  const { repo, password, snapshotId } = await request.json();
  if (!repo || !password || !snapshotId) {
    return json(
      { success: false, error: "repo, password, and snapshotId are required" },
      { status: 400 }
    );
  }
  const result = await runRestic(["-r", repo, "ls", snapshotId, "--json"], password);
  if (!result.success) {
    return json({ success: false, stderr: result.stderr, files: [] });
  }
  const files = [];
  const lines = result.stdout.trim().split("\n");
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    try {
      files.push(JSON.parse(line));
    } catch {
    }
  }
  return json({ success: true, files });
};
export {
  POST
};
