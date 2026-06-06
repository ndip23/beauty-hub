module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'primary-pink': '#D946EF', // A vibrant fuchsia/pink
        'primary-purple': '#8B5CF6', // A nice medium purple
        'dark-footer': '#1E1B4B', // A deep indigo for the footer
        'text-main': '#1F2937',
        'text-muted': '#6B7280',
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'], // Set Poppins as the default font
      }
    },
  },
  plugins: [],
};