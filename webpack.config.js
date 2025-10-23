const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.vue', '.ts', '.json'],
    '@': path.resolve(__dirname, 'src'),
    },
  
  module: {
     rules: [
      {test: /\.vue$/,
       loader: 'vue-loader',
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
         options: {
           appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true,
         },
         exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
};

  /*},
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },

      
    ],
  }
  /*,*/
  plugins: [
    new VueLoaderPlugin(),
  ],*/
};
