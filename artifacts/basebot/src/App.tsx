import { useEffect, useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/Navbar";
import { Home } from "@/pages/Home";
import { About } from "@/pages/About";
import { Features } from "@/pages/Features";
import { Contact } from "@/pages/Contact";
import { wagmiConfig } from "@/lib/wagmi";
import { sdk } from "@farcaster/miniapp-sdk";
import { init as initTelegram } from "@telegram-apps/sdk";

const queryClient = new QueryClient();

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text">404</h1>
        <p className="mt-2 text-muted-foreground">Page not found</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/features" component={Features} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Resolve context first to establish connection with frame host
        const context = await sdk.context;
        console.log("Farcaster frame context:", context);
        // Then signal the frame host that the app is ready
        sdk.actions.ready();
      } catch (e) {
        console.log("Not in a Farcaster frame context", e);
      }
      setIsSDKLoaded(true);
    };

    if (!isSDKLoaded) {
      init();
    }

    try {
      initTelegram();
    } catch (e) {
      // Not in Telegram Mini App context
    }
  }, [isSDKLoaded]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Navbar />
            <Router />
          </WouterRouter>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}

export default App;
