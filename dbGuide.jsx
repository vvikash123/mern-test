import { GuideLayout } from "./guideComponents.jsx";

const topics = [
  { id: 1, title: "SQL vs documents", icon: "⚖️" },
  { id: 2, title: "MongoDB basics", icon: "🍃" },
  { id: 3, title: "CRUD & queries", icon: "🔍" },
  { id: 4, title: "Indexes", icon: "📇" },
  { id: 5, title: "Aggregation", icon: "🪜" },
  { id: 6, title: "Mongoose", icon: "🦡" },
  { id: 7, title: "Transactions", icon: "🔐" },
  { id: 8, title: "Atlas & ops", icon: "☁️" },
];

const C = {
  p: "#47a248", s: "#e8f5e9", m: "#7F77DD", ms: "#EEEDFE", o: "#D85A30", os: "#FAECE7",
};

const contents = {
  1: {
    title: "Relational vs document DB",
    subtitle: "When MongoDB fits — and when it doesn’t",
    story: "A spreadsheet with strict columns is like SQL. A folder of JSON sticky notes is like MongoDB — flexible shape, but you still need labels (indexes) to find notes fast.",
    sections: [
      {
        name: "Documents", color: C.p, bg: C.s,
        desc: "BSON (binary JSON) in collections; schema flexible by default.",
        when: "Nested objects, evolving product catalogs, content-heavy apps.",
        code: `// One user document — nested profile OK
{
  "_id": ObjectId("..."),
  "email": "a@b.com",
  "profile": { "city": "NYC", "tags": ["dev"] }
}`,
        interview: "Flexibility can become chaos without application-level schema discipline.",
      },
      {
        name: "SQL strengths", color: C.m, bg: C.ms,
        desc: "JOINs, ACID across rows, strong constraints.",
        when: "Complex reporting, heavy relational integrity, financial ledgers.",
        code: `-- Relational: many tables, foreign keys
SELECT u.name, COUNT(o.id)
FROM users u
JOIN orders o ON o.user_id = u.id
GROUP BY u.id;`,
        interview: "MongoDB can model relations via references or embedding — different tradeoffs than JOINs.",
      },
      {
        name: "Embedding vs reference", color: C.o, bg: C.os,
        desc: "Embed for one-to-few, atomic updates; reference for unbounded one-to-many.",
        when: "Designing collections before indexes.",
        code: `// Embedded comments (bounded)
{ post: "...", comments: [{ body: "hi", at: ISODate() }] }

// Referenced — millions of events
{ userId: ObjectId("..."), type: "login", at: ISODate() }`,
        interview: "16MB document limit — don’t embed unbounded arrays.",
      },
    ],
  },
  2: {
    title: "MongoDB core concepts",
    subtitle: "Database, collection, document, _id",
    story: "A library (database) has shelves (collections). Each book is a document; the barcode _id is never duplicated on that shelf.",
    sections: [
      {
        name: "Shell / Compass", color: C.p, bg: C.s,
        desc: "mongosh for CLI; Compass GUI for browsing.",
        when: "Ad-hoc queries and learning.",
        code: `mongosh "mongodb://localhost:27017"
use shop
db.products.findOne()`,
        interview: "Atlas free tier for learning; local Docker for offline dev.",
      },
      {
        name: "_id", color: C.m, bg: C.ms,
        desc: "Unique ObjectId per document in a collection; 12-byte value with timestamp.",
        when: "Default primary key; can use custom strings (UUID).",
        code: `db.users.insertOne({ name: "Ada" });
// auto _id

db.users.insertOne({ _id: "user-1", name: "Bob" });`,
        interview: "ObjectId first 4 bytes encode creation time — sortable roughly by insert time.",
      },
      {
        name: " BSON types", color: C.o, bg: C.os,
        desc: "Date, Decimal128, BinData — richer than JSON.",
        when: "Money (Decimal), binary assets metadata.",
        code: `db.events.insertOne({
  at: new Date(),
  amount: NumberDecimal("19.99")
});`,
        interview: "Never store money as floating double — precision loss.",
      },
    ],
  },
  3: {
    title: "CRUD & query operators",
    subtitle: "insertOne, find, update, delete",
    story: "Librarian tasks: add a book, find by author, fix a typo on one copy, remove a damaged book.",
    sections: [
      {
        name: "Create & read", color: C.p, bg: C.s,
        desc: "insertOne, insertMany; find, findOne, projection.",
        when: "Basic API persistence.",
        code: `db.users.insertOne({ email: "a@b.com", score: 0 });

db.users.find(
  { score: { $gte: 10 } },
  { email: 1, _id: 0 }
);`,
        interview: "Project fields to reduce wire size and accidental data leaks.",
      },
      {
        name: "Update", color: C.m, bg: C.ms,
        desc: "updateOne with $set, $inc, $push; replaceOne.",
        when: "Partial updates vs full document replace.",
        code: `db.users.updateOne(
  { _id: ObjectId("...") },
  { $set: { lastLogin: new Date() }, $inc: { visits: 1 } }
);`,
        interview: "updateMany without careful filter can touch every document — test in staging.",
      },
      {
        name: "Delete", color: C.o, bg: C.os,
        desc: "deleteOne, deleteMany; soft-delete pattern with flag.",
        when: "Hard delete vs audit retention.",
        code: `db.users.deleteMany({ status: "banned" });

// soft delete
db.users.updateOne(
  { _id: id },
  { $set: { deletedAt: new Date() } }
);`,
        interview: "Many apps prefer soft delete for compliance and undo.",
      },
    ],
  },
  4: {
    title: "Indexes",
    subtitle: "Speed up reads — cost writes",
    story: "A book’s index at the back: you find “React” in seconds instead of reading every page. Without it, Mongo scans the whole shelf (COLLSCAN).",
    sections: [
      {
        name: "createIndex", color: C.p, bg: C.s,
        desc: "Single field, compound, unique, TTL.",
        when: "Any frequent filter/sort field.",
        code: `db.orders.createIndex({ userId: 1, createdAt: -1 });
db.users.createIndex({ email: 1 }, { unique: true });

// expire sessions after 1 hour
db.sessions.createIndex({ expires: 1 }, { expireAfterSeconds: 0 });`,
        interview: "explain('executionStats') shows winningPlan — IXSCAN vs COLLSCAN.",
      },
      {
        name: "Compound index order", color: C.m, bg: C.ms,
        desc: "Prefix rule: { a:1, b:1 } helps {a}, {a,b} not {b} alone.",
        when: "Queries filter on a then sort on b.",
        code: `// Good for: find({ status: 'open' }).sort({ priority: -1 })
db.tasks.createIndex({ status: 1, priority: -1 });`,
        interview: "ESR rule: Equality, Sort, Range — order fields in index for mixed queries.",
      },
      {
        name: "Covered queries", color: C.o, bg: C.os,
        desc: "When index contains all projected fields — no document fetch.",
        when: "High-read dashboards.",
        code: `db.users.find(
  { region: "EU" },
  { _id: 0, email: 1 }
); // if index { region:1, email:1 }`,
        interview: "Large indexes eat RAM — monitor working set vs RAM on Atlas.",
      },
    ],
  },
  5: {
    title: "Aggregation pipeline",
    subtitle: "$match, $group, $lookup, $project",
    story: "An assembly line: first remove bad apples ($match), sort into baskets ($group), maybe borrow labels from another conveyor ($lookup).",
    sections: [
      {
        name: "Pipeline stages", color: C.p, bg: C.s,
        desc: "Stages process documents left-to-right; $out / $merge for results.",
        when: "Analytics, reporting, ETL inside Mongo.",
        code: `db.orders.aggregate([
  { $match: { status: "paid" } },
  { $group: {
      _id: "$userId",
      total: { $sum: "$amount" }
  }},
  { $sort: { total: -1 } },
  { $limit: 10 }
]);`,
        interview: "Pipeline runs server-side — less data over the wire than client-side reduce.",
      },
      {
        name: "$lookup", color: C.m, bg: C.ms,
        desc: "Left outer join to another collection.",
        when: "Denormalization not possible; ad-hoc joins.",
        code: `db.orders.aggregate([
  { $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
  }},
  { $unwind: "$user" }
]);`,
        interview: "$lookup can be slow without indexes on join fields.",
      },
      {
        name: "$facet", color: C.o, bg: C.os,
        desc: "Multiple sub-pipelines in parallel — e.g. count + page.",
        when: "API returns stats + rows in one round trip.",
        code: `db.products.aggregate([
  { $match: { category: "shoes" } },
  { $facet: {
      items: [{ $skip: 0 }, { $limit: 20 }],
      total: [{ $count: "n" }]
  }}
]);`,
        interview: "Complex pipelines deserve unit tests against fixture data.",
      },
    ],
  },
  6: {
    title: "Mongoose ODM",
    subtitle: "Schemas, models, middleware",
    story: "Mongo is schemaless; Mongoose is the gentle rulebook your team agrees on — with defaults, validation, and hooks before save.",
    sections: [
      {
        name: "Schema & model", color: C.p, bg: C.s,
        desc: "new Schema({...}); mongoose.model('User', schema).",
        when: "Node.js apps wanting structure and validation.",
        code: `import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 0 }
});

export const User = mongoose.model('User', userSchema);`,
        interview: "strict: true strips unknown keys — good for security.",
      },
      {
        name: "Queries", color: C.m, bg: C.ms,
        desc: "Model.find, findById, findOneAndUpdate with options.",
        when: "CRUD with lean() for plain objects.",
        code: `const users = await User.find({ active: true }).lean();

await User.findByIdAndUpdate(id, { $set: { last: new Date() } }, { new: true });`,
        interview: "lean() skips Mongoose document overhead for read-heavy JSON APIs.",
      },
      {
        name: "Middleware", color: C.o, bg: C.os,
        desc: "pre('save') hooks — hash passwords, timestamps.",
        when: "Cross-cutting model logic.",
        code: `userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});`,
        interview: "Avoid heavy work in hooks without understanding test implications.",
      },
    ],
  },
  7: {
    title: "Transactions",
    subtitle: "multi-document ACID (replica set)",
    story: "Transferring money: both accounts must update or neither does. Transactions bundle writes so they commit or roll back together.",
    sections: [
      {
        name: "startSession", color: C.p, bg: C.s,
        desc: "withTransaction callback — retries transient errors.",
        when: "Debit/credit, inventory + order creation.",
        code: `const session = await mongoose.startSession();
session.startTransaction();
try {
  await Account.updateOne({ _id: a }, { $inc: { bal: -10 } }, { session });
  await Account.updateOne({ _id: b }, { $inc: { bal: 10 } }, { session });
  await session.commitTransaction();
} catch (e) {
  await session.abortTransaction();
  throw e;
} finally {
  session.endSession();
}`,
        interview: "Transactions need replica set — even single-node dev as a set.",
      },
      {
        name: "Isolation", color: C.m, bg: C.ms,
        desc: "snapshot read concern; write concern majority.",
        when: "Correctness under concurrent writes.",
        code: `const session = await mongoose.startSession();
try {
  await session.withTransaction(async () => {
    await Order.create([{ /* ... */ }], { session });
  });
} finally {
  session.endSession();
}`,
        interview: "Long transactions hurt throughput — keep scope small.",
      },
      {
        name: "Idempotency", color: C.o, bg: C.os,
        desc: "Client sends idempotency key — safe retries.",
        when: "Payment webhooks, mobile flaky networks.",
        code: `// Unique index on idempotencyKey prevents double charge
await Payment.create({ idempotencyKey: key, ... });`,
        interview: "Transactions + idempotency keys = robust money flows.",
      },
    ],
  },
  8: {
    title: "Atlas & operations",
    subtitle: "Hosted MongoDB, backups, scaling",
    story: "Instead of guarding your own basement server, you rent a vault with alarms (monitoring), copies (backups), and extra clerks (replicas) when busy.",
    sections: [
      {
        name: "Connection string", color: C.p, bg: C.s,
        desc: "mongodb+srv://user:pass@cluster/db — TLS by default.",
        when: "Atlas cluster; rotate passwords regularly.",
        code: `await mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10
});`,
        interview: "Never log connection strings with credentials.",
      },
      {
        name: "Replica sets", color: C.m, bg: C.ms,
        desc: "Primary + secondaries; automatic failover.",
        when: "Production HA; transactions require oplog.",
        code: `// Driver handles failover URI with multiple hosts
mongodb://host1:27017,host2:27017,host3:27017/mydb?replicaSet=rs0`,
        interview: "Read from secondaries with readPreference for scale — accept eventual consistency.",
      },
      {
        name: "Backups & indexes", color: C.o, bg: C.os,
        desc: "Atlas continuous backup; Performance Advisor suggests indexes.",
        when: "Production readiness checklist.",
        code: `// Slow query log + .explain() in staging before prod index`,
        interview: "Index builds on large collections lock briefly — plan maintenance window or rolling build.",
      },
    ],
  },
};

const accent = { primary: "#47a248", soft: "#e8f5e9", text: "#2d6a32" };

export default function DbGuide() {
  return (
    <GuideLayout
      hero={{
        emoji: "🍃",
        title: "MongoDB Interview Guide",
        subtitle: "8 topics — documents, CRUD, indexes, aggregation, Mongoose, transactions.",
        pills: ["8 Topics", "Query patterns", "Interview tips"],
      }}
      topics={topics}
      contents={contents}
      accent={accent}
    />
  );
}
