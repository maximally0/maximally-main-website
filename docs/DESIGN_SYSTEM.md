# Maximally Design System

Reference guide for the Maximally visual identity. Use this when styling new pages or components.

---

## Brand Positioning

- Tagline: "The world's most serious builder ecosystem"
- Tone: Confident, minimal, professional. Not playful or youth-oriented.
- Audience: Builders, operators, founders, and enterprise partners

---

## Typography

### Fonts
- **Space Grotesk** (`font-space`): Primary font for all body text, headings, subheadings, buttons, labels, and UI elements
- **Press Start 2P** (`font-press-start`): Logo text only ("MAXIMALLY"). Do NOT use for headings, body copy, or labels

### Sizes (Tailwind classes)
- Hero heading: `text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold`
- Section heading: `text-3xl sm:text-4xl md:text-5xl font-bold`
- Section subheading: `text-gray-400 text-base sm:text-lg md:text-xl`
- Card title: `text-lg sm:text-xl font-semibold`
- Body text: `text-sm sm:text-base`
- Small labels/tags: `text-xs sm:text-sm font-medium`
- Button text: `text-sm sm:text-base font-semibold`

### Line heights
- Headings: `leading-[1.1]` or `leading-tight`
- Body: `leading-relaxed`

---

## Colors

### Primary Palette
- **Orange (accent)**: `#f97316` / `orange-500`
  - Gradient: `from-orange-600 to-orange-500` (buttons), `from-orange-400 to-orange-500` (text gradient)
  - Hover: `orange-400` or `orange-500`
  - Glow/shadow: `shadow-orange-500/20`, `shadow-orange-500/40`
- **Black (background)**: `#000000` / `bg-black`
- **White (primary text)**: `text-white`

### Text Colors
- Primary text: `text-white`
- Secondary text: `text-gray-400`
- Muted text: `text-gray-500`
- Faint text: `text-gray-600`
- Accent text: `text-orange-400`

### Border Colors
- Default: `border-gray-800`
- Subtle: `border-gray-700`
- Hover: `border-orange-500` or `border-orange-500/50`
- Active/highlighted: `border-orange-500`

### Background Colors
- Page: `bg-black`
- Card: `bg-gray-900` or `bg-gray-900/80`
- Card hover: `bg-gray-800`
- Subtle overlay: `bg-gray-900/98`
- Tag/badge default: `bg-gray-800`

### DO NOT USE
- Purple, pink, cyan, red as accent colors (legacy palette)
- Multi-color gradients (stick to orange or gray)
- `font-press-start` for anything other than the logo

---

## Spacing

### Page Sections
- Section padding: `py-20 sm:py-28`
- Container: `container mx-auto px-4 sm:px-6`
- Max content width: `max-w-4xl mx-auto` (hero), `max-w-6xl mx-auto` (grids)
- Section separator: thin gradient line `h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent`

### Cards
- Card padding: `p-6 sm:p-8`
- Card gap in grid: `gap-4 sm:gap-6`
- Card border radius: none (sharp corners) or minimal

### Buttons
- Padding: `px-8 sm:px-10 py-4 sm:py-5`
- Gap between buttons: `gap-4 sm:gap-5`

---

## Components

### Primary Button (CTA)
```
bg-gradient-to-r from-orange-600 to-orange-500
hover:from-orange-500 hover:to-orange-400
text-white font-space text-sm sm:text-base font-semibold
shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40
hover:scale-[1.02] transition-all duration-300
```

### Secondary Button (Outline)
```
bg-transparent border border-gray-600
hover:border-orange-500
text-gray-300 hover:text-white
font-space text-sm sm:text-base font-semibold
transition-all duration-300
```

### Card
```
bg-gradient-to-br from-gray-900/80 via-black to-gray-900/80
border border-gray-800
hover:border-orange-500/50
transition-all duration-300 overflow-hidden
```

### Tag / Badge
```
px-3 py-1 text-xs font-space font-medium
bg-orange-500/10 text-orange-400 border border-orange-500/30
```

### Section Label (e.g. "OPEN NOW")
```
font-space text-xs sm:text-sm font-semibold tracking-widest uppercase
text-orange-400
```

---

## Background Effects

### Subtle Grid
```
bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),
    linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]
bg-[size:60px_60px]
```

### Ambient Glow
```
<div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-orange-500/8 rounded-full blur-[200px]" />
```
Use sparingly. One or two per section max.

### Color Overlay
```
bg-gradient-to-br from-orange-950/15 via-transparent to-gray-950/20
```

---

## Animations & Transitions

- Hover transitions: `transition-all duration-300`
- Color transitions: `transition-colors duration-200`
- Scale on hover: `hover:scale-[1.02]`
- Translate on hover: `group-hover:translate-x-1 transition-transform`
- Fade in: `animate-fade-in` with staggered delays

---

## Navigation

- Navbar: fixed, `bg-black/95 backdrop-blur-md`, hides on scroll down
- Nav links: `font-space text-sm font-medium`, underline on hover/active with `bg-gradient-to-r from-orange-500 to-amber-500`
- User icon: circular `w-10 h-10` with `border-2 border-gray-700 hover:border-orange-500 rounded-full`
- Mobile nav: full-screen overlay, `bg-black`

---

## Page Layout Pattern

```tsx
<section className="py-20 sm:py-28 relative bg-black overflow-hidden">
  {/* Optional separator line */}
  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-700/30 to-transparent" />
  
  {/* Optional ambient glow */}
  <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/5 rounded-full blur-[100px]" />
  
  <div className="container mx-auto px-4 sm:px-6">
    {/* Section label */}
    <p className="font-space text-xs sm:text-sm font-semibold tracking-widest uppercase text-orange-400 mb-4">
      SECTION LABEL
    </p>
    
    {/* Section heading */}
    <h2 className="font-space text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
      Section Title
    </h2>
    
    {/* Section description */}
    <p className="text-gray-400 text-base sm:text-lg max-w-2xl mb-12">
      Description text goes here.
    </p>
    
    {/* Content grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Cards */}
    </div>
  </div>
</section>
```

---

## Key Principles

1. **Less is more** - Generous whitespace, minimal decorative elements
2. **Single accent** - Orange only. No multi-color rainbows
3. **Sharp edges** - Square corners on cards and buttons (no rounded-lg)
4. **Professional tone** - Copy should feel like a serious platform, not a student club
5. **Consistent font** - Space Grotesk everywhere except the logo
6. **Dark theme** - Pure black backgrounds, no dark grays as base
