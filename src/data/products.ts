export type SizePrice = { size: string; price: number };

export type Product = {
  slug: string;
  name: string;
  category: string;
  image: string;
  alt: string;
  description: string;
  /** Price shown on cards, e.g. "S=R450, M=R500, L=R550" or "R150" */
  priceLabel: string;
  basePrice: number;
  sizes?: SizePrice[];
};

export type Category = {
  name: string;
  slug: string;
  badge?: string;
};

const U = "/lovable-uploads";

export const categories: Category[] = [
  { name: "Cardigans", slug: "cardigans", badge: "Bestseller" },
  { name: "Shirts", slug: "shirts" },
  { name: "Accessories", slug: "accessories" },
  { name: "Beanies", slug: "beanies" },
  { name: "Bucket Hats", slug: "bucket-hats" },
  { name: "Ruffle Hats", slug: "ruffle-hats" },
  { name: "Leg Warmers", slug: "leg-warmers" },
  { name: "Seasonal Specials", slug: "seasonal-specials", badge: "New" },
  { name: "Tops", slug: "tops", badge: "New" },
];

const sized = (s: number, m: number, l: number): SizePrice[] => [
  { size: "S", price: s },
  { size: "M", price: m },
  { size: "L", price: l },
  { size: "XL", price: l + 5 },
];

const oneSize = (p: number): SizePrice[] => [{ size: "One size", price: p }];

const latestProductSlugs = [
  "bag-cherry-charm-mini",
  "summer-set-fuchsia-ruffle",
  "hat-sunburst-granny-square",
  "hat-berry-dusk-bucket",
  "cardigan-forest-stripe-button",
  "bag-dusk-drawstring-shoulder",
  "cardigan-granny-square",
  "cardigan-monochrome-patchwork",
  "shirt-brown-black-button",
  "forest-ribbed-beanie",
  "oat-ribbed-beanie",
  "oat-tweed-beanie",
  "charcoal-tweed-beanie",
];

const latestProductOrder = new Map(
  latestProductSlugs.map((slug, index) => [slug, index])
);

