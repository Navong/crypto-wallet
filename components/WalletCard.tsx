"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, CheckCircle, Loader } from "lucide-react";
import { useBalance } from "wagmi";
import { Address } from "viem";
import { toast } from "sonner";
import { FaCheckCircle } from "react-icons/fa";
import TokenPrice from "./TokenPrice";


interface WalletCardProps {
    address: string;
    ethPrice: string | undefined;
    chainId: number | undefined;
}


const tokenSymbols: { [key: string]: { name: string; symbol: string } } = {
    eth: { name: "ethereum", symbol: "eth" },
    btc: { name: "bitcoin", symbol: "btc" },
    usdt: { name: "tether", symbol: "usdt" },
    usdc: { name: "usd coin", symbol: "usdc" },
    bnb: { name: "bnb", symbol: "bnb" },
    ada: { name: "cardano", symbol: "ada" },
    sol: { name: "solana", symbol: "sol" },
    xrp: { name: "ripple", symbol: "xrp" },
    dot: { name: "polkadot", symbol: "dot" },
    doge: { name: "dogecoin", symbol: "doge" },
    avax: { name: "avalanche", symbol: "avax" }
};


export function WalletCard({ address, chainId }: WalletCardProps) {
    const [copied, setCopied] = useState(false);
    const { data: balanceData, isError, isLoading, refetch } = useBalance({
        address: address as Address,
    });

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    // refetch when receiving new tokens
    const [previousBalance, setPreviousBalance] = useState<string | undefined>();
    const [previousChainId, setPreviousChainId] = useState<number | undefined>(chainId);

    // Handle token reception
    useEffect(() => {
        if (
            previousBalance &&
            balanceData?.formatted !== previousBalance &&
            chainId === previousChainId // Ensure the chain ID hasn't changed
        ) {
            toast("", {
                description: (
                    <div className="items-center gap-2 cursor-pointer hover:text-[#39A6FF] px-2">
                        <div className="text-white font-semibold">
                            Received {(parseFloat(balanceData?.formatted || "0") - parseFloat(previousBalance || "0")).toFixed(4)} {balanceData?.symbol}
                        </div>
                    </div>
                ),
                duration: 4000,
                icon: <FaCheckCircle className="text-green-600 h-[1.12rem] w-[1.12rem]" />,
            });
        }

        // Update previous balance only when chainId stays the same
        if (chainId === previousChainId) {
            setPreviousBalance(balanceData?.formatted);
        }
    }, [balanceData, chainId, previousBalance, previousChainId]);

    // Handle chain ID changes
    useEffect(() => {
        if (chainId !== previousChainId) {
            setPreviousBalance(undefined); // Reset balance tracking when the chain changes
            setPreviousChainId(chainId); // Update the chain ID
        }
    }, [chainId, previousChainId]);


    return (
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
            <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
                    <h2 className="text-xl font-semibold text-gray-100">Wallet Overview</h2>
                    <span className="text-sm text-gray-400">Main Account</span>
                </div>
                {!address ? (
                    <div className="text-center py-8">
                        <p className="text-gray-400 text-lg">Please connect your wallet to view details</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="text-gray-400">
                            <div className="font-mono">Wallet Address:</div>
                            <div className="flex">
                                <div className="hidden md:block">
                                    <div className="font-mono break-all text-xl sm:text-xl text-white">
                                        {address}
                                    </div>
                                </div>
                                <div className="block md:hidden">
                                    <div className="font-mono break-all text-xl sm:text-xl text-white">
                                        {address?.length > 10 ? `${address.slice(0, 10)}....${address.slice(-10)}` : address}
                                    </div>
                                </div>
                                <button
                                    onClick={handleCopy}
                                    className="ml-2 flex items-center justify-center w-6 h-6 bg-gray-700 
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
                        <div className="text-gray-400">
                            <div className="font-mono">Balance:</div>
                            {isLoading ? (
                                <div className="flex items-center text-gray-400">
                                    <Loader size={20} className="animate-spin mr-2" /> Loading...
                                </div>
                            ) : isError ? (
                                <div className="text-red-500">Failed to load balance</div>
                            ) : (
                                <div className="font-mono text-xl sm:text-xl text-white gap-y-2">
                                    <div className="py-3">
                                        <img
                                            src={balanceData?.symbol ? `https://cryptologos.cc/logos/${tokenSymbols[balanceData.symbol.toLowerCase()]?.name}-${balanceData.symbol.toLowerCase()}-logo.svg` : ''}
                                            alt={`${balanceData?.symbol} logo`}
                                            className="inline-block w-5 h-5 mr-2"
                                        />
                                        {balanceData?.formatted} {balanceData?.symbol}
                                    </div>
                                    <TokenPrice tokenId={balanceData?.symbol ?? ''} currentBalance={balanceData?.formatted ?? ''} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <div className="pt-4">
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                    <Link href="/sent" className="flex-1">
                        <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100 py-2 rounded-lg transition-colors">
                            Sent
                        </button>
                    </Link>
                    <Link href="/receive" className="flex-1">
                        <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-100 py-2 rounded-lg transition-colors">
                            Receive
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
