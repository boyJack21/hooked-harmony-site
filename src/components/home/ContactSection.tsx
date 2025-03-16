
import React from 'react';
import { Mail, Instagram } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="font-playfair text-4xl mb-6">Get in Touch</h3>
          <p className="font-inter mb-8">
            Interested in a custom piece or have questions? We'd love to hear from you!
          </p>
          <div className="flex justify-center space-x-6">
            <a href="mailto:everythinghooked09@gmail.com" className="p-3 rounded-full bg-primary hover:bg-secondary transition-colors">
              <Mail className="w-6 h-6" />
            </a>
            <a href="https://instagram.com/everything_hooked" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-primary hover:bg-secondary transition-colors">
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
