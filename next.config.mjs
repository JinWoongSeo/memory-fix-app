/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'yisol-idm-vton.hf.space',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.hf.space',
                port: '',
                pathname: '/**',
            }
        ],
    },
};

export default nextConfig;
