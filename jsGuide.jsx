import { GuideLayout } from "./guideComponents.jsx";

const topics = [
  { id: 1, title: "Types & coercion", icon: "🔤" },
  { id: 2, title: "Scope & closures", icon: "📦" },
  { id: 3, title: "this & arrows", icon: "🎯" },
  { id: 4, title: "Prototypes & class", icon: "🧬" },
  { id: 5, title: "Promises & async", icon: "⏱️" },
  { id: 6, title: "Arrays & objects", icon: "🗂️" },
  { id: 7, title: "ES6+ & modules", icon: "✨" },
  { id: 8, title: "Event loop", icon: "🔄" },
];

const C = {
  p: "#ca8a04", s: "#fef9c3", m: "#7F77DD", ms: "#EEEDFE", o: "#D85A30", os: "#FAECE7",
};

const contents = {
  1: {
    title: "Types & coercion",
    subtitle: "Primitives, typeof, == vs ===",
    story: "A strict teacher checks ID cards exactly (===). A relaxed teacher says “close enough” and converts your note into a number (==). Know which room you’re in before you hand in homework.",
    sections: [
      {
        name: "Primitives", color: C.p, bg: C.s,
        desc: "undefined, null, boolean, number, bigint, string, symbol — immutable; stored by value.",
        when: "Reasoning about equality and copying.",
        code: `let a = 1;
let b = a;
b = 2;
console.log(a); // 1 — number copied

const s1 = 'hi';
const s2 = s1;
// strings immutable — can't mutate s1[0]`,
        interview: "typeof null === 'object' is a long-standing JS quirk — use x === null to test null.",
      },
      {
        name: "== vs ===", color: C.m, bg: C.ms,
        desc: "=== checks without coercion; == applies abstract equality rules.",
        when: "Default to ===; rare DOM/legacy cases may use == with null/undefined.",
        code: `0 == '0'   // true  (coercion)
0 === '0'  // false

null == undefined  // true
null === undefined // false`,
        interview: "Interviewers often ask for [] + [] or weird == cases — learn the spec table or say “I always use ===.”",
      },
      {
        name: "Truthiness", color: C.o, bg: C.os,
        desc: "Falsy: false, 0, -0, 0n, '', null, undefined, NaN. Everything else is truthy (including [] and {}).",
        when: "if (x), default params, || and ??.",
        code: `console.log(Boolean([]));  // true
console.log(Boolean(''));   // false

const name = input ?? 'guest'; // only null/undefined
const label = input || 'n/a';  // any falsy`,
        interview: "?? avoids treating 0 or '' as missing; || treats them as missing.",
      },
    ],
  },
  2: {
    title: "Scope & closures",
    subtitle: "Lexical scope, var vs let, closures",
    story: "Each function remembers the backpack of variables from where it was born, even after the outer function went home. That backpack is a closure.",
    sections: [
      {
        name: "let / const / var", color: C.p, bg: C.s,
        desc: "let/const are block-scoped; var is function-scoped and hoisted (undefined until assignment).",
        when: "Loops with callbacks, TDZ errors.",
        code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3,3,3
}
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 0); // 0,1,2
}`,
        interview: "Temporal dead zone: accessing let before declaration throws ReferenceError.",
      },
      {
        name: "Closures", color: C.m, bg: C.ms,
        desc: "Inner function captures outer variables; they live as long as the inner function is reachable.",
        when: "Factories, private state, event handlers, React hooks mental model.",
        code: `function counter() {
  let n = 0;
  return {
    inc: () => ++n,
    get: () => n
  };
}
const c = counter();
c.inc();
console.log(c.get()); // 1`,
        interview: "Classic loop bug: var + async — each closure shares one i; use let or IIFE with parameter.",
      },
      {
        name: "Hoisting", color: C.o, bg: C.os,
        desc: "function declarations hoisted whole; var hoisted as undefined; let/const hoisted but TDZ.",
        when: "Reading legacy code or debugging weird order.",
        code: `console.log(f()); // works — declaration hoisted
function f() { return 1; }

console.log(x); // undefined (var)
var x = 2;`,
        interview: "Prefer const/let and function expressions assigned to const for predictable order.",
      },
    ],
  },
  3: {
    title: "this & arrow functions",
    subtitle: "Dynamic this vs lexical this",
    story: "In a team photo, “this” usually means the person holding the camera — unless you use a selfie stick (arrow), which always points the lens the same way no matter who holds it.",
    sections: [
      {
        name: "Rules of this", color: C.p, bg: C.s,
        desc: "Default: undefined (strict) or global (non-strict). Method call: object before dot. call/apply/bind: first arg.",
        when: "Event handlers, class methods, callbacks.",
        code: `const user = {
  name: 'Ada',
  greet() { console.log(this.name); }
};
user.greet(); // Ada

const g = user.greet;
g(); // undefined in strict mode`,
        interview: "React class components needed bind or arrow fields; function components avoid this.",
      },
      {
        name: "Arrow functions", color: C.m, bg: C.ms,
        desc: "No own this, arguments, super — inherits from enclosing scope.",
        when: "Callbacks that should use outer this; short lambdas.",
        code: `const obj = {
  nums: [1, 2, 3],
  sum() {
    return this.nums.reduce((a, b) => a + b, 0);
  }
};
// arrow in sum still sees obj as this from sum()`,
        interview: "Don’t use arrow for object methods if you need dynamic this from caller.",
      },
      {
        name: "bind / call / apply", color: C.o, bg: C.os,
        desc: "call — args list; apply — array of args; bind — new function with fixed this.",
        when: "Borrowing methods, partial application.",
        code: `function introduce(lang) {
  console.log(\`\${this.name} speaks \${lang}\`);
}
introduce.call({ name: 'Bob' }, 'JS');

const bound = introduce.bind({ name: 'Bob' });
bound('EN');`,
        interview: "class fields as arrows lose prototype benefits but fix this in React class components.",
      },
    ],
  },
  4: {
    title: "Prototypes & classes",
    subtitle: "Delegation, extends, super",
    story: "A family recipe card: children inherit instructions but can scribble their own notes. Prototype chain is that stack of cards; class is the neat printed version of the same idea.",
    sections: [
      {
        name: "Prototype chain", color: C.p, bg: C.s,
        desc: "Objects delegate lookups to Object.getPrototypeOf(obj) until null.",
        when: "Understanding instanceof, method resolution.",
        code: `const a = { x: 1 };
const b = Object.create(a);
console.log(b.x); // 1 — found on prototype
b.y = 2;`,
        interview: "__proto__ vs Object.getPrototypeOf — prefer the standard API.",
      },
      {
        name: "class syntax", color: C.m, bg: C.ms,
        desc: "Syntactic sugar over prototypes; constructor, methods, static, extends, super.",
        when: "OOP style in modern codebases.",
        code: `class Animal {
  constructor(name) { this.name = name; }
  speak() { return '...'; }
}
class Dog extends Animal {
  speak() { return \`\${this.name} barks\`; }
}`,
        interview: "Methods on class prototype; fields create instance properties (per instance).",
      },
      {
        name: "Object helpers", color: C.o, bg: C.os,
        desc: "Object.assign, spread {...obj}, structuredClone (deep), keys/values/entries.",
        when: "Immutability patterns, copying.",
        code: `const next = { ...prev, count: prev.count + 1 };

const copy = structuredClone(nested); // deep, no functions`,
        interview: "Spread is shallow — nested objects still shared unless cloned.",
      },
    ],
  },
  5: {
    title: "Promises & async/await",
    subtitle: "Thenables, chaining, error handling",
    story: "Ordering pizza: you get a ticket (Promise). It might arrive (resolve) or the shop closes (reject). async/await is reading the ticket in order instead of nesting sticky notes.",
    sections: [
      {
        name: "Promise basics", color: C.p, bg: C.s,
        desc: "new Promise((resolve, reject) => ...); .then / .catch / .finally.",
        when: "Wrapping callbacks, sequencing async work.",
        code: `fetch('/api')
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(err => console.error(err))
  .finally(() => console.log('done'));`,
        interview: "Unhandled rejection can crash Node — always attach catch or use try/catch with await.",
      },
      {
        name: "async / await", color: C.m, bg: C.ms,
        desc: "async functions return Promises; await unwraps thenables in async context.",
        when: "Linear readable async code.",
        code: `async function load() {
  try {
    const r = await fetch('/api');
    if (!r.ok) throw new Error(r.statusText);
    return await r.json();
  } catch (e) {
    console.error(e);
  }
}`,
        interview: "await in non-async function is a syntax error; parallel work needs Promise.all, not sequential await in a loop unless intended.",
      },
      {
        name: "Promise.all / race", color: C.o, bg: C.os,
        desc: "all — fail fast if one rejects; allSettled — wait for all; race — first settled wins.",
        when: "Parallel fetches, timeouts.",
        code: `const [a, b] = await Promise.all([
  fetch('/a').then(r => r.json()),
  fetch('/b').then(r => r.json()),
]);`,
        interview: "Promise.all with empty array resolves immediately to [].",
      },
    ],
  },
  6: {
    title: "Arrays & objects",
    subtitle: "map, filter, reduce, mutating vs copying",
    story: "A conveyor belt: map changes every box’s label, filter kicks some off, reduce squashes the line into one crate. Know which belt is non-destructive.",
    sections: [
      {
        name: "Array methods", color: C.p, bg: C.s,
        desc: "map/filter/reduce/some/every/find/slice — return new array or value; push/pop/splice mutate.",
        when: "Data transforms in React state (prefer new refs).",
        code: `const doubled = [1, 2, 3].map(n => n * 2);
const sum = [1, 2, 3].reduce((a, n) => a + n, 0);

const withoutTwo = [1, 2, 3].filter(n => n !== 2);`,
        interview: "reduce initial value — without it, first element is accumulator (empty array edge case bug).",
      },
      {
        name: "Immutability", color: C.m, bg: C.ms,
        desc: "New array/object references trigger React re-renders; shallow updates for nested data need care.",
        when: "setState, useReducer, Redux.",
        code: `// nested update — spread each level
setUser(u => ({
  ...u,
  profile: { ...u.profile, city: 'NYC' }
}));`,
        interview: "Structured mutation detection (Immer) vs manual spreads — tradeoffs in team velocity.",
      },
      {
        name: "Iterables", color: C.o, bg: C.os,
        desc: "for...of, ...spread on iterable; Array.from converts array-like.",
        when: "NodeList, Map, Set, generators.",
        code: `const m = new Map([['a', 1], ['b', 2]]);
for (const [k, v] of m) console.log(k, v);`,
        interview: "for...in enumerates keys (including inherited); for...of values of iterable.",
      },
    ],
  },
  7: {
    title: "ES6+ & modules",
    subtitle: "Destructuring, rest/spread, import/export",
    story: "Unpacking a suitcase: pull out socks and shirts into named piles (destructuring), and leave the rest zipped (rest). import/export are shipping labels between files.",
    sections: [
      {
        name: "Destructuring", color: C.p, bg: C.s,
        desc: "Unpack properties or array slots; defaults and renaming.",
        when: "Function params, API responses.",
        code: `const { name, age = 0 } = user;
const [first, ...rest] = list;

function draw({ x, y }) { /* ... */ }`,
        interview: "Deep destructuring can harm readability — balance with intermediate variables.",
      },
      {
        name: "Template literals", color: C.m, bg: C.ms,
        desc: "`Hello ${name}`; tagged templates for i18n or styled-components style.",
        when: "String building, multiline strings.",
        code: `const msg = \`Line1
Line2 \${1 + 1}\`;`,
        interview: "Tagged templates receive cooked vs raw strings — advanced DSL use.",
      },
      {
        name: "Modules", color: C.o, bg: C.os,
        desc: "import/export static in ES modules; dynamic import() returns Promise.",
        when: "Tree shaking, code splitting in bundlers.",
        code: `import { foo } from './mod.js';
export default function App() {}

const mod = await import('./heavy.js'); // lazy`,
        interview: "Circular dependencies — sometimes need lazy import or refactor shared module.",
      },
    ],
  },
  8: {
    title: "Event loop (browser)",
    subtitle: "Stack, queue, microtasks, macrotasks",
    story: "A single cashier (call stack) serves one customer at a time. A side counter holds Promise slips (microtask) that must clear before the next line from the door (macrotask timer).",
    sections: [
      {
        name: "Call stack", color: C.p, bg: C.s,
        desc: "Synchronous code runs to completion; stack frames push/pop per function.",
        when: "Why long sync work freezes UI.",
        code: `function a() { b(); }
function b() { console.log('in b'); }
a();`,
        interview: "Stack overflow from infinite recursion — tail call optimization not guaranteed in engines.",
      },
      {
        name: "Micro vs macro", color: C.m, bg: C.ms,
        desc: "Microtasks: Promise.then, queueMicrotask. Macrotasks: setTimeout, I/O. Microtasks drain before next macrotask.",
        when: "Ordering of logs in interview puzzles.",
        code: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// 1, 4, 3, 2`,
        interview: "requestAnimationFrame ties to paint — different from setTimeout(0).",
      },
      {
        name: "Web Workers", color: C.o, bg: C.os,
        desc: "Separate thread — no DOM; message passing only.",
        when: "Heavy computation without blocking main thread.",
        code: `// main.js
const w = new Worker('work.js');
w.postMessage({ n: 40 });
w.onmessage = (e) => console.log(e.data);`,
        interview: "SharedArrayBuffer requires cross-origin isolation headers — security constraints.",
      },
    ],
  },
};

const accent = { primary: "#ca8a04", soft: "#fef9c3", text: "#854d0e" };

export default function JsGuide() {
  return (
    <GuideLayout
      hero={{
        emoji: "📜",
        title: "JavaScript Interview Guide",
        subtitle: "8 topics — types, scope, this, prototypes, async, collections, ES6+, event loop.",
        pills: ["8 Topics", "Core language", "Interview tips"],
      }}
      topics={topics}
      contents={contents}
      accent={accent}
    />
  );
}
