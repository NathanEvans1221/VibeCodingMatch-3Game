const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const vm = require('node:vm');
const html = fs.readFileSync(require('node:path').join(__dirname, '../index.html'), 'utf8');
const source = html.match(/<script id="match3-core">([\s\S]*?)<\/script>/)?.[1];

test('首頁提供可測試的遊戲核心', () => assert.ok(source, '缺少三消核心'));
const core = source ? vm.runInNewContext(`${source}\nMatch3;`) : null;
const board = () => Array.from({ length: 36 }, (_, i) => (Math.floor(i / 6) + i % 6) % 5);

test('橫向、直向與交叉消除不重複計算', () => {
  assert.ok(core);
  const b = board();
  [12, 13, 14, 8, 20].forEach(i => b[i] = 4);
  assert.deepEqual(Array.from(core.matches(b)).sort((a, b) => a - b), [8, 12, 13, 14, 20]);
});

test('邊界不能跨列交換，無效交換不改棋盤', () => {
  assert.ok(core);
  const b = board(), original = b.slice();
  assert.equal(core.swap(b, 5, 6), false);
  assert.equal(core.swap(b, 0, 1), false);
  assert.deepEqual(b, original);
});

test('有效交換形成三消，搜尋可走步不修改棋盤', () => {
  assert.ok(core);
  const b = board();
  b[0] = 0; b[1] = 1; b[2] = 0; b[7] = 0;
  const original = b.slice();
  assert.ok(core.move(b));
  assert.deepEqual(b, original);
  assert.equal(core.swap(b, 1, 7), true);
  assert.ok(core.matches(b).has(0));
});

test('補位保留同列剩餘方塊順序且填满36格', () => {
  assert.ok(core);
  const b = board(), remaining = [b[0], b[6], b[18], b[30]];
  const next = core.collapse(b, new Set([12, 24]), () => 0.9);
  assert.equal(next.length, 36);
  assert.deepEqual([next[12], next[18], next[24], next[30]], remaining);
  assert.ok(next.every(n => Number.isInteger(n) && n >= 0 && n < 5));
});

test('新棋盤無初始消除且一定有可走步，固定亂數也會終止', () => {
  assert.ok(core);
  for (const random of [Math.random, () => 0, () => 0.999]) {
    for (let i = 0; i < 40; i++) {
      const b = core.fresh(random);
      assert.equal(b.length, 36);
      assert.equal(core.matches(b).size, 0);
      assert.ok(core.move(b));
    }
  }
});

test('節拍窗口與連鎖分數符合規格', () => {
  assert.ok(core);
  for (const elapsed of [0, 120, 480, 600, 720]) assert.equal(core.onBeat(elapsed), true);
  for (const elapsed of [121, 300, 479]) assert.equal(core.onBeat(elapsed), false);
  assert.equal(core.points(3, 1, false), 30);
  assert.equal(core.points(3, 2, true), 120);
});

test('沒有三消移動的棋盤會被辨識為無解', () => {
  assert.ok(core);
  const b = board();
  assert.equal(core.matches(b).size, 0);
  assert.equal(core.move(b), null);
});

test('橫向五連消除涵蓋每顆方塊且不跨列', () => {
  assert.ok(core);
  const b = board();
  [0, 1, 2, 3, 4].forEach(i => b[i] = 4);
  assert.deepEqual(Array.from(core.matches(b)).sort((a, b) => a - b), [0, 1, 2, 3, 4]);
});
