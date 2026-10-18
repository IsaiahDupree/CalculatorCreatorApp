/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@calc/spec', '@calc/evaluator', '@calc/shared'],
};

module.exports = nextConfig;




