/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Tous les fichiers React
    "./public/index.html",       // Si vous utilisez un fichier HTML statique
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
