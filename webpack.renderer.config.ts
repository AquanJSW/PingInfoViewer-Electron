import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import aliases from './webpack.aliases';

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins: plugins as any,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: aliases
  },
  devtool: 'inline-source-map'
};
