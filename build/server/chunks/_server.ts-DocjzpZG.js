import { j as json } from './index-lhTMmBNn.js';
import { r as runRestic } from './restic--xPJouOC.js';
import 'child_process';

const POST = async ({ request }) => {
  const { repo, password } = await request.json();
  if (!repo || !password) {
    return json({ success: false, error: "repo and password are required" }, { status: 400 });
  }
  const result = await runRestic(["-r", repo, "snapshots", "--json"], password);
  if (!result.success) {
    return json({ success: false, stderr: result.stderr, snapshots: [] });
  }
  let snapshots = [];
  const raw = result.stdout.trim();
  if (raw) {
    try {
      snapshots = JSON.parse(raw);
    } catch {
      return json({
        success: false,
        error: "Failed to parse snapshots output",
        stderr: result.stderr,
        snapshots: []
      });
    }
  }
  return json({ success: true, snapshots });
};

export { POST };
//# sourceMappingURL=_server.ts-DocjzpZG.js.map
