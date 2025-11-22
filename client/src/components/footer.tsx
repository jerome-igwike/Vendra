import { Instagram, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <div className="container px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src="/images/vendra-logo.svg" alt="Vendra" className="h-8" />
            </div>
            <p className="text-sm text-muted-foreground">
              Building trust in Africa's social commerce ecosystem, one transaction at a time.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://instagram.com/vendra" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://twitter.com/vendra" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/vendra" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-linkedin">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:hello@vendra.ng" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-email-footer">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-features">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-pricing">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-how-it-works">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-faq">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-about">
                  About Us
                </a>
              </li>
              <li>
                <a href="#blog" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-blog">
                  Blog
                </a>
              </li>
              <li>
                <a href="#careers" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-careers">
                  Careers
                </a>
              </li>
              <li>
                <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#privacy" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-privacy">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-terms">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#security" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-security">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Vendra. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Built in Nigeria for African entrepreneurs
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}