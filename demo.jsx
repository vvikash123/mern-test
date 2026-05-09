import { useState } from "react";
import { CodeBlock, InterviewTip, Badge } from "./guideComponents.jsx";

const topics = [
  { id: 1, title: "Hooks", icon: "🪝" },
  { id: 2, title: "HOC", icon: "🔧" },
  { id: 3, title: "Lifecycle Methods", icon: "♻️" },
  { id: 4, title: "State Management", icon: "📦" },
  { id: 5, title: "Redux / Zustand", icon: "🗃️" },
  { id: 6, title: "Custom Hooks", icon: "🎣" },
  { id: 7, title: "Lazy Loading", icon: "⚡" },
  { id: 8, title: "Virtual DOM", icon: "🌐" },
  { id: 9, title: "SSR vs CSR", icon: "🖥️" },
  { id: 10, title: "Routing & RBAC", icon: "🛣️" },
  { id: 11, title: "Testing", icon: "🧪" },
  { id: 12, title: "Async Tasks", icon: "⏳" },
  { id: 13, title: "Code Practices", icon: "✅" },
  { id: 14, title: "Performance", icon: "🚀" },
  { id: 15, title: "Styling", icon: "🎨" },
];

const content = {
  1: {
    title: "React Hooks",
    subtitle: "Manage state and side effects in functional components",
    story: "Maya has a little counter on her desk. Each time she taps it, only the number changes — she does not rebuild the whole room. Hooks are like those small tools: remember a number, listen for the doorbell, or keep a sticky note that does not force everyone to look up.",
    sections: [
      {
        name: "useState",
        color: "#7F77DD",
        bg: "#EEEDFE",
        desc: "Manages local state in functional components. Returns [state, setter].",
        when: "Whenever a component needs its own piece of data that can change over time.",
        code: `const [count, setCount] = useState(0);
const [user, setUser] = useState({ name: '', age: 0 });

// Update primitive
setCount(prev => prev + 1);

// Update object — always spread!
setUser(prev => ({ ...prev, name: 'Alice' }));`,
        interview: "React batches state updates in event handlers. Calling setCount twice inside one click handler won't trigger two re-renders — use the functional form (prev => prev + 1) to safely depend on the previous value.",
      },
      {
        name: "useEffect",
        color: "#1D9E75",
        bg: "#E1F5EE",
        desc: "Runs side effects after render. Replaces componentDidMount, componentDidUpdate, componentWillUnmount.",
        when: "API calls, subscriptions, DOM manipulation, timers.",
        code: `// Runs once on mount (empty deps)
useEffect(() => {
  fetchUser(id);
}, []);

// Runs when 'id' changes
useEffect(() => {
  fetchUser(id);
}, [id]);

// Cleanup (like componentWillUnmount)
useEffect(() => {
  const timer = setInterval(tick, 1000);
  return () => clearInterval(timer); // cleanup
}, []);`,
        interview: "Missing a dependency in the array causes stale closures. Always include everything you read from outside the effect. Use ESLint's exhaustive-deps rule to catch this.",
      },
      {
        name: "useContext",
        color: "#D85A30",
        bg: "#FAECE7",
        desc: "Reads the nearest context value without prop drilling.",
        when: "Theming, auth state, locale — data needed by many components at different nesting levels.",
        code: `// 1. Create context
const ThemeContext = createContext('light');

// 2. Provide it high up
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// 3. Consume anywhere below
function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}`,
        interview: "Every consumer re-renders when the context value changes — even if it only reads part of it. Split large contexts or use memo/useMemo to avoid unnecessary renders.",
      },
      {
        name: "useReducer",
        color: "#D4537E",
        bg: "#FBEAF0",
        desc: "Like useState but for complex state logic. State transitions are explicit and testable.",
        when: "State has multiple sub-values, next state depends on action type, or logic is complex enough to benefit from a reducer.",
        code: `const initialState = { count: 0, loading: false };

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { ...state, count: state.count + 1 };
    case 'setLoading': return { ...state, loading: action.payload };
    default: return state;
  }
}

const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'increment' });
dispatch({ type: 'setLoading', payload: true });`,
        interview: "useReducer is preferable over useState when you have 3+ state values that change together, or when the next state depends on the previous in complex ways. It also makes testing pure reducer functions very easy.",
      },
      {
        name: "useMemo",
        color: "#BA7517",
        bg: "#FAEEDA",
        desc: "Memoizes an expensive computed value — recalculates only when dependencies change.",
        when: "Heavy computations (sorting, filtering large lists) inside render that shouldn't run on every re-render.",
        code: `const sortedList = useMemo(() => {
  return items
    .filter(item => item.active)
    .sort((a, b) => a.name.localeCompare(b.name));
}, [items]); // Only recalculates when 'items' changes

// ❌ Don't overuse — simple values don't need it
const double = useMemo(() => count * 2, [count]); // overkill`,
        interview: "useMemo has its own cost. Only use it when a profiler confirms the computation is actually slow. Premature optimization with useMemo adds noise without benefit.",
      },
      {
        name: "useCallback",
        color: "#378ADD",
        bg: "#E6F1FB",
        desc: "Memoizes a function so it keeps the same reference across renders.",
        when: "Passing callbacks to deeply nested children or to dependencies of useEffect/useMemo.",
        code: `// Without useCallback: new function ref every render
// → Child wrapped in React.memo() still re-renders!
const handleClick = useCallback(() => {
  setCount(prev => prev + 1);
}, []); // stable reference

// Common pattern: memoized child + stable callback
const Child = React.memo(({ onClick }) => (
  <button onClick={onClick}>Click</button>
));`,
        interview: "useCallback without React.memo on the child is useless — the child re-renders regardless. They must be paired. Also note: useCallback(fn, deps) is just useMemo(() => fn, deps).",
      },
      {
        name: "useRef",
        color: "#639922",
        bg: "#EAF3DE",
        desc: "Creates a mutable container (.current) that persists between renders and does NOT trigger re-render when changed.",
        when: "DOM access, storing timers/previous values, or any mutable value that shouldn't trigger UI updates.",
        code: `// 1. DOM access
const inputRef = useRef(null);
<input ref={inputRef} />
inputRef.current.focus();

// 2. Store previous value (no re-render)
const prevCount = useRef(count);
useEffect(() => { prevCount.current = count; }, [count]);

// 3. Store timer ID
const timerRef = useRef(null);
timerRef.current = setInterval(tick, 1000);
clearInterval(timerRef.current);`,
        interview: "Unlike state, changing ref.current does NOT cause a re-render. This makes it perfect for values you need to 'remember' across renders (like timer IDs) without triggering unnecessary updates.",
      },
    ],
  },
  2: {
    title: "Higher Order Components (HOC)",
    subtitle: "Reuse component logic by wrapping components with functions",
    story: "You have one plain teddy bear. A shop offers a service: same bear, but they add a superhero cape before it goes home. The bear is still the bear; the cape is the extra layer. An HOC wraps your component the same way — same UI inside, shared powers on the outside.",
    summary: `A Higher Order Component is a function that accepts a component and returns a new, enhanced component. It's a pattern for cross-cutting concerns — logic that many components share.`,
    analogy: `Think of HOCs like a decorator factory in a coffee shop. A plain cup of coffee is your component. An HOC is a function that wraps it: withMilk(coffee), withSugar(coffee), withSugarAndMilk(coffee). The coffee stays the same — only what's added around it changes.`,
    structure: `function withAuth(WrappedComponent) {
  return function EnhancedComponent(props) {
    const isLoggedIn = useAuth(); // shared logic

    if (!isLoggedIn) return <Redirect to="/login" />;

    return <WrappedComponent {...props} />;
  };
}

// Usage
const ProtectedDashboard = withAuth(Dashboard);
const ProtectedSettings  = withAuth(Settings);`,
    examples: [
      {
        name: "withLogger",
        desc: "Logs every render with props",
        code: `function withLogger(Component) {
  return function(props) {
    console.log('Rendering', Component.name, props);
    return <Component {...props} />;
  };
}`,
      },
      {
        name: "withLoading",
        desc: "Shows a spinner while data loads",
        code: `function withLoading(Component) {
  return function({ isLoading, ...rest }) {
    if (isLoading) return <Spinner />;
    return <Component {...rest} />;
  };
}
const UserListWithLoading = withLoading(UserList);
<UserListWithLoading isLoading={loading} data={users} />`,
      },
      {
        name: "withErrorBoundary",
        desc: "Wraps component in error handling",
        code: `function withErrorBoundary(Component) {
  return class extends React.Component {
    state = { hasError: false };
    static getDerivedStateFromError() {
      return { hasError: true };
    }
    render() {
      if (this.state.hasError) return <ErrorUI />;
      return <Component {...this.props} />;
    }
  };
}`,
      },
    ],
    rules: [
      "Always pass through props with {...props} — don't swallow them.",
      "Set a displayName for better DevTools debugging: EnhancedComponent.displayName = `withAuth(${name})`",
      "Don't mutate the original component — always return a new one.",
      "Compose HOCs from right to left: compose(withAuth, withLogger)(Dashboard)",
      "Prefer Custom Hooks over HOCs in modern React — they're simpler and avoid wrapper hell.",
    ],
    interview: "HOCs vs Custom Hooks: HOCs wrap the component tree (visible in DevTools as extra layers). Custom Hooks share logic without touching the tree. In 2024, Custom Hooks are the preferred pattern.",
  },
  3: {
    title: "Component Lifecycle",
    subtitle: "Class components vs functional components — how they live and die",
    story: "A plant arrives in your window: first you pot it (it appears on screen). Days pass and you water it when the weather changes (updates). When you move away, you pack the pot and say goodbye (unmount). A component’s life is that same simple rhythm.",
    phases: [
      {
        name: "Mounting",
        color: "#7F77DD",
        bg: "#EEEDFE",
        classMethod: "constructor → render → componentDidMount",
        hookEquiv: "useState initializer → render → useEffect(fn, [])",
        desc: "Component is created and inserted into the DOM for the first time.",
        code: `// Class
class MyComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null }; // init state
  }
  componentDidMount() {
    fetchData().then(data => this.setState({ data }));
  }
}

// Functional equivalent
function MyComp() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData().then(setData);
  }, []); // [] = run once on mount
}`,
      },
      {
        name: "Updating",
        color: "#1D9E75",
        bg: "#E1F5EE",
        classMethod: "render → componentDidUpdate(prevProps, prevState)",
        hookEquiv: "render → useEffect(fn, [deps])",
        desc: "Component re-renders due to state or prop changes.",
        code: `// Class
componentDidUpdate(prevProps) {
  if (prevProps.userId !== this.props.userId) {
    fetchUser(this.props.userId);
  }
}

// Functional equivalent
useEffect(() => {
  fetchUser(userId);
}, [userId]); // runs when userId changes`,
      },
      {
        name: "Unmounting",
        color: "#D85A30",
        bg: "#FAECE7",
        classMethod: "componentWillUnmount",
        hookEquiv: "useEffect cleanup (return function)",
        desc: "Component is removed from the DOM. Clean up subscriptions, timers, listeners.",
        code: `// Class
componentWillUnmount() {
  clearInterval(this.timer);
  this.socket.close();
}

// Functional equivalent
useEffect(() => {
  const timer = setInterval(tick, 1000);
  const socket = openSocket();

  return () => {           // cleanup function
    clearInterval(timer);
    socket.close();
  };
}, []);`,
      },
      {
        name: "Error Handling",
        color: "#D4537E",
        bg: "#FBEAF0",
        classMethod: "getDerivedStateFromError + componentDidCatch",
        hookEquiv: "No hook equivalent — use class-based Error Boundaries",
        desc: "Catch JavaScript errors in the component tree and show a fallback UI.",
        code: `class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true }; // update state for fallback UI
  }

  componentDidCatch(error, info) {
    logToService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) return <h1>Something broke!</h1>;
    return this.props.children;
  }
}

// Use it
<ErrorBoundary>
  <MyRiskyComponent />
</ErrorBoundary>`,
      },
    ],
  },
  4: {
    title: "State Management",
    subtitle: "How data flows through your React application",
    story: "At dinner, your own plate is yours alone (local state). Passing the salt down the table is like props — hand to hand. A note on the fridge everyone can read is like global store or context. Three simple pictures for where information can live.",
    concepts: [
      {
        name: "State vs Props",
        color: "#7F77DD",
        bg: "#EEEDFE",
        items: [
          { label: "State", desc: "Internal — owned and mutated by the component itself. Private data.", example: "const [open, setOpen] = useState(false);" },
          { label: "Props", desc: "External — passed down from a parent. Read-only inside the child.", example: "<Button label='Submit' onClick={handleSubmit} />" },
        ],
      },
      {
        name: "Props Drilling",
        color: "#D85A30",
        bg: "#FAECE7",
        desc: "Passing data through multiple component layers that don't actually need it — just acting as middlemen.",
        problem: `// ❌ Props drilling — Middle doesn't use 'user' but must pass it
function App() {
  const [user] = useState({ name: 'Alice' });
  return <Layout user={user} />;
}
function Layout({ user }) {
  return <Sidebar user={user} />; // just passing through
}
function Sidebar({ user }) {
  return <UserCard user={user} />; // finally uses it
}`,
        solution: `// ✅ Solution 1: Context
const UserContext = createContext();
function App() {
  return (
    <UserContext.Provider value={{ name: 'Alice' }}>
      <Layout /> {/* no prop needed */}
    </UserContext.Provider>
  );
}
function UserCard() {
  const user = useContext(UserContext); // get directly
}`,
      },
      {
        name: "Context API",
        color: "#1D9E75",
        bg: "#E1F5EE",
        desc: "React's built-in way to share data globally without prop drilling.",
        code: `// auth-context.js
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login  = (u) => setUser(u);
  const logout = ()  => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for convenience
export const useAuth = () => useContext(AuthContext);

// Usage in any component
function Header() {
  const { user, logout } = useAuth();
  return <button onClick={logout}>Hi {user.name}</button>;
}`,
        interview: "Context is NOT a state manager — it's a data broadcaster. It doesn't optimize re-renders. Every component consuming the context re-renders when value changes. Use Redux/Zustand for frequently-changing global state.",
      },
    ],
  },
  5: {
    title: "Redux & Zustand",
    subtitle: "Centralized state management for large applications",
    story: "Imagine one school diary that holds the class score. Students do not each keep a secret copy. They raise a hand (dispatch an action), the teacher updates the diary one clear way (reducer), and everyone sees the same number. Redux and Zustand are fancy versions of that one shared diary.",
    redux: {
      flow: ["Component dispatches Action", "Action reaches Reducer", "Reducer creates new State", "Store updates", "Component re-renders"],
      core: `// store.js (Redux Toolkit — RTK)
import { createSlice, configureStore } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: state => { state.value += 1; }, // Immer allows mutation syntax
    decrement: state => { state.value -= 1; },
    addBy: (state, action) => { state.value += action.payload; }
  }
});

export const { increment, decrement, addBy } = counterSlice.actions;
export const store = configureStore({ reducer: { counter: counterSlice.reducer } });`,
      usage: `// App.jsx — wrap with Provider
import { Provider } from 'react-redux';
<Provider store={store}><App /></Provider>

// Component
import { useSelector, useDispatch } from 'react-redux';
import { increment, addBy } from './store';

function Counter() {
  const count = useSelector(state => state.counter.value);
  const dispatch = useDispatch();
  return (
    <>
      <p>{count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(addBy(5))}>+5</button>
    </>
  );
}`,
      asyncThunk: `// Async action with createAsyncThunk
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk(
  'users/fetchById',
  async (userId) => {
    const response = await fetch('/api/users/' + userId);
    return response.json(); // returned value becomes action.payload
  }
);

// In slice:
extraReducers: (builder) => {
  builder
    .addCase(fetchUser.pending,   (state) => { state.loading = true; })
    .addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase(fetchUser.rejected,  (state) => { state.error = true; });
}`,
    },
    zustand: {
      desc: "Lightweight (~1KB), minimal boilerplate alternative to Redux.",
      code: `import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  user: null,
  increment: () => set(state => ({ count: state.count + 1 })),
  setUser: (user) => set({ user }),
  fetchUser: async (id) => {
    const user = await getUser(id);
    set({ user });
  }
}));

// In component — no Provider needed!
function Counter() {
  const count = useStore(state => state.count);
  const increment = useStore(state => state.increment);
  return <button onClick={increment}>{count}</button>;
}`,
      interview: "Pick Zustand for small-medium apps or when you want less boilerplate. Pick Redux (RTK) for large teams where explicit actions/reducers, Redux DevTools time-travel, and strict patterns matter.",
    },
  },
  6: {
    title: "Custom Hooks",
    subtitle: "Extract and reuse stateful logic across components",
    story: "You invent a bedtime routine: brush teeth, story, lights out. You write it on a card. Every child gets their own night, but the card is the same recipe. A custom hook is that card — shared steps, separate bedrooms.",
    rules: [
      "Must start with 'use' (React enforces the rules of hooks on them)",
      "Can call other hooks inside them",
      "Each component calling a custom hook gets its own isolated state",
      "They're just functions — easy to test and compose",
    ],
    examples: [
      {
        name: "useFetch",
        desc: "Reusable data-fetching with loading & error states",
        code: `function useFetch(url) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(r => r.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Usage — clean component!
function UserProfile({ id }) {
  const { data: user, loading, error } = useFetch('/api/users/' + id);
  if (loading) return <Spinner />;
  if (error)   return <Error msg={error.message} />;
  return <h1>{user.name}</h1>;
}`,
      },
      {
        name: "useLocalStorage",
        desc: "Syncs state with localStorage automatically",
        code: `function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });

  const setStoredValue = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setStoredValue];
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'light');`,
      },
      {
        name: "useDebounce",
        desc: "Delays a value update — great for search inputs",
        code: `function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cancel on next change
  }, [value, delay]);

  return debounced;
}

// Usage — only fires API call after user stops typing
function Search() {
  const [query, setQuery] = useState('');
  const debouncedQuery    = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) searchAPI(debouncedQuery);
  }, [debouncedQuery]);

  return <input onChange={e => setQuery(e.target.value)} />;
}`,
      },
    ],
  },
  7: {
    title: "Lazy Loading",
    subtitle: "Load code only when it's needed — faster initial load",
    story: "You do not carry every book in the library in your backpack. You open the map chapter only when you get lost, and the cookbook only when you cook. Lazy loading is carrying less today and fetching the right chapter when the story needs it.",
    concepts: [
      {
        name: "Code Splitting",
        color: "#7F77DD",
        bg: "#EEEDFE",
        desc: "Break your app bundle into smaller chunks. Users download only what they need for the current page.",
        code: `// Without lazy loading — everything bundled together
import Dashboard from './Dashboard';   // always downloaded
import Settings  from './Settings';    // always downloaded
import Reports   from './Reports';     // always downloaded

// With lazy loading — downloaded on demand
const Dashboard = lazy(() => import('./Dashboard'));
const Settings  = lazy(() => import('./Settings'));
const Reports   = lazy(() => import('./Reports'));`,
      },
      {
        name: "React.lazy + Suspense",
        color: "#1D9E75",
        bg: "#E1F5EE",
        desc: "React.lazy dynamically imports a component. Suspense shows a fallback while it loads.",
        code: `import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));

function Dashboard() {
  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <HeavyChart />
    </Suspense>
  );
}

// With React Router — lazy-load entire pages
const Home    = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));

<Suspense fallback={<PageSpinner />}>
  <Routes>
    <Route path="/"        element={<Home />} />
    <Route path="/profile" element={<Profile />} />
  </Routes>
</Suspense>`,
      },
      {
        name: "Dynamic Imports",
        color: "#D85A30",
        bg: "#FAECE7",
        desc: "Import heavy libraries only when a specific action occurs, not on page load.",
        code: `// Load a PDF library only when user clicks 'Export'
async function handleExport() {
  const { generatePDF } = await import('./pdf-utils');
  generatePDF(data);
}

// Load chart library only when chart tab is active
const [showChart, setShowChart] = useState(false);

{showChart && (
  <Suspense fallback={<Spinner />}>
    <LazyChart data={data} />
  </Suspense>
)}`,
      },
    ],
    interview: "Always wrap lazy-loaded components in Suspense. A common interview question: 'How do you improve initial load time?' — answer with code splitting, lazy loading routes, and dynamic imports for heavy libraries.",
  },
  8: {
    title: "Virtual DOM",
    subtitle: "How React efficiently updates the real DOM",
    story: "Before repainting your real wall, you doodle on tracing paper. You compare old and new doodles, then change only the one sticker that moved. The virtual DOM is the tracing paper — cheap to redraw; the real wall changes only where it must.",
    concepts: [
      {
        name: "What is Virtual DOM?",
        color: "#7F77DD",
        bg: "#EEEDFE",
        desc: "A lightweight JavaScript representation of the real DOM. React keeps a virtual tree in memory and syncs it with the real DOM efficiently.",
        code: `// When you write JSX:
const element = <h1 className="title">Hello</h1>;

// React creates a virtual object:
{
  type: 'h1',
  props: { className: 'title', children: 'Hello' },
  key: null,
  ref: null
}

// Only when React decides it's necessary does it touch the real DOM.`,
      },
      {
        name: "Reconciliation",
        color: "#1D9E75",
        bg: "#E1F5EE",
        desc: "The process of comparing the new virtual DOM tree with the previous one (diffing) and computing the minimum set of real DOM updates.",
        code: `// React's diffing rules:
// 1. Different element types → destroy old, mount new
<div> → <span>  // destroys div subtree, creates span

// 2. Same element type → update changed attributes only
<div className="old"> → <div className="new">
// Only updates className, nothing else

// 3. Lists need KEYS for efficient diffing
// ❌ Bad — React can't tell what moved
{items.map(item => <li>{item.name}</li>)}

// ✅ Good — stable, unique key
{items.map(item => <li key={item.id}>{item.name}</li>)}`,
      },
      {
        name: "React Fiber",
        color: "#D85A30",
        bg: "#FAECE7",
        desc: "React's reimplemented reconciliation engine (since React 16). Fiber makes rendering interruptible and enables features like Suspense, Concurrent Mode, and transitions.",
        code: `// Fiber enables:
// 1. Prioritized rendering — urgent updates first
import { startTransition } from 'react';

// High priority (typing) — immediate
setInputValue(e.target.value);

// Low priority (search results) — can be interrupted
startTransition(() => {
  setSearchResults(computeResults(query));
});

// 2. useTransition hook
const [isPending, startTransition] = useTransition();
// isPending = true while low-priority update is in progress`,
      },
      {
        name: "Keys — the most important optimization",
        color: "#D4537E",
        bg: "#FBEAF0",
        desc: "Keys help React identify which items changed, were added, or removed in a list.",
        code: `// ❌ Using index as key — causes bugs on reorder/delete
{items.map((item, i) => <Component key={i} {...item} />)}

// ✅ Use stable unique IDs
{items.map(item => <Component key={item.id} {...item} />)}

// ✅ Trick: Force remount by changing key
// e.g. reset a form when user changes
<UserForm key={selectedUserId} userId={selectedUserId} />
// When selectedUserId changes, React destroys and recreates the form`,
      },
    ],
    interview: "Interview favourite: 'Why shouldn't you use array index as a key?' — Answer: If items are reordered or deleted, the index-to-item mapping changes. React uses the key to match old vs new elements. Wrong keys = wrong component state surviving to the wrong item.",
  },
  9: {
    title: "SSR vs CSR",
    subtitle: "Where does rendering happen — server or client?",
    story: "CSR is a blank coloring book mailed to you: you wait, then fill every page in your house. SSR is a finished poster from the print shop: you see the picture right away, then you add the buttons that make it click. Same app, different moment when the picture appears.",
    comparison: [
      {
        aspect: "Where rendering happens",
        csr: "In the browser (client)",
        ssr: "On the server",
      },
      {
        aspect: "Initial page load",
        csr: "Slow — user sees blank page until JS loads",
        ssr: "Fast — user sees HTML immediately",
      },
      {
        aspect: "SEO",
        csr: "Poor — crawlers may not execute JS",
        ssr: "Excellent — HTML is pre-rendered",
      },
      {
        aspect: "Server load",
        csr: "Low — server just serves static files",
        ssr: "Higher — server renders on each request",
      },
      {
        aspect: "Interactivity (TTI)",
        csr: "Immediate once JS loads",
        ssr: "Delayed — HTML visible but not interactive until JS hydrates",
      },
      {
        aspect: "Best for",
        csr: "Dashboards, apps behind login, real-time data",
        ssr: "Landing pages, blogs, e-commerce, anything needing SEO",
      },
    ],
    patterns: [
      {
        name: "CSR (Create React App)",
        code: `// User requests /products
// Server returns empty HTML:
<html><body><div id="root"></div><script src="bundle.js"></script></body></html>

// Browser downloads bundle.js, React mounts, fetches data, renders.
// User sees blank → spinner → content (Time to Content: slow)`,
      },
      {
        name: "SSR (Next.js getServerSideProps)",
        code: `// In Next.js pages/products.js:
export async function getServerSideProps() {
  const products = await fetchProducts(); // runs on server
  return { props: { products } };
}

export default function Products({ products }) {
  return products.map(p => <ProductCard key={p.id} {...p} />);
}
// User requests /products → server returns FULL HTML with products
// User sees content immediately. Then JS hydrates for interactivity.`,
      },
      {
        name: "SSG (Static Generation)",
        code: `// Next.js — build time rendering
export async function getStaticProps() {
  const posts = await fetchBlogPosts(); // runs at BUILD TIME
  return { props: { posts }, revalidate: 60 }; // ISR: rebuild every 60s
}
// HTML generated once at deploy → served via CDN → fastest possible
// Best for: blogs, docs, marketing pages`,
      },
    ],
    interview: "Hydration is the process of attaching React's event listeners to server-rendered HTML. Until hydration completes, the page looks interactive but clicks don't work — this is 'Time to Interactive' (TTI). Next.js, Remix, and Astro all solve SSR for React.",
  },
  10: {
    title: "Routing & RBAC",
    subtitle: "Navigation and role-based access control in React",
    story: "A museum has rooms (routes). The map shows how to walk. The guard checks your ticket before the treasure room (login). Some halls need a special badge — kids’ craft corner vs. staff only (roles). Routing is the map; RBAC is who may open each door.",
    basics: `// React Router v6 setup
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
      </nav>
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/profile"       element={<Profile />} />
        <Route path="/users/:id"     element={<UserDetail />} /> {/* dynamic */}
        <Route path="/search"        element={<Search />} />    {/* query params */}
        <Route path="*"              element={<NotFound />} />   {/* 404 */}
      </Routes>
    </BrowserRouter>
  );
}`,
    advanced: [
      {
        name: "Dynamic Routing",
        code: `// Access route params
function UserDetail() {
  const { id } = useParams(); // from /users/:id
  const { data } = useFetch('/api/users/' + id);
  return <h1>{data?.name}</h1>;
}

// Query params
function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // from /search?q=react
  return <Results query={query} />;
}`,
      },
      {
        name: "Protected Routes",
        code: `// ProtectedRoute component
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login, remember where they wanted to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Usage
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />`,
      },
      {
        name: "RBAC (Role-Based Access Control)",
        code: `// Role-based protection
const PERMISSIONS = {
  admin:  ['read', 'write', 'delete', 'manage_users'],
  editor: ['read', 'write'],
  viewer: ['read'],
};

function RoleRoute({ children, requiredPermission }) {
  const { user } = useAuth();
  const userPerms = PERMISSIONS[user?.role] || [];

  if (!userPerms.includes(requiredPermission)) {
    return <AccessDenied />;
  }
  return children;
}

// Usage
<Route path="/admin" element={
  <ProtectedRoute>
    <RoleRoute requiredPermission="manage_users">
      <AdminPanel />
    </RoleRoute>
  </ProtectedRoute>
} />`,
      },
    ],
    interview: "Always handle two layers of security: 1) Frontend — hide UI elements based on role (UX), 2) Backend — validate permissions on every API call (security). Never rely solely on frontend RBAC for security — it can be bypassed.",
  },
  11: {
    title: "Testing",
    subtitle: "Write tests that give you confidence to ship",
    story: "Before a school play, you check one actor’s line alone (unit), two actors in a scene (integration), then the whole show with costumes (e2e). Testing is rehearsing so opening night does not surprise you.",
    pyramid: ["Unit Tests (most)", "Integration Tests", "E2E Tests (least)"],
    examples: [
      {
        name: "Unit Test — utility function",
        lib: "Jest",
        code: `// utils/formatCurrency.js
export const formatCurrency = (amount, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

// utils/formatCurrency.test.js
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  test('formats USD correctly', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50');
  });
  test('handles zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });
  test('handles other currencies', () => {
    expect(formatCurrency(100, 'EUR')).toContain('100');
  });
});`,
      },
      {
        name: "Component Test",
        lib: "React Testing Library",
        code: `// Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Submit</Button>);

  // Find by accessible role — not implementation detail
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  expect(handleClick).toHaveBeenCalledTimes(1);
});

test('is disabled when loading', () => {
  render(<Button loading>Submit</Button>);
  expect(screen.getByRole('button')).toBeDisabled();
});`,
      },
      {
        name: "Async / API Test",
        lib: "React Testing Library + MSW",
        code: `import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import UserProfile from './UserProfile';

// Mock the API — no real network calls
const server = setupServer(
  rest.get('/api/users/1', (req, res, ctx) =>
    res(ctx.json({ name: 'Alice', role: 'admin' }))
  )
);
beforeAll(() => server.listen());
afterAll(() => server.close());

test('shows user name after loading', async () => {
  render(<UserProfile id={1} />);

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
});`,
      },
      {
        name: "Custom Hook Test",
        lib: "renderHook",
        code: `import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('increments counter', () => {
  const { result } = renderHook(() => useCounter(0));

  expect(result.current.count).toBe(0);

  act(() => { result.current.increment(); });

  expect(result.current.count).toBe(1);
});`,
      },
    ],
    interview: "RTL's golden rule: 'Test what the user sees, not implementation details.' Query by role, label, or text — not by className or component name. This makes tests resilient to refactoring.",
  },
  12: {
    title: "Async Tasks",
    subtitle: "Handling asynchronous operations in React",
    story: "You order noodles. The kitchen keeps cooking; you do not freeze time. Later the tray arrives, or you cancel if you leave first. Async code is like that: start a request, stay busy, handle the result or clean up when you walk away.",
    examples: [
      {
        name: "API Calls with fetch",
        code: `// Pattern 1: useEffect + async IIFE
useEffect(() => {
  (async () => {
    try {
      setLoading(true);
      const res  = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  })();
}, []);

// Pattern 2: Abort stale requests (important!)
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/users', { signal: controller.signal })
    .then(r => r.json())
    .then(setUsers)
    .catch(err => {
      if (err.name !== 'AbortError') setError(err);
    });

  return () => controller.abort(); // cancel on unmount/re-run
}, []);`,
      },
      {
        name: "Promises",
        code: `// Promise chaining
fetchUser(id)
  .then(user => fetchPosts(user.id))
  .then(posts => setPosts(posts))
  .catch(err => console.error(err));

// Promise.all — parallel requests (faster!)
const [user, posts, comments] = await Promise.all([
  fetchUser(id),
  fetchPosts(id),
  fetchComments(id),
]);

// Promise.allSettled — continue even if some fail
const results = await Promise.allSettled([
  fetchUser(id),
  fetchPosts(id),
]);
results.forEach(r => {
  if (r.status === 'fulfilled') console.log(r.value);
  else console.error(r.reason);
});`,
      },
      {
        name: "Event Handling",
        code: `// Synthetic events in React
function Form() {
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload
    const formData = new FormData(e.target);
    
    try {
      await submitForm(Object.fromEntries(formData));
    } catch (err) {
      setError(err.message);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}

// Async event handlers — no need to wrap in async useEffect
const handleClick = async () => {
  setLoading(true);
  await saveData();
  setLoading(false);
};`,
      },
      {
        name: "setTimeout / setInterval",
        code: `// Safe setTimeout in React
useEffect(() => {
  const id = setTimeout(() => {
    setMessage('Time is up!');
  }, 3000);

  return () => clearTimeout(id); // cancel if component unmounts
}, []);

// Safe setInterval
useEffect(() => {
  const id = setInterval(() => {
    setSeconds(s => s + 1); // functional update — always fresh
  }, 1000);

  return () => clearInterval(id);
}, []); // empty deps is fine because of functional update`,
      },
    ],
    interview: "Race condition trap: if a user types fast and triggers multiple API calls, they can resolve out of order. Always cancel the previous request (AbortController) or ignore stale responses by checking if the component is still mounted.",
  },
  13: {
    title: "Code Practices",
    subtitle: "Write code that's reusable, readable, modular, and testable",
    story: "A tidy workshop puts drills with drills and paints with paints. Each drawer has one job, tools are labeled, and you borrow the same wrench instead of buying ten. Good practices keep the workshop gentle for the next person who walks in.",
    principles: [
      {
        name: "Single Responsibility",
        color: "#7F77DD",
        bg: "#EEEDFE",
        bad: `// ❌ One component doing everything
function UserPage() {
  // fetches data
  // formats data
  // handles form
  // renders table
  // manages pagination
  // ... 500 lines
}`,
        good: `// ✅ Each piece has one job
function UserPage() {
  const { users } = useFetchUsers();
  return (
    <>
      <UserTable users={users} />
      <Pagination />
    </>
  );
}
// useFetchUsers — data fetching logic
// UserTable — presentation
// Pagination — its own logic`,
      },
      {
        name: "DRY (Don't Repeat Yourself)",
        color: "#1D9E75",
        bg: "#E1F5EE",
        bad: `// ❌ Same fetch pattern copy-pasted everywhere
// In UserPage.jsx, ProductPage.jsx, OrderPage.jsx...
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
useEffect(() => { fetch(url).then(r => r.json()).then(setData); }, [url]);`,
        good: `// ✅ Extract to a Custom Hook once
const { data, loading, error } = useFetch(url);
// Use everywhere without repetition`,
      },
      {
        name: "Component Composition",
        color: "#D85A30",
        bg: "#FAECE7",
        bad: `// ❌ Prop-heavy monolith
<Modal
  title="Delete User"
  body="Are you sure?"
  primaryLabel="Delete"
  primaryColor="red"
  onPrimary={deleteUser}
  secondaryLabel="Cancel"
  onSecondary={closeModal}
  icon="warning"
  iconColor="yellow"
/>`,
        good: `// ✅ Composable — flexible, readable
<Modal>
  <Modal.Header>Delete User</Modal.Header>
  <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
  <Modal.Footer>
    <Button variant="ghost" onClick={closeModal}>Cancel</Button>
    <Button variant="danger" onClick={deleteUser}>Delete</Button>
  </Modal.Footer>
</Modal>`,
      },
      {
        name: "Naming Conventions",
        color: "#D4537E",
        bg: "#FBEAF0",
        code: `// Components — PascalCase
function UserProfileCard() {}

// Hooks — camelCase prefixed with 'use'
function useFetchUser() {}

// Event handlers — prefix 'handle'
const handleSubmit = () => {};
const handleInputChange = () => {};

// Props for events — prefix 'on'
<Button onClick={handleClick} onFocus={handleFocus} />

// Boolean state — prefix 'is', 'has', 'should'
const [isLoading, setIsLoading] = useState(false);
const [hasError, setHasError] = useState(false);`,
      },
    ],
  },
  14: {
    title: "Performance Optimization",
    subtitle: "Make React apps fast — measure first, optimize second",
    story: "A bus does not repaint every seat when one passenger boards. Performance work is noticing who actually needs a new ticket and skipping work for everyone else — after you peek at who is slow, not before.",
    optimizations: [
      {
        name: "React.memo",
        color: "#7F77DD",
        bg: "#EEEDFE",
        desc: "Prevents a component from re-rendering if its props haven't changed (shallow comparison).",
        code: `// Child re-renders every time Parent re-renders — even if props are the same
const ExpensiveChild = React.memo(function ExpensiveChild({ data }) {
  return <HeavyVisualization data={data} />;
});

// Now only re-renders when 'data' prop actually changes
// Must pair with useCallback for function props!
const handleClick = useCallback(() => {}, []);
<ExpensiveChild data={data} onClick={handleClick} />`,
      },
      {
        name: "Lazy Loading + Code Splitting",
        color: "#1D9E75",
        bg: "#E1F5EE",
        desc: "Split bundle into chunks, load only what's needed.",
        code: `// Route-based code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Reports   = lazy(() => import('./pages/Reports'));

// Component-based — load heavy component only when visible
const HeavyMap = lazy(() => import('./HeavyMap'));

function Page() {
  const [showMap, setShowMap] = useState(false);
  return (
    <>
      <button onClick={() => setShowMap(true)}>Show Map</button>
      {showMap && (
        <Suspense fallback={<Spinner />}>
          <HeavyMap />
        </Suspense>
      )}
    </>
  );
}`,
      },
      {
        name: "Virtualization",
        color: "#D85A30",
        bg: "#FAECE7",
        desc: "Render only visible list items — essential for 10k+ row lists.",
        code: `// Without virtualization: 10,000 DOM nodes → slow scroll
{items.map(item => <Row key={item.id} item={item} />)}

// With react-window: only ~20 DOM nodes in viewport
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}      // visible height
  itemCount={10000}
  itemSize={50}     // each row height
  width="100%"
>
  {({ index, style }) => (
    <Row style={style} item={items[index]} />
  )}
</FixedSizeList>`,
      },
      {
        name: "Asset Optimization",
        color: "#BA7517",
        bg: "#FAEEDA",
        desc: "Reduce what the browser downloads.",
        code: `// 1. Image optimization
<img
  src="hero.webp"                          // WebP format
  srcSet="hero-400.webp 400w, hero-800.webp 800w"  // responsive
  loading="lazy"                           // native lazy load
  alt="Hero image"
/>

// 2. Analyze your bundle
// webpack-bundle-analyzer or vite-bundle-visualizer
// Find what's bloating your bundle

// 3. Tree shaking — import only what you need
// ❌ Imports entire lodash (~70KB)
import _ from 'lodash';
// ✅ Imports only one function
import debounce from 'lodash/debounce';`,
      },
    ],
    checklist: [
      "Profile with React DevTools Profiler before optimizing",
      "Check for unnecessary re-renders with React DevTools Highlight Updates",
      "Use production builds for performance testing (not dev mode)",
      "Minimize JavaScript bundle size — check with Lighthouse",
      "Serve assets from CDN for global speed",
      "Use HTTP/2 for parallel resource loading",
    ],
  },
  15: {
    title: "Styling in React",
    subtitle: "Different approaches to styling React applications",
    story: "Dressing a doll: you can snap on ready-made outfits (utilities), sew named costumes that never clash (CSS modules), or mold clay clothes that change with the doll’s mood (CSS-in-JS). Same doll, different ways to pick the look.",
    approaches: [
      {
        name: "Tailwind CSS",
        color: "#378ADD",
        bg: "#E6F1FB",
        pros: ["Utility-first — no context switching", "Consistent design system", "Tiny production bundle (purges unused classes)", "Great with component libraries"],
        cons: ["Learning curve for class names", "Can look cluttered in JSX"],
        code: `function Button({ variant = 'primary', children }) {
  const styles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger:  'bg-red-600 hover:bg-red-700 text-white',
    ghost:   'border border-gray-300 hover:bg-gray-50',
  };
  return (
    <button className={\`px-4 py-2 rounded-lg font-medium transition-colors \${styles[variant]}\`}>
      {children}
    </button>
  );
}`,
      },
      {
        name: "CSS Modules",
        color: "#1D9E75",
        bg: "#E1F5EE",
        pros: ["Scoped class names — no conflicts", "Plain CSS syntax", "Works with any CSS features", "Zero runtime overhead"],
        cons: ["Verbose import syntax", "Dynamic styles need inline or classname concatenation"],
        code: `/* Button.module.css */
.button { padding: 8px 16px; border-radius: 8px; }
.primary { background: #2563eb; color: white; }
.danger  { background: #dc2626; color: white; }

/* Button.jsx */
import styles from './Button.module.css';

function Button({ variant = 'primary', children }) {
  return (
    <button className={\`\${styles.button} \${styles[variant]}\`}>
      {children}
    </button>
  );
}`,
      },
      {
        name: "Styled Components",
        color: "#D4537E",
        bg: "#FBEAF0",
        pros: ["Props-based dynamic styling", "Automatic critical CSS", "Scoped styles with full CSS power", "Theme support"],
        cons: ["Runtime overhead", "Larger bundle", "CSS in JS may feel awkward"],
        code: `import styled from 'styled-components';

const Button = styled.button\`
  padding: 8px 16px;
  border-radius: 8px;
  background: \${props => props.variant === 'danger' ? '#dc2626' : '#2563eb'};
  color: white;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
\`;

// Usage
<Button variant="danger">Delete</Button>
<Button>Submit</Button>`,
      },
      {
        name: "Material UI (MUI)",
        color: "#7F77DD",
        bg: "#EEEDFE",
        pros: ["Full component library out of the box", "Consistent Google Material Design", "Theming system", "Accessibility built-in"],
        cons: ["Large bundle size", "Harder to customize beyond the system", "Can look generic"],
        code: `import { Button, TextField, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: { primary: { main: '#7F77DD' } }
});

function LoginForm() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Email" variant="outlined" fullWidth />
        <TextField label="Password" type="password" fullWidth />
        <Button variant="contained" size="large" fullWidth>
          Login
        </Button>
      </Box>
    </ThemeProvider>
  );
}`,
      },
    ],
    comparison: [
      { approach: "Tailwind CSS", bundle: "Tiny", dynamicStyles: "Limited", learningCurve: "Medium", bestFor: "Fast prototyping, utility-first" },
      { approach: "CSS Modules", bundle: "Zero", dynamicStyles: "Manual", learningCurve: "Low", bestFor: "Medium apps, team projects" },
      { approach: "Styled Components", bundle: "Medium", dynamicStyles: "Excellent", learningCurve: "Low", bestFor: "Component libraries" },
      { approach: "Material UI", bundle: "Large", dynamicStyles: "Excellent", learningCurve: "Medium", bestFor: "Enterprise apps, quick MVPs" },
    ],
  },
};

