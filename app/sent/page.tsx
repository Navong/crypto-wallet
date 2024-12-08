'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { ArrowLeft, Info } from 'lucide-react';
import Link from 'next/link';
import { FormEvent } from 'react';
import { type Hex, parseEther } from 'viem';
import { type BaseError, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'sonner';
import { FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useAccountContext } from '../AccountContext';
import { Address } from "viem";


export default function SendPage() {
    const { account: address, chainId } = useAccountContext();
    const { data: availableBalance, isError, isLoading, refetch } = useBalance({
        address: address as Address,
    });


    const [formData, setFormData] = useState({
        recipient: '',
        amount: '',
        gasLimit: '21000',
        gasPrice: '50',
    });

    const { data: hash, error, isPending, sendTransaction } = useSendTransaction();

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const { recipient, amount } = formData;
        sendTransaction({ to: recipient as Hex, value: parseEther(amount) });
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    console.log({ hash, isConfirming, isConfirmed });

    const [showAdvanced, setShowAdvanced] = useState(false);


    // toast
    useEffect(() => {
        if (isConfirmed) {
            toast("", {
                description: (
                    <div className="items-center gap-2 cursor-pointer hover:text-[#39A6FF] px-2">
                        <div className="text-white font-semibold">Transaction confirmed</div>
                        <div className="py-1 flex gap-2" onClick={() => window.open(`https://sepolia.etherscan.io/tx/${hash}`)}>
                            <div>View on sepolia.etherscan.io</div>
                            <FaExternalLinkAlt size={14} />
                        </div>
                    </div>
                ),
                duration: 2000,
                icon: <FaCheckCircle className="text-green-600 h-[1.12rem] w-[1.12rem]" />,
                // position: "top-left",
            });
        }
    }, [isConfirmed]);

    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    // is loading
    useEffect(() => {

        let toastId: string | number | undefined;

        if (isConfirming) {
            toastId = toast("", {
                description: (
                    <div className="items-center gap-2 cursor-pointer hover:text-[#39A6FF] px-2">
                        <div className="text-white font-semibold">Confirming transaction</div>
                        <div className="py-1 flex gap-2" onClick={() => window.open(`https://sepolia.etherscan.io/tx/${hash}`)}>
                            <div>View on sepolia.etherscan.io</div>
                            <FaExternalLinkAlt size={13} />
                        </div>
                        {/* <button className={styles.headlessClose} onClick={() => toast.dismiss(toastId)}>
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M2.96967 2.96967C3.26256 2.67678 3.73744 2.67678 4.03033 2.96967L8 6.939L11.9697 2.96967C12.2626 2.67678 12.7374 2.67678 13.0303 2.96967C13.3232 3.26256 13.3232 3.73744 13.0303 4.03033L9.061 8L13.0303 11.9697C13.2966 12.2359 13.3208 12.6526 13.1029 12.9462L13.0303 13.0303C12.7374 13.3232 12.2626 13.3232 11.9697 13.0303L8 9.061L4.03033 13.0303C3.73744 13.3232 3.26256 13.3232 2.96967 13.0303C2.67678 12.7374 2.67678 12.2626 2.96967 11.9697L6.939 8L2.96967 4.03033C2.7034 3.76406 2.6792 3.3474 2.89705 3.05379L2.96967 2.96967Z"></path>
                            </svg>
                        </button> */}
                    </div>
                ),
                duration: Infinity,
                icon: <AiOutlineLoading3Quarters className="text-[#39A6FF] h-[1.12rem] w-[1.12rem] animate-spin" />,
                // position: "top-left",
            });
        }

        if (isConfirming || isConfirmed) {
            if (toastId) {
                toast.dismiss(toastId);
            }
        }

        return () => {
            if (toastId) {
                toast.dismiss(toastId);
            }
        };
    }, [isConfirming, isConfirmed]);

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
                        <h1 className="text-2xl font-bold text-gray-100 mb-6">Send Assets</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Recipient Address
                                </label>
                                <input
                                    type="text"
                                    value={formData.recipient}
                                    onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg
                                        focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                                        text-gray-100 placeholder-gray-400"
                                    placeholder="0x..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Amount ({availableBalance?.symbol})
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg
                                            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                                            text-gray-100 placeholder-gray-400"
                                        placeholder="0.0"
                                        step="0.000001"
                                        required
                                    />
                                    <div className="absolute right-3 top-3 text-gray-400 pr-6">{availableBalance?.symbol}</div>
                                </div>
                                <div className="mt-2 text-sm text-gray-400">
                                    Available balance: {availableBalance?.formatted} {availableBalance?.symbol}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-gray-100 py-3 px-4 
                                    rounded-lg transition-colors text-base font-medium"
                                disabled={isPending}
                            >
                                {isPending ? 'Confirming...' : 'Send'}
                            </button>
                        </form>

                        {hash && <div className="mt-4 text-sm text-gray-300">Transaction Hash: {hash}</div>}
                        {isConfirming && <div className="mt-4 text-sm text-gray-300">Waiting for confirmation...</div>}
                        {isConfirmed && <div className="mt-4 text-sm text-green-400">Transaction confirmed.</div>}
                        {error && (
                            <div className="mt-4 text-sm text-red-400">
                                Error: {(error as BaseError).shortMessage || error.message}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
