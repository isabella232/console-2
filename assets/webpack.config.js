const path = require('path');

module.exports = function(env) {
  const production = process.env.NODE_ENV === 'production';
  return {
    devtool: production ? 'source-maps' : 'eval',
    entry: './js/app.js',
    output: {
      path: path.resolve(__dirname, '../priv/static/js'),
      filename: 'app.js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/,
          use: [ 'style-loader', 'css-loader' ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                publicPath: '/js'
              }
            }
          ]
        },
      ],
    },
    resolve: {
      modules: ['node_modules', path.resolve(__dirname, 'js')],
      extensions: ['.js', '.jsx'],
    },
  };
};
