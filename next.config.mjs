/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        staleTimes:{
            dynamic:30
        }
    },
    images:{
        remotePatterns:[{
            hostname:"lh3.googleusercontent.com"
        }]
    }
};

export default nextConfig;
