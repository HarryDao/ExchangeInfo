const path = require('path');

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            cwd: 'babelrc',
            extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js'],
            configs: './src/configs',
            navigations: './src/navigations',
            screens: './src/screens',
            context: "./src/context",
            actions: './src/actions',
            apis: './src/apis',
            reducers: './src/reducers',
            sagas: './src/sagas',
            services: './src/services',
            helpers: './src/helpers',
            components: "./src/components",
            styles: "./src/styles",
          }
        }
      ]
    ]
  };
};
