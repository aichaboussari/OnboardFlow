import { Database } from 'bun:sqlite';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'onboardflow.db');
const db = new Database(DB_PATH, { create: true });

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS businesses (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    industry TEXT,
    password_hash TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    business_id TEXT,
    name TEXT,
    email TEXT,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id)
  );

  CREATE TABLE IF NOT EXISTS email_templates (
    id TEXT PRIMARY KEY,
    business_id TEXT,
    name TEXT,
    subject TEXT,
    body TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id)
  );

  CREATE TABLE IF NOT EXISTS checklists (
    id TEXT PRIMARY KEY,
    business_id TEXT,
    name TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id)
  );

  CREATE TABLE IF NOT EXISTS checklist_tasks (
    id TEXT PRIMARY KEY,
    checklist_id TEXT,
    task_name TEXT,
    order_index INT,
    FOREIGN KEY (checklist_id) REFERENCES checklists(id)
  );

  CREATE TABLE IF NOT EXISTS onboarding_flows (
    id TEXT PRIMARY KEY,
    business_id TEXT,
    client_id TEXT,
    status TEXT DEFAULT 'active',
    progress_pct REAL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id),
    FOREIGN KEY (client_id) REFERENCES clients(id)
  );

  CREATE TABLE IF NOT EXISTS flow_tasks (
    id TEXT PRIMARY KEY,
    flow_id TEXT,
    task_name TEXT,
    completed INT DEFAULT 0,
    order_index INT,
    FOREIGN KEY (flow_id) REFERENCES onboarding_flows(id)
  );

  CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    flow_id TEXT,
    name TEXT,
    file_path TEXT,
    signed INT DEFAULT 0,
    signed_at TEXT,
    FOREIGN KEY (flow_id) REFERENCES onboarding_flows(id)
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    business_id TEXT,
    expires_at TEXT,
    FOREIGN KEY (business_id) REFERENCES businesses(id)
  );

  CREATE TABLE IF NOT EXISTS email_logs (
    id TEXT PRIMARY KEY,
    business_id TEXT,
    client_id TEXT,
    subject TEXT,
    body TEXT,
    sent_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id),
    FOREIGN KEY (client_id) REFERENCES clients(id)
  );
`);

// Migration safety: Ensure 'notes' column exists in clients table
try {
  const tableInfo = db.prepare("PRAGMA table_info(clients)").all() as any[];
  const hasNotes = tableInfo.some(col => col.name === 'notes');
  if (!hasNotes) {
    db.exec("ALTER TABLE clients ADD COLUMN notes TEXT;");
  }
} catch (e) {
  console.error("Migration error (clients.notes):", e);
}

export default db;
// test
