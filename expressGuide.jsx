import { GuideLayout } from "./guideComponents.jsx";

const topics = [
  { id: 1, title: "App & routing", icon: "🚂" },
  { id: 2, title: "Middleware", icon: "🧱" },
  { id: 3, title: "Request / response", icon: "📨" },
  { id: 4, title: "Router", icon: "🔀" },
  { id: 5, title: "Errors", icon: "⚠️" },
  { id: 6, title: "Static & uploads", icon: "📎" },
  { id: 7, title: "Security", icon: "🔒" },
  { id: 8, title: "Production", icon: "🚀" },
];

const C = {
  p: "#2596be", s: "#e0f4fa", m: "#7F77DD", ms: "#EEEDFE", o: "#D85A30", os: "#FAECE7",
};

const contents = {
  1: {
    title: "Express application",
    subtitle: "app, listen, basic routes",
    story: "Express is a polite waiter: takes the order (HTTP request), walks past stations (middleware), and brings the plate (response). You still own the kitchen rules.",
    sections: [
      {
        name: "Hello Express", color: C.p, bg: C.s,
        desc: "express() returns an app; app.METHOD(path, handler).",
        when: "Every Express server starts here.",
        code: `import express from 'express';

const app = express();
const port = process.env.PORT ?? 3000;

app.get('/', (req, res) => {
  res.send('Hello');
});

app.listen(port, () => console.log(\`http://localhost:\${port}\`));`,
        interview: "app.listen returns the http.Server — call server.close() for graceful shutdown.",
      },
      {
        name: "Route methods", color: C.m, bg: C.ms,
        desc: "get, post, put, patch, delete, all, use.",
        when: "REST APIs and HTML pages.",
        code: `app.post('/users', (req, res) => res.status(201).json({ id: 1 }));
app.put('/users/:id', (req, res) => res.json({ updated: true }));
app.delete('/users/:id', (req, res) => res.status(204).end());`,
        interview: "Order matters — first matching route wins.",
      },
      {
        name: "Route params & query", color: C.o, bg: C.os,
        desc: "req.params for /users/:id; req.query for ?q=search.",
        when: "Dynamic URLs and filters.",
        code: `app.get('/users/:id', (req, res) => {
  res.json({ userId: req.params.id });
});

app.get('/search', (req, res) => {
  res.json({ q: req.query.q });
});`,
        interview: "req.params are strings — cast to number when needed.",
      },
    ],
  },
  2: {
    title: "Middleware",
    subtitle: "Functions with (req, res, next)",
    story: "Airport security checkpoints: each belt scans bags before the gate. Skip a step or block the line and nobody flies. next() is “this bag is fine, move on.”",
    sections: [
      {
        name: "Writing middleware", color: C.p, bg: C.s,
        desc: "Call next() to continue; send response to end the chain.",
        when: "Logging, auth, parsing, timing.",
        code: `function requestId(req, res, next) {
  req.id = crypto.randomUUID();
  next();
}

app.use(requestId);

app.get('/', (req, res) => {
  res.send(req.id);
});`,
        interview: "Forgetting next() hangs the client until timeout.",
      },
      {
        name: "Order & paths", color: C.m, bg: C.ms,
        desc: "app.use('/api', router) mounts at prefix; global middleware first.",
        when: "Splitting public vs authenticated routes.",
        code: `app.use(express.json()); // before routes

app.use('/api', apiRouter);
app.use('/admin', authMiddleware, adminRouter);`,
        interview: "express.json() must run before handlers that read req.body.",
      },
      {
        name: "Third-party", color: C.o, bg: C.os,
        desc: "cors, helmet, morgan, compression — common stack.",
        when: "Production APIs.",
        code: `import cors from 'cors';
import helmet from 'helmet';

app.use(helmet());
app.use(cors({ origin: process.env.ORIGIN }));`,
        interview: "cors() with origin: '*' is easy but avoid with credentials.",
      },
    ],
  },
  3: {
    title: "Request & response",
    subtitle: "Body, headers, status, JSON",
    story: "The envelope (headers), the letter (body), and the stamp you put on the reply (status code). Express wraps Node’s req/res with helpers.",
    sections: [
      {
        name: "Body parsers", color: C.p, bg: C.s,
        desc: "express.json(), express.urlencoded({ extended: true }).",
        when: "POST JSON and HTML forms.",
        code: `app.use(express.json({ limit: '1mb' }));

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  res.json({ ok: !!email });
});`,
        interview: "Always validate and sanitize req.body — trust nothing from the client.",
      },
      {
        name: "Response helpers", color: C.m, bg: C.ms,
        desc: "res.json, res.send, res.status, res.set, res.cookie.",
        when: "Consistent API responses.",
        code: `res.status(400).json({ error: 'invalid' });
res.redirect(302, '/login');
res.cookie('sid', token, { httpOnly: true, secure: true });`,
        interview: "res.json sets Content-Type automatically.",
      },
      {
        name: "req lifecycle", color: C.o, bg: C.os,
        desc: "req.ip, req.get('User-Agent'), req.path, req.originalUrl.",
        when: "Rate limiting, logging, analytics.",
        code: `app.use((req, res, next) => {
  console.log(req.method, req.originalUrl, req.ip);
  next();
});`,
        interview: "Behind a proxy, trust X-Forwarded-For only if app.set('trust proxy', 1) is configured.",
      },
    ],
  },
  4: {
    title: "express.Router",
    subtitle: "Modular route files",
    story: "Instead of one giant notebook, each team keeps their own chapter. Router is a mini-app you mount with app.use.",
    sections: [
      {
        name: "Split routes", color: C.p, bg: C.s,
        desc: "Router() has same .get/.post API; export and mount.",
        when: "Medium+ apps — users.js, orders.js.",
        code: `// routes/users.js
import { Router } from 'express';
const r = Router();

r.get('/', (req, res) => res.json([]));
r.get('/:id', (req, res) => res.json({ id: req.params.id }));

export default r;

// app.js
import users from './routes/users.js';
app.use('/users', users);`,
        interview: "Router is great for testing routes in isolation.",
      },
      {
        name: "Router-level middleware", color: C.m, bg: C.ms,
        desc: "r.use(mw) applies to all routes on that router.",
        when: "Auth for /api/* only.",
        code: `const r = Router();
r.use(requireAuth);
r.get('/me', (req, res) => res.json(req.user));`,
        interview: "Separate routers keep concerns clear vs one app with 100 routes.",
      },
      {
        name: "mergeParams", color: C.o, bg: C.os,
        desc: "Router({ mergeParams: true }) for nested :id access.",
        when: "/users/:userId/posts/:postId patterns.",
        code: `const posts = Router({ mergeParams: true });

posts.get('/', (req, res) => {
  // req.params.userId from parent
  res.json({ userId: req.params.userId });
});

users.use('/:userId/posts', posts);`,
        interview: "Without mergeParams, nested routers don’t see parent params.",
      },
    ],
  },
  5: {
    title: "Error handling",
    subtitle: "next(err) and 4-arg handlers",
    story: "When the kitchen burns toast, a red light goes to the manager’s desk — not every waiter invents a different apology. Central error middleware is that manager.",
    sections: [
      {
        name: "next(error)", color: C.p, bg: C.s,
        desc: "Passing an error skips normal handlers to error middleware.",
        when: "Async route errors — wrap or use wrapper.",
        code: `app.get('/bad', (req, res, next) => {
  next(new Error('oops'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'server' });
});`,
        interview: "Async handlers must forward errors: catch → next(err) or use express-async-errors.",
      },
      {
        name: "404 handler", color: C.m, bg: C.ms,
        desc: "Place after all routes; no match reaches it.",
        when: "JSON 404 for unknown API paths.",
        code: `app.use((req, res) => {
  res.status(404).json({ error: 'not found' });
});`,
        interview: "404 handler is not error middleware — it’s a normal middleware with 4 args only for errors.",
      },
      {
        name: "Operational vs programmer", color: C.o, bg: C.os,
        desc: "Custom error classes; hide stack in production.",
        when: "Known validation errors return 400; unknown return 500.",
        code: `class ValidationError extends Error {
  status = 400;
}

if (!email) throw new ValidationError('email required');`,
        interview: "Don’t leak stack traces or internal messages to clients in prod.",
      },
    ],
  },
  6: {
    title: "Files & static",
    subtitle: "express.static, multer",
    story: "A museum gift shop: some items sit on open shelves (static files), some need a form and staff (uploads).",
    sections: [
      {
        name: "express.static", color: C.p, bg: C.s,
        desc: "Serve folders — SPA builds, images.",
        when: "Public assets; often behind CDN in prod.",
        code: `import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'public')));`,
        interview: "Don’t serve node_modules or .env — scope static root carefully.",
      },
      {
        name: "Multer", color: C.m, bg: C.ms,
        desc: "multipart/form-data — memory or disk storage.",
        when: "File uploads from browsers.",
        code: `import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

app.post('/avatar', upload.single('file'), (req, res) => {
  res.json({ path: req.file?.path });
});`,
        interview: "Validate file type and size — never trust filename extensions.",
      },
      {
        name: "Download", color: C.o, bg: C.os,
        desc: "res.download, res.sendFile for attachments.",
        when: "Export CSV, PDF generation.",
        code: `app.get('/report', (req, res) => {
  res.download('./out/report.pdf', 'report.pdf');
});`,
        interview: "sendFile needs absolute path or root option for security.",
      },
    ],
  },
  7: {
    title: "Security basics",
    subtitle: "Headers, rate limits, validation",
    story: "Lock the door (helmet), check IDs at the door (auth), and don’t let one person grab every free sample (rate limit).",
    sections: [
      {
        name: "Helmet", color: C.p, bg: C.s,
        desc: "Sets security-related HTTP headers.",
        when: "Every public Express app.",
        code: `import helmet from 'helmet';
app.use(helmet());`,
        interview: "CSP can break inline scripts — tune helmet.contentSecurityPolicy.",
      },
      {
        name: "Rate limiting", color: C.m, bg: C.ms,
        desc: "express-rate-limit — cap requests per IP.",
        when: "Login, public APIs.",
        code: `import rateLimit from 'express-rate-limit';

const limiter = rateLimit({ windowMs: 60_000, max: 100 });
app.use('/api/', limiter);`,
        interview: "Use Redis store for limits across multiple Node instances.",
      },
      {
        name: "Input validation", color: C.o, bg: C.os,
        desc: "zod, joi, express-validator — schema for body/query.",
        when: "Any user input → DB or downstream service.",
        code: `import { z } from 'zod';

const schema = z.object({ email: z.string().email() });

app.post('/signup', (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  // ...
});`,
        interview: "Validate early; fail fast with clear 400 responses.",
      },
    ],
  },
  8: {
    title: "Production patterns",
    subtitle: "Env, logging, health",
    story: "Opening a real restaurant: printed hours (.env), a logbook for incidents, and a “open/closed” sign health check for delivery apps.",
    sections: [
      {
        name: "Environment", color: C.p, bg: C.s,
        desc: "dotenv for local dev; platform env in prod.",
        when: "Secrets and config.",
        code: `import 'dotenv/config';

const port = process.env.PORT ?? 3000;`,
        interview: "Never commit .env — use secrets manager in cloud.",
      },
      {
        name: "Logging", color: C.m, bg: C.ms,
        desc: "pino, winston — structured JSON logs.",
        when: "Debugging production; ship to ELK/Datadog.",
        code: `import pino from 'pino';
const log = pino();
log.info({ userId: 1 }, 'login');`,
        interview: "console.log is fine locally; structured logs scale better.",
      },
      {
        name: "Health checks", color: C.o, bg: C.os,
        desc: "GET /health — 200 if process + DB OK.",
        when: "Load balancers, Kubernetes probes.",
        code: `app.get('/health', async (req, res) => {
  await db.ping();
  res.json({ ok: true });
});`,
        interview: "Separate /live vs /ready if DB should block traffic drain.",
      },
    ],
  },
};

const accent = { primary: "#2596be", soft: "#e0f4fa", text: "#0c6482" };

export default function ExpressGuide() {
  return (
    <GuideLayout
      hero={{
        emoji: "🚂",
        title: "Express.js Interview Guide",
        subtitle: "8 topics — routing, middleware, security, and production habits.",
        pills: ["8 Topics", "REST patterns", "Interview tips"],
      }}
      topics={topics}
      contents={contents}
      accent={accent}
    />
  );
}
