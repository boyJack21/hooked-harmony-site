
import React from 'react';
import { Heart } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-accent/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="font-playfair text-4xl mb-6">About Us</h3>
          <p className="font-inter text-lg mb-6 leading-relaxed">
            At Everything Hooked, we believe in creating beautiful, handcrafted pieces that bring warmth and character to your home. Each item is made with love and attention to detail, ensuring that you receive a unique piece that will be cherished for years to come.
          </p>
          <div className="flex justify-center">
            <Heart className="text-secondary w-8 h-8" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