function Topic1() {
  const d = content[1];
  const [active, setActive] = useState(0);
  const s = d.sections[active];
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {d.sections.map((sec, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            padding: "6px 14px", borderRadius: 20, border: "1.5px solid",
            borderColor: active === i ? sec.color : "#e2e8f0",
            background: active === i ? sec.bg : "white",
            color: active === i ? sec.color : "#64748b",
            fontWeight: active === i ? 600 : 400,
            fontSize: 13, cursor: "pointer",
          }}>{sec.name}</button>
        ))}
      </div>
      <div style={{ background: s.bg, borderRadius: 12, padding: "18px 20px", marginBottom: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: s.color, marginBottom: 4 }}>{s.name}</div>
        <div style={{ color: "#334155", fontSize: 14 }}>{s.desc}</div>
      </div>
      <div style={{ marginBottom: 4, color: "#64748b", fontSize: 13 }}>
        <strong style={{ color: "#1e293b" }}>When to use: </strong>{s.when}
      </div>
      <CodeBlock code={s.code} />
      <InterviewTip text={s.interview} />
    </div>
  );
}

function Topic2() {
  const d = content[2];
  const [ex, setEx] = useState(0);
  return (
    <div>
      <p style={{ color: "#475569", lineHeight: 1.7, marginTop: 0 }}>{d.summary}</p>
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
        <strong style={{ color: "#166534" }}>Analogy: </strong>
        <span style={{ color: "#15803d" }}>{d.analogy}</span>
      </div>
      <p style={{ fontWeight: 600, color: "#1e293b", marginBottom: 6 }}>Structure</p>
      <CodeBlock code={d.structure} />
      <p style={{ fontWeight: 600, color: "#1e293b", margin: "16px 0 8px" }}>Common HOC Examples</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {d.examples.map((e, i) => (
          <button key={i} onClick={() => setEx(i)} style={{
            padding: "5px 14px", borderRadius: 20, border: "1.5px solid",
            borderColor: ex === i ? "#7F77DD" : "#e2e8f0",
            background: ex === i ? "#EEEDFE" : "white",
            color: ex === i ? "#7F77DD" : "#64748b",
            fontWeight: ex === i ? 600 : 400, fontSize: 13, cursor: "pointer",
          }}>{d.examples[i].name}</button>
        ))}
      </div>
      <div style={{ color: "#475569", fontSize: 14, marginBottom: 6 }}>{d.examples[ex].desc}</div>
      <CodeBlock code={d.examples[ex].code} />
      <p style={{ fontWeight: 600, color: "#1e293b", margin: "16px 0 6px" }}>HOC Golden Rules</p>
      <ul style={{ margin: 0, paddingLeft: 20, color: "#475569" }}>
        {d.rules.map((r, i) => <li key={i} style={{ marginBottom: 4, fontSize: 13.5 }}>{r}</li>)}
      </ul>
      <InterviewTip text={d.interview} />
    </div>
  );
}

