"use client";

import { Header } from "../components/Header";
import { WalletCard } from "../components/WalletCard";
import { useAccount, useBalance } from "wagmi";
import { useEffect, useState, useMemo } from "react";
import Moralis from "moralis";
import { useAccountContext } from "./AccountContext";
import { Address } from "viem";

interface Token {
  token_address: string;
  symbol: string;
  name: string;
  logo: string;
  thumbnail?: string;
  decimals: number;
  balance: string;
  possible_spam: boolean;
  verified_contract?: boolean;
  balance_formatted?: string;
  usd_price: number;
  usd_price_24hr_percent_change?: number;
  usd_price_24hr_usd_change?: string;
  usd_value?: number;
  usd_value_24hr_usd_change?: string;
  native_token?: boolean;
  portfolio_percentage?: number;
}

export default function Home() {
  const { isConnected } = useAccount();
  const { account: address, chainId: rawChainId } = useAccountContext();
  const chainId = rawChainId ?? undefined;
  const [tokenUsd, setTokenUsd] = useState<string | undefined>();

  const formattedChainId = chainId ? `0x${parseInt(chainId.toString()).toString(16)}` : null;

  // const [tokens, setTokens] = useState<Token[]>([]);



  const { data, isError, isLoading, refetch } = useBalance({
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
            apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY || '',
          });
        }

        const chain = formattedChainId || "";
        const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
          chain,
          address,
        });

        let tokenData: Token[] = response.toJSON().result.map((token) => ({
          token_address: token.token_address || "",
          symbol: token.symbol || "",
          name: token.name || "",
          logo: token.logo || "",
          thumbnail: token.thumbnail,
          decimals: token.decimals || 0,
          balance: token.balance || "0",
          possible_spam: token.possible_spam || false,
          verified_contract: token.verified_contract,
          balance_formatted: token.balance_formatted,
          usd_price: token.usd_price ? parseFloat(token.usd_price) : 0,
          usd_price_24hr_percent_change: token.usd_price_24hr_percent_change ? parseFloat(token.usd_price_24hr_percent_change) : 0,
          usd_price_24hr_usd_change: token.usd_price_24hr_usd_change,
          usd_value: token.usd_value,
          usd_value_24hr_usd_change: token.usd_value_24hr_usd_change,
          native_token: token.native_token,
          portfolio_percentage: token.portfolio_percentage,
        }));


        if (tokenData.length > 0) {
          setTokenUsd(tokenData[0].usd_price.toString());
        }


        // If chainId is 11155111, fetch ETH price from mainnet (chainId 1)
        if (chainId === 11155111 || chainId === 17000) {
          const ethResponse = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
            address,
            chain: '0x1', // Chain ID for Ethereum Mainnet
          });

          const ethPrice = ethResponse.toJSON().result.find((token) => token.symbol === 'ETH')?.usd_price;
          console.log('ETH Price (from Mainnet):', ethPrice);

          // Optionally, you can store this price for display or calculations
          setTokenUsd(ethPrice);

          // Update the ETH token's price with mainnet price for Sepolia
          tokenData = tokenData.map(token => {
            if (token.symbol === 'ETH' && ethPrice) {
              return {
                ...token,
                usd_price: parseFloat(ethPrice),
                usd_value: parseFloat(ethPrice) * parseFloat(token.balance_formatted || '0')
              };
            }
            return token;
          });
        }

        // setTokens(tokenData);
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
  }, [data, fetchTokenBalances]);


  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
                  ethPrice={tokenUsd} // ETH price for Sepolia
                  chainId={chainId}
                />
                {/* <TokenList tokens={tokens} /> */}
              </>
            )
          ) : (
            <WalletCard
              address={address!} // The wallet address
              ethPrice={tokenUsd} // ETH price for Sepolia
              chainId={chainId}


            // balance="0.00" // Default balance when not connected
            // symbol="ETH" // Default token symbol
            />
          )}
        </div>
      </main>
    </div>
  );
}
