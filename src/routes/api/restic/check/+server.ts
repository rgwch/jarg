import { json } from '@sveltejs/kit';
import { runRestic } from '$lib/server/restic';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  const { repo, password, readData } = await request.json();

  if (!repo || !password) {
    return json({ success: false, error: 'repo and password are required' }, { status: 400 });
  }

  const args = ['-r', repo, 'check'];
  if (readData) args.push('--read-data');

  const result = await runRestic(args, password);

  return json({
    success: result.success,
    stdout: result.stdout,
    stderr: result.stderr
  });
};