function Topic3() {
  const d = content[3];
  const [active, setActive] = useState(0);
  const p = d.phases[active];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {d.phases.map((ph, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            padding: "6px 16px", borderRadius: 20, border: "1.5px solid",
            borderColor: active === i ? ph.color : "#e2e8f0",
            background: active === i ? ph.bg : "white",
            color: active === i ? ph.color : "#64748b",
            fontWeight: active === i ? 600 : 400, fontSize: 13, cursor: "pointer",
          }}>{ph.name}</button>
        ))}
      </div>
      <div style={{ background: p.bg, borderRadius: 10, padding: "14px 18px", marginBottom: 12 }}>
        <div style={{ fontWeight: 600, color: p.color, marginBottom: 6 }}>{p.name}</div>
        <div style={{ color: "#334155", fontSize: 13.5, marginBottom: 8 }}>{p.desc}</div>
        <div style={{ fontSize: 12.5 }}>
          <span style={{ color: "#94a3b8" }}>Class: </span>
          <code style={{ background: "#e2e8f0", padding: "1px 6px", borderRadius: 4, color: "#1e293b" }}>{p.classMethod}</code>
        </div>
        <div style={{ fontSize: 12.5, marginTop: 4 }}>
          <span style={{ color: "#94a3b8" }}>Hook equivalent: </span>
          <code style={{ background: "#e2e8f0", padding: "1px 6px", borderRadius: 4, color: "#1e293b" }}>{p.hookEquiv}</code>
        </div>
      </div>
      <CodeBlock code={p.code} />
    </div>
  );
}

