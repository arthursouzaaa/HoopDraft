export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        nba: { blue: "#1D428A", red: "#C8102E", gold: "#FDB927" }
      },
      fontFamily: {
        display: ["Bebas Neue", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 10px 30px -10px rgba(0,0,0,0.5)",
        glow: "0 0 24px rgba(253,185,39,0.35)"
      }
    }
  },
  plugins: []
};