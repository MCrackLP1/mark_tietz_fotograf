module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    cssnano: {
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
        minifyFontValues: true,
        minifyParams: true,
        minifySelectors: true,
        reduceIdents: false,
        zindex: false
      }]
    }
  },
} 