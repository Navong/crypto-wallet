import { ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react';
import React from 'react';
import {useNavigate} from 'react-router-dom';

// Utility functions (replace with your implementations)
const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;
const formatTimestamp = (timestamp: number) => new Date(timestamp).toLocaleString();

const mockTransactions = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  type: index % 2 === 0 ? 'sent' : 'received',
  to: `0xRecipientAddress${index}`,
  from: `0xSenderAddress${index}`,
  amount: (Math.random() * 10).toFixed(2),
  timestamp: Date.now() - index * 3600000,
}));

// Main Transaction List Page
const TransactionList = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="py-4 text-center text-white text-2xl font-bold">
        Transaction History
      </header>
      <div className="container mx-auto px-4 py-6 max-w-xl">
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
          <h2 className="text-xl font-bold mb-6">Transaction History</h2>
          <div className="space-y-4">
            {mockTransactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => navigate(`/transaction/${tx.id}`)}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full ${tx.type === 'sent' ? 'bg-red-500/20' : 'bg-green-500/20'
                      }`}
                  >
                    {tx.type === 'sent' ? (
                      <ArrowUpRight className="w-5 h-5 text-red-500" />
                    ) : (
                      <ArrowDownLeft className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {tx.type === 'sent' ? 'Sent to' : 'Received from'}
                    </p>
                    <p className="text-sm text-slate-400">
                      {tx.type === 'sent'
                        ? formatAddress(tx.to || '')
                        : formatAddress(tx.from || '')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-medium ${tx.type === 'sent' ? 'text-red-500' : 'text-green-500'
                      }`}
                  >
                    {tx.type === 'sent' ? '-' : '+'}
                    {tx.amount} ETH
                  </p>
                  <div className="flex items-center justify-end text-sm text-slate-400">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTimestamp(tx.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;