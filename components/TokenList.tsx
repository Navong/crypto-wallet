import React from 'react';

interface Token {
    token_address: string;
    symbol: string;
    name: string;
    logo: string;
    thumbnail: string;
    decimals: string;
    balance: string;
    possible_spam: string;
    verified_contract: boolean;
    balance_formatted: string;
    usd_price: number;
    usd_price_24hr_percent_change: number;
    usd_price_24hr_usd_change: number;
    usd_value: number;
    usd_value_24hr_usd_change: number;
    native_token: boolean;
    portfolio_percentage: number;
}

interface TokenListProps {
    tokens: Token[];
}

const TokenList: React.FC<TokenListProps> = ({ tokens }) => {
    return (
        <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-600">
            <div className="mt-4">
                <h2 className="text-white text-lg font-semibold">Tokens</h2>
                <div className="grid grid-cols-1 gap-4 mt-2">
                    {tokens.map((token) => {
                        const balanceInUSD = token.usd_price * parseFloat(token.balance_formatted);
                        return token.logo && (
                            <div key={token.token_address} className="bg-gray-700 p-4 rounded-lg">
                                <div className="flex items-center mt-2 font-mono text-lg">
                                    <img src={token.logo} alt={`${token.symbol} logo`} className="w-4 h-4 mr-2" />
                                    <div className="text-white">{token.symbol}: {token.balance_formatted}</div>
                                </div>
                                <div className="text-gray-400 font-mono text-lg">Value: ${balanceInUSD.toFixed(2)}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TokenList;