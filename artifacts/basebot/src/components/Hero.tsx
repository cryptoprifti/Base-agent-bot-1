import { motion } from "framer-motion";
import { ArrowDown, Zap, Shield, Globe } from "lucide-react";

const FEATURES = [
  { icon: Zap, label: "Onchain Actions", desc: "Execute real transactions" },
  { icon: Shield, label: "Non-custodial", desc: "Your keys, your assets" },
  { icon: Globe, label: "Base Network", desc: "Fast & low cost L2" },
];

interface HeroProps {
  onStartChat: () => void;
}

export function Hero({ onStartChat }: HeroProps) {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 pt-28 pb-20 text-center grid-bg">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-6 max-w-3xl"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
          </span>
          Live on Base Sepolia Testnet
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
        >
          Your AI agent
          <br />
          <span className="gradient-text">that acts on Base</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg text-muted-foreground max-w-xl leading-relaxed"
        >
          BaseBot is an autonomous AI agent that executes onchain actions on your behalf, including transfers, mints, and swaps, directly on Base.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={onStartChat}
            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 glow-blue"
          >
            <Zap className="h-4 w-4 fill-current" />
            Launch Agent
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </button>
          <a
            href="https://www.base.org/ecosystem"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-7 py-3.5 text-sm font-semibold text-foreground/80 transition-all hover:border-primary/50 hover:text-foreground"
          >
            Base Ecosystem
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl"
        >
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-md shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30 hover:-translate-y-1"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <div className="flex flex-col gap-1.5 mt-2 text-center">
                <span className="text-base font-bold text-foreground">{label}</span>
                <span className="text-sm text-muted-foreground/90">{desc}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={onStartChat}
        className="absolute bottom-8 flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="text-xs">Scroll to chat</span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </motion.button>
    </section>
  );
}
