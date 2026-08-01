/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    'firebase-admin',
    'firebase-admin/app',
    'firebase-admin/auth',
    'firebase-admin/firestore',
    'firebase-admin/storage',
  ],
};

export default nextConfig;
