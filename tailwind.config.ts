import type { Config } from "tailwindcss";

const config: Config = {
  safelist: [
    { pattern: /from-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(400|500|600|700)/ },
    { pattern: /to-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(400|500|600|700)/ },
  ],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#333333",
        accent: "#e74c3c",
      },
    },
  },
  plugins: [],
};
export default config;
