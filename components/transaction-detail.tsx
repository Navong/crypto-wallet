'use client';

import { useSearchParams } from "next/navigation";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from "./Header";

const formatTimestamp = (timestamp: number) => new Date(timestamp).toLocaleString();

export const TransactionDetails = () => {
    const searchParams = useSearchParams();

    const id = searchParams.get('id');
    const type = searchParams.get('type');
    const to = searchParams.get('to');
    const from = searchParams.get('from');
    const amount = searchParams.get('amount');
    const timestamp = searchParams.get('timestamp');
    const currentPage = searchParams.get('currentPage');

    if (!id || !type || !to || !from || !amount || !timestamp) {
        return <div className="text-white">Transaction not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <Header />
            <div className="container mx-auto px-4 py-6 max-w-xl">
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                    <h2 className="text-xl font-bold mb-6">Transaction Details</h2>
                    <div className="space-y-4 text-white">
                        <div className="flex justify-between">
                            <span className="font-medium">Type:</span>
                            <span>{type === 'sent' ? 'Sent' : 'Received'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">To:</span>
                            <span>{to}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">From:</span>
                            <span>{from}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Amount:</span>
                            <span>{amount} ETH</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Timestamp:</span>
                            <span>{formatTimestamp(Number(timestamp))}</span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Link
                            href={{
                                pathname: '/transactions',
                                query: { currentPage },
                            }}
                            className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 mb-6"
                        >
                            <ArrowLeft size={20} />
                            Back
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
