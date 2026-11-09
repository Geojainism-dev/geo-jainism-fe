/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class", '[data-theme="dark"]'],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			success: {
  				DEFAULT: 'hsl(var(--success))',
  				foreground: 'hsl(var(--success-foreground))'
  			},
  			info: {
  				DEFAULT: 'hsl(var(--info))',
  				foreground: 'hsl(var(--info-foreground))'
  			},
  			lotus: {
  				DEFAULT: 'hsl(var(--lotus))',
  				deep: 'hsl(var(--lotus-deep))'
  			},
  			tulsi: {
  				DEFAULT: 'hsl(var(--tulsi))',
  				deep: 'hsl(var(--tulsi-deep))'
  			},
  			/* GEO Jainism Shop palette (src/pages/Shop) — values live in shop.css as
  			   RGB channels so the global light/dark theme (useTheme → data-theme) can swap them. */
  			gj: {
  				ivory: 'rgb(var(--gj-ivory) / <alpha-value>)',
  				gold: 'rgb(var(--gj-gold) / <alpha-value>)',
  				'gold-deep': 'rgb(var(--gj-gold-deep) / <alpha-value>)',
  				maroon: 'rgb(var(--gj-maroon) / <alpha-value>)',
  				brown: 'rgb(var(--gj-brown) / <alpha-value>)',
  				beige: 'rgb(var(--gj-beige) / <alpha-value>)',
  				sand: 'rgb(var(--gj-sand) / <alpha-value>)',
  				charcoal: 'rgb(var(--gj-charcoal) / <alpha-value>)',
  				paper: 'rgb(var(--gj-paper) / <alpha-value>)',
  				mist: 'rgb(var(--gj-mist) / <alpha-value>)',
  				green: 'rgb(var(--gj-green) / <alpha-value>)'
  			},
  			/* Virasat page palette (src/pages/Virasat) */
  			vr: {
  				burgundy: '#4A101D',
  				maroon: '#641C2B',
  				gold: '#C6A15B',
  				'gold-soft': '#D9BE86',
  				ivory: '#F5EBD8',
  				charcoal: '#171313',
  				ink: '#0E0B0B'
  			},
  			'sky-pale': 'hsl(var(--sky-pale))',
  			'bg-alt': 'hsl(var(--bg-alt))',
  			'bg-deep': 'hsl(var(--bg-deep))',
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar))',
  				foreground: 'hsl(var(--sidebar-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			'gj-display': ['"Instrument Serif"', 'Georgia', 'serif'],
  			'gj-sans': ['"DM Sans"', 'system-ui', 'sans-serif'],
  			'vr-display': ['"Cormorant Garamond"', 'Georgia', 'serif'],
  			'vr-sans': ['Manrope', 'system-ui', 'sans-serif'],
  			'vr-deva': ['"Tiro Devanagari Hindi"', '"Cormorant Garamond"', 'serif']
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};