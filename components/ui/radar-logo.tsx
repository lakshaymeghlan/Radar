import React from 'react';

export const RadarLogo = ({ className = "h-6 w-6", color = "currentColor" }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
  >
    {/* The "R" - Geometric and Modern */}
    <path 
      d="M8 20V4H14C16.5 4 18.5 6 18.5 8.5C18.5 11 16.5 13 14 13H8M14 13L19 20" 
      stroke={color} 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    
    {/* The Radar Curve - Upper Arc */}
    <path 
      d="M5 8C5 5 10 2 16 2C22 2 27 5 27 8" 
      stroke={color} 
      strokeWidth="2.5" 
      strokeLinecap="round"
      className="animate-pulse"
      style={{ opacity: 0.6 }}
    />
    <path 
      d="M8 7C8 6 10 5 12 5C14 5 16 6 16 7" 
      stroke={color} 
      strokeWidth="1.5" 
      strokeLinecap="round"
      className="animate-pulse"
      style={{ animationDelay: '0.2s', opacity: 0.4 }}
    />
  </svg>
);
