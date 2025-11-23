import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Shield, Truck, MessageSquare, Smartphone, MapPin, Wallet, TrendingUp, AlertCircle, Check, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Progress } from "@/components/ui/progress";
// Star was missing in previous version, added back to prevent white screen crash
import { Star } from "lucide-react";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailFormData = z.infer<typeof emailSchema>;

export default function Home() {
  const { toast } = useToast();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const { data: waitlistCount, isLoading: isLoadingCount, isError: isErrorCount } = useQuery<{ count: number }>({
    queryKey: ["/api/waitlist"],
    refetchInterval: 5000, 
  });

  const form = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: EmailFormData) => {
      return apiRequest("POST", "/api/waitlist", data);
    },
    onSuccess: (_, variables) => {
      setSubmittedEmail(variables.email);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/waitlist"] });
      toast({
        title: "Welcome to Vendra!",
        description: "You're on the waitlist. Check your email for early bird perks!",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Already on the list?",
        description: error.message || "This email is already registered.",
      });
    },
  });

  const onSubmit = (data: EmailFormData) => {
    mutation.mutate(data);
  };

  const count = waitlistCount?.count || 0;
  const progress = Math.min((count / 100) * 100, 100);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      
      {/* HERO SECTION */}
      <section id="hero" className="relative pt-8 pb-16 md:py-24 overflow-hidden px-6">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-accent/20 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,166,81,0.08),transparent_50%)] -z-10" />
        
        <div className="container max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* LEFT SIDE: Content */}
            <div className="flex-1 text-center lg:text-left space-y-8 animate-fade-in z-10">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-primary font-semibold px-4 py-2 text-sm">
                  Africa's Trust Layer
                </Badge>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                  Stop Losing Sales to the{" "}
                  <span className="text-primary relative inline-block">
                    Trust Gap
                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Secure payments + automatic delivery for Instagram & WhatsApp sellers across Nigeria. We hold the money until the item is delivered.
                </p>
              </div>

              {submittedEmail ? (
                <Card className="border-primary/20 bg-accent/30 shadow-sm" data-testid="card-success">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5" data-testid="icon-success" />
                      <div>
                        <p className="font-semibold text-foreground" data-testid="text-success-message">You're on the waitlist!</p>
                        <p className="text-sm text-muted-foreground mt-1" data-testid="text-success-email">{submittedEmail}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Check your email for early bird perks and updates.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="your@email.com"
                                className="h-12 text-base bg-white border-input shadow-sm"
                                data-testid="input-email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        size="lg"
                        className="h-12 px-8 font-bold shadow-md"
                        disabled={mutation.isPending}
                        data-testid="button-join-waitlist"
                      >
                        {mutation.isPending ? "Joining..." : "Secure My Spot"}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground text-center lg:text-left flex items-center justify-center lg:justify-start gap-2" data-testid="text-waitlist-count">
                      {isLoadingCount ? (
                        "Loading..."
                      ) : isErrorCount ? (
                        "Join the waitlist • Launching Q1 2026"
                      ) : (
                        <>
                          <Users className="w-4 h-4" /> 
                          <span>Join <span className="font-bold text-foreground">{count}+</span> vendors waiting for launch</span>
                        </>
                      )}
                    </p>
                  </form>
                </Form>
              )}
            </div>

            {/* RIGHT SIDE: The Images */}
            <div className="flex-1 relative w-full max-w-[600px] lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
                
                {/* 1. MOBILE IMAGE (Visible only on small screens) */}
                <img 
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80" 
                  alt="Secure transaction on mobile"
                  className="block lg:hidden w-full h-[400px] object-cover"
                />

                {/* 2. DESKTOP IMAGE (Visible only on large screens) */}
                {/* FIXED: Added h-[500px] to force height so it doesn't disappear */}
                <img 
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1600&q=80" 
                  alt="Business handshake trust" 
                  className="hidden lg:block w-full h-[500px] object-cover"
                />
                
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl border shadow-lg animate-in slide-in-from-bottom-4 duration-1000">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Escrow Active</p>
                      <p className="text-xs text-muted-foreground">Payment held securely until delivery confirmed</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background Decoration */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
            </div>

          </div>
        </div>
      </section>

      {/* Waitlist Progress */}
      <section className="py-12 px-6 border-y bg-accent/30">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Launch Waitlist Progress</span>
              </div>
              <Badge variant="default" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Early Bird Perks
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {count} {count === 1 ? 'vendor' : 'vendors'} joined
                </span>
                <span className="font-semibold text-foreground">Goal: 100 vendors</span>
              </div>
              <Progress value={progress} className="h-3" data-testid="progress-waitlist" />
              <p className="text-xs text-muted-foreground text-center">
                First 100 vendors get 3 months free Pro plan + priority onboarding
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-16 md:py-24 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Trust Crisis in Social Commerce
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nigeria's ₦5-10B social commerce market runs on broken trust
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center border-2" data-testid="card-stat-abandonment">
              <CardHeader>
                <CardTitle className="text-4xl md:text-5xl font-bold text-primary" data-testid="text-stat-abandonment">40-60%</CardTitle>
                <CardDescription className="text-base">Cart Abandonment Rate</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center border-2" data-testid="card-stat-market">
              <CardHeader>
                <CardTitle className="text-4xl md:text-5xl font-bold text-primary" data-testid="text-stat-market">₦5-10B</CardTitle>
                <CardDescription className="text-base">Market Size (2025)</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center border-2" data-testid="card-stat-transfers">
              <CardHeader>
                <CardTitle className="text-4xl md:text-5xl font-bold text-primary" data-testid="text-stat-transfers">95%</CardTitle>
                <CardDescription className="text-base">Direct Bank Transfers</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover-elevate" data-testid="card-customer-pain">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-3">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle>Customer Pain</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2" />
                  <p className="text-muted-foreground">No escrow protection on payments</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2" />
                  <p className="text-muted-foreground">No tracking or delivery confirmation</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2" />
                  <p className="text-muted-foreground">No recourse if product never arrives</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-vendor-pain">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center mb-3">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle>Vendor Pain</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2" />
                  <p className="text-muted-foreground">Hours spent confirming payments in DMs</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2" />
                  <p className="text-muted-foreground">Appear untrustworthy with personal accounts</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2" />
                  <p className="text-muted-foreground">Manual logistics coordination</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Transaction Flow */}
      <section id="how-it-works" className="py-16 md:py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete Transaction in 7 Simple Steps
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From payment to delivery, everything happens automatically
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <div className="grid gap-6">
                {[
                  { step: "01", title: "Create Link", desc: "Vendor generates payment link with product details" },
                  { step: "02", title: "Customer Pays", desc: "Payment + 5% fee held securely in escrow" },
                  { step: "03", title: "Escrow Active", desc: "Funds protected until delivery confirmed" },
                  { step: "04", title: "Book Delivery", desc: "One-click Kwik logistics booking" },
                  { step: "05", title: "Live Tracking", desc: "Customer receives WhatsApp updates" },
                  { step: "06", title: "Confirmation", desc: "7-day window to confirm receipt" },
                  { step: "07", title: "Auto-Payout", desc: "Vendor receives 96% automatically" },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4 p-4 bg-white rounded-lg border shadow-sm">
                    <div className="font-bold text-xl text-primary/40">{s.step}</div>
                    <div>
                      <h3 className="font-semibold">{s.title}</h3>
                      <p className="text-sm text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button size="lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Get Started Now <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 relative">
              <div className="sticky top-24">
                <img 
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80" 
                  alt="Secure payment on phone" 
                  className="rounded-2xl shadow-2xl border-8 border-white w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border max-w-xs hidden md:block">
                  <div className="flex items-start gap-3">
                    <Shield className="w-8 h-8 text-primary mt-1" />
                    <div>
                      <p className="font-bold">Money Protected</p>
                      <p className="text-xs text-muted-foreground">Funds are held in an escrow wallet until the buyer confirms the item is exactly as described.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Build Trust
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Escrow Protection", desc: "Payments held securely until delivery confirmed. No risk for customers." },
              { icon: Truck, title: "One-Click Logistics", desc: "Book Kwik delivery instantly. Prepaid from the 5% service fee." },
              { icon: MessageSquare, title: "WhatsApp Automation", desc: "Automatic tracking updates sent directly to customer's WhatsApp." },
              { icon: Smartphone, title: "No App Required", desc: "Works via shareable links. Customers pay directly in browser." },
              { icon: MapPin, title: "Live Tracking", desc: "Real-time delivery tracking from pickup to doorstep." },
              { icon: Wallet, title: "Auto-Payout", desc: "Receive funds automatically after confirmation period." },
            ].map((feature) => (
              <Card key={feature.title} className="hover-elevate border-2">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transparent Pricing That Grows With You
            </h2>
            <p className="text-lg text-muted-foreground">
              All plans include escrow + logistics automation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Free",
                price: "₦0",
                period: "/month",
                transactions: "5 transactions/mo",
                fee: "9%",
                features: ["1 link/day", "Basic analytics", "WhatsApp updates", "Escrow protection"],
              },
              {
                name: "Basic",
                price: "₦10,000",
                period: "/month",
                transactions: "100 transactions/mo",
                fee: "7.5%",
                features: ["Unlimited links", "Advanced analytics", "Priority support", "Custom branding"],
              },
              {
                name: "Pro",
                price: "₦25,000",
                period: "/month",
                transactions: "Unlimited",
                fee: "6%",
                features: ["Everything in Basic", "API access", "Dedicated account manager", "White-label option"],
                popular: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                transactions: "Unlimited",
                fee: "4-5%",
                features: ["Everything in Pro", "Custom integrations", "SLA guarantee", "24/7 phone support"],
              },
            ].map((plan) => (
              <Card
                key={plan.name}
                className={`relative hover-elevate ${plan.popular ? "border-primary border-2 shadow-lg" : "border-2"}`}
                data-testid={`card-pricing-${plan.name.toLowerCase()}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="default" className="font-semibold">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="text-base mt-2">{plan.transactions}</CardDescription>
                  <Badge variant="secondary" className="w-fit mt-2">
                    {plan.fee} Vendra fee
                  </Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={plan.popular ? "default" : "secondary"}
                    className="w-full"
                    data-testid={`button-choose-${plan.name.toLowerCase()}`}
                  >
                    {plan.name === "Free" ? "Start Free" : "Choose Plan"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Modes Section */}
      <section className="py-16 md:py-24 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Two Ways to Use Vendra
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover-elevate border-2">
              <CardHeader>
                <Badge variant="default" className="w-fit mb-3">For Vendors</Badge>
                <CardTitle className="text-2xl">Vendor Mode</CardTitle>
                <CardDescription className="text-base mt-2">
                  Full dashboard for your growing business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5" />
                    <p className="text-muted-foreground">Unlimited payment links</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5" />
                    <p className="text-muted-foreground">Sales analytics and reports</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5" />
                    <p className="text-muted-foreground">Customer management</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5" />
                    <p className="text-muted-foreground">Transaction history</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate border-2">
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-3">For Everyone</Badge>
                <CardTitle className="text-2xl">P2P Mode</CardTitle>
                <CardDescription className="text-base mt-2">
                  No signup needed for one-time transactions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5" />
                    <p className="text-muted-foreground">Phone OTP verification only</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5" />
                    <p className="text-muted-foreground">1 free link per day</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5" />
                    <p className="text-muted-foreground">Perfect for occasional sellers</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary mt-0.5" />
                    <p className="text-muted-foreground">All core features included</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted Partners & Security
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-xl">Powered By Industry Leaders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg bg-secondary flex items-center justify-center">
                    <span className="font-bold text-foreground">Paystack</span>
                  </div>
                  <div>
                    <p className="font-semibold">Payment Processing</p>
                    <p className="text-sm text-muted-foreground">Bank-grade encryption & security</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg bg-secondary flex items-center justify-center">
                    <span className="font-bold text-foreground">Kwik</span>
                  </div>
                  <div>
                    <p className="font-semibold">Logistics Partner</p>
                    <p className="text-sm text-muted-foreground">Reliable delivery across Nigeria</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardHeader>
                <CardTitle className="text-xl">Enterprise-Grade Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Bank-Grade Encryption</p>
                    <p className="text-sm text-muted-foreground">All data encrypted in transit and at rest</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Escrow Protection</p>
                    <p className="text-sm text-muted-foreground">Funds held securely by Paystack</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold">Compliance Ready</p>
                    <p className="text-sm text-muted-foreground">Built for Nigerian regulations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Nigerian Entrepreneurs
            </h2>
            <p className="text-lg text-muted-foreground">
              See what early adopters are saying about solving the trust gap
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Chioma O.",
                role: "Fashion Vendor, Lagos",
                initials: "CO",
                quote: "Finally, a solution that makes my customers feel safe! I've already seen my cart abandonment drop by 30% just by mentioning Vendra.",
                rating: 5,
              },
              {
                name: "Tunde A.",
                role: "Electronics Seller, Abuja",
                initials: "TA",
                quote: "The escrow protection is exactly what I needed to build trust with new customers. No more back-and-forth payment confirmations!",
                rating: 5,
              },
              {
                name: "Amara N.",
                role: "Beauty Products, Port Harcourt",
                initials: "AN",
                quote: "My customers love the automatic WhatsApp tracking updates. It's professional and saves me so much time!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="hover-elevate border-2" data-testid={`card-testimonial-${index}`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-semibold">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto border-primary/20 bg-accent/30">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-12 h-12 rounded-full bg-primary text-primary-foreground border-2 border-background flex items-center justify-center font-semibold">
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="text-center md:text-left">
                    <p className="font-semibold text-foreground">Join {count}+ vendors already on the waitlist</p>
                    <p className="text-sm text-muted-foreground">Be part of the trust revolution in Nigerian e-commerce</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 px-6 bg-card">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-background border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline" data-testid="button-faq-escrow">
                How does the escrow system work?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                When a customer pays, funds are held securely by Paystack (not Vendra) until delivery is confirmed. 
                After 7 days, if the customer doesn't report an issue, funds automatically release to your account. 
                This protects both parties.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-background border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline" data-testid="button-faq-fees">
                What are the fees?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Customers pay a 5% logistics & service fee (covers delivery + platform). Vendors pay a transaction 
                fee of 6-9% based on their plan tier. So on a ₦10,000 sale, customer pays ₦10,500, and vendor 
                receives approximately ₦9,600 after fees.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-background border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline" data-testid="button-faq-payout">
                When do I receive my money?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Funds automatically release to your bank account 7 days after delivery confirmation, or immediately 
                if the customer confirms receipt early. You can track all payouts in your dashboard.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-background border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline" data-testid="button-faq-delivery">
                What if the customer disputes delivery?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                We have tracking data from Kwik showing delivery status. Customers must provide valid reasons 
                within the 7-day window. Our support team mediates disputes using delivery proof, tracking 
                history, and communication records.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-background border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline" data-testid="button-faq-instagram">
                Can I use this with Instagram and WhatsApp?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Yes! That's exactly what Vendra is built for. Generate a payment link and share it in your 
                Instagram DMs, WhatsApp status, or anywhere else. Customers click, pay, and you handle the rest 
                through our dashboard.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-background border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline" data-testid="button-faq-start">
                How do I get started?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Join our waitlist now! We're launching Q1 2026. The first 100 signups get 3 months of Pro tier 
                free. We'll email you when we're ready to onboard vendors.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 px-6 bg-gradient-to-br from-primary/5 via-background to-accent/10 border-t-2 border-primary/20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold">
              Join the Waitlist. Get 3 Months Free.
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground">
              First 100 vendors get Pro tier features at no cost
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Waitlist Progress</span>
                <span className="text-sm font-semibold" data-testid="text-waitlist-progress">
                  {count}/100
                </span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                  data-testid="progress-waitlist"
                />
              </div>
            </div>

            {!submittedEmail && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="your@email.com"
                              className="h-12 text-base bg-card"
                              data-testid="input-email-cta"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="h-12 px-8 font-semibold animate-pulse-subtle"
                      disabled={mutation.isPending}
                      data-testid="button-join-waitlist-cta"
                    >
                      {mutation.isPending ? "Joining..." : "Secure My Spot"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            Launching Q1 2026 • No credit card required
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
