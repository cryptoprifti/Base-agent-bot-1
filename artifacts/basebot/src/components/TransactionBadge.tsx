import { useState } from "react";
import type { AgentAction } from "@/lib/agent";
import { motion } from "framer-motion";
import { ExternalLink, ArrowUpRight, ImageIcon, ArrowLeftRight, TrendingUp, Share, LineChart as ChartIcon } from "lucide-react";
import { AreaChart, Area, Tooltip, ResponsiveContainer, YAxis } from "recharts";
import { cn } from "@/lib/utils";

const MOCK_CHART_DATA = [
  { time: "00:00", price: 3300 },
  { time: "02:00", price: 3320 },
  { time: "04:00", price: 3350 },
  { time: "06:00", price: 3310 },
  { time: "08:00", price: 3280 },
  { time: "10:00", price: 3340 },
  { time: "12:00", price: 3410 },
  { time: "14:00", price: 3380 },
  { time: "16:00", price: 3390 },
  { time: "18:00", price: 3430 },
  { time: "20:00", price: 3450 },
  { time: "22:00", price: 3420 },
  { time: "24:00", price: 3480 },
];

const ACTION_ICONS = {
  transfer: ArrowUpRight,
  mint: ImageIcon,
  swap: ArrowLeftRight,
  stake: TrendingUp,
  chart: ChartIcon,
  none: ArrowUpRight,
};

const ACTION_COLORS = {
  transfer: "text-blue-400 bg-blue-400/10 ring-blue-400/20",
  mint: "text-purple-400 bg-purple-400/10 ring-purple-400/20",
  swap: "text-cyan-400 bg-cyan-400/10 ring-cyan-400/20",
  stake: "text-green-400 bg-green-400/10 ring-green-400/20",
  chart: "text-indigo-400 bg-indigo-400/10 ring-indigo-400/20",
  none: "text-muted-foreground bg-muted/10 ring-border",
};

interface TransactionBadgeProps {
  action: AgentAction;
}

export function TransactionBadge({ action }: TransactionBadgeProps) {
  const initialStatus = action.details?.["Status"]?.includes("Confirmed") ? "confirmed" : "proposed";
  const [status, setStatus] = useState<"proposed" | "confirmed">(initialStatus);
  
  const Icon = ACTION_ICONS[action.type];
  const colorClass = ACTION_COLORS[action.type];
  const shortHash = `${action.txHash.slice(0, 10)}...${action.txHash.slice(-6)}`;

  if (action.type === 'chart') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.15 }}
        className="mt-3 rounded-xl border border-border/60 bg-card/60 overflow-hidden"
      >
        <div className="flex items-center gap-2.5 px-3 py-2 border-b border-border/40">
          <div className={cn("flex h-6 w-6 items-center justify-center rounded-md ring-1", colorClass)}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-semibold text-foreground">{action.description}</span>
          <span className="ml-auto text-[10px] text-green-400 font-medium bg-green-400/10 px-2 py-0.5 rounded-full ring-1 ring-green-400/20">
            Live Data
          </span>
        </div>
        
        <div className="h-48 w-full p-2 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_CHART_DATA} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <YAxis domain={['dataMin - 20', 'dataMax + 20']} hide />
              <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px', fontSize: '10px', color: 'hsl(var(--foreground))' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number) => [`$${value}`, 'Price']}
                labelStyle={{ display: 'none' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="px-3 py-2 grid grid-cols-1 gap-1 border-t border-border/40 bg-card/40">
          {Object.entries(action.details).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between gap-4">
              <span className="text-[11px] text-muted-foreground shrink-0">{key}</span>
              <span className="text-[11px] font-mono text-foreground/80 truncate text-right max-w-[200px]">
                {value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.15 }}
      className="mt-3 rounded-xl border border-border/60 bg-card/60 overflow-hidden"
    >
      <div className="flex items-center gap-2.5 px-3 py-2 border-b border-border/40">
        <div className={cn("flex h-6 w-6 items-center justify-center rounded-md ring-1", colorClass)}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs font-semibold text-foreground capitalize">{action.type} Proposal</span>
        
        {status === "proposed" ? (
          <span className="ml-auto flex items-center gap-1.5 text-[10px] text-yellow-500 font-medium bg-yellow-500/10 px-2 py-0.5 rounded-full ring-1 ring-yellow-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
            Signature Required
          </span>
        ) : (
          <span className="ml-auto flex items-center gap-1.5 text-[10px] text-green-400 font-medium bg-green-400/10 px-2 py-0.5 rounded-full ring-1 ring-green-400/20">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Confirmed
          </span>
        )}
      </div>

      <div className="px-3 py-2 grid grid-cols-1 gap-1">
        {Object.entries(action.details).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <span className="text-[11px] text-muted-foreground shrink-0">{key}</span>
            <span className="text-[11px] font-mono text-foreground/80 truncate text-right max-w-[200px]">
              {value}
            </span>
          </div>
        ))}
      </div>

      {status === "proposed" ? (
        <div className="px-3 py-3 border-t border-border/40 bg-card/80">
          <div className="mb-3 rounded-md bg-yellow-500/5 p-2 text-[10px] text-yellow-500/90 border border-yellow-500/10">
            <span className="font-semibold text-yellow-500">Simulation Info:</span> Transaction will modify your onchain balance. Estimated gas: ~0.001 ETH.
          </div>
          <button 
            onClick={() => setStatus("confirmed")}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-primary/20"
          >
            Sign & Execute
          </button>
        </div>
      ) : (
        <div className="px-3 py-2 border-t border-border/40 bg-card/40">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">Tx:</span>
              <span className="font-mono text-[10px] text-foreground/60">{shortHash}</span>
            </div>
            <a
              href={action.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors font-medium"
            >
              View on BaseScan
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-border/30">
            <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-muted/30 py-1.5 text-[10px] font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
              <Share className="h-3 w-3" />
              Share Receipt
            </button>
            {action.type === 'mint' && (
              <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 py-1.5 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors">
                View NFT
              </button>
            )}
            {action.type === 'swap' && (
              <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-primary/10 py-1.5 text-[10px] font-medium text-primary hover:bg-primary/20 transition-colors">
                Provide Liquidity
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
