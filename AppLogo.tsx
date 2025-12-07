
import React from 'react';

const AppLogo = (props: { className?: string }) => (
  <svg
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0077C8" />
        <stop offset="100%" stopColor="#005590" />
      </linearGradient>
      <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.25"/>
      </filter>
    </defs>
    
    {/* Main Background Circle with Shadow */}
    <circle cx="256" cy="256" r="240" fill="url(#brandGradient)" filter="url(#dropShadow)" />
    
    {/* Decorative Ring */}
    <circle cx="256" cy="256" r="225" stroke="white" strokeWidth="4" strokeOpacity="0.2" />
    <circle cx="256" cy="256" r="215" stroke="white" strokeWidth="2" strokeOpacity="0.1" strokeDasharray="10 10" />

    {/* Inner White Shield Area */}
    <path 
      d="M256 440 C 380 400, 410 300, 410 200 A 160 160 0 0 0 256 60 A 160 160 0 0 0 102 200 C 102 300, 132 400, 256 440 Z" 
      fill="white" 
    />

    {/* 5S Typography */}
    <text x="256" y="240" textAnchor="middle" fontFamily="Kanit, sans-serif" fontWeight="800" fontSize="160" fill="#0077C8" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.1)' }}>
      5S
    </text>
    
    {/* Checkmark Icon symbolizing "Check-in" */}
    <path 
      d="M310 160 L350 160 L360 140 L380 140" 
      stroke="#F59E0B" 
      strokeWidth="10" 
      strokeLinecap="round" 
      fill="none"
      opacity="0"
    />
    <circle cx="340" cy="140" r="15" fill="#F59E0B" />
    <path d="M332 140 L338 146 L348 134" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

    {/* School Name */}
    <text x="256" y="300" textAnchor="middle" fontFamily="Kanit, sans-serif" fontWeight="700" fontSize="28" fill="#005590" letterSpacing="1">
      KOH SAMUI
    </text>
    <text x="256" y="335" textAnchor="middle" fontFamily="Kanit, sans-serif" fontWeight="600" fontSize="22" fill="#58B9F5" letterSpacing="4">
      SCHOOL
    </text>
    
    {/* 5 Stars for 5S */}
    <g transform="translate(0, 30)">
        <path d="M256 370 L260 380 L270 380 L262 386 L265 396 L256 390 L247 396 L250 386 L242 380 L252 380 Z" fill="#F59E0B" />
        <path d="M220 365 L224 375 L234 375 L226 381 L229 391 L220 385 L211 391 L214 381 L206 375 L216 375 Z" fill="#F59E0B" opacity="0.8" />
        <path d="M292 365 L296 375 L306 375 L298 381 L301 391 L292 385 L283 391 L286 381 L278 375 L288 375 Z" fill="#F59E0B" opacity="0.8" />
    </g>
  </svg>
);

export default AppLogo;
