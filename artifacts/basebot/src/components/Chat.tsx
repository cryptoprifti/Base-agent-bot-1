import { useState, useRef, useEffect, useCallback, type MutableRefObject } from "react";
import { useAccount } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Trash2, Zap, User, Bot, History, Copy, Mic, MicOff, Settings2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionBadge } from "@/components/TransactionBadge";
import { processAgentTask, type ChatHistoryItem } from "@/lib/agent";
import { loadMessages, saveMessages, clearMessages, loadHistory, saveHistory, clearHistory } from "@/lib/storage";
import type { Message } from "@/types/chat";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  "Send 10 USDC to 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "Mint an NFT called Base Genesis",
  "Swap 0.01 ETH for USDC",
  "Stake 0.05 ETH",
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="typing-dot h-1.5 w-1.5 rounded-full bg-primary/60 inline-block"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}

function ThinkingSteps({ steps }: { steps: string[] }) {
  return (
    <div className="mt-1 space-y-0.5">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: i * 0.05 }}
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60"
        >
          <span className="text-primary/50">→</span>
          {step}
        </motion.div>
      ))}
    </div>
  );
}

interface ChatBubbleProps { message: Message; }

function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";
  
  const renderText = (text: string) => {
    const addressRegex = /(0x[a-fA-F0-9]{40}|\b[a-zA-Z0-9.-]+\.eth\b)/g;
    return text.split(addressRegex).map((part, i) => {
      if (part.match(addressRegex)) {
        return (
          <span key={i} className="inline-flex items-center rounded-md bg-primary/15 px-1.5 py-0.5 text-[11px] font-mono text-primary ring-1 ring-primary/30 mx-0.5 shadow-sm" title={part}>
            {part.startsWith('0x') ? `${part.slice(0, 6)}...${part.slice(-4)}` : part}
          </span>
        );
      }
      return part.split(/(\*\*[^*]+\*\*)/g).map((subPart, j) => 
        subPart.startsWith("**") && subPart.endsWith("**") 
          ? <strong key={`${i}-${j}`}>{subPart.slice(2, -2)}</strong> 
          : <span key={`${i}-${j}`}>{subPart}</span>
      );
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3, ease: "easeOut" }} className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm mt-0.5", isUser ? "bg-primary/20 ring-1 ring-primary/30" : "bg-card ring-1 ring-border")}>{isUser ? <User className="h-4 w-4 text-primary" /> : <Zap className="h-4 w-4 text-primary" fill="currentColor" />}</div>
      <div className={cn("flex flex-col gap-1 max-w-[80%]", isUser && "items-end")}>
        <span className="text-[10px] text-muted-foreground px-1">{isUser ? "You" : "BaseBot"}</span>
        <div className={cn("rounded-2xl px-4 py-2.5 text-sm leading-relaxed", isUser ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border/50 text-foreground rounded-tl-sm")}>
          {message.isThinking ? <div className="flex flex-col gap-1"><TypingIndicator />{message.thinkingSteps && message.thinkingSteps.length > 0 && <ThinkingSteps steps={message.thinkingSteps} />}</div> : <div className="whitespace-pre-wrap leading-relaxed">{renderText(message.text)}</div>}
        </div>
        {message.action && <TransactionBadge action={message.action} />}
        <span className="text-[10px] text-muted-foreground/50 px-1">{new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
    </motion.div>
  );
}

function TransactionHistory({ items }: { items: Message[] }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl">
      <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
        <History className="h-4 w-4 text-primary" />
        <p className="text-sm font-semibold text-foreground">Transaction History</p>
      </div>
      <div className="max-h-72 overflow-y-auto chat-scrollbar divide-y divide-border/40">
        {items.length === 0 ? (
          <div className="px-4 py-8 text-sm text-muted-foreground">No completed transactions yet.</div>
        ) : items.map((item) => (
          <div key={item.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">{item.action?.description ?? "Conversation"}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{new Date(item.timestamp).toLocaleString()}</p>
              </div>
              {item.action && (
                <div className="flex gap-2">
                  <button className="rounded-md border border-border/60 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground" onClick={() => navigator.clipboard.writeText(item.action!.txHash)}>
                    <Copy className="h-3 w-3 inline-block mr-1" />Copy
                  </button>
                  <a className="rounded-md border border-border/60 px-2 py-1 text-[11px] text-primary hover:text-primary/80" href={item.action.explorerUrl} target="_blank" rel="noreferrer">View</a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Chat() {
  const { address } = useAccount();
  const [messages, setMessages] = useState<Message[]>(() => loadMessages());
  const [historyItems, setHistoryItems] = useState<Message[]>(() => loadHistory());
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const messagesRef: MutableRefObject<Message[]> = useRef(messages);

  useEffect(() => { messagesRef.current = messages; saveMessages(messages); }, [messages]);
  useEffect(() => { saveHistory(historyItems); }, [historyItems]);
  useEffect(() => { 
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages]);

  const addMessage = useCallback((msg: Omit<Message, "id">) => {
    const newMsg: Message = { ...msg, id: crypto.randomUUID() };
    setMessages((prev) => [...prev, newMsg]);
    return newMsg.id;
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  }, []);

  const handleVoiceInput = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + (prev && !prev.endsWith(' ') ? " " : "") + transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  }, []);

  const handleSend = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isProcessing) return;
    setInput("");
    setIsProcessing(true);
    const currentMessages = messagesRef.current;
    addMessage({ role: "user", text: trimmed, timestamp: Date.now() });
    const thinkingId = addMessage({ role: "agent", text: "", timestamp: Date.now(), isThinking: true, thinkingSteps: [] });
    const thinkingSteps: string[] = [];
    const history: ChatHistoryItem[] = currentMessages.filter((m) => !m.isThinking && m.text).map((m) => ({ role: m.role === "user" ? "user" : "assistant" as const, content: m.text }));
    try {
      const response = await processAgentTask(trimmed, address, history, (step) => {
        thinkingSteps.push(step);
        updateMessage(thinkingId, { thinkingSteps: [...thinkingSteps] });
      }, (partial) => {
        updateMessage(thinkingId, { isThinking: false, text: partial, thinkingSteps: undefined });
      });
      updateMessage(thinkingId, { isThinking: false, text: response.text, action: response.action, thinkingSteps: undefined });
      setHistoryItems((prev) => [{ id: crypto.randomUUID(), role: "agent", text: response.text, timestamp: Date.now(), action: response.action }, ...prev]);
    } catch {
      updateMessage(thinkingId, { isThinking: false, text: "Something went wrong. Please try again.", thinkingSteps: undefined });
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, address, addMessage, updateMessage]);

  const handleClear = () => { setMessages([]); clearMessages(); };
  const handleClearHistory = () => { setHistoryItems([]); clearHistory(); };
  const isEmpty = messages.length === 0;

  return (
    <section id="chat" className="mx-auto w-full max-w-4xl px-4 pt-24 pb-16 scroll-mt-16">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="rounded-2xl border border-border/60 bg-card/40 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
            <div className="flex items-center gap-2.5"><div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30"><Zap className="h-4 w-4 text-primary" fill="currentColor" /><span className={cn("absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-card", isProcessing ? "bg-yellow-400 animate-pulse" : "bg-green-400")} /></div><div><p className="text-sm font-semibold text-foreground">BaseBot Agent</p><p className="text-[10px] text-muted-foreground">{isProcessing ? "Executing onchain action..." : "Ready · Base Sepolia"}</p></div></div>
            <div className="flex gap-2">
              <button onClick={() => setShowMemory(true)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"><Settings2 className="h-3.5 w-3.5" />Memory</button>
              {!isEmpty && <button onClick={handleClear} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3.5 w-3.5" />Clear</button>}
              {!!historyItems.length && <button onClick={handleClearHistory} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"><History className="h-3.5 w-3.5" />History</button>}
            </div>
          </div>
          <div className="chat-scrollbar flex flex-col gap-4 overflow-y-auto p-4" style={{ minHeight: "380px", maxHeight: "480px" }}>
            {isEmpty ? <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20"><Bot className="h-7 w-7 text-primary" /></div><div><p className="font-semibold text-foreground">BaseBot is ready</p><p className="mt-1 text-sm text-muted-foreground max-w-xs">Give me a task and I&apos;ll execute it onchain on Base Sepolia.{!address && <span className="text-primary block mt-1">Connect your wallet first.</span>}</p></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md mt-2">{QUICK_ACTIONS.map((action) => <button key={action} onClick={() => handleSend(action)} className="rounded-xl border border-border/60 bg-card/50 px-3 py-2 text-left text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all hover:bg-primary/5 truncate">{action.length > 50 ? action.slice(0, 50) + "…" : action}</button>)}</div></div> : <AnimatePresence initial={false}>{messages.map((msg) => <ChatBubble key={msg.id} message={msg} />)}</AnimatePresence>}
            <div ref={bottomRef} />
          </div>
          <div className="border-t border-border/50 p-3">
            {!isEmpty && <div className="mb-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar">{QUICK_ACTIONS.map((action) => <button key={action} onClick={() => handleSend(action)} disabled={isProcessing} className="shrink-0 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all disabled:opacity-50">{action.split(" ").slice(0, 3).join(" ")}…</button>)}</div>}
            
            <div className="relative">
              <AnimatePresence>
                {showCommands && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 mb-3 w-48 rounded-xl border border-border/60 bg-card/95 backdrop-blur-xl p-1.5 shadow-2xl z-10"
                  >
                    <p className="text-[10px] font-semibold text-muted-foreground mb-1.5 px-2.5 pt-1 uppercase tracking-wider">Commands</p>
                    {["/send", "/swap", "/mint", "/stake"].map(cmd => (
                      <button 
                        key={cmd} 
                        className="w-full text-left px-2.5 py-2 text-xs font-medium text-foreground hover:bg-primary/15 hover:text-primary rounded-lg transition-colors"
                        onClick={() => {
                          setInput(cmd + " ");
                          setShowCommands(false);
                        }}
                      >
                        {cmd}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex gap-2 items-end">
                <textarea 
                  value={input} 
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (e.target.value.trim() === "/") setShowCommands(true);
                    else setShowCommands(false);
                  }} 
                  onKeyDown={(e) => { 
                    if (e.key === "Enter" && !e.shiftKey) { 
                      e.preventDefault(); 
                      handleSend(input); 
                      setShowCommands(false);
                    } 
                  }} 
                  placeholder="Give BaseBot a task… e.g. '/send 10 USDC to...'" 
                  rows={1} 
                  disabled={isProcessing} 
                  className="flex-1 resize-none rounded-xl border border-border/60 bg-background/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 transition-all" 
                  style={{ maxHeight: "120px" }} 
                  onInput={(e) => { const t = e.currentTarget; t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight, 120) + "px"; }} 
                />
                
                <div className="flex gap-2 shrink-0 h-[42px]">
                  <Button 
                    onClick={handleVoiceInput} 
                    disabled={isProcessing} 
                    variant="outline" 
                    size="icon" 
                    className={cn("h-full w-[42px] rounded-xl border-border/60", isListening && "border-red-500 text-red-500 hover:bg-red-500/10 hover:text-red-500")}
                  >
                    {isListening ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button 
                    onClick={() => handleSend(input)} 
                    disabled={!input.trim() || isProcessing} 
                    size="icon" 
                    className="h-full w-[42px] rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-40"
                  >
                    <Send className="h-4 w-4 ml-0.5" />
                  </Button>
                </div>
              </div>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground/50">All transactions are simulated on Base Sepolia testnet · Press Enter to send</p>
          </div>
        </motion.div>
        <TransactionHistory items={historyItems.filter((m) => m.action)} />
      </div>

      {/* Agent Memory Modal */}
      <AnimatePresence>
        {showMemory && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <motion.div initial={{scale: 0.95}} animate={{scale: 1}} exit={{scale: 0.95}} className="w-full max-w-sm rounded-2xl border border-border/60 bg-card p-6 shadow-2xl relative">
              <button onClick={() => setShowMemory(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
              <h3 className="text-lg font-semibold text-foreground mb-1">Agent Memory</h3>
              <p className="text-xs text-muted-foreground mb-6">BaseBot learns your preferences to serve you better.</p>
              
              <div className="space-y-3">
                <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-primary font-semibold mb-1">Risk Tolerance</p>
                  <p className="text-sm text-foreground">Prefers low slippage (&lt; 0.5%)</p>
                </div>
                <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-primary font-semibold mb-1">Favorite Tokens</p>
                  <p className="text-sm text-foreground">USDC, ETH, DEGEN</p>
                </div>
                <div className="rounded-lg bg-primary/5 border border-primary/10 p-3">
                  <p className="text-[10px] uppercase tracking-wider text-primary font-semibold mb-1">Known Addresses</p>
                  <p className="text-sm text-foreground">amar.base.eth</p>
                </div>
              </div>
              
              <button onClick={() => setShowMemory(false)} className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                Save & Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
