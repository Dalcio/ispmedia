import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'images.unsplash.com', // Para imagens de placeholder
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Configuração para PWA (futuro)
  webpack: (config) => {
    // Configurações personalizadas do webpack se necessário
    return config;
  },
};

export default nextConfig;
