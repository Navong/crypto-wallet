import Database from 'better-sqlite3';
import path from 'path';

interface Transaction {
    id?: number;
    address: string;
    amount: string;
    timestamp?: string;
}

// Initialize SQLite database
const db = new Database(path.resolve(process.cwd(), 'transaction_history.db'));

// Create table if not exists with a unique constraint on the 'address' column
db.exec(`
    CREATE TABLE IF NOT EXISTS transaction_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        address TEXT NOT NULL UNIQUE,
        amount TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

export default db;
export type { Transaction };
