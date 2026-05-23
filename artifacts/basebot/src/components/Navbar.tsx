import { WalletButton } from "@/components/WalletButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Link, useLocation } from "wouter";

export function Navbar() {
  const [location] = useLocation();
  
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
            <Zap className="h-5 w-5 text-primary" fill="currentColor" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold tracking-tight text-foreground">
              BaseBot
            </span>
            <span className="text-[10px] text-muted-foreground leading-none">
              Powered by Base chain
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${location === '/' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            App
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors ${location === '/about' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            About
          </Link>
          <Link
            href="/features"
            className={`text-sm font-medium transition-colors ${location === '/features' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Features
          </Link>
          <Link
            href="/contact"
            className={`text-sm font-medium transition-colors ${location === '/contact' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <WalletButton />
        </div>
      </div>
    </motion.header>
  );
}
