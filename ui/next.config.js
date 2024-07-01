// next.config.js
module.exports = {
    async rewrites() {
        return [
            {
                source: '/',
                destination: '/pages/home',
            },
            {
                source: '/signup/:path*',
                destination: '/pages/signup/:path*',
            },
            {
                source: '/signin/:path*',
                destination: '/pages/signin/:path*',
            },
            {
                source: '/documentation/:path*',
                destination: '/pages/documentation/:path*',
            },
            {
                source: '/home',
                destination: '/pages/home',
            },
            {
                source: '/memory',
                destination: '/pages/memory',
            },
            {
                source: '/decisions',
                destination: '/pages/decisions',
            }
        ];
    },
    reactStrictMode: true,
    experimental: {
        appDir: true,
    },
};
