import { useAccount, useConnect, useDisconnect, useBalance } from "wagmi";
import { formatUnits } from "viem";
import { baseSepolia } from "@/lib/wagmi";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet, ChevronDown, LogOut, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function WalletButton() {
  const { address, isConnected, chain } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address, chainId: baseSepolia.id });
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  const formattedBalance = balance ? `${parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} ${balance.symbol}` : "";

  if (!isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" className="glow-blue-sm gap-2 bg-primary text-primary-foreground font-semibold" disabled={isPending}>{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}{isPending ? "Connecting..." : "Connect Wallet"}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52 bg-card border-border">
          <DropdownMenuLabel className="text-muted-foreground text-xs">Select Wallet</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {connectors.map((connector) => (<DropdownMenuItem key={connector.uid} onClick={() => connect({ connector, chainId: baseSepolia.id })} className="cursor-pointer gap-2"><Wallet className="h-4 w-4 text-primary" />{connector.name}</DropdownMenuItem>))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const isWrongNetwork = chain?.id !== baseSepolia.id;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("gap-2 font-mono text-sm border-border", isWrongNetwork && "border-destructive text-destructive")}>
          {isWrongNetwork ? <span className="h-2 w-2 rounded-full bg-destructive" /> : <span className="relative h-2 w-2 pulse-ring"><span className="h-2 w-2 rounded-full bg-green-400 block" /></span>}
          {isWrongNetwork ? "Wrong Network" : shortAddress}
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 bg-card border-border">
        <DropdownMenuLabel><div className="flex flex-col gap-1"><span className="text-xs text-muted-foreground">Connected Wallet</span><span className="font-mono text-sm text-foreground">{shortAddress}</span>{formattedBalance && <span className="text-xs text-primary">{formattedBalance}</span>}</div></DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel><div className="flex items-center gap-2"><div className={cn("h-2 w-2 rounded-full", isWrongNetwork ? "bg-destructive" : "bg-green-400")} /><span className="text-xs text-muted-foreground">{isWrongNetwork ? "Wrong Network — switch to Base Sepolia" : "Base Sepolia Testnet"}</span></div></DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => window.open(`https://sepolia.basescan.org/address/${address}`, "_blank")} className="cursor-pointer gap-2 text-sm"><ExternalLink className="h-4 w-4 text-muted-foreground" />View on BaseScan</DropdownMenuItem>
        <DropdownMenuItem onClick={() => disconnect()} className="cursor-pointer gap-2 text-sm text-destructive focus:text-destructive"><LogOut className="h-4 w-4" />Disconnect</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
