var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    "babel-polyfill",
    "./src/index"
  ],
  output: {
    path: __dirname + '/build',
    filename: 'air-traffic-control.js'
  },
  module: {
    loaders: [
      {
        loader: "babel-loader",

        // Skip any files outside of your project's `src` directory
        include: [
          path.resolve(__dirname, "src"),
        ],

        // Only run `.js` files through Babel
        test: /\.js?$/,

        // Options to configure babel
        query: {
          presets: ["es2015", "stage-0"],
        }
      },
    ]
  }
}
