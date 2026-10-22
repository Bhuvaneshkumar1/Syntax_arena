import { chromium } from 'playwright';
import assert from 'assert';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 8095;
const BASE_URL = `http://localhost:${PORT}`;

function createServer() {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png'
  };

  return http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/index.html';
    const filePath = path.join(process.cwd(), reqPath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    });
  });
}

async function runMultiSandboxTest() {
  const server = createServer();
  await new Promise(resolve => server.listen(PORT, resolve));
  console.log(`Test Server running on ${PORT}`);

  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();

  try {
    // 1. Verify game.html does NOT have the sandbox drawer (Item 2)
    console.log('\n--- 1. Checking game.html drawer is removed ---');
    await page.goto(`${BASE_URL}/game.html?lang=python&diff=beginner&stage=1`);
    await page.waitForTimeout(500);

    const drawerCount = await page.locator('#sandbox-drawer').count();
    const btnCount = await page.locator('#btn-toggle-sandbox').count();
    assert(drawerCount === 0, 'In-game sandbox drawer is cleanly removed from game.html');
    assert(btnCount === 0, 'In-game sandbox trigger button is cleanly removed from game.html');
    console.log('✓ PASS: In-game drawer is removed. Gameplay is focused.');

    // 2. Verify sandbox.html Python 3 Execution
    console.log('\n--- 2. Checking sandbox.html Python Execution ---');
    await page.goto(`${BASE_URL}/sandbox.html`);
    await page.waitForTimeout(600);

    const runBtn = page.locator('#btn-page-run');
    await runBtn.click();
    await page.waitForTimeout(1000);

    const pythonOut = await page.locator('#page-console-output').textContent();
    console.log('Python Output:', pythonOut.trim());
    assert(pythonOut.includes('len(a): 4') || pythonOut.includes('[1, 2, 3, 4]'), 'Python mutability executed cleanly');
    console.log('✓ PASS: Python 3 engine works.');

    // 3. Verify Cyber & Linux Shell Sandbox
    console.log('\n--- 3. Checking Cyber & Linux Shell Tab ---');
    const cyberTab = page.locator('button[data-env="cyber"]');
    await cyberTab.click();
    await page.waitForTimeout(300);

    assert(await page.locator('#linux-cli-interactive').isVisible(), 'Interactive Linux CLI prompt is visible');
    await runBtn.click();
    await page.waitForTimeout(400);

    const bashOut = await page.locator('#page-console-output').textContent();
    console.log('Bash Script Output:', bashOut.trim());
    assert(bashOut.includes('MATCH'), 'Bash pattern matching condition script executed');

    // Test typing a command into the interactive prompt
    const cliInput = page.locator('#linux-cli-input');
    await cliInput.fill('cat /etc/passwd | grep hacker');
    await page.locator('#linux-cli-form button[type="submit"]').click();
    await page.waitForTimeout(300);

    const cliOut = await page.locator('#page-console-output').textContent();
    assert(cliOut.includes('hacker:x:1000:1000'), 'Interactive pipe and grep executed on virtual VFS');
    console.log('✓ PASS: Cyber & Linux Shell simulator works with virtual VFS and pipes.');

    // 4. Verify SQL Relational Engine
    console.log('\n--- 4. Checking SQL Relational Engine Tab ---');
    const sqlTab = page.locator('button[data-env="sql"]');
    await sqlTab.click();
    await page.waitForTimeout(300);

    await runBtn.click();
    await page.waitForTimeout(400);

    const sqlRows = await page.locator('#page-console-output table tbody tr').count();
    console.log('SQL Returned Rows:', sqlRows);
    assert(sqlRows >= 4, 'SQL query returned table rows');
    const sqlText = await page.locator('#page-console-output').textContent();
    assert(sqlText.includes('neo_coder') && sqlText.includes('xp'), 'SQL rendered tabular records for users');
    console.log('✓ PASS: SQL Relational engine works with HTML table rendering.');

    // 5. Verify JavaScript Sandbox
    console.log('\n--- 5. Checking JavaScript Console Tab ---');
    const jsTab = page.locator('button[data-env="javascript"]');
    await jsTab.click();
    await page.waitForTimeout(300);

    await runBtn.click();
    await page.waitForTimeout(400);

    const jsOut = await page.locator('#page-console-output').textContent();
    console.log('JavaScript Output:', jsOut.trim());
    assert(jsOut.includes('Original: [10,20,30,40]') || jsOut.includes('Destructured: 10'), 'JavaScript console logged outputs');
    console.log('✓ PASS: JavaScript sandbox works.');

    // 6. Verify Systems Simulators
    console.log('\n--- 6. Checking Systems Simulators Tab ---');
    const sysTab = page.locator('button[data-env="systems"]');
    await sysTab.click();
    await page.waitForTimeout(300);

    await runBtn.click();
    await page.waitForTimeout(400);

    const sysOut = await page.locator('#page-console-output').textContent();
    console.log('Systems Output:', sysOut.trim());
    assert(sysOut.includes('SyntaxArena') || sysOut.includes('GCC'), 'Systems simulator executed C preprocessor challenge');
    console.log('✓ PASS: Systems challenge simulator works.');

    // 7. Verify Assembly & RE Simulator
    console.log('\n--- 7. Checking Assembly & RE Tab ---');
    const asmTab = page.locator('button[data-env="asm"]');
    await asmTab.click();
    await page.waitForTimeout(300);

    await runBtn.click();
    await page.waitForTimeout(400);

    const asmOut = await page.locator('#page-console-output').textContent();
    console.log('Assembly Output:', asmOut.trim());
    assert(asmOut.includes('REGISTER & STACK SNAPSHOT') && asmOut.includes('RAX'), 'Assembly emulator executed instructions and dumped registers');
    console.log('✓ PASS: Assembly & RE CPU emulator works.');

    console.log('\n🎉 ALL MULTI-ENGINE SANDBOX & DRAWER CHECKS PASSED!');
  } finally {
    await browser.close();
    server.close();
  }
}

runMultiSandboxTest().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
