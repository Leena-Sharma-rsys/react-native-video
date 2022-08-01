const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const appDirectory = path.resolve(__dirname);
const {presets} = require(`${appDirectory}/babel.config.js`);

const compileNodeModules = [
  'react-native-fast-image',
  'react-native-vector-icons',
  'react-native-status-bar-height',
  '@react-navigation/native',
  '@react-navigation/stack',
  'react-native-animatable',
  'react-native-image-zoom-viewer',
  'react-native-linear-gradient',
  'react-native-image-pan-zoom',

].map(moduleName => path.resolve(appDirectory, `node_modules/${moduleName}`));

const babelLoaderConfiguration = {
  test: /\.js$|tsx?$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(__dirname, 'index.web.js'), // Entry to your application
    path.resolve(__dirname, 'App.web.js'), // Change this to your main App file
    path.resolve(__dirname, 'src'),
    ...compileNodeModules,
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets,
      plugins: ['react-native-web'],
    },
  },
};

const svgLoaderConfiguration = {
  test: /\.svg$/,
  use: [
    {
      loader: '@svgr/webpack',
    },
  ],
};

const imageLoaderConfiguration = {
  test: /\.(gif|jpe?g|png)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
    },
  },
};

const cssLoader = {
  test: /\.css$/i,
  use: ['css-loader'],
};

const fontLoader = {
  test: /\.ttf$/,
  loader: 'file-loader', // or directly file-loader
  include: [
    path.resolve(__dirname, 'src/assets/fonts/Montserrat-Bold'), 
    path.resolve(__dirname, 'src/assets/fonts/Montserrat-Light'), // Entry to your application
    path.resolve(__dirname, 'src/assets/fonts/Montserrat-Medium'), // Change this to your main App file
    path.resolve(__dirname, 'src/assets/fonts/Montserrat-Regular'),
    path.resolve(__dirname, 'src/assets/fonts/Montserrat-SemiBold'),
  ],
}

module.exports = {
  entry: {
    app: path.join(__dirname, 'index.web.js'),
  },
  output: {
    path: path.resolve(appDirectory, 'dist'),
    publicPath: '/',
    filename: 'rnw_blogpost.bundle.js',
  },
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.js'],
    alias: {
      'react-native$': 'react-native-web',
    },
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration,
      svgLoaderConfiguration,
      cssLoader,
      fontLoader
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      // See: https://github.com/necolas/react-native-web/issues/349
      __DEV__: JSON.stringify(true),
    }),
  ],
};
