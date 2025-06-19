/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Old Florida Color Palette
        'florida': {
          'green': {
            50: '#f0f4f1',
            100: '#dae5dc',
            200: '#b5cbb9',
            300: '#8fb096',
            400: '#6a9573',
            500: '#5a8063', // Main palmetto green
            600: '#4a6b53',
            700: '#3a5642',
            800: '#2a4032',
            900: '#1a2b21',
          },
          'blue': {
            50: '#f0f6f8',
            100: '#d9e8ec',
            200: '#b3d1d9',
            300: '#8dbac6',
            400: '#67a3b3',
            500: '#4f8fa0', // Main gulf blue
            600: '#3f7380',
            700: '#2f5760',
            800: '#1f3b40',
            900: '#0f1f20',
          },
          'sand': {
            50: '#faf9f6',
            100: '#f1ede4',
            200: '#e3dbc9',
            300: '#d5c9ae',
            400: '#c7b793',
            500: '#b5a57d', // Main sandy beige
            600: '#9d8f6a',
            700: '#7a6f52',
            800: '#57503a',
            900: '#343022',
          },
          'sunset': {
            50: '#fef7f0',
            100: '#fce5d3',
            200: '#f9cba7',
            300: '#f6b17b',
            400: '#f3974f',
            500: '#e6802e', // Main sunset orange
            600: '#c66b25',
            700: '#9a521d',
            800: '#6e3914',
            900: '#42200c',
          },
          'flamingo': {
            50: '#fef5f5',
            100: '#fce2e2',
            200: '#f9c5c5',
            300: '#f5a8a8',
            400: '#f28b8b',
            500: '#e85d5d', // Main flamingo pink
            600: '#d14545',
            700: '#a33636',
            800: '#752626',
            900: '#471616',
          }
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        'florida-script': ['Pacifico', 'cursive'],
        'florida-display': ['Playfair Display', 'serif'],
        'florida-body': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} 