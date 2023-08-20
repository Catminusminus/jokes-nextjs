const { createExcss } = require("excss/next");

const withExcss = createExcss({
  // excss options
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
};

module.exports = withExcss(nextConfig);
