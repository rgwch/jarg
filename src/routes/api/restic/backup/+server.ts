import { json } from '@sveltejs/kit';
import { runRestic } from '$lib/server/restic';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const { repo, password, dirs } = await request.json();

  if (!repo || !password || !Array.isArray(dirs) || dirs.length === 0) {
    return json(
      { success: false, error: 'repo, password, and at least one dir are required' },
      { status: 400 }
    );
  }

  const validDirs: string[] = dirs.filter((d: unknown) => typeof d === 'string' && d.trim());
  if (validDirs.length === 0) {
    return json({ success: false, error: 'No valid directories provided' }, { status: 400 });
  }

  const result = await runRestic(['-r', repo, 'backup', ...validDirs], password);

  return json({
    success: result.success,
    stdout: result.stdout,
    stderr: result.stderr
  });
};
