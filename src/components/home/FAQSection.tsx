
import React from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How do I place an order?",
      answer: "You can place an order by clicking on the 'Order' link in the navigation menu, or by selecting a product and clicking the 'Order Now' button. Fill out the order form with your details and preferences."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept EFT payments. Once your order is confirmed, we'll send you our banking details to complete the payment."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping typically takes 3-7 business days within South Africa, depending on your location. International shipping may take 10-14 business days."
    },
    {
      question: "Do you offer returns or exchanges?",
      answer: "Yes, we offer returns and exchanges within 14 days of receiving your order. The item must be unworn and in its original condition with tags attached."
    },
    {
      question: "Can I get a custom size or design?",
      answer: "Absolutely! We specialize in custom creations. Please contact us with your specific requirements, and we'll work with you to create the perfect piece."
    },
    {
      question: "How do I care for my crochet items?",
      answer: "We recommend hand washing all crochet items in cold water with mild detergent. Lay flat to dry to maintain shape and avoid stretching or shrinking."
    }
  ];

  return (
    <section id="faq" className="py-16 bg-accent/30 dark:bg-slate-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-playfair text-3xl md:text-4xl font-semibold mb-4 text-black dark:text-white">Frequently Asked Questions</h2>
          <p className="text-black/70 dark:text-white/70 max-w-2xl mx-auto">
            Have questions? We've got answers! If you don't find what you're looking for, feel free to contact us.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AccordionItem value={`item-${index}`} className="border dark:border-slate-700">
                  <AccordionTrigger className="text-left font-medium text-black dark:text-white hover:text-secondary dark:hover:text-secondary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-black/80 dark:text-white/80">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
