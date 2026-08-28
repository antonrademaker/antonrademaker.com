import { mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';

const host = '127.0.0.1';
const port = process.env.LIGHTHOUSE_PORT ?? '1314';
const siteUrl = `http://${host}:${port}/`;
const reportPath = resolve('.lighthouse/lighthouse');
const hugoCommand = process.execPath;
const hugoEntryPoint = resolve('node_modules/hugo-bin/bin/cli.js');
const lighthouseCommand = process.execPath;
const lighthouseEntryPoint = resolve('node_modules/lighthouse/cli/index.js');

function run(command, args, env = process.env) {
  return new Promise((resolveCommand, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', windowsHide: true, env });

    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolveCommand();
        return;
      }

      reject(new Error(`${command} exited with ${signal ? `signal ${signal}` : `code ${code}`}`));
    });
  });
}

async function waitForServer(url) {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
    }
  }

  throw new Error(`Hugo did not become available at ${url}`);
}

async function main() {
  await mkdir('.lighthouse', { recursive: true });

  const hugo = spawn(hugoCommand, [hugoEntryPoint,
    'server',
    '--source',
    process.cwd(),
    '--bind',
    host,
    '--port',
    port,
    '--baseURL',
    siteUrl,
    '--disableFastRender'
  ], { stdio: 'inherit', windowsHide: true });

  try {
    await waitForServer(siteUrl);
    await run(lighthouseCommand, [lighthouseEntryPoint,
      siteUrl,
      '--chrome-flags=--headless=new',
      '--output=json',
      '--output=html',
      `--output-path=${reportPath}`,
      '--quiet'
    ], { ...process.env, CHROME_PATH: chromium.executablePath() });

    const report = JSON.parse(await readFile(`${reportPath}.report.json`, 'utf8'));
    const checks = [
      ['accessibility', 1, true],
      ['seo', 1, true],
      ['performance', 0.9, false],
      ['best-practices', 0.9, false]
    ];
    const failures = [];

    for (const [category, minimum, required] of checks) {
      const score = report.categories[category].score ?? 0;
      const percentage = Math.round(score * 100);

      if (score < minimum) {
        const message = `Lighthouse ${category}: ${percentage}% (minimum ${minimum * 100}%)`;
        if (required) failures.push(message);
        else console.warn(`Warning: ${message}`);
      } else {
        console.log(`Lighthouse ${category}: ${percentage}%`);
      }
    }

    if (failures.length > 0) {
      throw new Error(`Lighthouse quality gate failed:\n${failures.join('\n')}`);
    }
  } finally {
    hugo.kill();
  }
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}