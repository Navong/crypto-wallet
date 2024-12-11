'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { FormEvent } from 'react';
import { type Hex, parseEther } from 'viem';
import { type BaseError, useBalance, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from 'sonner';
import { FaCheckCircle, FaExternalLinkAlt } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useAccountContext } from '../AccountContext';
import { Address } from "viem";

interface AddressHistoryItem {
    id: string;
    address: string;
    amount: string;
    timestamp: string;
}


export default function SendPage() {
    const { account: address, chainId } = useAccountContext();


    const [addressHistory, setAddressHistory] = useState<AddressHistoryItem[]>(() => []);
    const { data: availableBalance, refetch } = useBalance({
        address: address as Address,
    });

    const [formData, setFormData] = useState({
        recipient: '',
        amount: '',
    });


    const { data: hash, error, isPending, sendTransaction } = useSendTransaction();


    // Load address history on component mount
    useEffect(() => {
        const savedAddresses = JSON.parse(localStorage.getItem('addressHistory') || '[]');
        setAddressHistory(savedAddresses);
    }, []);

    // Save a new recipient address to localStorage
    const saveAddressToHistory = (address: string) => {
        const updatedHistory = Array.from(new Set([{ id: Date.now().toString(), address, amount: '', timestamp: new Date().toISOString() }, ...addressHistory.filter(item => item.address !== address)])).slice(0, 5); // Keep unique, last 5 addresses
        localStorage.setItem('addressHistory', JSON.stringify(updatedHistory));
        setAddressHistory(updatedHistory);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { recipient, amount } = formData;

        try {
            await sendTransaction({ to: recipient as Hex, value: parseEther(amount) });
            saveAddressToHistory(recipient); // Save recipient to history after successful submission
        } catch (error) {
            console.error('Transaction failed:', error);
        }
    };


    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const chainIdToExplorer = {
        1: "https://etherscan.io", // Ethereum Mainnet
        5: "https://goerli.etherscan.io", // Goerli Testnet
        11155111: "https://sepolia.etherscan.io", // Sepolia Testnet
        56: "https://bscscan.com", // Binance Smart Chain Mainnet
        97: "https://testnet.bscscan.com", // Binance Smart Chain Testnet
        // Add other chains as needed
        43114: "https://snowtrace.io", // Avalanche C-Chain Mainnet
        17000: "https://holesky.etherscan.io", // Holesky Testnet
    };


    // toast
    useEffect(() => {
        if (isConfirmed) {



            toast("", {
                description: (
                    <div className="items-center gap-2 cursor-pointer hover:text-[#39A6FF] px-2">
                        <div className="text-white font-semibold">Transaction confirmed</div>
                        <div
                            className="py-1 flex gap-2"
                            onClick={() => {
                                const explorerBaseUrl = chainId ? chainIdToExplorer[chainId as keyof typeof chainIdToExplorer] || "https://etherscan.io" : "https://etherscan.io";
                                window.open(`${explorerBaseUrl}/tx/${hash}`);
                            }}
                        >
                            <div>View on {chainIdToExplorer[chainId as keyof typeof chainIdToExplorer]?.replace("https://", "") || "etherscan.io"}</div>
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
                        <div
                            className="py-1 flex gap-2"
                            onClick={() => {
                                const explorerBaseUrl = chainId ? chainIdToExplorer[chainId as keyof typeof chainIdToExplorer] || "https://etherscan.io" : "https://etherscan.io";
                                window.open(`${explorerBaseUrl}/tx/${hash}`);
                            }}
                        >
                            <div>View on {chainIdToExplorer[chainId as keyof typeof chainIdToExplorer]?.replace("https://", "") || "etherscan.io"}</div>
                            <FaExternalLinkAlt size={13} />
                        </div>

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
                                    list="address-history" // Add this for the datalist
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg
                                        focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                                        text-gray-100 placeholder-gray-400"
                                    placeholder="0x..."
                                    required
                                />
                                <datalist id="address-history">
                                    {addressHistory.map((address, index) => (
                                        <option key={index} value={address.address} />
                                    ))}
                                </datalist>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Amount
                                </label>

                                <div className='relative'>
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

                        {/* {hash && <div className="mt-4 text-sm text-gray-300">Transaction Hash: {hash}</div>} */}
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
