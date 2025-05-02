
import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const BackgroundAnimation: React.FC = () => {
  const isMobile = useIsMobile();
  
  // Render fewer and simpler animations on mobile
  const numElements = isMobile ? 2 : 6;
  const animationDuration = isMobile ? 30 : 20;
  
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Optimized animated circles */}
      {[...Array(numElements)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-secondary/40"
          style={{
            width: `${Math.random() * 300 + 200}px`,
            height: `${Math.random() * 300 + 200}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: animationDuration + (Math.random() * 5),
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Fewer floating shapes on mobile */}
      {isMobile ? null : [...Array(2)].map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute bg-accent/30"
          style={{
            width: `${Math.random() * 200 + 100}px`,
            height: `${Math.random() * 200 + 100}px`,
            borderRadius: `${Math.random() * 50}%`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            rotate: 360,
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
          }}
          transition={{
            duration: 30 + (Math.random() * 10),
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default React.memo(BackgroundAnimation);
