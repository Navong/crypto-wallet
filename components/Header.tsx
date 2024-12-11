"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Wallet, Settings, History, Menu, X } from 'lucide-react';
import { CustomConnectButton } from './CustomConnectButton';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-transparent text-gray-100 py-4">
            <div className="container mx-auto px-4">
                <nav className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="text-xl font-bold flex items-center gap-2">
                        <Wallet size={24} className="text-indigo-400" />
                        <span className="sm:inline">CryptoWallet</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 px-4 py-2"
                            onClick={closeMenu}
                        >
                            <History size={20} />
                            History
                        </Link>
                        <CustomConnectButton />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="md:hidden p-2 text-gray-300 hover:text-indigo-400"
                    >
                        <Menu size={24} />
                    </button>
                </nav>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="fixed inset-0 z-50">
                        {/* Overlay */}
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50"
                            onClick={closeMenu}
                        ></div>

                        {/* Modal Content */}
                        <div className="absolute top-0 right-0 w-full bg-gray-900 text-white h-full shadow-lg p-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold">Menu</h2>
                                <button
                                    onClick={closeMenu}
                                    className="p-2 text-gray-300 hover:text-indigo-400"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="mt-4 flex flex-col items-center gap-4">
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 px-4 py-2"
                                    onClick={closeMenu}
                                >
                                    <History size={20} />
                                    History
                                </Link>
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 text-gray-300 hover:text-indigo-400 px-4 py-2"
                                    onClick={closeMenu}
                                >
                                    <Settings size={20} />
                                    Settings
                                </Link>
                                <div className="mt-4">
                                    <CustomConnectButton />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </header>
    );
}


