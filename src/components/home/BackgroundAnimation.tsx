
import React from 'react';
import { motion } from 'framer-motion';

const BackgroundAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Larger animated circles with more vibrant colors */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-secondary/40"
          style={{
            width: `${Math.random() * 400 + 200}px`,
            height: `${Math.random() * 400 + 200}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [
              Math.random() * 200 - 100,
              Math.random() * 200 - 100,
              Math.random() * 200 - 100,
            ],
            y: [
              Math.random() * 200 - 100,
              Math.random() * 200 - 100,
              Math.random() * 200 - 100,
            ],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: Math.random() * 20 + 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Additional floating shapes with more vibrant colors */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute bg-accent/30"
          style={{
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
            borderRadius: `${Math.random() * 50}%`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            rotate: 360,
            x: [0, Math.random() * 150 - 75, 0],
            y: [0, Math.random() * 150 - 75, 0],
          }}
          transition={{
            duration: Math.random() * 25 + 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundAnimation;
