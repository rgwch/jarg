import { spawn } from 'child_process';

async function runRestic(args, password) {
  return new Promise((resolve) => {
    let proc;
    try {
      proc = spawn("restic", args, {
        env: { ...process.env, RESTIC_PASSWORD: password }
      });
    } catch (err) {
      resolve({
        success: false,
        stdout: "",
        stderr: String(err),
        exitCode: -1
      });
      return;
    }
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (data) => {
      stdout += data.toString();
    });
    proc.stderr.on("data", (data) => {
      stderr += data.toString();
    });
    proc.on("close", (exitCode) => {
      resolve({ success: exitCode === 0, stdout, stderr, exitCode: exitCode ?? -1 });
    });
    proc.on("error", (err) => {
      resolve({ success: false, stdout, stderr: err.message, exitCode: -1 });
    });
  });
}

export { runRestic as r };
//# sourceMappingURL=restic--xPJouOC.js.map