function Topic4() {
  const d = content[4];
  const [tab, setTab] = useState(0);
  const c = d.concepts[tab];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {d.concepts.map((c, i) => (
          <button key={i} onClick={() => setTab(i)} style={{
            padding: "6px 14px", borderRadius: 20, border: "1.5px solid",
            borderColor: tab === i ? c.color : "#e2e8f0",
            background: tab === i ? c.bg : "white",
            color: tab === i ? c.color : "#64748b",
            fontWeight: tab === i ? 600 : 400, fontSize: 13, cursor: "pointer",
          }}>{c.name}</button>
        ))}
      </div>
      {tab === 0 && (
        <div>
          {c.items.map((item, i) => (
            <div key={i} style={{ background: i === 0 ? "#EEEDFE" : "#E1F5EE", borderRadius: 10, padding: "14px 16px", marginBottom: 10 }}>
              <div style={{ fontWeight: 600, color: i === 0 ? "#7F77DD" : "#1D9E75", marginBottom: 4 }}>{item.label}</div>
              <div style={{ color: "#334155", fontSize: 13.5, marginBottom: 6 }}>{item.desc}</div>
              <code style={{ fontSize: 12.5, background: "rgba(255,255,255,0.6)", padding: "4px 8px", borderRadius: 4, display: "block" }}>{item.example}</code>
            </div>
          ))}
        </div>
      )}
      {tab === 1 && (
        <div>
          <div style={{ color: "#ef4444", fontWeight: 500, marginBottom: 6 }}>❌ The Problem</div>
          <CodeBlock code={c.problem} />
          <div style={{ color: "#22c55e", fontWeight: 500, margin: "12px 0 6px" }}>✅ The Solution</div>
          <CodeBlock code={c.solution} />
        </div>
      )}
      {tab === 2 && (
        <div>
          <p style={{ color: "#475569", marginTop: 0 }}>{c.desc}</p>
          <CodeBlock code={c.code} />
          <InterviewTip text={c.interview} />
        </div>
      )}
    </div>
  );
}

