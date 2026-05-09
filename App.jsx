import { BrowserRouter, Routes, Route, Navigate, NavLink } from "react-router-dom";
import ReactGuide from "./demo.jsx";
import NodeGuide from "./nodeGuide.jsx";
import ExpressGuide from "./expressGuide.jsx";
import DbGuide from "./dbGuide.jsx";
import NextGuide from "./nextGuide.jsx";
import JsGuide from "./jsGuide.jsx";

function SiteHeader() {
  const links = [
    { to: "/react", label: "React" },
    { to: "/js", label: "JavaScript" },
    { to: "/node", label: "Node.js" },
    { to: "/express", label: "Express" },
    { to: "/db", label: "MongoDB" },
    { to: "/next", label: "Next.js" },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#0f172a",
        borderBottom: "1px solid #1e293b",
        boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
      }}
    >
      <div className="site-header-bar">
        <span className="site-header-brand">
          Interview guides
        </span>
        <nav className="site-header-nav">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `site-nav-link${isActive ? " site-nav-link-active" : ""}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteHeader />
      <div style={{ paddingTop: 8, minHeight: "100vh", background: "#f8fafc" }}>
        <Routes>
          <Route path="/" element={<Navigate to="/react" replace />} />
          <Route path="/react" element={<ReactGuide />} />
          <Route path="/js" element={<JsGuide />} />
          <Route path="/node" element={<NodeGuide />} />
          <Route path="/express" element={<ExpressGuide />} />
          <Route path="/db" element={<DbGuide />} />
          <Route path="/next" element={<NextGuide />} />
          <Route path="*" element={<Navigate to="/react" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
