const fs = require('fs');
const vm = require('vm');

const skulptCode = fs.readFileSync('assets/vendor/skulpt.min.js', 'utf8');
const stdlibCode = fs.readFileSync('assets/vendor/skulpt-stdlib.js', 'utf8');

const ctx = {
  window: {},
  console: console,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout
};
vm.createContext(ctx);
vm.runInContext(skulptCode, ctx);
vm.runInContext(stdlibCode, ctx);

console.log('Sk loaded:', typeof ctx.Sk);

let out = '';
ctx.Sk.configure({
  output: (t) => { out += t; },
  read: (x) => {
    if (ctx.Sk.builtinFiles === undefined || ctx.Sk.builtinFiles['files'][x] === undefined) {
      throw 'File not found: ' + x;
    }
    return ctx.Sk.builtinFiles['files'][x];
  },
  execLimit: 3000
});

const pyCode = `
a = [1, 2, 3]
b = a
b.append(4)
print("Length of a:", len(a))
print("Last element:", a[-1])
print("List a:", a)
`;

ctx.Sk.misceval.asyncToPromise(() => {
  return ctx.Sk.importMainWithBody('<stdin>', false, pyCode, true);
}).then(() => {
  console.log('--- PYTHON EXECUTION SUCCESS ---');
  console.log(out);
}).catch(err => {
  console.error('PYTHON ERROR:', err.toString());
});
