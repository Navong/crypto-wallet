'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { ArrowLeft, Copy, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import QRCodeComponent from '@/components/QRCodeComponent';
import { useAccountContext } from '../AccountContext';

export default function ReceivePage() {
    const [copied, setCopied] = useState(false);
    const { account: address } = useAccountContext();

    const handleCopy = async () => {
        try {
            if (address) {
                await navigator.clipboard.writeText(address);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } else {
                console.error('Address is null');
            }
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };


    return (
        <div className="min-h-screen bg-gray-900">
            <Header />
            <main className="container mx-auto px-4 py-6">
                <div className="max-w-xl mx-auto">
                    <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 mb-6">
                        <ArrowLeft size={20} />
                        Back to Wallet
                    </Link>

                    <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                        <h1 className="text-2xl font-bold text-gray-100 mb-6">Receive Assets</h1>

                        <div className="space-y-6">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Your Wallet Address
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={address || ''}
                                        readOnly
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg
                             text-gray-100 font-mono"
                                    />
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center justify-center w-12 h-12 bg-gray-700 
                             hover:bg-gray-600 rounded-lg transition-colors"
                                    >
                                        {copied ? (
                                            <CheckCircle size={20} className="text-green-400" />
                                        ) : (
                                            <Copy size={20} className="text-gray-300" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-700 pt-6">
                                <h2 className="text-lg font-medium text-gray-100 mb-4">QR Code</h2>
                                <div className="flex justify-center bg- rounded-lg">
                                    <QRCodeComponent value={address || ''}
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-700/50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-100 mb-2">Important Notice</h3>
                                <ul className="text-sm text-gray-300 space-y-2">
                                    {/* <li>• Only send  tokens to this address</li> */}
                                    <li>• Sending other types of tokens may result in permanent loss</li>
                                    <li>• Make sure to always verify the address before sending</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
