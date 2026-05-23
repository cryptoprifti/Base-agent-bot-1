export type ActionType = "transfer" | "mint" | "swap" | "stake" | "chart" | "none";

export interface AgentAction {
  type: ActionType;
  description: string;
  txHash: string;
  explorerUrl: string;
  details: Record<string, string>;
}

export interface AgentResponse {
  text: string;
  action?: AgentAction;
}

export interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

function randomHex(length: number): string {
  const chars = "0123456789abcdef";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * 16)]).join("");
}

function generateTxHash(): string {
  return `0x${randomHex(64)}`;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface RawAgentResponse {
  text: string;
  action?: {
    type: ActionType;
    description: string;
    details: Record<string, string>;
  };
}

function attachTxData(action: RawAgentResponse["action"]): AgentAction | undefined {
  if (!action) return undefined;
  const txHash = generateTxHash();
  return {
    type: action.type,
    description: action.description,
    txHash,
    explorerUrl: `https://sepolia.basescan.org/tx/${txHash}`,
    details: action.details ?? {},
  };
}

export async function processAgentTask(
  message: string,
  walletAddress: string | undefined,
  history: ChatHistoryItem[],
  onThinking: (step: string) => void,
  onStream: (partial: string) => void
): Promise<AgentResponse> {
  onThinking("Connecting to Base Sepolia...");
  await sleep(300);

  if (!walletAddress) {
    onThinking("Checking wallet...");
    await sleep(200);
    const msg = "Please connect your wallet first to perform onchain actions.";
    for (let i = 1; i <= msg.length; i += 2) {
      onStream(msg.slice(0, i));
      await sleep(10);
    }
    onStream(msg);
    return { text: msg };
  }

  onThinking("Parsing intent with AI...");
  await sleep(600);
  onThinking("Generating mock response...");
  
  const lowerMsg = message.toLowerCase();
  let rawResponse: RawAgentResponse;

  if (lowerMsg.includes("transfer") || lowerMsg.includes("send")) {
    rawResponse = {
      text: "I've initiated the USDC transfer for you.",
      action: {
        type: "transfer",
        description: "Transfer USDC",
        details: { "Amount": "10 USDC", "Status": "Confirmed ✓", "Network": "Base Sepolia Testnet" }
      }
    };
  } else if (lowerMsg.includes("mint") || lowerMsg.includes("nft")) {
    rawResponse = {
      text: "I've successfully minted the Base Genesis NFT for you.",
      action: {
        type: "mint",
        description: "Mint NFT",
        details: { "Collection": "BaseBot Genesis", "Status": "Confirmed ✓", "Network": "Base Sepolia Testnet" }
      }
    };
  } else if (lowerMsg.includes("swap") || lowerMsg.includes("trade")) {
    rawResponse = {
      text: "I've swapped your ETH for USDC on Uniswap V3.",
      action: {
        type: "swap",
        description: "Swap Tokens",
        details: { "Amount In": "0.01 ETH", "Amount Out": "≈ 30 USDC", "Status": "Confirmed ✓", "Network": "Base Sepolia Testnet" }
      }
    };
  } else if (lowerMsg.includes("stake")) {
    rawResponse = {
      text: "I've staked your ETH with Lido.",
      action: {
        type: "stake",
        description: "Stake ETH",
        details: { "Amount": "0.05 ETH", "Protocol": "Lido", "Status": "Confirmed ✓", "Network": "Base Sepolia Testnet" }
      }
    };
  } else if (lowerMsg.includes("price") || lowerMsg.includes("chart")) {
    rawResponse = {
      text: "Here is the 24h price chart for ETH on Base.",
      action: {
        type: "chart",
        description: "ETH/USD 24h Price",
        details: { "Current": "$3,450.00", "24h Change": "+5.2%", "Network": "Base" }
      }
    };
  } else {
    rawResponse = {
      text: "I am BaseBot, your autonomous AI agent on Base. I can help you send USDC, mint NFTs, swap tokens, or stake ETH. What would you like to do?"
    };
  }

  // Simulate streaming text response
  for (let i = 1; i <= rawResponse.text.length; i += 2) {
    onStream(rawResponse.text.slice(0, i));
    await sleep(15);
  }
  onStream(rawResponse.text);

  if (rawResponse.action) {
    onThinking(`Executing ${rawResponse.action.type} on Base Sepolia...`);
    await sleep(600);
    onThinking("Broadcasting transaction (mock)...");
    await sleep(500);
    onThinking("Awaiting confirmation...");
    await sleep(400);
  }

  return {
    text: rawResponse.text,
    action: attachTxData(rawResponse.action),
  };
}
