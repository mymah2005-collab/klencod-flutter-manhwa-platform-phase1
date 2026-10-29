import type { Config } from "tailwindcss";

// Design system: printed manga. Square panels with thick ink borders,
// round speech elements (buttons, chips, bubbles), and one yellow for the main action.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "#F4F4F1", // newsprint background
        ink: "#15151A", // line art, text and borders
        bubble: "#FFFFFF", // speech-bubble white for panels and fields
        sfx: "#FFD60A", // sound-effect yellow, reserved for the primary action
        tone: "#C9C9CF", // screentone grey
        muted: "#5E5E68", // secondary text (passes AA on the page colour)
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
