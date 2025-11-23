import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Shield, Truck, MessageSquare, Smartphone, MapPin, Wallet, TrendingUp, AlertCircle, Check, Clock, Users, ArrowRight, Zap } from "lucide-react";
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

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailFormData = z.infer<typeof emailSchema>;

export default function Home() {
  const { toast } = useToast();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  // Polling kept active as requested
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
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Header />
      
      {/* HERO SECTION - UPDATED WITH IMAGES & BETTER COPY */}
      <section id="hero" className="relative pt-8 pb-16 md:py-24 overflow-hidden">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Left Content: Text & Form */}
            <div className="flex-1 space-y-8 z-10">
              <div className="space-y-4">
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 px-4 py-1.5 text-sm rounded-full">
                  🚀 Launching Q1 2026
                </Badge>
                
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
                  Stop Losing Sales to the <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600 relative">
                    "Trust Gap"
                    {/* Subtle underline decoration */}
                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                    </svg>
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                  Customers are scared to pay first. You are scared to send first. 
                  <span className="font-medium text-foreground"> Vendra fixes this.</span> We hold the money securely until the item is delivered.
                </p>
              </div>

              {/* Waitlist Form Area */}
              <div className="p-1 bg-background/50 backdrop-blur-sm rounded-2xl border shadow-sm max-w-md">
                {submittedEmail ? (
                  <Card className="border-none shadow-none bg-green-50/50">
                    <CardContent className="pt-6 flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-bold text-green-900">You're in! Position #{count}</p>
                        <p className="text-green-700 text-sm mt-1">We've sent a confirmation to {submittedEmail}</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="p-4 md:p-6">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex flex-col gap-3">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    {...field}
                                    type="email"
                                    placeholder="Enter your email address..."
                                    className="h-12 bg-white"
                                    data-testid="input-email"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" size="lg" className="h-12 text-base w-full font-bold shadow-lg shadow-primary/20" disabled={mutation.isPending} data-testid="button-join-waitlist">
                            {mutation.isPending ? "Securing Spot..." : "Secure My Early Access"}
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                          <Shield className="w-3 h-3" />
                          <span>Bank-grade security • No spam pledge</span>
                        </div>
                      </form>
                    </Form>
                  </div>
                )}
              </div>

              {/* Social Proof / Count */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i*123}`} alt="User" />
                    </div>
                  ))}
                </div>
                <p>Join <strong className="text-foreground">{count > 0 ? count : "100+"}</strong> vendors waiting for launch</p>
              </div>
            </div>

            {/* Right Content: Hero Images (Responsive) */}
            <div className="flex-1 relative w-full max-w-[600px] lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
                {/* Mobile Image: Vertical - Person on Phone */}
                

[Image of Black business woman using phone]

                <img 
                  src="https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80" 
                  alt="Secure transaction on phone"
                  className="block md:hidden w-full h-[400px] object-cover"
                />
                {/* Desktop Image: Horizontal - Trust/Handshake context */}
                

[Image of business handshake deal]

                <img 
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=1600&q=80" 
                  alt="Happy business owner delivering package" 
                  className="hidden md:block w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Badge */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl border shadow-lg animate-fade-in-up">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Payment Held Securely</p>
                      <p className="text-xs text-muted-foreground">Released only after delivery is confirmed</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background decorations */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Progress Bar */}
      <div className="bg-green-50 border-y border-green-100 py-4">
        <div className="container px-6 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Early Bird Status: <span className="font-bold">Active</span></span>
            </div>
            <div className="flex-1 w-full max-w-md flex items-center gap-3">
              <Progress value={progress} className="h-3 bg-green-200" indicatorClassName="bg-green-600" />
              <span className="text-xs font-bold text-green-700 whitespace-nowrap">{count}/100 Spots</span>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Section - Updated Visuals */}
      <section id="problem" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why selling on social media is hard</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Without a middleman, every transaction is a risk for both sides.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: AlertCircle,
                color: "text-red-500",
                bg: "bg-red-50",
                title: "The \"Payment First\" Standoff",
                desc: "Customers refuse to pay before delivery. You refuse to deliver before payment. The sale dies."
              },
              {
                icon: Truck,
                color: "text-orange-500",
                bg: "bg-orange-50",
                title: "Logistics Nightmares",
                desc: "Calling bike men, negotiating prices, and praying the package actually arrives safely."
              },
              {
                icon: Wallet,
                color: "text-blue-500",
                bg: "bg-blue-50",
                title: "Manual Payment Tracking",
                desc: "Sending account numbers in DMs and asking for screenshots of payment receipts."
              }
            ].map((item, i) => (
              <Card key={i} className="border-none shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-4`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Simplified */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                Simple Process
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">How Vendra builds the trust</h2>
              
              <div className="space-y-6">
                {[
                  { step: "01", title: "Create a Link", desc: "Generate a secure payment link for your product in 5 seconds." },
                  { step: "02", title: "Customer Pays Vendra", desc: "We hold the money. We tell you it's safe to ship." },
                  { step: "03", title: "Automatic Delivery", desc: "Our logistics partners pick up and deliver instantly." },
                  { step: "04", title: "You Get Paid", desc: "Once the customer accepts the item, funds hit your account." }
                ].map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="font-bold text-2xl text-primary/30">{s.step}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{s.title}</h3>
                      <p className="text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button size="lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Get Started Now <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="relative">
                {/* Using a relevant "Trust" image here */}
                

[Image of secure payment concept]

                <img 
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80" 
                  alt="Secure payment on phone" 
                  className="rounded-2xl shadow-2xl border-8 border-white"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border max-w-xs">
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

      {/* Pricing & Testimonials (Kept similar but cleaner) */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Fair Pricing for Everyone</h2>
          <p className="text-muted-foreground mb-12">No monthly fees to start. We only make money when you make a sale.</p>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
             <Card className="border-2 hover:border-primary/50 transition-colors">
               <CardHeader>
                 <CardTitle>Free Plan</CardTitle>
                 <CardDescription>Perfect for occasional sellers</CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="text-3xl font-bold mb-4">₦0 <span className="text-base font-normal text-muted-foreground">/month</span></div>
                 <ul className="space-y-3">
                   <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600"/> 5 Free transactions/mo</li>
                   <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600"/> Escrow protection</li>
                   <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600"/> WhatsApp Notifications</li>
                 </ul>
               </CardContent>
               <CardFooter>
                  <Button variant="outline" className="w-full">Start Free</Button>
               </CardFooter>
             </Card>
             
             <Card className="border-2 border-primary bg-primary/5 relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-xl font-bold">BEST VALUE</div>
               <CardHeader>
                 <CardTitle>Pro Vendor</CardTitle>
                 <CardDescription>For growing businesses</CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="text-3xl font-bold mb-4">₦10,000 <span className="text-base font-normal text-muted-foreground">/month</span></div>
                 <ul className="space-y-3">
                   <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary"/> Unlimited transactions</li>
                   <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary"/> Lower transaction fees (6%)</li>
                   <li className="flex items-center gap-2"><Check className="w-4 h-4 text-primary"/> Dedicated Support</li>
                 </ul>
               </CardContent>
               <CardFooter>
                  <Button className="w-full">Choose Pro</Button>
               </CardFooter>
             </Card>
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
