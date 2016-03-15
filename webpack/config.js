import path from 'path';
import webpack from 'webpack';

// Disable `.scss`-imports on the server with this package
import register from 'ignore-styles';
register(['.scss']);

const DEBUG = !process.argv.includes('--release');
const VERBOSE = process.argv.includes('--verbose');

const clientRoot = path.resolve(__dirname, '../src/client');
const PATHS = {
  clientRoot: clientRoot,
  client: path.resolve(clientRoot, 'app.js'),
  build: path.resolve(__dirname, '../build')
};

export default {
  devtool: 'source-map',

  entry: [
    'webpack-hot-middleware/client',
    PATHS.client
  ],

  output: {
    path: PATHS.build,
    filename: 'app.js',
    publicPath: '/'
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],

  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: path.resolve(__dirname, '../node_modules')
      },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'sass-loader'
        ]
      }
    ]
  },

  // allow loading of scss files using client-path
  sassLoader: {
    includePaths: [ PATHS.clientRoot ]
  },

  resolve: {
    modulesDirectories: [
      PATHS.clientRoot,
      'node_modules'
    ]
  },

  stats: {
    colors: true,
    reasons: DEBUG,
    hash: VERBOSE,
    version: VERBOSE,
    timings: true,
    chunks: VERBOSE,
    chunkModules: VERBOSE,
    cached: VERBOSE,
    cachedAssets: VERBOSE,
  }
};