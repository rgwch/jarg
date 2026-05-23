import { j as json } from './index-lhTMmBNn.js';
import { r as runRestic } from './restic--xPJouOC.js';
import 'child_process';

const POST = async ({ request }) => {
  const { repo, password, snapshotId, target, include } = await request.json();
  if (!repo || !password || !snapshotId || !target) {
    return json(
      { success: false, error: "repo, password, snapshotId, and target are required" },
      { status: 400 }
    );
  }
  const args = ["-r", repo, "restore", snapshotId, "--target", target];
  if (include) {
    args.push("--include", include);
  }
  const result = await runRestic(args, password);
  return json({
    success: result.success,
    stdout: result.stdout,
    stderr: result.stderr
  });
};

export { POST };
//# sourceMappingURL=_server.ts-BEEWY8Ej.js.map
