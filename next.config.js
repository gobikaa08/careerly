/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  optimizeFonts: false,
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'mammoth'],
  },
  async redirects() {
    return [
      { source: '/login', destination: '/auth/login', permanent: false },
      { source: '/signup', destination: '/auth/signup', permanent: false },
      { source: '/resumes', destination: '/resume', permanent: false },
      { source: '/roadmaps', destination: '/roadmap', permanent: false },
      { source: '/career', destination: '/careers', permanent: false },
      { source: '/skillgap', destination: '/skill-gap', permanent: false },
      { source: '/skills', destination: '/skill-gap', permanent: false },
      { source: '/home', destination: '/', permanent: false },
      { source: '/assessments', destination: '/assessment', permanent: false },
    ];
  },
  async rewrites() {
    return [
      { source: '/index.html', destination: '/' },
      { source: '/assessment.html', destination: '/assessment' },
      { source: '/pages/assessment.html', destination: '/assessment' },
      { source: '/careers.html', destination: '/careers' },
      { source: '/pages/careers.html', destination: '/careers' },
      { source: '/dashboard.html', destination: '/dashboard' },
      { source: '/pages/dashboard.html', destination: '/dashboard' },
      { source: '/profile.html', destination: '/profile' },
      { source: '/pages/profile.html', destination: '/profile' },
      { source: '/resume.html', destination: '/resume' },
      { source: '/pages/resume.html', destination: '/resume' },
      { source: '/roadmap.html', destination: '/roadmap' },
      { source: '/pages/roadmap.html', destination: '/roadmap' },
      { source: '/skill-gap.html', destination: '/skill-gap' },
      { source: '/pages/skill-gap.html', destination: '/skill-gap' },
      { source: '/upload.html', destination: '/upload' },
      { source: '/pages/upload.html', destination: '/upload' },
    ];
  },
};

module.exports = nextConfig;
