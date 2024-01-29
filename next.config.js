/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push(
      "fast-json-stringify",
      "@whatwg-node/fetch",
      "long",
      "uglify-es",
      "uglify-es/package.json",
      "@graphql-mesh/utils",
      "@graphql-mesh/tools",
      "@graphql-tools/url-loader"
    );
    return config;
  },
};

module.exports = nextConfig;
