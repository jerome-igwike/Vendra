# Vendra Landing Page Design Guidelines

## Design Approach
**Reference-Based**: Drawing inspiration from Stripe's trustworthy minimalism, Paystack's local credibility, and Linear's modern polish. The design must project financial security and technological sophistication while remaining accessible to Nigerian social commerce vendors.

## Color System
- **Primary Green**: #00A651 (trust, growth, Nigeria's identity)
- **Cream/Frost**: #FFF8E7 (warmth, approachability)
- **Supporting Neutrals**: Deep charcoal (#1A1A1A) for text, soft gray (#F5F5F5) for backgrounds
- **Accent**: Lighter green (#33C47F) for hover states and highlights

## Typography Hierarchy
**Font Families** (Google Fonts):
- **Display/Headlines**: Inter (700, 800 weights) - bold, modern, trustworthy
- **Body/UI**: Inter (400, 500, 600 weights) - consistent, readable at small sizes

**Scale**:
- Hero Headline: text-4xl (mobile) → text-6xl (desktop), font-bold
- Section Headers: text-2xl → text-4xl, font-bold
- Subsections: text-xl → text-2xl, font-semibold
- Body: text-base → text-lg, font-normal
- Small Text/Captions: text-sm, font-medium

## Layout System
**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16, 20, 24 (consistent rhythm)
- Section padding: py-16 (mobile) → py-24 (desktop)
- Component spacing: gap-8 → gap-12
- Container max-width: max-w-7xl with px-6 → px-8

**Mobile-First Grid**: Single column mobile, 2-column tablet (md:), 3-column desktop (lg:) where appropriate

## Page Structure & Sections

### 1. Hero Section (100vh on mobile, 90vh desktop)
- **Background**: Cream gradient with subtle green geometric patterns (abstract African motifs)
- **Large Hero Image**: YES - Show authentic Nigerian vendor on phone/Instagram making a sale, overlaid with translucent UI mockup of Vendra payment link
- **Content**: 
  - Logo (top-left, green)
  - "Africa's Trust Layer" tagline (text-xl, green)
  - Headline: "Stop Losing Sales to the Trust Gap" (text-5xl, charcoal)
  - Subheadline: "Secure payments + automatic delivery for Instagram & WhatsApp sellers" (text-xl, gray)
  - Email capture form (prominent, green button with cream background input)
  - Social proof: "Join 100+ vendors building trust" (small text)
- **CTA Button**: Blurred cream background (backdrop-blur-md bg-cream/80), green text, green border

### 2. Problem Section (2-column on md+)
- **Stats Grid**: 3 columns on desktop
  - "40-60% Cart Abandonment" (large green numbers)
  - "₦5-10B Market" (large green numbers)
  - "95% Direct Transfers" (large green numbers)
- **Pain Points Cards**: 2-column grid
  - Customer pain: No escrow, no tracking (illustrated icon from Heroicons)
  - Vendor pain: Manual DMs, appears untrustworthy (illustrated icon)

### 3. Solution Section - Transaction Flow
- **Visual Flow Diagram**: Vertical on mobile, horizontal on desktop
- 7 connected cards showing: Link → Payment → Escrow → Delivery → Tracking → Confirmation → Payout
- Each card: Icon (Heroicons), step number (green circle), short description
- Connecting lines with subtle green animation (CSS only, subtle pulse)
- Background: Soft cream with green accent borders

### 4. Features Grid (3-column on lg)
- **Cards with icons**:
  - Escrow Protection (shield icon)
  - One-Click Logistics (truck icon)
  - WhatsApp Automation (chat icon)
  - No App Required (smartphone icon)
  - Live Tracking (map icon)
  - Auto-Payout (wallet icon)
- Each card: Icon, title (font-semibold), 2-sentence description
- Hover: Subtle lift (transform scale), green border glow

### 5. Pricing Tiers (4-column on lg, stack on mobile)
- **Tier Cards**: White background, green border for "Pro" (recommended)
- Display: Price, transaction limit, Vendra fee %, key features list
- CTA: "Start Free" / "Choose Plan" buttons (green primary, cream ghost)

### 6. Dual Modes Section (2-column)
- **Vendor Mode**: Dashboard screenshot placeholder, feature bullets
- **P2P Mode**: Phone OTP flow illustration, "No signup needed" emphasis
- Side-by-side comparison table

### 7. Trust & Security
- **Partnership Logos**: Paystack, Kwik Delivery (grayscale, hover to color)
- **Security Callouts**: "Bank-grade encryption", "Licensed by CBN" (when applicable)
- 2-column layout with icons

### 8. Final CTA Section
- **Full-width cream background**, green accent border top
- Large headline: "Join the waitlist. Get 3 months free."
- Email form (larger, centered)
- Countdown: "X/100 spots filled" (dynamic if possible, static otherwise)

### 9. Footer
- 3-column on desktop: 
  - Column 1: Logo, tagline, "Launching Q1 2026"
  - Column 2: Quick links (About, Pricing, Contact)
  - Column 3: Contact (hello@vendra.ng), Social icons
- Bottom bar: Copyright, Made by Devlix.inc

## Component Specifications

**Buttons**:
- Primary: Green bg (#00A651), white text, px-8 py-4, rounded-lg, font-semibold
- Secondary: Cream bg, green text, green border, same padding
- Hover: Slight darken, subtle lift (translate-y-[-2px])

**Form Inputs**:
- Cream background, green border on focus
- Rounded-lg, px-6 py-4, text-base
- Placeholder: gray-400

**Cards**:
- White background, subtle shadow (shadow-sm), rounded-xl
- Padding: p-8 (desktop), p-6 (mobile)
- Border: 1px cream, green on hover

**Icons**: Heroicons (outline style), size-8 for feature cards, size-6 for smaller contexts

## Images Required

1. **Hero Image**: Authentic Nigerian vendor (30s-40s) smiling while using smartphone, warm lighting, show Instagram/WhatsApp on screen, Vendra UI overlay (transparent mockup). Image should convey trust and modernity. Position: Right side on desktop, background on mobile.

2. **Transaction Flow Icons**: Abstract illustrations for each step - can use Heroicons enhanced with green accent colors

3. **Partnership Logos**: Paystack and Kwik Delivery logos (source from brand assets or use placeholders)

## Animations (Minimal)
- Scroll-triggered fade-in for sections (opacity 0 → 1, translate-y)
- Hover states only on interactive elements
- Subtle pulse on CTA buttons (CSS keyframe, 2s interval)
- NO complex scroll animations or parallax

## Mobile Optimization
- All text readable at base mobile size
- Touch targets minimum 44px height
- Email form full-width on mobile
- Stack all multi-column layouts
- Hero text hierarchy adjusted for smaller screens

## Accessibility
- Maintain 4.5:1 contrast ratio (charcoal on cream, white on green)
- All interactive elements keyboard navigable
- Form inputs with proper labels (can be sr-only if design requires)
- Alt text for all images describing context

This design projects financial credibility, modern technology, and local relevance - essential for building trust in Nigeria's social commerce ecosystem.