function Topic5() {
  const d = content[5];
  const [tab, setTab] = useState("flow");
  const tabs = ["flow", "slice", "async", "zustand"];
  const tabLabels = { flow: "How Redux Works", slice: "RTK Slice", async: "Async Thunk", zustand: "Zustand" };
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "5px 14px", borderRadius: 20, fontSize: 13, cursor: "pointer",
            border: "1.5px solid", borderColor: tab === t ? "#7F77DD" : "#e2e8f0",
            background: tab === t ? "#EEEDFE" : "white",
            color: tab === t ? "#7F77DD" : "#64748b",
            fontWeight: tab === t ? 600 : 400,
          }}>{tabLabels[t]}</button>
        ))}
      </div>
      {tab === "flow" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
            {d.redux.flow.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  background: "#EEEDFE", color: "#7F77DD", padding: "8px 14px",
                  borderRadius: 8, fontSize: 13, fontWeight: 500,
                }}>{step}</div>
                {i < d.redux.flow.length - 1 && <span style={{ color: "#94a3b8", fontSize: 18 }}>→</span>}
              </div>
            ))}
          </div>
          <p style={{ color: "#475569", fontSize: 14, marginTop: 0 }}>
            Redux follows a strict unidirectional data flow. Components never modify state directly — they dispatch actions, reducers compute the new state, and components re-render.
          </p>
        </div>
      )}
      {tab === "slice" && <CodeBlock code={d.redux.core + "\n\n" + d.redux.usage} />}
      {tab === "async" && <CodeBlock code={d.redux.asyncThunk} />}
      {tab === "zustand" && (
        <div>
          <p style={{ color: "#475569", marginTop: 0 }}>{d.zustand.desc}</p>
          <CodeBlock code={d.zustand.code} />
          <InterviewTip text={d.zustand.interview} />
        </div>
      )}
    </div>
  );
}

