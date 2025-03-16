
import React from 'react';
import FeaturedItem from './FeaturedItem';

const FeaturedSection = () => {
  const featuredItems = [
    {
      imageSrc: "/lovable-uploads/292bcef9-b482-4906-b037-def69ad64fbf.png",
      imageAlt: "Brown and Pink Cardigan",
      title: "Cozy Two-Tone Cardigan",
      description: "Handcrafted cardigan in brown with pink accents, perfect for chilly evenings"
    },
    {
      imageSrc: "/lovable-uploads/d910cf04-5989-46cf-8bc7-a9bcb94356b4.png",
      imageAlt: "Blue Summer Set",
      title: "Summer Beach Set",
      description: "Stylish blue and white checkered set including a hat and accessories"
    },
    {
      imageSrc: "/lovable-uploads/3b8fc3fe-1891-426b-9f1c-7e6d61851ee4.png",
      imageAlt: "Cream Crop Top",
      title: "Ruffled Crop Top",
      description: "Delicate cream crop top with ruffle details and tie front"
    },
    {
      imageSrc: "/lovable-uploads/8e8b348c-460f-4202-b822-cce533c16d65.png",
      imageAlt: "Beige Polo Shirt",
      title: "Classic Beige Polo",
      description: "Comfortable and breathable beige polo shirt, ideal for casual outings"
    },
    {
      imageSrc: "/lovable-uploads/5b1caa4b-5579-450f-84f4-c46a9c909ab8.png",
      imageAlt: "Beige and Brown Shirt",
      title: "Two-Tone Button Shirt",
      description: "Elegant beige and brown button-up shirt with contrasting detail"
    },
    {
      imageSrc: "/lovable-uploads/7c1dfbee-f9f7-4b62-8b0d-ab7c5d1d2990.png",
      imageAlt: "Color Block Cardigan",
      title: "Color Block Cardigan",
      description: "Stylish layered cardigan with cream, tan, brown and gray color blocks"
    },
    {
      imageSrc: "/lovable-uploads/e255fe3b-ce35-4980-87aa-3b593d0d626d.png",
      imageAlt: "Orange Bikini Set",
      title: "Vibrant Bikini Set",
      description: "Bright orange crochet bikini, perfect for beach days and pool parties"
    },
    {
      imageSrc: "/lovable-uploads/cca20f48-3399-428c-9418-804bf8a9c508.png",
      imageAlt: "Green Beanie",
      title: "Emerald Beanie",
      description: "Warm and stylish green beanie, perfect for cold winter days"
    },
    {
      imageSrc: "/lovable-uploads/2f2c964c-4ac4-47b6-8b6f-ed4fc2667b3c.png",
      imageAlt: "Baby Dress",
      title: "Baby Girl Dress",
      description: "Adorable gray crochet dress for babies, perfect for special occasions"
    },
    {
      imageSrc: "/lovable-uploads/d977b0bc-aa7a-49ea-9d6a-c37dbe6e71b9.png",
      imageAlt: "White Crop Top",
      title: "Summer Crop Top",
      description: "Elegant white crochet crop top with tie-back design, perfect for summer days"
    },
    {
      imageSrc: "/lovable-uploads/68f87ec2-6bd6-4657-a718-151d2cecfa27.png",
      imageAlt: "Bucket Hats Collection",
      title: "Bucket Hat Collection",
      description: "Stylish bucket hats in various colors, perfect for sun protection with a fashion twist"
    }
  ];

  return (
    <section id="featured" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h3 className="font-playfair text-4xl text-center mb-12">Featured Creations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredItems.map((item, index) => (
            <FeaturedItem
              key={index}
              imageSrc={item.imageSrc}
              imageAlt={item.imageAlt}
              title={item.title}
              description={item.description}
              delay={index % 3 * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
