"use client";

import React from "react";

interface Category3DIconProps {
  name: string;
  className?: string;
}

export default function Category3DIcon({ name, className = "h-9 w-9" }: Category3DIconProps) {
  switch (name) {
    case "미식 & 코스":
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="gourmet-bg" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF6B35" />
              <stop offset="0.5" stopColor="#FF8800" />
              <stop offset="1" stopColor="#FFAA00" />
            </linearGradient>
            <linearGradient id="gourmet-cloche" x1="16" y1="16" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="1" stopColor="#FFE8D6" stopOpacity="0.4" />
            </linearGradient>
            <filter id="gourmet-shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="5" stdDeviation="4.5" floodColor="#FF6B35" floodOpacity="0.35" />
            </filter>
          </defs>
          <g filter="url(#gourmet-shadow)">
            {/* 3D Base Spherical Orb */}
            <circle cx="32" cy="35" r="23" fill="#D84315" />
            <circle cx="32" cy="31" r="23" fill="url(#gourmet-bg)" />
            
            {/* Glass Specular Top Sheen */}
            <path d="M15 22C19 14 27 10 37 10C42 10 45 12 47 14C39 12 25 14 17 24C15 27 15 24 15 22Z" fill="#FFFFFF" fillOpacity="0.6" />

            {/* 3D Plate & Dish Cloche Rim */}
            <ellipse cx="32" cy="38" rx="16" ry="6" fill="#BF360C" fillOpacity="0.4" />
            <path d="M16 37C16 26 23 19 32 19C41 19 48 26 48 37H16Z" fill="url(#gourmet-cloche)" />
            <ellipse cx="32" cy="37" rx="16" ry="4" fill="#FFFFFF" fillOpacity="0.8" />
            <circle cx="32" cy="18" r="3.5" fill="#FFFFFF" />

            {/* Fork & Knife Embossed Silhouette */}
            <path d="M26 27V33M26 33C26 35 27.5 36 29 36M26 33H29M29 27V33M27.5 36V41" stroke="#D84315" strokeWidth="2" strokeLinecap="round" />
            <path d="M37 27C37 27 34 30 34 34C34 37 35.5 38 35.5 41" stroke="#D84315" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      );

    case "브랜드 & 제품":
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="brand-bg" x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366F1" />
              <stop offset="0.5" stopColor="#8B5CF6" />
              <stop offset="1" stopColor="#D946EF" />
            </linearGradient>
            <linearGradient id="brand-gold-handle" x1="22" y1="8" x2="42" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE047" />
              <stop offset="1" stopColor="#CA8A04" />
            </linearGradient>
            <filter id="brand-shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="5" stdDeviation="4.5" floodColor="#8B5CF6" floodOpacity="0.38" />
            </filter>
          </defs>
          <g filter="url(#brand-shadow)">
            {/* 3D Tote Base */}
            <rect x="12" y="21" width="40" height="34" rx="9" fill="#3730A3" />
            <rect x="12" y="17" width="40" height="34" rx="9" fill="url(#brand-bg)" />

            {/* Translucent Gold Handle */}
            <path d="M23 17C23 10 41 10 41 17" stroke="url(#brand-gold-handle)" strokeWidth="4" strokeLinecap="round" />

            {/* Glossy Top Glass Bevel */}
            <path d="M14 20H50C45 22 22 24 14 20Z" fill="#FFFFFF" fillOpacity="0.45" />

            {/* Glowing 3D Star Crest */}
            <circle cx="32" cy="33" r="8" fill="#FFFFFF" fillOpacity="0.95" />
            <path d="M32 27.5L33.8 31.2L37.8 31.8L34.9 34.6L35.6 38.5L32 36.6L28.4 38.5L29.1 34.6L26.2 31.8L30.2 31.2L32 27.5Z" fill="#8B5CF6" />
          </g>
        </svg>
      );

    case "데이트 & 놀거리":
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="date-bg" x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF0055" />
              <stop offset="0.5" stopColor="#FF2A6D" />
              <stop offset="1" stopColor="#FF758C" />
            </linearGradient>
            <filter id="date-shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#FF0055" floodOpacity="0.4" />
            </filter>
          </defs>
          <g filter="url(#date-shadow)">
            {/* 3D Heart Base Shadow Layer */}
            <path
              d="M32 55C32 55 8 39 8 23C8 14 15 8 23 8C27.8 8 31.8 10.8 32 13.5C32.2 10.8 36.2 8 41 8C49 8 56 14 56 23C56 39 32 55 32 55Z"
              fill="#9F0033"
            />
            {/* 3D Main Gradient Heart */}
            <path
              d="M32 51C32 51 9 36 9 22C9 14 16 9 23 9C27.5 9 31.5 11.5 32 14C32.5 11.5 36.5 9 41 9C48 9 55 14 55 22C55 36 32 51 32 51Z"
              fill="url(#date-bg)"
            />

            {/* Specular Curved Highlight */}
            <path
              d="M23 12C18 12 13 16 12 22C14 17 20 14 25 14C27 14 29 15 30 16C29.5 14 26.5 12 23 12Z"
              fill="#FFFFFF"
              fillOpacity="0.75"
            />

            {/* Floating Sparkles ✨ */}
            <path d="M42 16L43.2 19.8L47 21L43.2 22.2L42 26L40.8 22.2L37 21L40.8 19.8L42 16Z" fill="#FFFFFF" />
            <circle cx="20" cy="38" r="2" fill="#FFFFFF" fillOpacity="0.8" />
          </g>
        </svg>
      );

    case "뷰티 & 케어":
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="beauty-bullet" x1="24" y1="6" x2="40" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF2E93" />
              <stop offset="0.5" stopColor="#E11D48" />
              <stop offset="1" stopColor="#9F1239" />
            </linearGradient>
            <linearGradient id="beauty-gold" x1="21" y1="24" x2="43" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FACC15" />
              <stop offset="1" stopColor="#CA8A04" />
            </linearGradient>
            <linearGradient id="beauty-case" x1="20" y1="32" x2="44" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E1B4B" />
              <stop offset="1" stopColor="#312E81" />
            </linearGradient>
            <filter id="beauty-shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="5" stdDeviation="4.5" floodColor="#E11D48" floodOpacity="0.38" />
            </filter>
          </defs>
          <g filter="url(#beauty-shadow)">
            {/* Lipstick Case Base */}
            <rect x="22" y="34" width="20" height="22" rx="5" fill="url(#beauty-case)" />
            
            {/* Gold Metallic Ring */}
            <rect x="21" y="24" width="22" height="9" rx="2" fill="url(#beauty-gold)" />

            {/* Lipstick Bullet */}
            <path d="M25 24L25 13C25 8 39 4 39 10L39 24Z" fill="url(#beauty-bullet)" />

            {/* Glossy Bullet Specular Light */}
            <path d="M26 22L26 14C26 12 32 9 34 8C31 10 28 14 28 22Z" fill="#FFFFFF" fillOpacity="0.65" />
            <rect x="24" y="36" width="3" height="18" rx="1.5" fill="#FFFFFF" fillOpacity="0.15" />
          </g>
        </svg>
      );

    case "헬스 & 웰니스":
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="health-bg" x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#10B981" />
              <stop offset="0.5" stopColor="#06B6D4" />
              <stop offset="1" stopColor="#3B82F6" />
            </linearGradient>
            <filter id="health-shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="5" stdDeviation="4.5" floodColor="#10B981" floodOpacity="0.38" />
            </filter>
          </defs>
          <g filter="url(#health-shadow)">
            {/* 3D Orb Base */}
            <circle cx="32" cy="35" r="23" fill="#047857" />
            <circle cx="32" cy="31" r="23" fill="url(#health-bg)" />

            {/* Glass Specular Top Sheen */}
            <path d="M15 22C19 14 27 10 37 10C42 10 45 12 47 14C39 12 25 14 17 24C15 27 15 24 15 22Z" fill="#FFFFFF" fillOpacity="0.6" />

            {/* Glowing ECG Pulse Wave */}
            <path
              d="M14 31H22L26 18L32 42L37 26L41 31H50"
              stroke="#FFFFFF"
              strokeWidth="3.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="32" cy="42" r="2" fill="#6EE7B7" />
          </g>
        </svg>
      );

    case "펫 & 패밀리":
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="pet-bg" x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F97316" />
              <stop offset="0.5" stopColor="#FB923C" />
              <stop offset="1" stopColor="#FBBF24" />
            </linearGradient>
            <filter id="pet-shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="5" stdDeviation="4.5" floodColor="#F97316" floodOpacity="0.38" />
            </filter>
          </defs>
          <g filter="url(#pet-shadow)">
            {/* Main Center Paw Pad */}
            <path
              d="M32 25C24 25 19 31 19 38C19 45 25 50 32 50C39 50 45 45 45 38C45 31 40 25 32 25Z"
              fill="url(#pet-bg)"
            />
            {/* Top Glossy Reflection */}
            <ellipse cx="32" cy="31" rx="8" ry="4" fill="#FFFFFF" fillOpacity="0.5" />

            {/* 4 Paw Toe Beans */}
            <circle cx="17" cy="24" r="5" fill="url(#pet-bg)" />
            <circle cx="27" cy="16" r="5.5" fill="url(#pet-bg)" />
            <circle cx="37" cy="16" r="5.5" fill="url(#pet-bg)" />
            <circle cx="47" cy="24" r="5" fill="url(#pet-bg)" />

            {/* Specular Highlights on Toe Beans */}
            <circle cx="16" cy="22" r="1.8" fill="#FFFFFF" fillOpacity="0.7" />
            <circle cx="26" cy="14" r="2" fill="#FFFFFF" fillOpacity="0.7" />
            <circle cx="36" cy="14" r="2" fill="#FFFFFF" fillOpacity="0.7" />
            <circle cx="46" cy="22" r="1.8" fill="#FFFFFF" fillOpacity="0.7" />
          </g>
        </svg>
      );

    case "생활 & 서비스":
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="home-bg" x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2563EB" />
              <stop offset="0.5" stopColor="#3B82F6" />
              <stop offset="1" stopColor="#60A5FA" />
            </linearGradient>
            <linearGradient id="home-roof" x1="8" y1="6" x2="56" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EF4444" />
              <stop offset="1" stopColor="#DC2626" />
            </linearGradient>
            <filter id="home-shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="5" stdDeviation="4.5" floodColor="#2563EB" floodOpacity="0.38" />
            </filter>
          </defs>
          <g filter="url(#home-shadow)">
            {/* House Body 3D */}
            <rect x="17" y="27" width="30" height="26" rx="6" fill="#1D4ED8" />
            <rect x="17" y="24" width="30" height="26" rx="6" fill="url(#home-bg)" />

            {/* Roof 3D */}
            <path d="M10 27L32 8L54 27Z" fill="url(#home-roof)" />
            <path d="M14 25L32 9L50 25Z" fill="#FFFFFF" fillOpacity="0.35" />

            {/* Glowing Frosted Glass Door */}
            <rect x="26" y="34" width="12" height="16" rx="3" fill="#FFFFFF" fillOpacity="0.9" />
            <circle cx="35" cy="42" r="1.2" fill="#2563EB" />
          </g>
        </svg>
      );

    case "여행":
      return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="travel-bg" x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0EA5E9" />
              <stop offset="0.5" stopColor="#0284C7" />
              <stop offset="1" stopColor="#4F46E5" />
            </linearGradient>
            <filter id="travel-shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="5" stdDeviation="4.5" floodColor="#0EA5E9" floodOpacity="0.38" />
            </filter>
          </defs>
          <g filter="url(#travel-shadow)">
            {/* 3D Orb Base */}
            <circle cx="32" cy="35" r="23" fill="#0369A1" />
            <circle cx="32" cy="31" r="23" fill="url(#travel-bg)" />

            {/* Glass Specular Top Sheen */}
            <path d="M15 22C19 14 27 10 37 10C42 10 45 12 47 14C39 12 25 14 17 24C15 27 15 24 15 22Z" fill="#FFFFFF" fillOpacity="0.6" />

            {/* 3D Airplane Ascending */}
            <path
              d="M47 23L36 19L22 25L17 22L14 24L20 30L17 37L21 39L27 33L40 38L47 23Z"
              fill="#FFFFFF"
            />
            {/* Jet Contrail Loop */}
            <path d="M14 36C18 42 28 44 38 41" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="2 2" strokeLinecap="round" />
          </g>
        </svg>
      );

    default:
      return null;
  }
}