function Topic6() {
  const d = content[6];
  const [ex, setEx] = useState(0);
  return (
    <div>
      <div style={{ background: "#EEEDFE", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
        <div style={{ fontWeight: 600, color: "#7F77DD", marginBottom: 8 }}>Rules of Custom Hooks</div>
        {d.rules.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4, fontSize: 13.5 }}>
            <span style={{ color: "#7F77DD" }}>→</span>
            <span style={{ color: "#334155" }}>{r}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {d.examples.map((e, i) => (
          <button key={i} onClick={() => setEx(i)} style={{
            padding: "5px 14px", borderRadius: 20, border: "1.5px solid",
            borderColor: ex === i ? "#1D9E75" : "#e2e8f0",
            background: ex === i ? "#E1F5EE" : "white",
            color: ex === i ? "#0F6E56" : "#64748b",
            fontWeight: ex === i ? 600 : 400, fontSize: 13, cursor: "pointer",
          }}>{d.examples[i].name}</button>
        ))}
      </div>
      <div style={{ color: "#475569", fontSize: 14, marginBottom: 8 }}>{d.examples[ex].desc}</div>
      <CodeBlock code={d.examples[ex].code} />
    </div>
  );
}

function Topic7() {
  const d = content[7];
  const [active, setActive] = useState(0);
  const c = d.concepts[active];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {d.concepts.map((con, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            padding: "5px 14px", borderRadius: 20, border: "1.5px solid",
            borderColor: active === i ? con.color : "#e2e8f0",
            background: active === i ? con.bg : "white",
            color: active === i ? con.color : "#64748b",
            fontWeight: active === i ? 600 : 400, fontSize: 13, cursor: "pointer",
          }}>{con.name}</button>
        ))}
      </div>
      <div style={{ background: c.bg, borderRadius: 10, padding: "12px 16px", marginBottom: 10, color: "#334155", fontSize: 14 }}>
        <strong style={{ color: c.color }}>{c.name}: </strong>{c.desc}
      </div>
      <CodeBlock code={c.code} />
      <InterviewTip text={d.interview} />
    </div>
  );
}

