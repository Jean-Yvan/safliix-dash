import daisyui from "daisyui"

// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // adapte le chemin à ton projet
  ],
  plugins: [daisyui],
  daisyui: {
    themes: ["mytheme"], // ton thème custom uniquement
    darkTheme: "mytheme", // même si DaisyUI pense être en dark, il prend mytheme
  },
};
