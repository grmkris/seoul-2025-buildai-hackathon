module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    cssnano: process.env.NODE_ENV === "production" && { preset: "default" },
  },
};
