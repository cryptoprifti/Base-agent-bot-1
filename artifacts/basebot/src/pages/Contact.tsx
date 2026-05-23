import { motion } from "framer-motion";

export function Contact() {
  return (
    <main className="flex flex-col min-h-screen pt-24 pb-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-2xl text-center"
      >
        <h2 className="text-3xl font-bold mb-8">Contact</h2>
        <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/60 shadow-2xl relative overflow-hidden max-w-sm mx-auto">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full blur-xl bg-primary/20 animate-pulse" />
              <img 
                src="https://unavatar.io/x/a12321xyz" 
                alt="Amar" 
                className="relative h-28 w-28 rounded-full ring-4 ring-background shadow-xl object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://api.dicebear.com/7.x/avataaars/svg?seed=Amar";
                }}
              />
            </div>
            
            <h3 className="text-2xl font-bold mb-1 text-foreground">Amar</h3>
            <p className="text-sm text-muted-foreground mb-6">Creator of BaseBot</p>
            
            <a 
              href="https://x.com/a12321xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-foreground bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all px-6 py-2.5 rounded-full font-medium"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-currentColor"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.965h-1.969z"></path></g></svg>
              Follow @a12321xyz
            </a>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
