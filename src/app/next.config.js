const env = process.env.NODE_ENV || 'development';

module.exports = {
  distDir: env === 'production' ? '../../dist/functions/next' : '.next',
};
