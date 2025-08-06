
import React, { useState } from 'react';
import { Mail, Instagram, MessageCircle } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { sendOrderEmail } from '@/services/emailService';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    item_size: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (value: string) => {
    setFormData(prev => ({ ...prev, item_size: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await sendOrderEmail({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        item: 'Contact Form Inquiry',
        quantity: 1,
        color: '',
        size: formData.item_size,
        specialInstructions: formData.message,
      });

      toast({
        title: "Message sent!",
        description: "We've received your message and will contact you soon.",
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        item_size: '',
      });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          <h3 className="font-playfair text-4xl mb-6 text-center">Get in Touch</h3>
          <p className="font-inter mb-8 text-center">
            Interested in a custom piece or have questions? We'd love to hear from you!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block font-medium mb-1">Name</label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block font-medium mb-1">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Your email address"
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block font-medium mb-1">Phone (optional)</label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="item_size" className="block font-medium mb-1">Size</label>
              <Select
                value={formData.item_size}
                onValueChange={handleSizeChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Small">Small</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Large">Large</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="message" className="block font-medium mb-1">Message</label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="What can we help you with?"
                rows={4}
                className="w-full"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-secondary transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>

          <div className="flex justify-center space-x-6 mt-8">
            <a 
              href="mailto:everythinghooked09@gmail.com" 
              className="p-3 rounded-full bg-primary hover:bg-secondary transition-colors"
              aria-label="Send us an email"
            >
              <Mail className="w-6 h-6 text-white" />
            </a>
            <a 
              href="https://wa.me/27608581873" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 rounded-full bg-emerald-600 hover:bg-emerald-700 transition-colors"
              aria-label="Contact us on WhatsApp"
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </a>
            <a 
              href="https://instagram.com/everything_hooked" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-colors"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-6 h-6 text-white" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
