export interface ExtendedProductSeed {
  _id?: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  countInStock: number;
  rating: number;
  numReviews: number;
}

export const extendedProductsArray: ExtendedProductSeed[] = [
  // ================== WATCHES (13 products) ==================
  {
    name: 'Premium Leather Executive Chronograph',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    description: 'A handcrafted Italian leather chronograph with a sapphire sandblasted glass display for the modern explorer.',
    category: 'Watch',
    countInStock: 12,
    rating: 4.8,
    numReviews: 42
  },
  {
    name: 'Minimalist Steel Silver Mesh Watch',
    price: 189.00,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314',
    description: 'Ultra-thin, featherweight polished silver build featuring custom-welded metal mesh loops and surgical-grade hardware.',
    category: 'Watch',
    countInStock: 20,
    rating: 4.6,
    numReviews: 19
  },
  {
    name: 'Sport Active Digital OLED Watch',
    price: 85.00,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12',
    description: 'Rugged dustproof and shock-resistant layout featuring full step-counting biometric metrics, ambient timer, and dual timezone displays.',
    category: 'Watch',
    countInStock: 35,
    rating: 4.4,
    numReviews: 53
  },
  {
    name: 'Imperial Classic 18k Gold Plated Watch',
    price: 450.00,
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3',
    description: 'Timeless luxury dress watch plated with deep gold finish, customized indices, and heavy Roman numeral layout.',
    category: 'Watch',
    countInStock: 8,
    rating: 4.9,
    numReviews: 28
  },
  {
    name: 'Smartwatch Active Pro V2',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a',
    description: 'Next-generation intelligent sensor companion tracks sleep, active oxygenation, and high-frequency GPS logs with ease.',
    category: 'Watch',
    countInStock: 15,
    rating: 4.7,
    numReviews: 91
  },
  {
    name: 'Oceanic Stainless Steel Diver Watch',
    price: 380.00,
    image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0',
    description: 'Professional ocean diving timepiece sealed tight up to 200m depth with rotating blue bezel and glowing dials.',
    category: 'Watch',
    countInStock: 10,
    rating: 4.8,
    numReviews: 32
  },
  {
    name: 'Sleek Dark Chrono Stealth watch',
    price: 220.00,
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d',
    description: 'Dark satin-finished aerospace titanium bezel paired with dual calendar widgets and soft tactical straps.',
    category: 'Watch',
    countInStock: 14,
    rating: 4.5,
    numReviews: 24
  },
  {
    name: 'Traditional Heritage Oak Pocket Watch',
    price: 165.00,
    image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5',
    description: 'Vintage mechanism pocket configuration boasting polished brass hinges, mechanical hand-wind spiral, and organic wooden inlays.',
    category: 'Watch',
    countInStock: 6,
    rating: 4.9,
    numReviews: 12
  },
  {
    name: 'Elite Steel Chronograph Luxury Watch',
    price: 520.00,
    image: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=600&q=80',
    description: 'Masterfully built water-resistant mechanical chronograph featuring high contrast indices and multi-dial stopwatch gauges.',
    category: 'Watch',
    countInStock: 7,
    rating: 4.9,
    numReviews: 40
  },
  {
    name: 'Aero Dynamic Sports Runner Watch',
    price: 145.00,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=600&q=80',
    description: 'Streamlined athletic chronograph fitted with sweat-venting silicone watchbands and automatic smart lap counter.',
    category: 'Watch',
    countInStock: 22,
    rating: 4.3,
    numReviews: 16
  },
  {
    name: 'Futura Horizon Carbon Fiber Watch',
    price: 610.00,
    image: 'https://images.unsplash.com/photo-1619134778706-7015533a6150?auto=format&fit=crop&w=600&q=80',
    description: 'Premium aerospace carbon casing protecting state-of-the-art automatic self-winding internal rotors.',
    category: 'Watch',
    countInStock: 5,
    rating: 5.0,
    numReviews: 9
  },
  {
    name: 'Aviator Vintage Leather Pilot Watch',
    price: 275.00,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80',
    description: 'Recreation of classical 1940s pilot watch with broad easy-read layout, genuine cowhide leather, and bright lume.',
    category: 'Watch',
    countInStock: 11,
    rating: 4.7,
    numReviews: 31
  },
  {
    name: 'Regal Rosewood Gold Accent Watch',
    price: 320.00,
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=600&q=80',
    description: 'Beautiful wood-cased fashion timepiece detailed with rose gold dial hardware and a soft-textured beige strap.',
    category: 'Watch',
    countInStock: 9,
    rating: 4.6,
    numReviews: 15
  },

  // ================== SHOES (13 products) ==================
  {
    name: 'Classic Full-Grain Leather Sneakers',
    price: 120.00,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
    description: 'Minimalist hand-assembled premium white low-tops with dynamic arch support and robust textured vulcanized outsoles.',
    category: 'Shoes',
    countInStock: 18,
    rating: 4.5,
    numReviews: 38
  },
  {
    name: 'Urban Trail Performance Running Shoes',
    price: 95.00,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    description: 'Engineered lightweight athletic knit design with nitrogen-infused cushion foam soles for outstanding marathon energy return.',
    category: 'Shoes',
    countInStock: 22,
    rating: 4.7,
    numReviews: 67
  },
  {
    name: 'Chroma Street High-Top Sneakers',
    price: 145.00,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
    description: 'Chic urban high-tops boasting dynamic stitch paneling, vintage lace hooks, and extra cushioned tongue support.',
    category: 'Shoes',
    countInStock: 14,
    rating: 4.6,
    numReviews: 45
  },
  {
    name: 'Snowcrest Winter Waterproof Leather Boots',
    price: 175.50,
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570',
    description: 'Rugged weather-sealed adventure boots lined with dense fleece insoles and traction grip vibram soles for wet climates.',
    category: 'Shoes',
    countInStock: 10,
    rating: 4.8,
    numReviews: 29
  },
  {
    name: 'Minimalist Clean White Canvas Shoes',
    price: 55.00,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5',
    description: 'Sleek eco-friendly reinforced canvas footwear. Breathable, easily washable, and comfortable for quick park walks.',
    category: 'Shoes',
    countInStock: 30,
    rating: 4.3,
    numReviews: 110
  },
  {
    name: 'Velocity Aero-Trainer Cushion Shoes',
    price: 115.00,
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
    description: 'Fitted with elastic wave-plate soles that dynamic stabilize steps during high-intensity fitness drills.',
    category: 'Shoes',
    countInStock: 25,
    rating: 4.5,
    numReviews: 54
  },
  {
    name: 'Nomad Premium Suede Chelsea Boots',
    price: 160.00,
    image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a',
    description: 'Rich water-resistant calfskin suede Chelsea boot with flexible contrast side elastic bands and crepe rubber soles.',
    category: 'Shoes',
    countInStock: 12,
    rating: 4.7,
    numReviews: 33
  },
  {
    name: 'Vortex Mesh Daily Road Trainers',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d',
    description: 'Hypoallergenic open-cell knit mesh top provides superior ventilation for hot mid-day outdoor exercises.',
    category: 'Shoes',
    countInStock: 16,
    rating: 4.4,
    numReviews: 21
  },
  {
    name: 'Hyperion Carbon Fiber Track Spikes',
    price: 199.00,
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2',
    description: 'Professional racing spikes build for sprinters seeking elite-level stiffness and weight optimized to the gram.',
    category: 'Shoes',
    countInStock: 8,
    rating: 4.9,
    numReviews: 16
  },
  {
    name: 'Vintage Sun Yellow Canvas Trainers',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2',
    description: 'Retro 1970s low-top silhouette dyed in vibrant mustard yellow colors, designed with natural defense toe bumpers.',
    category: 'Shoes',
    countInStock: 20,
    rating: 4.6,
    numReviews: 42
  },
  {
    name: 'Volt Lime Neon Gym Shoes',
    price: 105.00,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
    description: 'High visibility electric neon athletic footwear designed to give maximum shock-damping inside studio gyms.',
    category: 'Shoes',
    countInStock: 15,
    rating: 4.5,
    numReviews: 36
  },
  {
    name: 'Earthy Retro Suede Court Shoes',
    price: 110.00,
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3',
    description: 'Low-cut tennis court inspired shoe wrapped in split-grain leather and soft grey suede for daily casual styles.',
    category: 'Shoes',
    countInStock: 19,
    rating: 4.6,
    numReviews: 22
  },
  {
    name: 'Premium Leather Work Oxfords',
    price: 139.99,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80',
    description: 'Gloss oiled black leather business oxfords built with a supportive steel shank and Goodyear welted sole.',
    category: 'Shoes',
    countInStock: 11,
    rating: 4.7,
    numReviews: 18
  },

  // ================== ELECTRONICS (13 products) ==================
  {
    name: 'Acoustic Elite Studio Headphones',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    description: 'Active hybrid noise-canceling stereo monitoring headphones boasting fine wooden chambers and 40mm beryllium speaker drivers.',
    category: 'Electronics',
    countInStock: 15,
    rating: 4.8,
    numReviews: 89
  },
  {
    name: 'Aura Wireless Bluetooth Headphones',
    price: 159.00,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b',
    description: 'High fidelity audio paired with memory foam earcups and a ultra-capacity battery rated for up to 60 hours continuous play.',
    category: 'Electronics',
    countInStock: 25,
    rating: 4.6,
    numReviews: 142
  },
  {
    name: 'Nexus Active Wireless Earbuds',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb',
    description: 'Micro sweatproof sports in-earbuds with touch gestures, adaptive vocal awareness, and clear audio playback.',
    category: 'Electronics',
    countInStock: 30,
    rating: 4.4,
    numReviews: 74
  },
  {
    name: 'Apex Mechanical Gaming Keyboard RGB',
    price: 115.00,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    description: 'Hot-swappable tactile linear switches encased in lightweight brushed aluminum frame. Dynamic customizable backlight profiles.',
    category: 'Electronics',
    countInStock: 12,
    rating: 4.7,
    numReviews: 56
  },
  {
    name: 'Precision Wireless Ergo Mouse',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7',
    description: 'Ergonomic vertical grip wireless mouse with adjustable high rate DPI tracking optic sensors for productivity.',
    category: 'Electronics',
    countInStock: 22,
    rating: 4.5,
    numReviews: 29
  },
  {
    name: 'Optima Pro Smart Tablet Holder Frame',
    price: 49.00,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
    description: 'Flexible aircraft-grade aluminum stand fits up to 13 inch tablets with magnetic rotation locks.',
    category: 'Electronics',
    countInStock: 40,
    rating: 4.2,
    numReviews: 15
  },
  {
    name: 'Vintage Retro Wooden Radio Speaker',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90',
    description: 'Retro 1950s inspired compact radio packed with modern Bluetooth 5.2 connectivity and warm bass tuning chambers.',
    category: 'Electronics',
    countInStock: 18,
    rating: 4.7,
    numReviews: 37
  },
  {
    name: 'CinemaSound Premium Soundbar Duo',
    price: 199.00,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46',
    description: 'Compact high-definition multi-channel soundbar with immersive Dolby spatial acoustics support and optical audio.',
    category: 'Electronics',
    countInStock: 10,
    rating: 4.6,
    numReviews: 45
  },
  {
    name: 'Pulse Splashproof Bluetooth Speaker',
    price: 65.00,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1',
    description: 'IPX7 submersible portable speaker with rubberized exterior bumpers and dense dual-firing subwoofers.',
    category: 'Electronics',
    countInStock: 28,
    rating: 4.5,
    numReviews: 61
  },
  {
    name: 'UltraWide Curved 34-Inch Display',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
    description: 'Beautiful curved high refresh rate monitor featuring 99% sRGB profile mapping perfect for design and code.',
    category: 'Electronics',
    countInStock: 6,
    rating: 4.9,
    numReviews: 18
  },
  {
    name: 'Phonograph Classic Wood Record Player',
    price: 180.00,
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944',
    description: 'Authentic belt-driven turntable nestled in dark walnut cabinets with high grade built-in pre-amp systems.',
    category: 'Electronics',
    countInStock: 9,
    rating: 4.8,
    numReviews: 24
  },
  {
    name: 'Broadcaster Cardioid Desk Microphone',
    price: 110.00,
    image: 'https://images.unsplash.com/photo-1590608897129-79da98d15969?auto=format&fit=crop&w=600&q=80',
    description: 'Podcast-ready high fidelity condenser microphone featuring instant hardware gain dials & silent tap-mute sensor.',
    category: 'Electronics',
    countInStock: 14,
    rating: 4.7,
    numReviews: 33
  },
  {
    name: 'Nomad Power Bank Hub 20K',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf',
    description: 'High capacity 20,000mAh external power battery support with dual power delivery charging outputs.',
    category: 'Electronics',
    countInStock: 50,
    rating: 4.4,
    numReviews: 80
  },

  // ================== FASHION (13 products) ==================
  {
    name: 'Designer Floral Silk Summer Dress',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
    description: 'Ethereal, breathable knit print flowy summer dress styled with comfortable spaghetti straps.',
    category: 'Fashion',
    countInStock: 15,
    rating: 4.6,
    numReviews: 28
  },
  {
    name: 'Emerald Evening Silk Gown',
    price: 250.00,
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae',
    description: 'Stunning premium emerald green woven mulberry silk gown with layered tail curves for formal evening events.',
    category: 'Fashion',
    countInStock: 7,
    rating: 4.9,
    numReviews: 15
  },
  {
    name: 'Retro Heavy Denim Vintage Jacket',
    price: 75.00,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=600&q=80',
    description: 'Classic faded pre-shrunk indigo cotton denim jacket detailed with durable zinc copper alloy rivets.',
    category: 'Fashion',
    countInStock: 25,
    rating: 4.5,
    numReviews: 60
  },
  {
    name: 'Executive Bespoke Tailored Suit',
    price: 499.00,
    image: 'https://images.unsplash.com/photo-1593030103066-0093718efeb9?auto=format&fit=crop&w=600&q=80',
    description: 'Sartorial executive two-piece check wool blazer set with precise padded athletic shoulder contours.',
    category: 'Fashion',
    countInStock: 8,
    rating: 4.8,
    numReviews: 14
  },
  {
    name: 'Alpine Winter Heavy Wool Coat',
    price: 180.00,
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
    description: 'Double-breasted luxurious earth-tone wool trenchcoat structured to resist heavy high-altitude winter chills.',
    category: 'Fashion',
    countInStock: 10,
    rating: 4.7,
    numReviews: 24
  },
  {
    name: 'Cozy Cloud White Knit Sweater',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105',
    description: 'Over-sized relaxed wear cotton blend cable-knit sweater dyed in organic soft cloud tones.',
    category: 'Fashion',
    countInStock: 18,
    rating: 4.6,
    numReviews: 45
  },
  {
    name: 'Rogue Premium Leather Biker Jacket',
    price: 220.00,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5',
    description: 'Thick, protective oiled cowhide leather detailed with custom chrome industrial utility heavy zippers.',
    category: 'Fashion',
    countInStock: 9,
    rating: 4.8,
    numReviews: 19
  },
  {
    name: 'Monochrome Street Knitwear Sweater',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
    description: 'Edgy minimalist black-and-grey geometric layout knit apparel designed for comfortable streetwear styles.',
    category: 'Fashion',
    countInStock: 20,
    rating: 4.4,
    numReviews: 31
  },
  {
    name: 'Minimal Solid Jet Black Premium Tee',
    price: 29.50,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a',
    description: 'Ultra-heavyweight ringspun combed organic cotton t-shirt with tight ribbing and modern drop shoulders.',
    category: 'Fashion',
    countInStock: 45,
    rating: 4.7,
    numReviews: 88
  },
  {
    name: 'Timber Checkered Flannel Shirt',
    price: 42.00,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf',
    description: 'Soft-brushed twin-pocket flannel shirting perfect for mid-season outdoor layer configurations.',
    category: 'Fashion',
    countInStock: 30,
    rating: 4.5,
    numReviews: 40
  },
  {
    name: 'Metropolitan Camel Wool Trenchcoat',
    price: 195.00,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80',
    description: 'Elegant long-profile beige double-breasted coat fitted with adjustable cuff straps and interior satin lining.',
    category: 'Fashion',
    countInStock: 11,
    rating: 4.8,
    numReviews: 22
  },
  {
    name: 'Linen Oasis Casual Light Shirt',
    price: 49.00,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633',
    description: 'Ultra-loose summer linen shirt woven entirely with breathable textured flax fibers.',
    category: 'Fashion',
    countInStock: 24,
    rating: 4.4,
    numReviews: 18
  },
  {
    name: 'Sahara Earth-Tone Linen Trousers',
    price: 65.00,
    image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=600&q=80',
    description: 'Comfortable drawstring trousers dyed with botanical pigments, perfect for beach getaways.',
    category: 'Fashion',
    countInStock: 15,
    rating: 4.5,
    numReviews: 12
  },

  // ================== ACCESSORIES (13 products) ==================
  {
    name: 'Tuscan Suede Hand-Stitched Bag',
    price: 195.00,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
    description: 'Luxury vegetable-tanned handbag tailored with gold clips and dual security micro pockets.',
    category: 'Accessories',
    countInStock: 8,
    rating: 4.9,
    numReviews: 41
  },
  {
    name: 'Minimal Bifold Calfskin Wallet',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e',
    description: 'Laser-cut premium leather bifold featuring hidden cash sleeves and RFID block electromagnetic signal shielding.',
    category: 'Accessories',
    countInStock: 35,
    rating: 4.7,
    numReviews: 120
  },
  {
    name: 'Aero Gold-Rim Retro Sunglasses',
    price: 110.00,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f',
    description: 'Ultralight stainless titanium sunglasses with polarized UV450 shielding gradients for maximum glare defense.',
    category: 'Accessories',
    countInStock: 16,
    rating: 4.6,
    numReviews: 34
  },
  {
    name: 'Classic Aviator Shadow Sunglasses',
    price: 125.00,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083',
    description: 'Timeless tear-drop aviators with polarized dark lenses and soft-grip silicone temple pads.',
    category: 'Accessories',
    countInStock: 22,
    rating: 4.8,
    numReviews: 50
  },
  {
    name: 'Explorer Heavy Duty Canvas Duffel',
    price: 140.00,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b',
    description: 'Spacious weekend duffel bag assembled with military-grade thick waxed canvas and brass hardware caps.',
    category: 'Accessories',
    countInStock: 12,
    rating: 4.7,
    numReviews: 28
  },
  {
    name: 'Classic Sterling Solid Silver Cuff',
    price: 85.00,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908',
    description: 'Hand-hammered sterling silver 925 cuff wristband with a smooth, subtly brushed industrial finish.',
    category: 'Accessories',
    countInStock: 20,
    rating: 4.5,
    numReviews: 19
  },
  {
    name: 'Heritage Plaid Wool Winter Scarf',
    price: 39.00,
    image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288',
    description: 'Ultra-soft cashmere wool blend scarf woven in traditional green-and-navy historic checks.',
    category: 'Accessories',
    countInStock: 30,
    rating: 4.7,
    numReviews: 43
  },
  {
    name: 'Ibiza Woven Straw Summer Beach Tote',
    price: 52.00,
    image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346',
    description: 'Rustic woven natural palm straw tote bag detailed with reinforced tan leather top handle loops.',
    category: 'Accessories',
    countInStock: 15,
    rating: 4.4,
    numReviews: 12
  },
  {
    name: 'Panama Classic Straw Sun Hat',
    price: 48.00,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',
    description: 'Fine Ecuadorian style woven straw sun-hat featuring a dark navy grosgrain silk trim ribbon.',
    category: 'Accessories',
    countInStock: 18,
    rating: 4.6,
    numReviews: 27
  },
  {
    name: 'Minimal Tact Belt & Travel Loop Set',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990',
    description: 'Stretch utility canvas belt paired with quick-release metal buckles for easy, airport-ready travel setups.',
    category: 'Accessories',
    countInStock: 40,
    rating: 4.3,
    numReviews: 31
  },
  {
    name: 'Voyager Anti-Theft Slim Backpack',
    price: 98.00,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b',
    description: 'Waterproof slim tech pack with secret zippers and built-in USB cable pass-through port holes.',
    category: 'Accessories',
    countInStock: 14,
    rating: 4.8,
    numReviews: 62
  },
  {
    name: 'Craftsman Suede Heavy Utility Belt',
    price: 55.00,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    description: 'Durable top-grain suede belt designed with gold buckle hooks for casual jeans pairings.',
    category: 'Accessories',
    countInStock: 25,
    rating: 4.5,
    numReviews: 15
  },
  {
    name: 'Bari Premium Brass Key Clip',
    price: 24.00,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990',
    description: 'Sand-cast solid brass quick release hook clip designed to attach easily to belt loops.',
    category: 'Accessories',
    countInStock: 60,
    rating: 4.6,
    numReviews: 20
  },

  // ================== MOBILE (10 products) ==================
  {
    name: 'iPhone 15 Pro Max',
    price: 1199.00,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80',
    description: 'Sleek aerospace titanium finish build, customized Action button, outstanding A17 Pro tech chips, and 5x optical optical telephoto capture.',
    category: 'Mobile',
    countInStock: 15,
    rating: 4.9,
    numReviews: 142
  },
  {
    name: 'Samsung Galaxy S23 Ultra Pro',
    price: 1299.00,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf',
    description: 'Integrated ultra-capacitive stylus S-Pen tracking with gorgeous 200MP detail cameras and advanced crystal screen controls.',
    category: 'Mobile',
    countInStock: 18,
    rating: 4.8,
    numReviews: 87
  },
  {
    name: 'Google Pixel 8 Superphone',
    price: 799.00,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97',
    description: 'The standard of custom intelligent computation with magic eraser photo tools and clear live voice translations.',
    category: 'Mobile',
    countInStock: 21,
    rating: 4.7,
    numReviews: 46
  },
  {
    name: 'OnePlus 11 5G Supercharged',
    price: 699.00,
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd',
    description: 'Buttery smooth 120Hz display with liquid chamber cooling and spectacular high contrast camera arrays.',
    category: 'Mobile',
    countInStock: 14,
    rating: 4.5,
    numReviews: 28
  },
  {
    name: 'OmniFold Double Flip Smartphone',
    price: 1099.00,
    image: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7',
    description: 'Innovative folding OLED frame designed to convert fluidly from sub-compact pocket sizing to expansive video viewing panes.',
    category: 'Mobile',
    countInStock: 10,
    rating: 4.6,
    numReviews: 32
  },
  {
    name: 'Celeste Vintage Pink Smartphone',
    price: 549.00,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
    description: 'Charming pastel pink handset layered with durable ceramic-shield glass covers and an optimized micro selfie flash.',
    category: 'Mobile',
    countInStock: 12,
    rating: 4.4,
    numReviews: 19
  },
  {
    name: 'Gladiator Ultimate Gaming Phone',
    price: 899.00,
    image: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7',
    description: 'High frequency tactile screen panels paired with physical trigger inputs, rgb custom backplates, and robust surround audio.',
    category: 'Mobile',
    countInStock: 8,
    rating: 4.7,
    numReviews: 24
  },
  {
    name: 'Slimline Air Premium Handset',
    price: 649.00,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505',
    description: 'Superbly thin handheld phone utilizing bio-plastics and low reflection display finishes for minimal thumb fatigue.',
    category: 'Mobile',
    countInStock: 16,
    rating: 4.5,
    numReviews: 12
  },
  {
    name: 'Redmi Prime Performance Mobile',
    price: 420.00,
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=600&q=80',
    description: 'High value day-to-day phone containing super fast face unlocks, wide 50MP triple sensor cameras and dense battery grids.',
    category: 'Mobile',
    countInStock: 25,
    rating: 4.3,
    numReviews: 39
  },
  {
    name: 'AeroLite Compact 5G Handset',
    price: 499.00,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80',
    description: 'Super pocket-friendly size phone packing a punch featuring an ultra-bright OLED display panel.',
    category: 'Mobile',
    countInStock: 15,
    rating: 4.4,
    numReviews: 18
  },

  // ================== COMPUTER (6 products) ==================
  {
    name: 'MacBook Pro M3 Max Slate Black',
    price: 2499.00,
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80',
    description: 'Enormously powerful studio workstation packing Apple M3 Max silicone, 36GB high speed combined RAM and 1TB SSD.',
    category: 'Computer',
    countInStock: 8,
    rating: 4.9,
    numReviews: 45
  },
  {
    name: 'Blade Pro Extreme Gaming Laptop',
    price: 1899.00,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
    description: 'NVIDIA RTX 4080 graphics matching high speed i9 processors under vapor chamber heat escapes for max frames.',
    category: 'Computer',
    countInStock: 6,
    rating: 4.8,
    numReviews: 29
  },
  {
    name: 'Concept Minimal Titanium Desktop PC',
    price: 1450.00,
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=600&q=80',
    description: 'A masterpiece workstation with pre-installed clean developer cooling grids and heavy-duty graphics compute modules.',
    category: 'Computer',
    countInStock: 5,
    rating: 4.7,
    numReviews: 14
  },
  {
    name: 'ThinkPad Elite Carbon Business Laptop',
    price: 1299.00,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
    description: 'Military Grade drop protection keyboard, 18-hour optimized high uptime batteries, and physical camera privacy shutters.',
    category: 'Computer',
    countInStock: 12,
    rating: 4.6,
    numReviews: 76
  },
  {
    name: 'Chromebook Cloud Lite Student Laptop',
    price: 349.00,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80',
    description: 'A lightweight Chromebook for quick browsing, study groups, essays, and online classes.',
    category: 'Computer',
    countInStock: 25,
    rating: 4.3,
    numReviews: 34
  },
  {
    name: 'AeroBook Air Ultraportable 13-Inch',
    price: 899.00,
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80',
    description: 'Super thin fanless silent operations styled with durable sandblasted aluminum chassis.',
    category: 'Computer',
    countInStock: 14,
    rating: 4.5,
    numReviews: 18
  }
];
