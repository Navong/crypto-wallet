"use client";

import { Header } from "../components/Header";
import { WalletCard } from "../components/WalletCard";
import { useAccount, useBalance } from "wagmi";
import { useEffect, useState, useMemo } from "react";
import Moralis from "moralis";
import TokenList from "@/components/TokenList";
import { useAccountContext } from "./AccountContext";
import { Address } from "viem";

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

export default function Home() {
  const { isConnected } = useAccount();
  const { account: address, chainId } = useAccountContext();

  const formattedChainId = chainId ? `0x${parseInt(chainId.toString()).toString(16)}` : null;

  const [tokens, setTokens] = useState<Token[]>([]);

  const { data: balanceData, isError, isLoading } = useBalance({
    address: address as Address,
  });

  const fetchTokenBalances = useMemo(() => {
    if (!address || !chainId) {
      return null; // Return null if dependencies are not ready
    }

    return async () => {
      try {
        if (!Moralis.Core.isStarted) {
          await Moralis.start({
            apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjQyZTc1ZmE5LWU4OTEtNDA0Yy05MjczLTU3MjFjNjZlYmRjZSIsIm9yZ0lkIjoiNDE5ODEyIiwidXNlcklkIjoiNDMxNzMyIiwidHlwZUlkIjoiMTJhZjBhYmUtZjI3My00Y2YxLWEwZDItYWFmY2FmZjAyYmYwIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MzM1Nzk4MTQsImV4cCI6NDg4OTMzOTgxNH0.wtdDC8igT0VaM4S53rksbRJmyN_2IP-SAbAA2BckCgw',
          });
        }

        const chain = formattedChainId || "";
        const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
          chain,
          address,
        });

        const tokenData: Token[] = response.toJSON().result.map((token: any) => ({
          ...token,
          token_address: token.token_address || "",
        }));

        setTokens(tokenData);
      } catch (e) {
        console.error(e);
      }
    };
  }, [address, chainId]); // Dependencies for useMemo

  // Trigger the fetch when `fetchTokenBalances` changes
  useEffect(() => {
    if (fetchTokenBalances) {
      fetchTokenBalances();
    }
  }, [fetchTokenBalances]);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 sm:gap-8 max-w-xl mx-auto">
          {isConnected ? (
            isLoading ? (
              <div className="text-gray-400">Loading wallet data...</div>
            ) : isError ? (
              <div className="text-red-500">Error fetching wallet data</div>
            ) : (
              <>
                <WalletCard
                  address={address!} // The wallet address
                // balance={balanceData?.formatted || "0.00"} // The balance in human-readable format
                // symbol={balanceData?.symbol || "ETH"} // The token symbol
                />
                <TokenList tokens={tokens} />
              </>
            )
          ) : (
            <WalletCard
              address={address!} // The wallet address
            // balance="0.00" // Default balance when not connected
            // symbol="ETH" // Default token symbol
            />
          )}
        </div>
      </main>
    </div>
  );
}
