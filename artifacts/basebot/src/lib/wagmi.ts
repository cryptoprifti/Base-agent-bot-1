import { http, createConfig } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { injected, coinbaseWallet, mock } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    mock({
      accounts: [
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      ],
    }),
    coinbaseWallet({
      appName: "BaseBot",
      appLogoUrl: "https://base.org/favicon.ico",
      preference: 'all',
    }),
  ],
  transports: {
    [baseSepolia.id]: http("https://sepolia.base.org"),
  },
});

export { baseSepolia };
