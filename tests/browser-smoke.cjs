// 使用已安裝的 Chromium 瀏覽器與本機 CDP，無需下載測試套件。
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const browser = process.env.BROWSER_PATH || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(p => fs.existsSync(p));
assert.ok(browser, '請設定 BROWSER_PATH 為 Chromium 瀏覽器路徑');
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'match3-browser-'));
const child = spawn(browser, ['--headless', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`], { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true });
let id = 0, session, socket;
const pending = new Map(), errors = [];
let browserLog = '';
child.stderr.on('data', chunk => { browserLog += chunk.toString(); });
function receive(event) {
    const message = JSON.parse(event.data);
    if (message.id) {
      const callback = pending.get(message.id); pending.delete(message.id);
      if (callback) message.error ? callback.reject(message.error) : callback.resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
}
function send(method, params = {}, sessionId = session) {
  return new Promise((resolve, reject) => {
    const request = { id: ++id, method, params };
    if (sessionId) request.sessionId = sessionId;
    pending.set(id, { resolve, reject }); socket.send(JSON.stringify(request));
  });
}
async function evaluate(expression) {
  const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  assert.ok(!response.exceptionDetails, JSON.stringify(response.exceptionDetails));
  return response.result.value;
}
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(expression, timeout = 5000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) { if (await evaluate(expression)) return; await wait(50); }
  throw new Error(`等待逾時：${expression}`);
}
const state = `(() => ({ score: document.getElementById('game-score').textContent,
  time: document.getElementById('game-time').textContent,
  cover: !document.getElementById('board-cover').hidden,
  board: [...document.querySelectorAll('.gem')].map(c => Number(c.dataset.kind)),
  disabled: [...document.querySelectorAll('.gem')].every(c => c.disabled) }))()`;
const playMove = `(() => { const b = [...document.querySelectorAll('.gem')].map(c => Number(c.dataset.kind));
  const move = Match3.move(b); if (!move) throw new Error('沒有可走步');
  document.querySelectorAll('.gem')[move[0]].click(); document.querySelectorAll('.gem')[move[1]].click(); })()`;
const deadline = setTimeout(() => { console.error('瀏覽器驗證超過90秒'); child.kill(); process.exitCode = 1; }, 90000);
(async () => {
  const portFile = path.join(profile, 'DevToolsActivePort');
  const launchDeadline = Date.now() + 10000;
  while (!fs.existsSync(portFile) && Date.now() < launchDeadline && child.exitCode === null) await wait(100);
  assert.ok(fs.existsSync(portFile), `瀏覽器未啟動：${browserLog}`);
  const [port, endpoint] = fs.readFileSync(portFile, 'utf8').trim().split(/\r?\n/);
  socket = new WebSocket(`ws://127.0.0.1:${port}${endpoint}`);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = receive;
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' }, null);
  session = (await send('Target.attachToTarget', { targetId, flatten: true }, null)).sessionId;
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 1100, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: pathToFileURL(path.resolve(__dirname, '../index.html')).href });
  await until("document.querySelectorAll('.gem').length === 36");
  await evaluate("document.getElementById('demo').scrollIntoView()");
  let current = await evaluate(state);
  assert.equal(current.disabled, true); assert.equal(current.cover, true);
  await evaluate("document.getElementById('cover-start').click()");
  current = await evaluate(state);
  assert.equal(current.cover, false); assert.equal(current.time, '60'); assert.equal(current.score, '0');
  assert.equal(current.disabled, false);
  const invalid = await evaluate(`(() => {
    const cells = [...document.querySelectorAll('.gem')];
    const board = cells.map(c => Number(c.dataset.kind));
    for (let i = 0; i < 36; i++) {
      for (const j of [i + 1, i + 6]) {
        if (Match3.adjacent(i, j) && !Match3.swap(board.slice(), i, j)) return [i, j];
      }
    }
    throw new Error('找不到無效交換');
  })()`);
  const beforeInvalid = current.board;
  await evaluate(`document.querySelectorAll('.gem')[${invalid[0]}].click(); document.querySelectorAll('.gem')[${invalid[1]}].click()`);
  assert.deepEqual((await evaluate(state)).board, beforeInvalid);
  assert.equal((await evaluate(state)).score, '0');
  await evaluate("document.querySelectorAll('.gem')[0].focus()");
  // 以真實鍵盤事件檢查方向鍵移動與空白鍵選取。
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight' });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight' });
  assert.equal(await evaluate("[...document.querySelectorAll('.gem')].indexOf(document.activeElement)"), 1);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  assert.equal(await evaluate("document.activeElement.getAttribute('aria-pressed')"), 'true');
  await evaluate("document.getElementById('game-start').click()");
  await evaluate("document.getElementById('game-hint').click()");
  assert.equal(await evaluate("document.querySelectorAll('.hinted').length"), 2);
  // 實際指標事件完成一個提示交換。
  const positions = await evaluate("[...document.querySelectorAll('.hinted')].map(c => { const r = c.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })");
  for (const p of positions) {
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', ...p, button: 'left', clickCount: 1 });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...p, button: 'left', clickCount: 1 });
  }
  await until("document.getElementById('game-board').getAttribute('aria-busy') === 'false'");
  assert.ok(Number((await evaluate(state)).score.replaceAll(',', '')) > 0);
  assert.equal(await evaluate("Match3.matches([...document.querySelectorAll('.gem')].map(c => Number(c.dataset.kind))).size"), 0);
  console.log('PASS 真實瀏覽器：開始、鍵盤、提示、點擊交換、加分及連鎖結束');
  await evaluate("document.getElementById('game-start').click()");
  await evaluate(playMove);
  await wait(170);
  await evaluate("document.getElementById('game-start').click()");
  const reset = await evaluate(state);
  await wait(700);
  current = await evaluate(state);
  assert.equal(current.score, '0'); assert.deepEqual(current.board, reset.board);
  assert.equal(await evaluate("document.getElementById('game-board').getAttribute('aria-busy')"), 'false');
  console.log('PASS 連鎖動畫中重新開始，舊局不會修改新局');
  for (const width of [1280, 390, 360]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: width > 720 ? 1100 : 844, deviceScaleFactor: 1, mobile: width <= 720 });
    await evaluate("document.getElementById('demo').scrollIntoView()");
    assert.equal(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), true, `${width}px 頁面溢出`);
    assert.equal(await evaluate("document.getElementById('game-board').getBoundingClientRect().right <= window.innerWidth"), true);
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const screenshot = path.join(os.tmpdir(), `match3-demo-${width}.png`);
    fs.writeFileSync(screenshot, Buffer.from(data, 'base64'));
    console.log(`PASS ${width}px 排版；截圖：${screenshot}`);
  }
  await send('Emulation.setTouchEmulationEnabled', { enabled: true });
  await evaluate("document.getElementById('game-start').click(); document.getElementById('game-hint').click()");
  const touch = await evaluate("[...document.querySelectorAll('.hinted')].map(c => { const r = c.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; })");
  for (const p of touch) {
    await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...p, id: 0 }] });
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  }
  await until("Number(document.getElementById('game-score').textContent.replaceAll(',', '')) > 0");
  console.log('PASS 手機觸控交换與計分');
  await evaluate("document.getElementById('game-sound').click()");
  await until("document.getElementById('game-sound').getAttribute('aria-pressed') === 'true'");
  await wait(700);
  await evaluate("document.getElementById('game-sound').click()");
  assert.equal(await evaluate("document.getElementById('game-sound').getAttribute('aria-pressed')"), 'false');
  console.log('PASS 合成節拍音效開關');
  await evaluate("document.getElementById('game-start').click()");
  console.log('驗證真實60秒倒數與到期鎖定…');
  await wait(30000);
  await until("Number(document.getElementById('game-time').textContent) <= 30", 1500);
  console.log('PASS 倒數已經過30秒');
  await until("document.getElementById('game-time').textContent === '0'", 32000);
  current = await evaluate(state);
  assert.equal(current.cover, true); assert.equal(current.disabled, true);
  const endScore = current.score;
  await evaluate("document.querySelector('.gem').click()");
  assert.equal((await evaluate(state)).score, endScore);
  await evaluate("document.getElementById('cover-start').click()");
  current = await evaluate(state);
  assert.equal(current.time, '60'); assert.equal(current.score, '0'); assert.equal(current.cover, false);
  assert.deepEqual(errors, []);
  console.log('PASS 到期結算、鎖定、重新挑戰；無 JavaScript 執行錯誤');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => {
  clearTimeout(deadline);
  if (socket?.readyState === WebSocket.OPEN) {
    try { await send('Browser.close', {}, null); } catch {}
    socket.close();
  }
  child.kill();
  await wait(500);
  const target = path.resolve(profile), temp = path.resolve(os.tmpdir());
  if (path.dirname(target) === temp && path.basename(target).startsWith('match3-browser-')) {
    fs.rmSync(target, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
});
