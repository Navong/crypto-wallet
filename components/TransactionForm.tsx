"use client";

import { useState } from 'react';

export function TransactionForm() {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Transaction:', { recipient, amount });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Send Transaction</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Recipient Address
                    </label>
                    <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                     text-sm sm:text-base text-gray-100 placeholder-gray-400"
                        placeholder="0x..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Amount
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                       text-sm sm:text-base text-gray-100 placeholder-gray-400"
                            placeholder="0.0"
                            step="0.000001"
                        />
                        <span className="absolute right-3 top-2 text-gray-400">ETH</span>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-gray-100 py-2 rounded-lg 
                   transition-colors text-sm sm:text-base"
                >
                    Send Transaction
                </button>
            </div>
        </form>
    );
}