function Topic8() {
  const d = content[8];
  const [active, setActive] = useState(0);
  const c = d.concepts[active];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {d.concepts.map((con, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            padding: "5px 14px", borderRadius: 20, border: "1.5px solid",
            borderColor: active === i ? con.color : "#e2e8f0",
            background: active === i ? con.bg : "white",
            color: active === i ? con.color : "#64748b",
            fontWeight: active === i ? 600 : 400, fontSize: 12.5, cursor: "pointer",
          }}>{con.name}</button>
        ))}
      </div>
      <div style={{ background: c.bg, borderRadius: 10, padding: "12px 16px", marginBottom: 10, color: "#334155", fontSize: 14 }}>
        <strong style={{ color: c.color }}>{c.name}: </strong>{c.desc}
      </div>
      <CodeBlock code={c.code} />
      <InterviewTip text={d.interview} />
    </div>
  );
}

function Topic9() {
  const d = content[9];
  const [tab, setTab] = useState("compare");
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["compare", "code"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "5px 14px", borderRadius: 20, border: "1.5px solid",
            borderColor: tab === t ? "#7F77DD" : "#e2e8f0",
            background: tab === t ? "#EEEDFE" : "white",
            color: tab === t ? "#7F77DD" : "#64748b",
            fontWeight: tab === t ? 600 : 400, fontSize: 13, cursor: "pointer",
          }}>{t === "compare" ? "CSR vs SSR" : "Code Examples"}</button>
        ))}
      </div>
      {tab === "compare" && (
        <div className="table-responsive">
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, borderBottom: "2px solid #e2e8f0" }}>Aspect</th>
                <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#1D9E75", borderBottom: "2px solid #e2e8f0" }}>CSR</th>
                <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#7F77DD", borderBottom: "2px solid #e2e8f0" }}>SSR</th>
              </tr>
            </thead>
            <tbody>
              {d.comparison.map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#f8fafc" }}>
                  <td style={{ padding: "9px 14px", fontWeight: 500, color: "#1e293b", borderBottom: "1px solid #f1f5f9" }}>{row.aspect}</td>
                  <td style={{ padding: "9px 14px", color: "#475569", borderBottom: "1px solid #f1f5f9" }}>{row.csr}</td>
                  <td style={{ padding: "9px 14px", color: "#475569", borderBottom: "1px solid #f1f5f9" }}>{row.ssr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {tab === "code" && (
        <div>
          {d.patterns.map((p, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 600, color: "#1e293b", marginBottom: 6 }}>{p.name}</div>
              <CodeBlock code={p.code} />
            </div>
          ))}
          <InterviewTip text={d.interview} />
        </div>
      )}
    </div>
  );
}

function Topic10() {
  const d = content[10];
  const [tab, setTab] = useState(0);
  const tabs = ["Basics", "Dynamic", "Protected", "RBAC"];
  const codes = [d.basics, d.advanced[0].code, d.advanced[1].code, d.advanced[2].code];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={{
            padding: "5px 14px", borderRadius: 20, border: "1.5px solid",
            borderColor: tab === i ? "#D85A30" : "#e2e8f0",
            background: tab === i ? "#FAECE7" : "white",
            color: tab === i ? "#D85A30" : "#64748b",
            fontWeight: tab === i ? 600 : 400, fontSize: 13, cursor: "pointer",
          }}>{t}</button>
        ))}
      </div>
      <CodeBlock code={codes[tab]} />
      <InterviewTip text={d.interview} />
    </div>
  );
}

