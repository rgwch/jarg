import { j as json } from './index-lhTMmBNn.js';
import { r as runRestic } from './restic--xPJouOC.js';
import 'child_process';

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

export { POST };
//# sourceMappingURL=_server.ts-CkbED1q7.js.map
