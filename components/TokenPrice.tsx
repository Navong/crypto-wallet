import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define types for the token data
interface Token {
    id: string;
    rank: string;
    symbol: string;
    name: string;
    supply: string;
    maxSupply: string;
    marketCapUsd: string;
    volumeUsd24Hr: string;
    priceUsd: string;
    changePercent24Hr: string;
    vwap24Hr: string;
    explorer: string;
}

interface TokenPriceProps {
    tokenId: string; // Token ID to fetch price for
    currentBalance: string; // Current balance of the token
}

const TokenPrice: React.FC<TokenPriceProps> = ({ tokenId, currentBalance }) => {
    const [price, setPrice] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTokenPrice = async () => {
            try {
                const response = await axios.get('https://api.coincap.io/v2/assets');
                const tokens: Token[] = response.data.data;
                const token = tokens.find((t) => t.symbol === tokenId.toUpperCase());

                if (token) {
                    setPrice(token.priceUsd);
                } else {
                    setError(`Token with ID "${tokenId}" not found.`);
                }
            } catch (err) {
                setError('Failed to fetch token price. Please try again later.');
                console.error(err);
            }
        };

        fetchTokenPrice();
    }, [tokenId]);

    return (
        <div className='text-sm text-blue-500'>
            {price ? `$${(parseFloat(price) * parseFloat(currentBalance)).toFixed(2)}` : error ? error : 'Loading...'}
        </div>
    );
};

export default TokenPrice;
