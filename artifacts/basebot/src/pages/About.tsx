import { motion } from "framer-motion";

export function About() {
  return (
    <main className="flex flex-col min-h-screen pt-24 pb-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-3xl"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-foreground">About BaseBot</h2>
        
        <div className="rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          
          <div className="relative space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-lg text-foreground font-medium">
              BaseBot is an AI agent built to interact with the Base network.
            </p>
            
            <p>
              The application executes onchain operations including transactions, NFT minting, and token swaps via natural language commands. The agent processes user intent and constructs the necessary transaction data for the Base Sepolia network.
            </p>
            
            <p>
              The application provides multiple interfaces:
            </p>
            
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>Web Application:</strong> A fully-featured standalone interface.</li>
              <li><strong>Farcaster Frame:</strong> Interact directly within your social feed.</li>
              <li><strong>Telegram Mini App:</strong> Execute commands right from your chats.</li>
            </ul>
            
            <p>
              BaseBot connects to standard wallets and parses text inputs to assist developers and users with Base network operations.
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
