const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const source = html.slice(html.indexOf('function runInstall('), html.indexOf('function installFail('));
function fixture() {
  const calls = [], errors = [];
  const ctx = { MDS: { cmd: (s, cb) => { calls.push(s); cb({ status: true }); } },
    installed: {}, busy: {}, toast() {}, installFail: (_d, _r, why) => errors.push(why) };
  vm.runInNewContext(source, ctx);
  return { calls, errors, run: p => ctx.runInstall({ name: 'test', version: '1' }, () => {}, p) };
}
test('install path with spaces remains one parameter with read permission', () => {
  const f = fixture(); f.run('/Users/test/Library/Application Support/node/Downloads/app.mds.zip');
  assert.deepEqual(f.calls, ['mds action:install file:"/Users/test/Library/Application Support/node/Downloads/app.mds.zip" trust:read']);
  assert.deepEqual(f.errors, []);
});
test('quotes, newlines and absent paths do not dispatch a command', () => {
  for (const p of ['', null, '/tmp/app" trust:write', '/tmp/app\nother', '/tmp/app\rnew']) {
    const f = fixture(); f.run(p); assert.equal(f.calls.length, 0); assert.equal(f.errors.length, 1);
  }
});
test('ordinary path retains the existing install flow', () => {
  const f = fixture(); f.run('/Downloads/app.mds.zip');
  assert.equal(f.calls[0], 'mds action:install file:"/Downloads/app.mds.zip" trust:read');
});