const productListings: Product[] = [
  // Cardigans
  {
    slug: "cardigan-beige-brown-striped",
    name: "Beige & Brown Striped Cardigan",
    category: "Cardigans",
    image: `${U}/ab9a74bb-8ffd-41b7-b3bb-dfaff34a8d66.png`,
    alt: "Beige and brown striped crochet cardigan",
    description:
      "Beautiful striped cardigan with brown and beige tones, featuring classic button closure",
    priceLabel: "S=R580, M=R660, L=R750",
    basePrice: 580,
    sizes: sized(580, 660, 750),
  },
  {
    slug: "cardigan-forest-stripe-button",
    name: "Forest Stripe Button Cardigan",
    category: "Cardigans",
    image: `${U}/products/forest-stripe-button-cardigan.jpg`,
    alt: "Forest green and white striped crochet button cardigan",
    description:
      "Bold forest green and white striped cardigan with a relaxed fit, ribbed cuffs and classic button front",
    priceLabel: "S=R580, M=R660, L=R750",
    basePrice: 580,
    sizes: sized(580, 660, 750),
  },
  {
    slug: "cardigan-cozy-two-tone",
    name: "Cozy Two-Tone Cardigan",
    category: "Cardigans",
    image: `${U}/292bcef9-b482-4906-b037-def69ad64fbf.png`,
    alt: "Brown crochet cardigan with pink accents",
    description:
      "Handcrafted cardigan in brown with pink accents, perfect for chilly evenings",
    priceLabel: "S=R500, M=R580, L=R660",
    basePrice: 500,
    sizes: sized(500, 580, 660),
  },
  {
    slug: "cardigan-color-block",
    name: "Color Block Cardigan",
    category: "Cardigans",
    image: `${U}/7c1dfbee-f9f7-4b62-8b0d-ab7c5d1d2990.png`,
    alt: "Cream, tan, brown and gray color block crochet cardigan",
    description:
      "Stylish layered cardigan with cream, tan, brown and gray color blocks",
    priceLabel: "S=R650, M=R700, L=R760",
    basePrice: 650,
    sizes: sized(650, 700, 760),
  },
  {
    slug: "cardigan-cream-button",
    name: "Cream Button Cardigan",
    category: "Cardigans",
    image: `${U}/d6ea798a-68f0-4e4c-8a0e-6b0d606189db.png`,
    alt: "Cream crochet cardigan with buttons and balloon sleeves",
    description: "Elegant cream cardigan with buttons and balloon sleeves",
    priceLabel: "S=R500, M=R580, L=R660",
    basePrice: 500,
    sizes: sized(500, 580, 660),
  },
  {
    slug: "cardigan-navy-button",
    name: "Navy Button Cardigan",
    category: "Cardigans",
    image: `${U}/a6d0d655-4648-4d2c-8a1b-1e5bdb9884cd.png`,
    alt: "Navy blue ribbed crochet cardigan with buttons",
    description: "Classic navy blue cardigan with ribbed texture and button closure",
    priceLabel: "S=R500, M=R580, L=R660",
    basePrice: 500,
    sizes: sized(500, 580, 660),
  },
  {
    slug: "cardigan-red-ribbed-long",
    name: "Red Ribbed Long Cardigan",
    category: "Cardigans",
    image: `${U}/745709c6-fff5-4382-8555-07bd30ff28fc.png`,
    alt: "Long red ribbed crochet cardigan with puffy sleeves",
    description:
      "Stunning red long cardigan with ribbed texture and puffy sleeves, perfect for cozy days",
    priceLabel: "S=R900, M=R1000, L=R1200",
    basePrice: 900,
    sizes: sized(900, 1000, 1200),
  },
  {
    slug: "cardigan-granny-square",
    name: "Granny Square Cardigan",
    category: "Cardigans",
    image: `${U}/products/granny-square-cardigan.jpg`,
    alt: "Colourful granny square crochet cardigan with striped sleeves",
    description:
      "Statement granny square cardigan with colourful panels and striped sleeves",
    priceLabel: "S=R650, M=R700, L=R760",
    basePrice: 650,
    sizes: sized(650, 700, 760),
  },
  {
    slug: "cardigan-monochrome-patchwork",
    name: "Monochrome Patchwork Cardigan",
    category: "Cardigans",
    image: `${U}/products/monochrome-patchwork-cardigan.jpg`,
    alt: "Black and white patchwork crochet cardigan with collar",
    description:
      "Chunky black and white patchwork cardigan with a soft collar and ribbed cuffs",
    priceLabel: "S/M=R650, L=R700",
    basePrice: 650,
    sizes: sized(650, 650, 700),
  },

  // Shirts
  {
    slug: "shirt-beige-black-button",
    name: "Beige & Black Button Shirt",
    category: "Shirts",
    image: `${U}/9294a9a2-018c-4538-9f59-8e98a51a166c.png`,
    alt: "Beige crochet shirt with black stripes and golden details",
    description:
      "Stylish short-sleeve shirt with beige base and black stripes with golden details",
    priceLabel: "S=R350, M=R400, L=R450",
    basePrice: 350,
    sizes: sized(350, 400, 450),
  },
  {
    slug: "shirt-brown-black-button",
    name: "Brown & Black Button Shirt",
    category: "Shirts",
    image: `${U}/products/brown-black-button-shirt.jpg`,
    alt: "Brown and black striped crochet button shirt with collar",
    description:
      "Short-sleeve button shirt with rich brown tones, black stripes and a structured collar",
    priceLabel: "S=R350, M=R400, L=R450",
    basePrice: 350,
    sizes: sized(350, 400, 450),
  },
  {
    slug: "shirt-classic-beige-polo",
    name: "Classic Beige Polo",
    category: "Shirts",
    image: `${U}/8e8b348c-460f-4202-b822-cce533c16d65.png`,
    alt: "Beige crochet polo shirt",
    description: "Comfortable and breathable beige polo shirt, ideal for casual outings",
     priceLabel: "S=R350, M=R400, L=R450",
    basePrice: 350,
    sizes: sized(350, 400, 450),
  },
  {
    slug: "shirt-two-tone-button",
    name: "Two-Tone Button Shirt",
    category: "Shirts",
    image: `${U}/5b1caa4b-5579-450f-84f4-c46a9c909ab8.png`,
    alt: "Beige and brown crochet button-up shirt",
    description: "Elegant beige and brown button-up shirt with contrasting detail",
    priceLabel: "S=R350, M=R400, L=R450",
    basePrice: 350,
    sizes: sized(350, 400, 450),
  },
  {
    slug: "shirt-sky-blue-polo",
    name: "Sky Blue Crochet Polo",
    category: "Shirts",
    image: `${U}/08cd791a-6b34-44fb-abb5-b8b113488695.png`,
    alt: "Sky blue crochet polo shirt",
    description:
      "Lightweight and breathable sky blue crochet polo shirt, perfect for summer days",
    priceLabel: "S=R350, M=R400, L=R450",
    basePrice: 350,
    sizes: sized(350, 400, 450),
  },

  // Accessories
  {
    slug: "bag-cherry-charm-mini",
    name: "Cherry Charm Mini Bag",
    category: "Accessories",
    image: `${U}/products/cherry-charm-mini-bag.jpg`,
    alt: "Chunky beige crochet mini handbag with cherry charm and strap",
    description:
      "Chunky hand-crocheted mini bag with a soft rounded handle, long strap and playful cherry charm detail",
    priceLabel: "R350",
    basePrice: 350,
    sizes: oneSize(350),
  },
  {
    slug: "bag-dusk-drawstring-shoulder",
    name: "Dusk Drawstring Shoulder Bag",
    category: "Accessories",
    image: `${U}/products/dusk-drawstring-shoulder-bag.png`,
    alt: "White and black crochet drawstring shoulder bags",
    description:
      "Structured crochet shoulder bag with drawstring side ties, a long strap and clean everyday shape",
    priceLabel: "R400 each",
    basePrice: 400,
    sizes: oneSize(400),
  },
  {
    slug: "emerald-beanie",
    name: "Emerald Beanie",
    category: "Beanies",
    image: `${U}/cca20f48-3399-428c-9418-804bf8a9c508.png`,
    alt: "Green crochet beanie",
    description: "Warm and stylish green beanie, perfect for cold winter days",
    priceLabel: "R150",
    basePrice: 150,
    sizes: oneSize(150),
  },
  {
    slug: "bucket-hat-collection",
    name: "Bucket Hat Collection",
    category: "Bucket Hats",
    image: `${U}/68f87ec2-6bd6-4657-a718-151d2cecfa27.png`,
    alt: "Collection of colourful crochet bucket hats",
    description:
      "Stylish bucket hats in various colors, perfect for sun protection with a fashion twist",
    priceLabel: "R150",
    basePrice: 150,
    sizes: oneSize(150),
  },
  {
    slug: "two-tone-beanie",
    name: "Two-Tone Beanie",
    category: "Beanies",
    image: `${U}/5aa296f8-52ea-47c3-89bc-bdaf4206b4a7.png`,
    alt: "Cream and brown ribbed crochet beanie",
    description: "Stylish cream and brown beanie with ribbed texture, perfect for winter",
    priceLabel: "R150",
    basePrice: 150,
    sizes: oneSize(150),
  },
  {
    slug: "ocean-blue-beanie",
    name: "Ocean Blue Beanie",
    category: "Beanies",
    image: `${U}/6140bc94-40b6-4cd1-81ed-4de76c6c32c6.png`,
    alt: "Blue ribbed crochet beanie",
    description: "Vibrant blue ribbed beanie with excellent stretch and warmth",
    priceLabel: "R150",
    basePrice: 150,
    sizes: oneSize(150),
  },
  {
    slug: "classic-brown-beanie",
    name: "Classic Brown Beanie",
    category: "Beanies",
    image: `${U}/d275dcf1-7d00-4422-9fd8-6b017717850b.png`,
    alt: "Brown ribbed crochet beanie with EverythingHooked label",
    description:
      "Rich brown ribbed beanie with EverythingHooked label, perfect for any outfit",
    priceLabel: "R150",
    basePrice: 150,
    sizes: oneSize(150),
  },
  {
    slug: "natural-tote-bag",
    name: "Natural Tote Bag",
    category: "Accessories",
    image: `${U}/25d8b0e5-c1f2-453b-ac4b-f6a406589f9b.png`,
    alt: "Natural coloured crochet tote bag",
    description:
      "Handcrafted natural-colored tote bag with EverythingHooked label, perfect for everyday use",
    priceLabel: "R200",
    basePrice: 200,
    sizes: oneSize(200),
  },
  {
    slug: "pink-ruffle-hat",
    name: "Pink Ruffle Hat",
    category: "Ruffle Hats",
    image: `${U}/c8fdb45d-3fab-4956-8c57-599c3ed66845.png`,
    alt: "Pink striped crochet cat ear beanie",
    description:
      "Adorable pink cat ear beanie with striped pattern, perfect for playful winter style",
    priceLabel: "R250",
    basePrice: 250,
    sizes: oneSize(250),
  },
  {
    slug: "hat-sunburst-granny-square",
    name: "Sunburst Granny Square Bucket Hat",
    category: "Bucket Hats",
    image: `${U}/products/sunburst-granny-square-bucket-hat.jpg`,
    alt: "Bright multicolour granny square crochet bucket hat",
    description:
      "Colour-rich granny square bucket hat with floral motifs and a soft flared brim for sunny statement styling",
    priceLabel: "R250",
    basePrice: 250,
    sizes: oneSize(250),
  },
  {
    slug: "hat-berry-dusk-bucket",
    name: "Berry Dusk Bucket Hat",
    category: "Bucket Hats",
    image: `${U}/products/berry-dusk-bucket-hat.jpg`,
    alt: "Pink and red striped crochet bucket hat",
    description:
      "Soft bucket hat in berry pink and red stripes, made for a snug handmade finish and easy everyday wear",
    priceLabel: "R150",
    basePrice: 150,
    sizes: oneSize(150),
  },
  {
    slug: "forest-ribbed-beanie",
    name: "Forest Ribbed Beanie",
    category: "Beanies",
    image: `${U}/products/forest-ribbed-beanie.jpg`,
    alt: "Forest green ribbed crochet beanie with EverythingHooked label",
    description:
      "Warm forest green ribbed beanie finished with an EverythingHooked label",
    priceLabel: "R150",
    basePrice: 150,
    sizes: oneSize(150),
  },
  {
    slug: "oat-ribbed-beanie",
    name: "Oat Ribbed Beanie",
    category: "Beanies",
    image: `${U}/products/oat-ribbed-beanie.jpg`,
    alt: "Oat coloured ribbed crochet beanie",
    description: "Soft oat-toned ribbed beanie with a classic folded cuff",
    priceLabel: "R150",
    basePrice: 150,
    sizes: oneSize(150),
  },
  {
    slug: "oat-tweed-beanie",
    name: "Oat Tweed Beanie",
    category: "Beanies",
    image: `${U}/products/oat-tweed-beanie.jpg`,
    alt: "Oat tweed crochet beanie with folded cuff",
    description: "Neutral oat tweed beanie with a textured folded cuff",
    priceLabel: "R150",
    basePrice: 150,
    sizes: oneSize(150),
  },
  {
    slug: "charcoal-tweed-beanie",
    name: "Charcoal Tweed Beanie",
    category: "Beanies",
    image: `${U}/products/charcoal-tweed-beanie.jpg`,
    alt: "Charcoal tweed crochet beanie with folded cuff",
    description: "Charcoal tweed beanie with subtle flecks and a cozy ribbed cuff",
    priceLabel: "R150",
    basePrice: 150,
    sizes: oneSize(150),
  },

  // Leg Warmers
  {
    slug: "ribbed-leg-warmers",
    name: "Ribbed Leg Warmers",
    category: "Leg Warmers",
    image: `${U}/d7be24c8-6653-4fd7-9cf3-260e5ebe0639.png`,
    alt: "Gray ribbed crochet leg warmers",
    description: "Cozy gray ribbed leg warmers, perfect for layering and staying warm",
    priceLabel: "From R100",
    basePrice: 100,
    sizes: oneSize(100),
  },
  {
    slug: "cable-knit-leg-warmers",
    name: "Cable Knit Leg Warmers",
    category: "Leg Warmers",
    image: `${U}/fdf08431-e067-477f-972f-0b0fe6b32dbb.png`,
    alt: "Cream cable knit crochet leg warmers",
    description: "Elegant cream leg warmers with cable knit pattern, stylish and functional",
    priceLabel: "From R100",
    basePrice: 100,
    sizes: oneSize(100),
  },

  // Seasonal Specials
  {
    slug: "summer-set-fuchsia-ruffle",
    name: "Fuchsia Ruffle Summer Set",
    category: "Seasonal Specials",
    image: `${U}/products/fuchsia-ruffle-summer-set.jpg`,
    alt: "Bright fuchsia crochet halter top and ruffle skirt set",
    description:
      "Vibrant handmade summer set with a halter-style crochet top, ruffled skirt and playful tie details",
    priceLabel: "From R500",
    basePrice: 500,
    sizes: oneSize(500),
  },
  {
    slug: "summer-beach-set",
    name: "Summer Beach Set",
    category: "Seasonal Specials",
    image: `${U}/d910cf04-5989-46cf-8bc7-a9bcb94356b4.png`,
    alt: "Blue and white checkered crochet summer set",
    description: "Stylish blue and white checkered set including a hat and accessories",
    priceLabel: "From R150",
    basePrice: 150,
    sizes: sized(150, 180, 210),
  },
  {
    slug: "vibrant-bikini-set",
    name: "Vibrant Bikini Set",
    category: "Seasonal Specials",
    image: `${U}/e255fe3b-ce35-4980-87aa-3b593d0d626d.png`,
    alt: "Bright orange crochet bikini set",
    description: "Bright orange crochet bikini, perfect for beach days and pool parties",
    priceLabel: "S=R170, M=R200, L=R230",
    basePrice: 170,
    sizes: sized(170, 200, 230),
  },
  {
    slug: "baby-girl-dress",
    name: "Baby Girl Dress",
    category: "Seasonal Specials",
    image: `${U}/2f2c964c-4ac4-47b6-8b6f-ed4fc2667b3c.png`,
    alt: "Gray crochet baby dress",
    description: "Adorable gray crochet dress for babies, perfect for special occasions",
    priceLabel: "From R200",
    basePrice: 200,
    sizes: oneSize(200),
  },

  // Tops
  {
    slug: "ruffled-crop-top",
    name: "Ruffled Crop Top",
    category: "Tops",
    image: `${U}/3b8fc3fe-1891-426b-9f1c-7e6d61851ee4.png`,
    alt: "Cream crochet crop top with ruffle details",
    description: "Delicate cream crop top with ruffle details and tie front",
    priceLabel: "S=R200, M=R250, L=R280",
    basePrice: 200,
    sizes: sized(200, 250, 280),
  },
  {
    slug: "summer-crop-top",
    name: "Summer Crop Top",
    category: "Tops",
    image: `${U}/d977b0bc-aa7a-49ea-9d6a-c37dbe6e71b9.png`,
    alt: "White crochet crop top with tie-back design",
    description:
      "Elegant white crochet crop top with tie-back design, perfect for summer days",
    priceLabel: "S=R170, M=R200, L=R230",
    basePrice: 170,
    sizes: sized(170, 200, 230),
  },
];

