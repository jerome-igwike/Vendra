import { Button } from "@/components/ui/button";

export function Header() {
  const scrollToWaitlist = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <img src="/og-image.png" alt="Vendra" className="h-8" data-testid="img-logo" />
        </div>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#problem" className="text-foreground/60 hover:text-foreground transition-colors" data-testid="link-nav-problem">
            Problem
          </a>
          <a href="#how-it-works" className="text-foreground/60 hover:text-foreground transition-colors" data-testid="link-nav-how-it-works">
            How It Works
          </a>
          <a href="#features" className="text-foreground/60 hover:text-foreground transition-colors" data-testid="link-nav-features">
            Features
          </a>
          <a href="#pricing" className="text-foreground/60 hover:text-foreground transition-colors" data-testid="link-nav-pricing">
            Pricing
          </a>
          <a href="#faq" className="text-foreground/60 hover:text-foreground transition-colors" data-testid="link-nav-faq">
            FAQ
          </a>
        </nav>

        <Button onClick={scrollToWaitlist} size="sm" className="font-semibold" data-testid="button-header-join-waitlist">
          Join Waitlist
        </Button>
      </div>
    </header>
  );
}