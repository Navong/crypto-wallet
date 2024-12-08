"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { darkTheme, getDefaultConfig, lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { bsc, bscTestnet, holesky, localhost, sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { http } from "wagmi";
import { hashFn } from "wagmi/query";
import { AccountProvider } from "./AccountContext";
import { Toaster } from "@/components/ui/sonner";


import { avalanche, avalancheFuji } from "wagmi/chains";

const config = getDefaultConfig({
    appName: "test",
    projectId: "YOUR_PROJECT_ID",
    chains: [sepolia, bsc, avalanche, localhost],
    transports: {
        [bsc.id]: http("https://bsc-dataseed1.binance.org"),
        [bscTestnet.id]: http("https://data-seed-prebsc-1-s1.bnbchain.org:8545"),
        [localhost.id]: http("http://127.0.0.1:1111"),
        [avalanche.id]: http("https://api.avax.network/ext/bc/C/rpc"),
        // [avalancheFuji.id]: http("https://api.avax-test.network/ext/bc/C/rpc"),
        [sepolia.id]: http("https://rpc.sepolia.org"),
        [holesky.id]: http("https://rpc.holesky.ethdevops.io"),
    },
    ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            queryKeyHashFn: hashFn,
        },
    },
});

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div>
            {/* <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange> */}
            {/* <AppRouterCacheProvider> */}
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitProvider
                        modalSize="compact"
                        theme={darkTheme({
                            accentColor: '#fff',
                            accentColorForeground: 'black',
                            borderRadius: 'small',
                            fontStack: 'system',
                            overlayBlur: 'small',
                        })}
                    >
                        <AccountProvider>
                            {children}
                        </AccountProvider>
                        <Toaster position="top-right" />
                    </RainbowKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
            {/* </AppRouterCacheProvider> */}
            {/* </ThemeProvider> */}
            {/* <ProgressBar height="3px" color="#64748b" options={{ showSpinner: false }} shallowRouting /> */}
        </div>
    );
}
