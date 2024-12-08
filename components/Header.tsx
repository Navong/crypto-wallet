"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Wallet, Settings, History, Menu, X } from 'lucide-react';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { StyledButton } from './ui/StyleButton';
import { useAccountContext } from '@/app/AccountContext';


export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    return (
        <header className="bg-transparent text-gray-100 py-4">
            <div className="container mx-auto px-4">
                <nav className="flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold flex items-center gap-2">
                        <Wallet size={24} className="text-indigo-400" />
                        <span className="hidden sm:inline">CryptoWallet</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* <Link href="/transactions" className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 transition-colors">
                            <History size={20} />
                            History
                        </Link>
                        <Link href="/settings" className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 transition-colors">
                            <Settings size={20} />
                            Settings
                        </Link> */}
                        <CustomConnectButton />
                    </div>

                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-gray-300 hover:text-indigo-400"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </nav>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden pt-4 pb-2">
                        <div className="flex flex-col gap-4">
                            <Link
                                href="/transactions"
                                className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 px-2 py-1 justify-center"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <History size={20} />
                                History
                            </Link>
                            <Link
                                href="/settings"
                                className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 px-2 py-1 justify-center"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <Settings size={20} />
                                Settings
                            </Link>
                            <div className='flex items-center justify-center'>
                                <CustomConnectButton />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}

export const CustomConnectButton = ({ className }: { className?: string }) => {
    const { setAccount, setChain } = useAccountContext();

    return (
        <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
                const ready = mounted && authenticationStatus !== "loading";
                const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");

                useEffect(() => {
                    if (connected) {
                        // Update account and chain in context
                        setAccount(account.address);
                        setChain(chain.id);
                    }
                }, [account, chain, connected, setAccount, setChain]); // Include all dependencies

                return (
                    <div
                        {...(!ready && {
                            "aria-hidden": true,
                            style: {
                                opacity: 0,
                                pointerEvents: "none",
                                userSelect: "none",
                            },
                        })}
                    >
                        {(() => {
                            if (!connected) {
                                return (
                                    <StyledButton onClick={openConnectModal} className="rounded-lg">
                                        Connect Wallet
                                    </StyledButton>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <StyledButton onClick={openChainModal} className="rounded-lg">
                                        Wrong Network
                                    </StyledButton>
                                );
                            }

                            return (
                                <div className="flex items-center gap-2 md:flex-row flex-col">
                                    <StyledButton onClick={openChainModal} className="flex items-center gap-1 rounded-lg">
                                        {chain.hasIcon && chain.iconUrl && (
                                            <img
                                                alt={chain.name ?? "Chain icon"}
                                                src={chain.iconUrl}
                                                style={{
                                                    width: 16,
                                                    height: 16,
                                                    borderRadius: "50%",
                                                    marginRight: "4px",
                                                }}
                                            />
                                        )}
                                        {chain.name}
                                    </StyledButton>

                                    <StyledButton onClick={openAccountModal} className="rounded-lg">
                                        {account.displayName}
                                        {account.displayBalance ? ` (${account.displayBalance})` : ""}
                                    </StyledButton>
                                </div>
                            );
                        })()}
                    </div>
                );
            }}
        </ConnectButton.Custom>
    );
};
