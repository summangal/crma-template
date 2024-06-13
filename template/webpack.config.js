const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { SourceMapDevToolPlugin } = require('webpack');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const deps = require('./package.json').dependencies;

const envName = env => {
  if (!env.ENVIRONMENT) return '';
  return `${env.ENVIRONMENT}`;
};

const enterpriseId = env => {
  if (!env.ENTERPRISE) return '';
  return `${env.ENTERPRISE}`;
};

const commonConfig = (env, mode) => {
  const isEnvProduction = mode === 'production';

  return {
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    },

    module: {
      rules: [
        isEnvProduction && {
          enforce: 'pre',
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          test: /\.(js|mjs|jsx|ts|tsx|css)$/,
          loader: require.resolve('source-map-loader'),
        },
        {
          test: /\.m?js/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.(css|s[ac]ss)$/i,
          use: [
            isEnvProduction && {
              loader: MiniCssExtractPlugin.loader,
              options: { publicPath: 'auto' },
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: isEnvProduction,
                modules: {
                  mode: 'icss',
                },
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                postcssOptions: {
                  ident: 'postcss',
                  config: false,
                  plugins: [
                    'postcss-flexbugs-fixes',
                    [
                      'postcss-preset-env',
                      {
                        autoprefixer: {
                          flexbox: 'no-2009',
                        },
                        stage: 3,
                      },
                    ],
                    'postcss-normalize',
                  ],
                },
                sourceMap: isEnvProduction,
              },
            },
          ],
        },
        {
          test: /\.(ts|tsx)$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.json$/,
          loader: 'json-loader',
        },
        {
          test: /\.svg$/,
          use: ['file-loader'],
        },
      ],
    },

    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          isEnvProduction ? 'production' : 'development',
        ),
        'process.env.ENVIRONMENT': JSON.stringify(envName(env)),
        'process.env.ENTERPRISE': JSON.stringify(enterpriseId(env)),
      }),
      new ModuleFederationPlugin({
        /** TODO: Change project name here */
        name: 'microapp_template',
        filename: 'remoteEntry.js',
        remotes: {},
        exposes: {
          './Sample': './src/pages/Sample.page.tsx',
        },
        shared: {
          react: {
            eager: true,
            singleton: true,
            requiredVersion: deps.react,
          },
          'react-dom': {
            eager: true,
            singleton: true,
            requiredVersion: deps['react-dom'],
          },
          'react-router-dom': {
            eager: true,
            singleton: true,
            requiredVersion: deps['react-router-dom'],
          },
        },
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: path.resolve(__dirname, './src/index.html'),
        ...(isEnvProduction
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          : undefined),
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, './src/favicon.ico'),
            to: 'favicon.ico',
          },
        ],
      }),
      isEnvProduction &&
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),
    ],
  };
};

const devConfig = {
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
    /** TODO: Change your PORT here */
    publicPath: 'http://localhost:4002/',
  },
  devtool: false,
  plugins: [
    new SourceMapDevToolPlugin({}),

    new ESLintPlugin({
      cache: true,
      emitError: true,
      emitWarning: false,
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      failOnError: true,
      files: 'src',
    }),
  ],

  mode: 'development',

  devServer: {
    /** TODO: Change your PORT here */
    port: 4002,
    allowedHosts: 'all',
    historyApiFallback: true,
    devMiddleware: {
      index: 'index.html',
      writeToDisk: true,
    },
  },
};

const prodConfig = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
  },
  output: {
    filename: 'static/js/[name].[contenthash:8].js',
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: 'auto',
  },
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512 * 1024,
    maxAssetSize: 1024 * 1024,
  },
  mode: 'production',
};

module.exports = (env, args) => {
  switch (args.mode) {
    case 'development':
      return merge(commonConfig(env, args.mode), devConfig);
    case 'production':
      console.log('Creating an optimized production build...');
      return merge(commonConfig(env, args.mode), prodConfig);
    default:
      throw new Error('No matching configuration was found!');
  }
};
