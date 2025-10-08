/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Press Start 2P"', "system-ui", "sans-serif"],
        pixel: ['"VT323"', "monospace"]
      },
      colors: {
        neon: {
          green: "#39FF14",
          blue: "#00D9FF",
          pink: "#FF28D7",
          yellow: "#F9F871"
        }
      },
      boxShadow: {
        'glow-green': '0 0 10px #39FF14, 0 0 20px #39FF14',
        'glow-blue': '0 0 10px #00D9FF, 0 0 20px #00D9FF',
      }
    },
  },
  plugins: [],
};
