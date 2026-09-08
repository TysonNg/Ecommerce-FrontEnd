import { spawn } from 'node:child_process';

const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'build'], {
  stdio: 'inherit', env: { ...process.env, NEXT_BUILD_DIR: '.next-admin-test' },
});
child.on('exit', (code) => { process.exitCode = code ?? 1; });
