
import React from 'react';
import { motion } from 'framer-motion';

const BackgroundAnimation: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Animated circles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-secondary/30"
          style={{
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
            ],
            y: [
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
            ],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Additional floating shapes */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute bg-accent/20"
          style={{
            width: `${Math.random() * 200 + 50}px`,
            height: `${Math.random() * 200 + 50}px`,
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
            duration: Math.random() * 30 + 30,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default BackgroundAnimation;
