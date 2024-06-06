const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
//const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const deps = require('./package.json').dependencies;
const { FederatedTypesPlugin } = require('@module-federation/typescript');
const path = require('path');

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
    //publicPath: 'http://localhost:3001/',
    path: path.resolve(__dirname, './dist'),
    assetModuleFilename: 'assets/[name][ext]',
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
      {
        test: /\.(png|jpg|gif|svg)$/, // only works for "import" images in tsx files, for dynamic loading had to copy images via CopyPlugin
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
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
    /* new CopyPlugin({
      patterns: [{ from: 'src/assets', to: 'assets' }],
    }), */
    new Dotenv(),
  ],
});
