# BaseBot

BaseBot is an autonomous agent application built on Base. Users connect their wallet and issue natural language tasks to the agent, which processes them and prepares onchain actions such as USDC transfers, NFT mints, token swaps, and ETH staking on the Base Sepolia testnet.

## Features

* AI Chat Interface: Natural language task execution with step by step reasoning.
* Wallet Connect: Non custodial wallet connection via wagmi (MetaMask, Coinbase Wallet) on Base Sepolia.
* Onchain Actions: USDC transfers, NFT minting, token swaps, ETH staking with BaseScan transaction links.
* Persistent History: Chat history saved to localStorage.
* Dark UI: Dark theme with Base brand colors.

## Tech Stack

* Framework: React 19, Vite 7
* Styling: Tailwind CSS v4, shadcn/ui
* Animations: Framer Motion
* Wallet: wagmi v3, viem v2
* Network: Base Sepolia Testnet
* State: React state, localStorage

## Getting Started

### Prerequisites

* Node.js 18+
* pnpm 9+

### Installation

```bash
git clone https://github.com/your-username/basebot
cd basebot
pnpm install
pnpm --filter @workspace/basebot run dev
```

The application will be available at `http://localhost:<PORT>`.

### Environment Variables

No environment variables are required. The application uses the Base Sepolia public RPC and localStorage for persistence.

## Deploying to Vercel

### Step 1: Build the project

```bash
pnpm --filter @workspace/basebot run build
```

This outputs static files to `artifacts/basebot/dist/public/`.

### Step 2: Deploy to Vercel

Use the Vercel CLI:

```bash
npm install -g vercel
cd artifacts/basebot
vercel --prod
```

### Step 3: Configure Vercel for SPA routing

Create `artifacts/basebot/public/vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## Usage

1. Click Connect Wallet in the top right. Select MetaMask or Coinbase Wallet. Ensure the network is set to Base Sepolia testnet (Chain ID: 84532).
2. Type a natural language command in the chat, such as:
   * Send 10 USDC to 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
   * Mint an NFT called Base Genesis
   * Swap 0.01 ETH for USDC
   * Stake 0.05 ETH
3. The agent processes the task and returns a transaction receipt with a link to BaseScan.

## Project Structure

```
artifacts/basebot/
├── src/
│   ├── components/
│   │   ├── Chat.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── TransactionBadge.tsx
│   │   └── WalletButton.tsx
│   ├── lib/
│   │   ├── agent.ts
│   │   ├── storage.ts
│   │   └── wagmi.ts
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   └── Features.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Extending BaseBot

### Replace Mock AI

Modify `src/lib/agent.ts` with an API call:

```typescript
const response = await fetch("/api/agent", {
  method: "POST",
  body: JSON.stringify({ message, address }),
});
```

### Enable Real Transaction Signing

Replace mock tx hashes with wagmi `writeContract` or `sendTransaction` calls:

```typescript
import { useWriteContract } from "wagmi";
const { writeContract } = useWriteContract();
```

### Add Base Mainnet

Add `base` from `wagmi/chains` to the wagmi config alongside `baseSepolia`.

## License

MIT