export const products: Product[] = productListings
  .map((product, index) => ({ product, index }))
  .sort((a, b) => {
    const aOrder = latestProductOrder.get(a.product.slug) ?? Number.POSITIVE_INFINITY;
    const bOrder = latestProductOrder.get(b.product.slug) ?? Number.POSITIVE_INFINITY;

    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.index - b.index;
  })
  .map(({ product }) => product);

export const featuredProduct = {
  ...products.find((p) => p.slug === "pink-ruffle-hat")!,
  heroImage: `${U}/3d200bb5-6fc3-434c-babc-f4df8d2f6f3f.png`,
  blurb:
    "Handcrafted with premium materials, this elegant ruffle hat adds a touch of sophistication to any outfit.",
  price: 200,
};

export const colorOptions = [
  "Pink",
  "Blue",
  "White",
  "Yellow",
  "Purple",
  "Beige",
  "Brown",
  "Black",
  "Green",
  "Gray",
];

export const CONTACT_EMAIL = "everythinghooked09@gmail.com";
export const INSTAGRAM_HANDLE = "@everything_hooked";
export const INSTAGRAM_URL = "https://www.instagram.com/everything_hooked";
export const WHATSAPP_NUMBER = "+27608581873";
export const WHATSAPP_URL =
  "https://wa.me/27608581873?text=Hi%20EverythingHooked%2C%20I%27d%20like%20to%20place%20an%20order.";

export const faqs = [
  {
    q: "How do I place an order?",
    a: "Browse the collection, open a product, choose your colour and size, then add it to your cart. When you're ready, send your order through and we'll confirm the details and payment with you directly.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept EFT and instant bank transfers. Payment details are shared with you once your order is confirmed.",
  },
  {
    q: "How long does delivery take?",
    a: "Each piece is made to order. Production usually takes 3–7 working days, and delivery within South Africa takes a further 2–4 working days.",
  },
  {
    q: "Do you offer returns or exchanges?",
    a: "Because every item is handmade to order, we don't offer returns on custom pieces. If something arrives faulty or isn't as described, contact us within 7 days and we'll make it right.",
  },
  {
    q: "Can I get a custom size or design?",
    a: "Absolutely. Custom sizes, colours and designs are welcome — use the custom order form and tell us exactly what you have in mind.",
  },
  {
    q: "How do I care for my crochet items?",
    a: "Hand wash in cool water with a gentle detergent, don't wring, and dry flat in the shade to keep the shape and stitch definition.",
  },
];

export function findProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function productsByCategory(name: string) {
  return products.filter((p) => p.category === name);
}

export function formatRand(value: number) {
  return `R${value.toFixed(2)}`;
}
