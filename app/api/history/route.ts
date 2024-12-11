import { NextResponse } from 'next/server';
import db from '@/lib/db';

interface Transaction {
    id?: number;
    address: string;
    amount: number;
    timestamp?: string;
}

// Handle GET requests
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address');

    if (!address) {
        return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    try {
        const stmt = db.prepare('SELECT * FROM transaction_history WHERE address = ? ORDER BY timestamp DESC');
        const transactions = stmt.all(address) as Transaction[];

        if (transactions.length === 0) {
            return NextResponse.json({ message: 'No transactions found for the given address' }, { status: 200 });
        }

        return NextResponse.json(transactions, { status: 200 });
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        return NextResponse.json({ error: 'Failed to fetch transaction history' }, { status: 500 });
    }
}


// Handle POST requests
export async function POST(req: Request) {
    try {
        const { address, amount } = await req.json();

        if (!address || !amount) {
            return NextResponse.json({ error: 'Address and amount are required' }, { status: 400 });
        }

        // Check if the address already exists in the transaction history
        const stmtCheck = db.prepare('SELECT 1 FROM transaction_history WHERE address = ? LIMIT 1');
        const existingTransaction = stmtCheck.get(address);

        // If the address exists, insert the new transaction only if no existing transaction matches
        if (!existingTransaction) {
            const stmtInsert = db.prepare('INSERT INTO transaction_history (address, amount) VALUES (?, ?)');
            stmtInsert.run(address, amount);
            return NextResponse.json({ message: 'Transaction saved successfully' }, { status: 201 });
        } else {
            return NextResponse.json({ message: 'Transaction for this address already exists' }, { status: 200 });
        }

    } catch (error) {
        console.error('Error processing POST request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}


