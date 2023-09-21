require('dotenv').config();
const packageJson = require('./package.json');
const extensionConfig = require('./extension.js');

const { webpackConfigBuilder } = require('@ellucian/experience-extension');

module.exports = async (env, options) => {
    // Generate Webpack configuration based on the extension.js file
    // and any optional env flags  ("--env verbose", "--env upload", etc)
    const webpackConfig = await webpackConfigBuilder({
        extensionConfig: extensionConfig,
        extensionVersion: packageJson.version,
        mode: options.mode || 'production',
        verbose: env.verbose || process.env.EXPERIENCE_EXTENSION_VERBOSE || false,
        upload: env.upload || process.env.EXPERIENCE_EXTENSION_UPLOAD || false,
        forceUpload:
      env.forceUpload || process.env.EXPERIENCE_EXTENSION_FORCE_UPLOAD || false,
        uploadToken:
      env.uploadToken || process.env.EXPERIENCE_EXTENSION_UPLOAD_TOKEN,
        liveReload: env.liveReload || false,
        port: process.env.PORT || 8082
    });

    webpackConfig.resolve.extensions = [
        ...webpackConfig.resolve.extensions,
        '.js',
        '.jsx',
        '.ts',
        '.tsx'
    ];
    webpackConfig.module.rules = [
        ...webpackConfig.module.rules,
        {
            test: /\.(ts|tsx)$/,
            use: 'ts-loader',
            exclude: /node_modules/
        },
        {
            test: /\.(js|jsx)$/,
            use: 'babel-loader', // You may need to install babel-loader
            exclude: /node_modules/
        }
    ];
    // For advanced scenarios, dynamically modify webpackConfig here.

    return webpackConfig;
};
