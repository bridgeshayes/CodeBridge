const path = require('path');
const webpack = require('webpack');

const commonConfig = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
  ],
};

const mainConfig = {
  ...commonConfig,
  target: 'electron-main',
  entry: './src/main.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

const rendererConfig = {
  ...commonConfig,
  target: 'electron-renderer',
  entry: './src/renderer/index.tsx',
  output: {
    filename: 'renderer.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

const preloadConfig = {
  mode: 'development',
  target: 'electron-preload',
  entry: './src/preload.ts',
  output: {
    filename: 'preload.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};

module.exports = [mainConfig, rendererConfig, preloadConfig]; 