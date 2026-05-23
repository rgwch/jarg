import { json } from '@sveltejs/kit';
import { runRestic } from '$lib/server/restic';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const { repo, password } = await request.json();

  if (!repo || !password) {
    return json({ success: false, error: 'repo and password are required' }, { status: 400 });
  }

  const result = await runRestic(['-r', repo, 'init'], password);

  return json({
    success: result.success,
    stdout: result.stdout,
    stderr: result.stderr
  });
};
