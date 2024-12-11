import { useAccountContext } from "@/app/AccountContext";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { StyledButton } from "./ui/StyleButton";

export const CustomConnectButton = ({ }: { className?: string }) => {
    const { setAccount, setChain, setDisconnected } = useAccountContext();


    return (
        <ConnectButton.Custom>
            {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
                const ready = mounted && authenticationStatus !== "loading";
                const connected = ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");

                if (!mounted) {
                    setDisconnected(false);
                }

                if (account) {
                    setAccount(account.address);
                }
                if (chain) {
                    setChain(chain.id);
                }

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
                                    <StyledButton onClick={openConnectModal} className="rounded-lg w-full md:w-auto">
                                        Connect Wallet
                                    </StyledButton>
                                );
                            }

                            if (chain.unsupported) {
                                return (
                                    <StyledButton onClick={openChainModal} className="rounded-lg w-full md:w-auto">
                                        Wrong Network
                                    </StyledButton>
                                );
                            }

                            return (
                                <div className="flex flex-col gap-2 items-center md:flex-row md:gap-4">
                                    <StyledButton onClick={openChainModal} className="flex items-center gap-1 rounded-lg text-[17px] font-mono justify-center">
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

                                    <StyledButton onClick={openAccountModal} className="rounded-lg font-mono text-[17px] justify-center">
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