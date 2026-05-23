import { spawn } from 'child_process';

export interface ResticResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number;
}

export async function runRestic(args: string[], password: string): Promise<ResticResult> {
  return new Promise((resolve) => {
    let proc;
    try {
      proc = spawn('restic', args, {
        env: { ...process.env, RESTIC_PASSWORD: password }
      });
    } catch (err) {
      resolve({
        success: false,
        stdout: '',
        stderr: String(err),
        exitCode: -1
      });
      return;
    }

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (data: Buffer) => { stdout += data.toString(); });
    proc.stderr.on('data', (data: Buffer) => { stderr += data.toString(); });

    proc.on('close', (exitCode: number | null) => {
      resolve({ success: exitCode === 0, stdout, stderr, exitCode: exitCode ?? -1 });
    });

    proc.on('error', (err: Error) => {
      resolve({ success: false, stdout, stderr: err.message, exitCode: -1 });
    });
  });
}
