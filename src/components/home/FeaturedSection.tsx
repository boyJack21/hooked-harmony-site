
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';
import CategoryCarousel, { ProductItem } from './CategoryCarousel';
import AvailableNowSection from './AvailableNowSection';

const FeaturedSection = () => {
  const featuredItems: ProductItem[] = [
    // Cardigans
    {
      id: "cardigan-brown-pink",
      imageSrc: "/lovable-uploads/292bcef9-b482-4906-b037-def69ad64fbf.png",
      imageAlt: "Brown and Pink Cardigan",
      title: "Cozy Two-Tone Cardigan",
      description: "Handcrafted cardigan in brown with pink accents, perfect for chilly evenings",
      category: "Cardigans",
      priceDisplay: "S=R400, M=R450, L=R500"
    },
    {
      id: "cardigan-color-block",
      imageSrc: "/lovable-uploads/7c1dfbee-f9f7-4b62-8b0d-ab7c5d1d2990.png",
      imageAlt: "Color Block Cardigan",
      title: "Color Block Cardigan",
      description: "Stylish layered cardigan with cream, tan, brown and gray color blocks",
      category: "Cardigans",
      priceDisplay: "S=R500, M=R540, L=R600"
    },
    {
      id: "cardigan-cream",
      imageSrc: "/lovable-uploads/d6ea798a-68f0-4e4c-8a0e-6b0d606189db.png",
      imageAlt: "Cream Cardigan",
      title: "Cream Button Cardigan",
      description: "Elegant cream cardigan with buttons and balloon sleeves",
      category: "Cardigans",
      priceDisplay: "S=R450, M=R520, L=R600"
    },
    {
      id: "cardigan-beige-navy",
      imageSrc: "/lovable-uploads/9294a9a2-018c-4538-9f59-8e98a51a166c.png",
      imageAlt: "Beige and Navy Cardigan",
      title: "Beige & Navy Button Cardigan",
      description: "Stylish short-sleeve cardigan with beige base and navy stripes with golden details",
      category: "Cardigans",
      priceDisplay: "S=R350, M=R400"
    },
    {
      id: "cardigan-navy-button",
      imageSrc: "/lovable-uploads/a6d0d655-4648-4d2c-8a1b-1e5bdb9884cd.png",
      imageAlt: "Navy Button Cardigan",
      title: "Navy Button Cardigan",
      description: "Classic navy blue cardigan with ribbed texture and button closure",
      category: "Cardigans",
      priceDisplay: "S=R400, M=R450, L=R500"
    },
    // Summer Sets
    {
      id: "summer-set-blue",
      imageSrc: "/lovable-uploads/d910cf04-5989-46cf-8bc7-a9bcb94356b4.png",
      imageAlt: "Blue Summer Set",
      title: "Summer Beach Set",
      description: "Stylish blue and white checkered set including a hat and accessories",
      category: "Summer Sets",
      priceDisplay: "From R150"
    },
    // Tops
    {
      id: "top-cream-crop",
      imageSrc: "/lovable-uploads/3b8fc3fe-1891-426b-9f1c-7e6d61851ee4.png",
      imageAlt: "Cream Crop Top",
      title: "Ruffled Crop Top",
      description: "Delicate cream crop top with ruffle details and tie front",
      category: "Tops",
      priceDisplay: "S=R200, M=R250, L=R280"
    },
    {
      id: "top-white-crop",
      imageSrc: "/lovable-uploads/d977b0bc-aa7a-49ea-9d6a-c37dbe6e71b9.png",
      imageAlt: "White Crop Top",
      title: "Summer Crop Top",
      description: "Elegant white crochet crop top with tie-back design, perfect for summer days",
      category: "Tops",
      priceDisplay: "S=R200, M=R250, L=R280"
    },
    // Shirts
    {
      id: "shirt-beige-polo",
      imageSrc: "/lovable-uploads/8e8b348c-460f-4202-b822-cce533c16d65.png",
      imageAlt: "Beige Polo Shirt",
      title: "Classic Beige Polo",
      description: "Comfortable and breathable beige polo shirt, ideal for casual outings",
      category: "Shirts",
      priceDisplay: "S=R280, M=R320, L=R360"
    },
    {
      id: "shirt-beige-brown",
      imageSrc: "/lovable-uploads/5b1caa4b-5579-450f-84f4-c46a9c909ab8.png",
      imageAlt: "Beige and Brown Shirt",
      title: "Two-Tone Button Shirt",
      description: "Elegant beige and brown button-up shirt with contrasting detail",
      category: "Shirts",
      priceDisplay: "S=R280, M=R320, L=R360"
    },
    {
      id: "shirt-blue-polo",
      imageSrc: "/lovable-uploads/08cd791a-6b34-44fb-abb5-b8b113488695.png",
      imageAlt: "Sky Blue Crochet Polo",
      title: "Sky Blue Crochet Polo",
      description: "Lightweight and breathable sky blue crochet polo shirt, perfect for summer days",
      category: "Shirts",
      priceDisplay: "S=R280, M=R320, L=R360"
    },
    // Swimwear
    {
      id: "swimwear-orange-bikini",
      imageSrc: "/lovable-uploads/e255fe3b-ce35-4980-87aa-3b593d0d626d.png",
      imageAlt: "Orange Bikini Set",
      title: "Vibrant Bikini Set",
      description: "Bright orange crochet bikini, perfect for beach days and pool parties",
      category: "Swimwear",
      priceDisplay: "S=R170, M=R200, L=R230"
    },
    // Accessories
    {
      id: "accessory-green-beanie",
      imageSrc: "/lovable-uploads/cca20f48-3399-428c-9418-804bf8a9c508.png",
      imageAlt: "Green Beanie",
      title: "Emerald Beanie",
      description: "Warm and stylish green beanie, perfect for cold winter days",
      category: "Accessories",
      priceDisplay: "R150"
    },
    {
      id: "accessory-bucket-hats",
      imageSrc: "/lovable-uploads/68f87ec2-6bd6-4657-a718-151d2cecfa27.png",
      imageAlt: "Bucket Hats Collection",
      title: "Bucket Hat Collection",
      description: "Stylish bucket hats in various colors, perfect for sun protection with a fashion twist",
      category: "Accessories",
      priceDisplay: "R150"
    },
    {
      id: "accessory-cream-brown-beanie",
      imageSrc: "/lovable-uploads/5aa296f8-52ea-47c3-89bc-bdaf4206b4a7.png",
      imageAlt: "Cream and Brown Beanie",
      title: "Two-Tone Beanie",
      description: "Stylish cream and brown beanie with ribbed texture, perfect for winter",
      category: "Accessories",
      priceDisplay: "R150"
    },
    {
      id: "accessory-blue-beanie",
      imageSrc: "/lovable-uploads/6140bc94-40b6-4cd1-81ed-4de76c6c32c6.png",
      imageAlt: "Blue Ribbed Beanie",
      title: "Ocean Blue Beanie",
      description: "Vibrant blue ribbed beanie with excellent stretch and warmth",
      category: "Accessories",
      priceDisplay: "R150"
    },
    {
      id: "accessory-brown-beanie",
      imageSrc: "/lovable-uploads/d275dcf1-7d00-4422-9fd8-6b017717850b.png",
      imageAlt: "Brown Ribbed Beanie",
      title: "Classic Brown Beanie",
      description: "Rich brown ribbed beanie with EverythingHooked label, perfect for any outfit",
      category: "Accessories",
      priceDisplay: "R150"
    },
    {
      id: "accessory-tote-bag",
      imageSrc: "/lovable-uploads/25d8b0e5-c1f2-453b-ac4b-f6a406589f9b.png",
      imageAlt: "Crochet Tote Bag",
      title: "Natural Tote Bag",
      description: "Handcrafted natural-colored tote bag with EverythingHooked label, perfect for everyday use",
      category: "Accessories",
      priceDisplay: "R200"
    },
    // Baby Clothes
    {
      id: "baby-dress-gray",
      imageSrc: "/lovable-uploads/2f2c964c-4ac4-47b6-8b6f-ed4fc2667b3c.png",
      imageAlt: "Baby Dress",
      title: "Baby Girl Dress",
      description: "Adorable gray crochet dress for babies, perfect for special occasions",
      category: "Baby Clothes",
      priceDisplay: "From R200"
    },
    // Leg Warmers
    {
      id: "leg-warmers-gray",
      imageSrc: "/lovable-uploads/d7be24c8-6653-4fd7-9cf3-260e5ebe0639.png",
      imageAlt: "Gray Leg Warmers",
      title: "Ribbed Leg Warmers",
      description: "Cozy gray ribbed leg warmers, perfect for layering and staying warm",
      category: "Leg Warmers",
      priceDisplay: "From R100"
    },
    {
      id: "leg-warmers-cream",
      imageSrc: "/lovable-uploads/fdf08431-e067-477f-972f-0b0fe6b32dbb.png",
      imageAlt: "Cream Leg Warmers",
      title: "Cable Knit Leg Warmers",
      description: "Elegant cream leg warmers with cable knit pattern, stylish and functional",
      category: "Leg Warmers",
      priceDisplay: "From R100"
    }
  ];

  const groupedByCategory = featuredItems.reduce<Record<string, ProductItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const sortedCategories = Object.keys(groupedByCategory).sort((a, b) => {
    if (a === "Cardigans") return -1;
    if (b === "Cardigans") return 1;
    if (a === "Shirts") return -1;
    if (b === "Shirts") return 1;
    return a.localeCompare(b);
  });

  return (
    <section id="featured" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 right-10 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span className="text-sm font-semibold text-pink-700">Featured Collection</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          
          <h2 className="font-playfair text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Handcrafted
            <span className="block text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-pink-500 bg-clip-text">
              Creations
            </span>
          </h2>
          
          <p className="font-inter text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our collection of beautifully handcrafted crochet pieces, each made with love and attention to detail
          </p>
        </motion.div>
        
        <AvailableNowSection />
        
        <div className="space-y-16 md:space-y-20">
          {sortedCategories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <CategoryCarousel 
                category={category} 
                items={groupedByCategory[category]} 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
