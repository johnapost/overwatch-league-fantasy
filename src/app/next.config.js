const env = process.env.NODE_ENV || "development";

module.exports = {
  distDir: env === "production" ? "../../dist/functions/next" : ".next",
  webpack: (config, { isServer }) =>
    !isServer
      ? {
          ...config,
          node: {
            child_process: "empty",
            fs: "empty",
            net: "empty",
            tls: "empty"
          }
        }
      : config
};
