// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// This allows the app to resolve files with specific platform extensions
config.resolver.sourceExts.push('mjs', 'cjs');

module.exports = config;