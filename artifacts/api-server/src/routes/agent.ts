import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const agentRouter = Router();

const SYSTEM_PROMPT = `You are BaseBot, an autonomous AI agent that executes onchain actions on Base (an Ethereum L2 blockchain).

You have the ability to perform the following onchain actions on Base Sepolia testnet:
- USDC transfers (send USDC to any address)
- NFT minting (mint NFTs from collections)
- Token swaps (swap ETH for USDC or other tokens via Uniswap V3)
- ETH staking (stake ETH for yield via Lido)

When the user gives you a task, respond with a JSON object in this exact format:
{
  "text": "Your conversational response explaining what you did or will do",
  "action": {
    "type": "transfer" | "mint" | "swap" | "stake",
    "description": "Short description of the action",
    "details": {
      "key": "value pairs describing the transaction details"
    }
  }
}

If no onchain action is needed (e.g. the user is just chatting or asking a question), omit the "action" field entirely:
{
  "text": "Your conversational response"
}

Rules:
- Always respond with valid JSON only — no markdown, no code blocks, just raw JSON.
- For transfers: extract the amount and recipient address from the user's message. Default to a random amount between 5-50 USDC if not specified.
- For mints: extract the NFT name. Default to "BaseBot Genesis #[random number]" if not specified.
- For swaps: suggest reasonable amounts (e.g. 0.01-0.05 ETH).
- For stakes: suggest reasonable amounts (e.g. 0.01-0.1 ETH).
- Be enthusiastic and knowledgeable about Base, the L2 ecosystem, and DeFi.
- If no wallet is connected (walletAddress is null), tell the user to connect their wallet first.
- Always include network info: "Base Sepolia Testnet" in your transaction details.
- Add "Status": "Confirmed ✓" to all transaction details.
- Keep text responses concise but informative. Use **bold** for key values.
- If the user asks what you can do, explain all four action types clearly.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

agentRouter.post("/agent/chat", async (req, res) => {
  const { message, walletAddress, history = [] } = req.body as {
    message: string;
    walletAddress?: string;
    history?: ChatMessage[];
  };

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "message is required" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  // Validate walletAddress format to prevent prompt injection
  const validAddress =
    typeof walletAddress === "string" && /^0x[a-fA-F0-9]{40}$/.test(walletAddress)
      ? walletAddress
      : undefined;

  const userContext = validAddress
    ? `User's wallet address: ${validAddress} (connected to Base Sepolia)`
    : "User's wallet: NOT CONNECTED";

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    {
      role: "system",
      content: `${SYSTEM_PROMPT}\n\nCurrent context: ${userContext}`,
    },
    ...history.slice(-10).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: message },
  ];

  let fullText = "";

  try {
    const stream = await openai.chat.completions.create({
      model: process.env.OPENROUTER_MODEL || "meta-llama/llama-3-8b-instruct:free",
      max_completion_tokens: 1024,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullText += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true, fullText })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "OpenAI agent error");
    res.write(`data: ${JSON.stringify({ error: "Agent error, please try again." })}\n\n`);
    res.end();
  }
});

export default agentRouter;
