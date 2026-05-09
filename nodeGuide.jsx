import { GuideLayout } from "./guideComponents.jsx";

const topics = [
  { id: 1, title: "Runtime & event loop", icon: "🔄" },
  { id: 2, title: "Modules", icon: "📦" },
  { id: 3, title: "fs & streams", icon: "📂" },
  { id: 4, title: "HTTP server", icon: "🌐" },
  { id: 5, title: "Events", icon: "📣" },
  { id: 6, title: "Process & env", icon: "⚙️" },
  { id: 7, title: "npm & tooling", icon: "🛠️" },
  { id: 8, title: "Scaling work", icon: "🧵" },
];

const C = {
  p: "#3c873a", s: "#e8f5e9", m: "#7F77DD", ms: "#EEEDFE", o: "#D85A30", os: "#FAECE7",
};

const contents = {
  1: {
    title: "Node.js runtime",
    subtitle: "V8, libuv, and the single-threaded event loop",
    story: "A café has one barista (one thread) and a long notepad of orders. While coffee brews, the barista serves the next person instead of staring at the machine. Node works like that: I/O waits happen in the background; the loop keeps the line moving.",
    sections: [
      {
        name: "What Node is", color: C.p, bg: C.s,
        desc: "JavaScript on the server. Chrome’s V8 compiles JS; libuv handles I/O, timers, and the thread pool.",
        when: "APIs, CLIs, proxies, real-time tools — anywhere I/O-heavy fits better than CPU-heavy crunching.",
        code: `// node runs this file directly
console.log(process.version); // e.g. v20.x

// Non-blocking I/O — callbacks fire when work finishes
import fs from 'fs';
fs.readFile('data.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data.length);
});
console.log('Scheduled read — this line runs first');`,
        interview: "Node is single-threaded for JS execution. Heavy CPU blocks the loop — offload CPU work to worker threads or another service.",
      },
      {
        name: "Event loop phases", color: C.m, bg: C.ms,
        desc: "Timers → pending callbacks → poll → check → close. Microtasks (Promises) run between macrotasks.",
        when: "Debugging order of logs, timers, and setImmediate vs nextTick.",
        code: `setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('promise'));

// Typical order: promise, then timeout/immediate (order can vary by context)`,
        interview: "process.nextTick runs before the loop continues — overuse can starve I/O. Prefer setImmediate for yielding to the event loop.",
      },
      {
        name: "Blocking vs non-blocking", color: C.o, bg: C.os,
        desc: "Sync APIs (readFileSync) block the thread. Async APIs free the loop for other work.",
        when: "Startup scripts may use sync; servers should almost always use async.",
        code: `// ❌ blocks every request while file reads
import fs from 'fs';
const data = fs.readFileSync('big.json', 'utf8');

// ✅ async — other requests can be handled
fs.readFile('big.json', 'utf8', (err, data) => {
  res.end(data);
});`,
        interview: "One slow synchronous call in a request handler delays all concurrent users on that process.",
      },
    ],
  },
  2: {
    title: "CommonJS vs ESM",
    subtitle: "require, module.exports, import, export",
    story: "Two mail systems: one passes paper notes desk to desk (require), one uses labeled envelopes the post office understands (import/export). Both deliver packages; mixing rules causes confusion until you learn each building’s policy.",
    sections: [
      {
        name: "CommonJS", color: C.p, bg: C.s,
        desc: "require() is synchronous. module.exports / exports — Node’s original system.",
        when: "Legacy packages, some tooling; still default in many .js files without \"type\": \"module\".",
        code: `// math.cjs
exports.add = (a, b) => a + b;

// app.cjs
const { add } = require('./math');
console.log(add(2, 3));`,
        interview: "require can load JSON and built-ins easily; dynamic require paths are tricky to tree-shake.",
      },
      {
        name: "ES modules", color: C.m, bg: C.ms,
        desc: "import / export — static analysis, async loading, browser-aligned.",
        when: "New projects: set \"type\": \"module\" in package.json or use .mjs.",
        code: `// math.js
export function add(a, b) { return a + b; }

// app.js
import { add } from './math.js';
console.log(add(2, 3));`,
        interview: "ESM needs file extensions or bundlers in some setups; __dirname is not defined — use import.meta.url.",
      },
      {
        name: "Interop", color: C.o, bg: C.os,
        desc: "default import of CJS, createRequire, package \"exports\" field.",
        when: "Publishing a library consumed by both systems.",
        code: `import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const legacy = require('some-cjs-package');`,
        interview: "Dual packages (CJS + ESM entry points) reduce pain for library authors.",
      },
    ],
  },
  3: {
    title: "File system & streams",
    subtitle: "Reading files without loading everything into RAM",
    story: "Sipping a milkshake through a straw beats swallowing the whole cup at once. Streams are the straw — data moves in sips, so huge files don’t explode memory.",
    sections: [
      {
        name: "fs promises", color: C.p, bg: C.s,
        desc: "import fs from 'fs/promises' — async/await friendly API.",
        when: "Small/medium files, simple scripts.",
        code: `import fs from 'fs/promises';

const txt = await fs.readFile('note.txt', 'utf8');
await fs.writeFile('out.txt', txt.toUpperCase());`,
        interview: "For very large files, streaming avoids loading the full buffer.",
      },
      {
        name: "Streams", color: C.m, bg: C.ms,
        desc: "Readable, Writable, Duplex, Transform — pipe() connects them.",
        when: "Large files, HTTP responses, compression, CSV processing.",
        code: `import { createReadStream, createWriteStream } from 'fs';

createReadStream('huge.log')
  .pipe(createWriteStream('copy.log'));`,
        interview: "Backpressure: if the reader is faster than the writer, streams pause automatically when pipe() is used correctly.",
      },
      {
        name: "path & URLs", color: C.o, bg: C.os,
        desc: "path.join, path.resolve — avoid string concat for cross-platform paths.",
        when: "Any file path built from user input or segments.",
        code: `import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);`,
        interview: "Windows vs POSIX separators — always use path.join.",
      },
    ],
  },
  4: {
    title: "HTTP with Node",
    subtitle: "http.createServer — before Express",
    story: "You can host a party in an empty hall with folding chairs (raw http). Express brings tables, signs, and a coat check. Learning the empty hall teaches what Express automates.",
    sections: [
      {
        name: "createServer", color: C.p, bg: C.s,
        desc: "Low-level request listener: req, res objects.",
        when: "Learning, microservices, or minimal servers.",
        code: `import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true, path: req.url }));
});

server.listen(3000, () => console.log('listening on 3000'));`,
        interview: "No routing — you parse req.url yourself or use a framework.",
      },
      {
        name: "Methods & bodies", color: C.m, bg: C.ms,
        desc: "req.method, headers; body must be read from stream for POST.",
        when: "Parsing JSON POST without framework.",
        code: `import http from 'http';

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const data = JSON.parse(body);
      res.end(JSON.stringify({ received: data }));
    });
    return;
  }
  res.end('OK');
}).listen(3000);`,
        interview: "Missing size limits on body can mean DoS — cap payload size in production.",
      },
      {
        name: "https", color: C.o, bg: C.os,
        desc: "https.createServer with TLS certificates.",
        when: "Termination at Node instead of load balancer.",
        code: `import https from 'https';
import fs from 'fs';

https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
}, (req, res) => {
  res.end('secure');
}).listen(443);`,
        interview: "Often TLS ends at a reverse proxy (nginx, cloud LB) and Node speaks plain HTTP internally.",
      },
    ],
  },
  5: {
    title: "EventEmitter",
    subtitle: "Pub/sub inside your process",
    story: "A school intercom: the office presses “announcement,” every classroom speaker listens. EventEmitter is that intercom — objects emit names, listeners react.",
    sections: [
      {
        name: "Basics", color: C.p, bg: C.s,
        desc: "extends EventEmitter; .on(event, fn), .emit(event, payload).",
        when: "Decoupling modules, custom streams, Socket patterns.",
        code: `import { EventEmitter } from 'events';

const bus = new EventEmitter();
bus.on('order', (id) => console.log('cook', id));
bus.emit('order', 42);`,
        interview: "Listeners are sync unless you async them — a slow listener blocks emit.",
      },
      {
        name: "once & error", color: C.m, bg: C.ms,
        desc: ".once removes after fire; 'error' events crash if unhandled on EventEmitter.",
        when: "One-shot setup; always handle 'error' on long-lived emitters.",
        code: `import { EventEmitter } from 'events';
const e = new EventEmitter();
e.once('ready', () => console.log('once'));
e.emit('ready');
e.emit('ready'); // no second log`,
        interview: "Unhandled 'error' on EventEmitter throws — use .on('error', ...) or try/catch won’t catch emit errors.",
      },
      {
        name: "Stream events", color: C.o, bg: C.os,
        desc: "Readable: data, end, error. Writable: drain, finish.",
        when: "Custom transforms, piping error handling.",
        code: `readable.on('error', (err) => {
  console.error('stream failed', err);
  writable.destroy(err);
});`,
        interview: "Always propagate or handle errors on both ends of a pipe.",
      },
    ],
  },
  6: {
    title: "process & environment",
    subtitle: "argv, env, signals, exit codes",
    story: "The backstage pass for your program: what floor to run on (NODE_ENV), who called you (argv), and when to shut the lights (SIGTERM).",
    sections: [
      {
        name: "process.env", color: C.p, bg: C.s,
        desc: "Configuration from environment — never commit secrets to code.",
        when: "DB URLs, API keys, feature flags.",
        code: `const port = process.env.PORT ?? 3000;
if (process.env.NODE_ENV === 'production') {
  // stricter logging, etc.
}`,
        interview: "12-factor app: config in env, not in repo.",
      },
      {
        name: "Signals", color: C.m, bg: C.ms,
        desc: "SIGINT (Ctrl+C), SIGTERM (orchestrators) — graceful shutdown.",
        when: "Closing DB pools, draining HTTP server.",
        code: `const server = app.listen(port);

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('HTTP closed');
    process.exit(0);
  });
});`,
        interview: "Kubernetes sends SIGTERM before SIGKILL — handle it to finish in-flight requests.",
      },
      {
        name: "argv", color: C.o, bg: C.os,
        desc: "process.argv — CLI argument parsing (or use commander, yargs).",
        when: "Custom CLIs built with Node.",
        code: `// node app.js --port 4000
const args = process.argv.slice(2);
console.log(args);`,
        interview: "Prefer a small library for robust flag parsing.",
      },
    ],
  },
  7: {
    title: "npm ecosystem",
    subtitle: "package.json, scripts, lockfiles",
    story: "A recipe card for your project: ingredients (dependencies), cooking steps (scripts), and exact versions (lockfile) so tomorrow’s meal tastes the same.",
    sections: [
      {
        name: "package.json", color: C.p, bg: C.s,
        desc: "name, version, dependencies, devDependencies, engines, type.",
        when: "Every Node project; publishable packages need main/module/exports.",
        code: `{
  "name": "my-api",
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js"
  }
}`,
        interview: "semver ranges (^ ~) vs exact — CI should use lockfile for reproducibility.",
      },
      {
        name: "npx", color: C.m, bg: C.ms,
        desc: "Run package binaries without global install.",
        when: "one-off CLIs, create-react-app style scaffolds.",
        code: `npx eslint src/
npx prisma migrate dev`,
        interview: "npx can prompt to install — pin versions in scripts for security.",
      },
      {
        name: "node --watch", color: C.o, bg: C.os,
        desc: "Built-in file watcher since Node 18+ for dev reload.",
        when: "Simple dev without nodemon.",
        code: `// package.json
"dev": "node --watch server.js"`,
        interview: "Production should use a process manager (systemd, PM2, container orchestration).",
      },
    ],
  },
  8: {
    title: "Worker threads & cluster",
    subtitle: "Using more CPU cores",
    story: "One chef chops slowly; several chefs share the prep table. Workers are extra chefs; cluster is several identical restaurants sharing the same menu.",
    sections: [
      {
        name: "worker_threads", color: C.p, bg: C.s,
        desc: "Run JS in parallel threads with message passing.",
        when: "Image resize, crypto, heavy parsing — CPU-bound work.",
        code: `import { Worker } from 'worker_threads';

const w = new Worker('./crunch.js', { workerData: { n: 40 } });
w.on('message', console.log);`,
        interview: "Workers don’t share memory by default — structured clone for messages.",
      },
      {
        name: "cluster", color: C.m, bg: C.ms,
        desc: "Fork worker processes; share a port; master distributes connections.",
        when: "Scaling HTTP on multi-core before containers.",
        code: `import cluster from 'cluster';
import http from 'http';

if (cluster.isPrimary) {
  for (let i = 0; i < 4; i++) cluster.fork();
} else {
  http.createServer((req, res) => res.end('hi')).listen(3000);
}`,
        interview: "Today many deploy multiple Node processes via Kubernetes replicas instead of cluster module.",
      },
      {
        name: "child_process", color: C.o, bg: C.os,
        desc: "spawn / exec — run shell commands or other binaries.",
        when: "FFmpeg wrappers, git hooks from Node.",
        code: `import { spawn } from 'child_process';
const ls = spawn('ls', ['-la']);
ls.stdout.on('data', (d) => console.log(String(d)));`,
        interview: "Never pass unsanitized user input to shell — use spawn with array args, not shell: true with strings.",
      },
    ],
  },
};

const accent = { primary: "#3c873a", soft: "#e8f5e9", text: "#2e5a2a" };

export default function NodeGuide() {
  return (
    <GuideLayout
      hero={{
        emoji: "🟢",
        title: "Node.js Interview Guide",
        subtitle: "8 topics — runtime, modules, I/O, HTTP, events, process, npm, scaling.",
        pills: ["8 Topics", "Code samples", "Interview tips"],
      }}
      topics={topics}
      contents={contents}
      accent={accent}
    />
  );
}