function Topic11() {
  const d = content[11];
  const [ex, setEx] = useState(0);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        {d.pyramid.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              background: ["#EEEDFE", "#E1F5EE", "#FAECE7"][i],
              color: ["#7F77DD", "#1D9E75", "#D85A30"][i],
              padding: "5px 12px", borderRadius: 20, fontSize: 13, fontWeight: 500,
            }}>{p}</div>
            {i < 2 && <span style={{ color: "#94a3b8" }}>→</span>}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {d.examples.map((e, i) => (
          <button key={i} onClick={() => setEx(i)} style={{
            padding: "5px 14px", borderRadius: 20, border: "1.5px solid",
            borderColor: ex === i ? "#1D9E75" : "#e2e8f0",
            background: ex === i ? "#E1F5EE" : "white",
            color: ex === i ? "#0F6E56" : "#64748b",
            fontWeight: ex === i ? 600 : 400, fontSize: 13, cursor: "pointer",
          }}>{e.name}</button>
        ))}
      </div>
      <Badge text={d.examples[ex].lib} bg="#E1F5EE" color="#0F6E56" />
      <div style={{ marginTop: 8 }}>
        <CodeBlock code={d.examples[ex].code} />
      </div>
      <InterviewTip text={d.interview} />
    </div>
  );
}

function Topic12() {
  const d = content[12];
  const [ex, setEx] = useState(0);
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        {d.examples.map((e, i) => (
          <button key={i} onClick={() => setEx(i)} style={{
            padding: "5px 14px", borderRadius: 20, border: "1.5px solid",
            borderColor: ex === i ? "#D85A30" : "#e2e8f0",
            background: ex === i ? "#FAECE7" : "white",
            color: ex === i ? "#D85A30" : "#64748b",
            fontWeight: ex === i ? 600 : 400, fontSize: 13, cursor: "pointer",
          }}>{e.name}</button>
        ))}
      </div>
      <CodeBlock code={d.examples[ex].code} />
      <InterviewTip text={d.interview} />
    </div>
  );
}

function Topic13() {
  const d = content[13];
  const [active, setActive] = useState(0);
  const p = d.principles[active];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {d.principles.map((pr, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            padding: "5px 14px", borderRadius: 20, border: "1.5px solid",
            borderColor: active === i ? pr.color : "#e2e8f0",
            background: active === i ? pr.bg : "white",
            color: active === i ? pr.color : "#64748b",
            fontWeight: active === i ? 600 : 400, fontSize: 13, cursor: "pointer",
          }}>{pr.name}</button>
        ))}
      </div>
      {p.bad && (
        <div>
          <div style={{ color: "#ef4444", fontWeight: 500, marginBottom: 6 }}>❌ Avoid this</div>
          <CodeBlock code={p.bad} />
          <div style={{ color: "#22c55e", fontWeight: 500, margin: "12px 0 6px" }}>✅ Do this instead</div>
          <CodeBlock code={p.good} />
        </div>
      )}
      {p.code && <CodeBlock code={p.code} />}
    </div>
  );
}

function Topic14() {
  const d = content[14];
  const [active, setActive] = useState(0);
  const o = d.optimizations[active];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {d.optimizations.map((op, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            padding: "5px 14px", borderRadius: 20, border: "1.5px solid",
            borderColor: active === i ? op.color : "#e2e8f0",
            background: active === i ? op.bg : "white",
            color: active === i ? op.color : "#64748b",
            fontWeight: active === i ? 600 : 400, fontSize: 12.5, cursor: "pointer",
          }}>{op.name}</button>
        ))}
      </div>
      <div style={{ background: o.bg, borderRadius: 10, padding: "12px 16px", marginBottom: 10, fontSize: 14, color: "#334155" }}>
        <strong style={{ color: o.color }}>{o.desc}</strong>
      </div>
      <CodeBlock code={o.code} />
      <div style={{ marginTop: 16 }}>
        <div style={{ fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>Performance Checklist</div>
        {d.checklist.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 4, fontSize: 13.5, color: "#475569" }}>
            <span style={{ color: "#22c55e" }}>✓</span>{item}
          </div>
        ))}
      </div>
    </div>
  );
}

function Topic15() {
  const d = content[15];
  const [active, setActive] = useState(0);
  const a = d.approaches[active];
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {d.approaches.map((ap, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            padding: "5px 14px", borderRadius: 20, border: "1.5px solid",
            borderColor: active === i ? ap.color : "#e2e8f0",
            background: active === i ? ap.bg : "white",
            color: active === i ? ap.color : "#64748b",
            fontWeight: active === i ? 600 : 400, fontSize: 13, cursor: "pointer",
          }}>{ap.name}</button>
        ))}
      </div>
      <div className="topic-pros-cons-row">
        <div style={{ flex: 1, background: "#f0fdf4", borderRadius: 10, padding: "12px 14px", minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: "#166534", marginBottom: 6, fontSize: 13 }}>✓ Pros</div>
          {a.pros.map((p, i) => <div key={i} style={{ fontSize: 13, color: "#15803d", marginBottom: 2 }}>• {p}</div>)}
        </div>
        <div style={{ flex: 1, background: "#fef2f2", borderRadius: 10, padding: "12px 14px", minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: "#991b1b", marginBottom: 6, fontSize: 13 }}>✗ Cons</div>
          {a.cons.map((c, i) => <div key={i} style={{ fontSize: 13, color: "#b91c1c", marginBottom: 2 }}>• {c}</div>)}
        </div>
      </div>
      <CodeBlock code={a.code} />
      <div className="table-responsive" style={{ marginTop: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Approach", "Bundle", "Dynamic Styles", "Learning", "Best For"].map(h => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, borderBottom: "2px solid #e2e8f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.comparison.map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? "white" : "#f8fafc" }}>
                <td style={{ padding: "7px 12px", fontWeight: 500 }}>{row.approach}</td>
                <td style={{ padding: "7px 12px", color: "#475569" }}>{row.bundle}</td>
                <td style={{ padding: "7px 12px", color: "#475569" }}>{row.dynamicStyles}</td>
                <td style={{ padding: "7px 12px", color: "#475569" }}>{row.learningCurve}</td>
                <td style={{ padding: "7px 12px", color: "#475569" }}>{row.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const topicComponents = {
  1: Topic1, 2: Topic2, 3: Topic3, 4: Topic4, 5: Topic5,
  6: Topic6, 7: Topic7, 8: Topic8, 9: Topic9, 10: Topic10,
  11: Topic11, 12: Topic12, 13: Topic13, 14: Topic14, 15: Topic15,
};

export default function ReactGuide() {
  const [selected, setSelected] = useState(1);
  const TopicContent = topicComponents[selected];
  const topicData = content[selected];

  return (
    <div className="guide-page">
      <div className="guide-hero">
        <div className="guide-hero-title">⚛️ React Interview Guide</div>
        <div className="guide-hero-sub">15 topics — from hooks to performance. Everything a React developer needs to know.</div>
        <div className="guide-hero-pills">
          {["15 Topics", "50+ Code Examples", "Interview Tips"].map(b => (
            <span key={b} style={{ background: "rgba(255,255,255,0.1)", padding: "3px 12px", borderRadius: 20, fontSize: 12, color: "#e2e8f0" }}>{b}</span>
          ))}
        </div>
      </div>

      <div className="guide-grid">
        <div className="guide-sidebar">
          {topics.map(t => (
            <button key={t.id} type="button" className="guide-topic-btn" onClick={() => setSelected(t.id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 14px", borderRadius: 9,
              border: "1.5px solid",
              borderColor: selected === t.id ? "#7F77DD" : "transparent",
              background: selected === t.id ? "#EEEDFE" : "transparent",
              color: selected === t.id ? "#534AB7" : "#475569",
              fontWeight: selected === t.id ? 600 : 400,
              fontSize: 13.5, cursor: "pointer", textAlign: "left",
            }}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              <span>{t.id}. {t.title}</span>
            </button>
          ))}
        </div>

        <div className="guide-main">
          <div style={{ marginBottom: 18, paddingBottom: 16, borderBottom: "1px solid #f1f5f9" }}>
            <div className="guide-main-header-title">{topicData.title}</div>
            <div className="guide-main-header-sub">{topicData.subtitle}</div>
            {topicData.story && (
              <div className="guide-story">
                <span style={{ fontWeight: 700, color: "#92400e" }}>Simple story — </span>
                {topicData.story}
              </div>
            )}
          </div>
          <TopicContent />
        </div>
      </div>
    </div>
  );
}