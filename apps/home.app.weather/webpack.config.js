const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const Dotenv = require('dotenv-webpack');
const deps = require('./package.json').dependencies;
const { FederatedTypesPlugin } = require('@module-federation/typescript');
const path = require('path');
const { content } = require('../home.app.host/tailwind.config');


const federationConfig = {
  name: 'home_app_weather',
  filename: 'remoteEntry.js',
  remotes: {},
  exposes: {
    './WeatherWidget': './src/components/WeatherWidget.tsx',
  },
  shared: {
    ...deps,
    react: {
      singleton: true,
      requiredVersion: deps.react,
    },
    'react-dom': {
      singleton: true,
      requiredVersion: deps['react-dom'],
    },
  },
};
module.exports = (_, argv) => ({
  infrastructureLogging: {
    level: 'log',
  },
  output: {
    publicPath: 'http://localhost:3001/',
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  mode: 'development',

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    port: 3001,
    liveReload: false,
    hot: true,
    open: true,
    compress: false,
    /* historyApiFallback: {
      disableDotRule: false
    }, */
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
    ],
  },

  plugins: [
    new ModuleFederationPlugin(federationConfig),
    new FederatedTypesPlugin({ federationConfig }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      title: 'Weather App',
      filename: 'index.html',
      chunks: ['main'],
      publicPath: '/',
    }),
    new Dotenv(),
  ],
});
