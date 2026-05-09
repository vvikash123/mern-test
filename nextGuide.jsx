import { GuideLayout } from "./guideComponents.jsx";

const topics = [
  { id: 1, title: "App Router", icon: "📁" },
  { id: 2, title: "Server & client", icon: "⚛️" },
  { id: 3, title: "Data fetching", icon: "🌊" },
  { id: 4, title: "Rendering modes", icon: "🖼️" },
  { id: 5, title: "Route Handlers", icon: "🔌" },
  { id: 6, title: "Metadata & SEO", icon: "🔎" },
  { id: 7, title: "next/image & link", icon: "🖇️" },
  { id: 8, title: "Middleware", icon: "🛡️" },
];

const C = {
  p: "#111827", s: "#f3f4f6", m: "#7F77DD", ms: "#EEEDFE", o: "#D85A30", os: "#FAECE7",
};

const contents = {
  1: {
    title: "App Router (Next 13+)",
    subtitle: "app/ directory, layouts, nested routes",
    story: "Folders are rooms; page.tsx is what visitors see in each room; layout.tsx is wallpaper shared by that room and its hallways. Special files (loading, error) are trapdoors for UX.",
    sections: [
      {
        name: "File conventions", color: C.p, bg: C.s,
        desc: "page.tsx, layout.tsx, loading.tsx, error.tsx, not-found.tsx, route.ts.",
        when: "New Next.js projects — default since v13.",
        code: `// app/dashboard/page.tsx
export default function Page() {
  return <h1>Dashboard</h1>;
}

// app/dashboard/layout.tsx
export default function Layout({ children }) {
  return <aside><nav />{children}</aside>;
}`,
        interview: "Only page.tsx is publicly addressable; colocated components stay private.",
      },
      {
        name: "Dynamic segments", color: C.m, bg: C.ms,
        desc: "[id] folder; generateStaticParams for SSG paths.",
        when: "Blog slugs, product IDs.",
        code: `// app/posts/[slug]/page.tsx
export default function Post({ params }) {
  return <article>{params.slug}</article>;
}`,
        interview: "params is async in Next 15 — await params in server components.",
      },
      {
        name: "Route groups", color: C.o, bg: C.os,
        desc: "(marketing) and (app) — organize without affecting URL.",
        when: "Different layouts for public vs authenticated areas.",
        code: `app/
  (marketing)/page.tsx      → /
  (app)/dashboard/page.tsx  → /dashboard`,
        interview: "Groups keep URLs clean while splitting layout trees.",
      },
    ],
  },
  2: {
    title: "Server vs client components",
    subtitle: "'use client' boundary",
    story: "Kitchen staff (server) prep food where customers can’t see. Waiters (client) interact at the table. Mark only the interactive slice as client — the rest stays server.",
    sections: [
      {
        name: "Default server", color: C.p, bg: C.s,
        desc: "RSC by default — fetch on server, zero bundle for that tree.",
        when: "Data access, secrets, SEO content.",
        code: `// Server Component — no directive
export default async function Page() {
  const data = await fetch('https://api...', { cache: 'no-store' });
  return <List data={await data.json()} />;
}`,
        interview: "Don’t import server-only modules into client components.",
      },
      {
        name: "use client", color: C.m, bg: C.ms,
        desc: "Marks boundary; children can be server if passed as props? Actually children of client become client. Use composition: server wraps client.",
        when: "useState, useEffect, browser APIs, event handlers.",
        code: `'use client';
import { useState } from 'react';

export function Counter() {
  const [n, setN] = useState(0);
  return <button onClick={() => setN(n + 1)}>{n}</button>;
}`,
        interview: "Pass serializable props from server to client — functions from server can’t cross.",
      },
      {
        name: "Composition pattern", color: C.o, bg: C.os,
        desc: "Server page fetches data; passes to client interactive child.",
        when: "Charts, forms with server-fetched defaults.",
        code: `// page.tsx (server)
import { Chart } from './Chart'; // client inside
const rows = await getData();
return <Chart data={rows} />;`,
        interview: "Reduces JS sent to browser vs making whole page client.",
      },
    ],
  },
  3: {
    title: "Fetching data",
    subtitle: "fetch, cache, revalidate",
    story: "Fresh bread daily vs frozen loaves. cache: 'force-cache' is the freezer; revalidate: 60 is “bake new every hour.” no-store is “always from oven now.”",
    sections: [
      {
        name: "fetch in RSC", color: C.p, bg: C.s,
        desc: "Extended fetch with caching — default static in App Router.",
        when: "Server components calling HTTP APIs or JSON.",
        code: `const res = await fetch('https://api/items', {
  next: { revalidate: 3600 }
});`,
        interview: "Understand default caching changed across versions — read current Next docs for your version.",
      },
      {
        name: "unstable_noStore", color: C.m, bg: C.ms,
        desc: "Opt out of static for dynamic data (API evolving).",
        when: "Personalized dashboards per request.",
        code: `import { unstable_noStore as noStore } from 'next/cache';

export default async function Page() {
  noStore();
  const data = await getUser();
  return <Profile user={data} />;
}`,
        interview: "dynamic = 'force-dynamic' on segment also opts out.",
      },
      {
        name: "Server Actions", color: C.o, bg: C.os,
        desc: "'use server' functions — form actions without API route.",
        when: "Mutations from forms, progressive enhancement.",
        code: `async function create(formData) {
  'use server';
  const title = formData.get('title');
  await db.insert({ title });
}

// <form action={create}>...</form>`,
        interview: "Validate and authorize inside actions — they’re server endpoints.",
      },
    ],
  },
  4: {
    title: "Rendering strategies",
    subtitle: "Static, dynamic, ISR",
    story: "Posters printed in advance (static), posters updated every morning (ISR), and a live chalkboard (dynamic) for scores that change every minute.",
    sections: [
      {
        name: "SSG", color: C.p, bg: C.s,
        desc: "Built at compile time; served from CDN.",
        when: "Marketing, docs, blogs with known paths.",
        code: `export const dynamic = 'force-static';`,
        interview: "Fast TTFB; stale until rebuild unless ISR.",
      },
      {
        name: "ISR", color: C.m, bg: C.ms,
        desc: "revalidate path or tag after N seconds or on-demand.",
        when: "Product catalog — mostly stable, occasional updates.",
        code: `export const revalidate = 60; // segment config

// on-demand
import { revalidateTag } from 'next/cache';
revalidateTag('products');`,
        interview: "revalidatePath vs revalidateTag — tag when many pages share data.",
      },
      {
        name: "SSR / dynamic", color: C.o, bg: C.os,
        desc: "Render per request on server.",
        when: "Auth-gated content, real-time sensitive data.",
        code: `export const dynamic = 'force-dynamic';`,
        interview: "Costs more server CPU — use only where needed.",
      },
    ],
  },
  5: {
    title: "Route Handlers",
    subtitle: "app/api/.../route.ts",
    story: "Mini Express inside Next: one file can export GET, POST like tiny endpoints for webhooks or mobile apps.",
    sections: [
      {
        name: "Basic handler", color: C.p, bg: C.s,
        desc: "export async function GET(request: Request).",
        when: "REST hooks, webhooks, proxying.",
        code: `// app/api/hello/route.ts
export async function GET() {
  return Response.json({ ok: true });
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ received: body }, { status: 201 });
}`,
        interview: "Route Handlers run on server — same runtime as RSC in Node.",
      },
      {
        name: "Request APIs", color: C.m, bg: C.ms,
        desc: "request.nextUrl.searchParams, headers, cookies().",
        when: "Auth checks, pagination.",
        code: `import { cookies } from 'next/headers';

export async function GET() {
  const token = cookies().get('session');
  if (!token) return new Response('Unauthorized', { status: 401 });
  return Response.json({ ok: true });
}`,
        interview: "Edge runtime has subset of Node APIs — check compatibility.",
      },
      {
        name: "Streaming", color: C.o, bg: C.os,
        desc: "Return ReadableStream for SSE or chunked responses.",
        when: "AI token streams, long polls.",
        code: `return new Response(stream, {
  headers: { 'Content-Type': 'text/event-stream' }
});`,
        interview: "Vercel/serverless timeouts apply — use dedicated streaming hosts for very long streams.",
      },
    ],
  },
  6: {
    title: "Metadata API",
    subtitle: "SEO, Open Graph, titles",
    story: "The label on a shipping box: title, summary, preview image — so Twitter and Google show your app nicely when shared.",
    sections: [
      {
        name: "Static metadata", color: C.p, bg: C.s,
        desc: "export const metadata = { title, description }.",
        when: "Fixed page SEO.",
        code: `export const metadata = {
  title: 'About — MyApp',
  description: 'We build widgets',
  openGraph: { images: ['/og.png'] }
};`,
        interview: "metadata object only in server components / layouts.",
      },
      {
        name: "generateMetadata", color: C.m, bg: C.ms,
        desc: "async function from params for dynamic titles.",
        when: "Product pages, blog posts.",
        code: `export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return { title: post.title };
}`,
        interview: "Avoid slow metadata fetches blocking TTFB — cache aggressively.",
      },
      {
        name: "JSON-LD", color: C.o, bg: C.os,
        desc: "Structured data script for rich results.",
        when: "Articles, FAQs, products in Google.",
        code: `<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>`,
        interview: "Validate with Google Rich Results Test.",
      },
    ],
  },
  7: {
    title: "next/image & link",
    subtitle: "Optimized images and client navigation",
    story: "Thumbnails auto-resized and modern formats (image), and teleporting between rooms without reloading the whole museum (link).",
    sections: [
      {
        name: "next/image", color: C.p, bg: C.s,
        desc: "Automatic srcset, lazy load, priority for LCP.",
        when: "All content images; configure remotePatterns for CDN domains.",
        code: `import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
/>`,
        interview: "Fill layout shift requires width/height or fill + sized parent.",
      },
      {
        name: "remote images", color: C.m, bg: C.ms,
        desc: "next.config.js images.remotePatterns whitelist.",
        when: "S3, CMS URLs.",
        code: `// next.config.mjs
images: {
  remotePatterns: [{ protocol: 'https', hostname: 'cdn.example.com' }]
}`,
        interview: "Don’t allow arbitrary user URLs without validation — SSRF risk.",
      },
      {
        name: "Link", color: C.o, bg: C.os,
        desc: "Client-side navigation; prefetch on viewport.",
        when: "Internal navigation; use <a> for external.",
        code: `import Link from 'next/link';

<Link href="/dashboard" prefetch={false}>
  Dashboard
</Link>`,
        interview: "scroll={false} to preserve scroll position on back navigation.",
      },
    ],
  },
  8: {
    title: "middleware.ts",
    subtitle: "Edge request interception",
    story: "Bouncer at the club door: check ID before anyone sees the dance floor. Runs before the route — rewrite, redirect, or set headers.",
    sections: [
      {
        name: "matcher", color: C.p, bg: C.s,
        desc: "export config = { matcher: '/dashboard/:path*' }.",
        when: "Auth gating, A/B splits, geo.",
        code: `import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('session');
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}`,
        interview: "Keep middleware fast — cold start on edge; avoid heavy I/O.",
      },
      {
        name: "Headers & rewrite", color: C.m, bg: C.ms,
        desc: "NextResponse.rewrite for feature flags; set request headers.",
        when: "i18n locale prefixes, beta routing.",
        code: `return NextResponse.rewrite(new URL('/beta' + path, request.url));`,
        interview: "middleware runs on static files too unless excluded — tune matcher.",
      },
      {
        name: "Limits", color: C.o, bg: C.os,
        desc: "Not full Node — use fetch; no direct DB drivers in typical setup.",
        when: "Complex auth may belong in layout or route handler instead.",
        code: `// Prefer JWT cookie verification in middleware
// Heavy session DB lookup → server component or API`,
        interview: "Know edge vs node runtime differences for your deployment.",
      },
    ],
  },
};

const accent = { primary: "#111827", soft: "#f3f4f6", text: "#111827" };

export default function NextGuide() {
  return (
    <GuideLayout
      hero={{
        emoji: "▲",
        title: "Next.js Interview Guide",
        subtitle: "8 topics — App Router, RSC, data fetching, rendering, APIs, SEO.",
        pills: ["8 Topics", "App Router", "Interview tips"],
      }}
      topics={topics}
      contents={contents}
      accent={accent}
    />
  );
}
