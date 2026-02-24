
import type { Config } from "tailwindcss";

export default {
        darkMode: ["class"],
        content: [
                "./pages/**/*.{ts,tsx}",
                "./components/**/*.{ts,tsx}",
                "./app/**/*.{ts,tsx}",
                "./src/**/*.{ts,tsx}",
        ],
        prefix: "",
        theme: {
                container: {
                        center: true,
                        padding: '2rem',
                        screens: {
                                '2xl': '1400px'
                        }
                },
                extend: {
                        colors: {
                                border: 'hsl(var(--border))',
                                input: 'hsl(var(--input))',
                                ring: 'hsl(var(--ring))',
                                background: 'hsl(var(--background))',
                                foreground: 'hsl(var(--foreground))',
                                primary: {
                                        DEFAULT: 'hsl(var(--primary))',
                                        foreground: 'hsl(var(--primary-foreground))'
                                },
                                secondary: {
                                        DEFAULT: 'hsl(var(--secondary))',
                                        foreground: 'hsl(var(--secondary-foreground))'
                                },
                                destructive: {
                                        DEFAULT: 'hsl(var(--destructive))',
                                        foreground: 'hsl(var(--destructive-foreground))'
                                },
                                muted: {
                                        DEFAULT: 'hsl(var(--muted))',
                                        foreground: 'hsl(var(--muted-foreground))'
                                },
                                accent: {
                                        DEFAULT: 'hsl(var(--accent))',
                                        foreground: 'hsl(var(--accent-foreground))'
                                },
                                popover: {
                                        DEFAULT: 'hsl(var(--popover))',
                                        foreground: 'hsl(var(--popover-foreground))'
                                },
                                card: {
                                        DEFAULT: 'hsl(var(--card))',
                                        foreground: 'hsl(var(--card-foreground))'
                                },
                                // Custom colors for Maximally
                                maximally: {
                                        blue: '#3C9EE7',
                                        red: '#D94F45',
                                        black: '#1A1A1A',
                                        white: '#FFFFFF',
                                },
                                sidebar: {
                                        DEFAULT: 'hsl(var(--sidebar-background))',
                                        foreground: 'hsl(var(--sidebar-foreground))',
                                        primary: 'hsl(var(--sidebar-primary))',
                                        'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                                        accent: 'hsl(var(--sidebar-accent))',
                                        'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                                        border: 'hsl(var(--sidebar-border))',
                                        ring: 'hsl(var(--sidebar-ring))'
                                }
                        },
                        fontFamily: {
                                'press-start': ['"Press Start 2P"', 'cursive'],
                                'vt323': ['"VT323"', 'monospace'],
                                'jetbrains': ['"JetBrains Mono"', 'monospace'],
                                'space': ['"Space Grotesk"', 'sans-serif'],
                        },
                        borderRadius: {
                                lg: 'var(--radius)',
                                md: 'calc(var(--radius) - 2px)',
                                sm: 'calc(var(--radius) - 4px)'
                        },
                        keyframes: {
                                'accordion-down': {
                                        from: { height: '0' },
                                        to: { height: 'var(--radix-accordion-content-height)' }
                                },
                                'accordion-up': {
                                        from: { height: 'var(--radix-accordion-content-height)' },
                                        to: { height: '0' }
                                },
                                blink: {
                                        '0%, 100%': { opacity: '1' },
                                        '50%': { opacity: '0' }
                                },
                                glitch: {
                                        '0%, 100%': { transform: 'translate(0)' },
                                        '20%': { transform: 'translate(-5px, 5px)' },
                                        '40%': { transform: 'translate(-5px, -5px)' },
                                        '60%': { transform: 'translate(5px, 5px)' },
                                        '80%': { transform: 'translate(5px, -5px)' }
                                },
                                bounce: {
                                        '0%, 100%': { transform: 'translateY(0)' },
                                        '50%': { transform: 'translateY(-10px)' }
                                },
                                float: {
                                        '0%, 100%': { transform: 'translateY(0)' },
                                        '50%': { transform: 'translateY(-15px)' }
                                },
                                pixel: {
                                        '0%': { 'background-position': '0% 0%' },
                                        '100%': { 'background-position': '100% 0%' }
                                },
                                shimmer: {
                                        '0%': { transform: 'translateX(-100%)' },
                                        '100%': { transform: 'translateX(100%)' }
                                }
                        },
                        animation: {
                                'accordion-down': 'accordion-down 0.2s ease-out',
                                'accordion-up': 'accordion-up 0.2s ease-out',
                                'blink': 'blink 1s infinite',
                                'glitch': 'glitch 0.3s ease-in-out',
                                'bounce': 'bounce 2s infinite',
                                'float': 'float 5s ease-in-out infinite',
                                'pixel': 'pixel 15s linear infinite',
                                'shimmer': 'shimmer 2s linear infinite'
                        }
                }
        },
        plugins: [require("tailwindcss-animate")],
} satisfies Config;
