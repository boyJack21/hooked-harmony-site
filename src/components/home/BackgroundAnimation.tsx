
import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

// Simplified component for better performance
const BackgroundAnimation: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Disable animations completely on very low-end devices or reduce them significantly
  const numElements = isMobile ? 1 : 4;
  const animationDuration = isMobile ? 40 : 25; // Slower animations are less CPU intensive
  
  // Early return for extremely constrained devices
  if (typeof window !== 'undefined' && window.innerWidth < 400) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Reduced number of circles with much simpler animations */}
      {[...Array(numElements)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-secondary/20"
          style={{
            width: `${isMobile ? 150 : 250}px`,
            height: `${isMobile ? 150 : 250}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            willChange: 'transform', // Optimize for animation performance
          }}
          animate={{
            x: [0, Math.random() * 50 - 25, 0], // Reduced movement range
            y: [0, Math.random() * 50 - 25, 0], // Reduced movement range
          }}
          transition={{
            duration: animationDuration + (Math.random() * 5),
            repeat: Infinity,
            ease: "linear",
            repeatType: "mirror", // Use mirror instead of loop for better performance
          }}
        />
      ))}

      {/* Disable floating shapes on mobile completely */}
      {isMobile ? null : (
        <motion.div
          className="absolute bg-accent/20"
          style={{
            width: `150px`,
            height: `150px`,
            borderRadius: `30%`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            willChange: 'transform', // Optimize for animation performance
          }}
          animate={{
            rotate: 360,
            x: [0, 20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}
    </div>
  );
};

// Using React.memo to prevent unnecessary re-renders
export default React.memo(BackgroundAnimation);
