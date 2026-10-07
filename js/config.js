// ============================================================
//  Brew & Bloom: all café details live in this file.
//  Edit it, save, and refresh the page.
//  PRICES BELOW ARE SAMPLE PRICES. Confirm every price and hour with the owner.
// ============================================================
window.CAFE = {
  name: 'Brew & Bloom',
  type: 'Café',
  city: 'Bengaluru',
  area: 'Church Street',
  tagline: 'Specialty coffee, cold brew, matcha and good food on Church Street.',
  heroTitle: 'Where good coffee blooms.',
  address: 'Church Street, Bengaluru',
  phone: '+91 8001231671',
  whatsapp: '918001231671', // country code + number, digits only. Orders are sent here.
  email: '',
  instagram: '',

  // SAMPLE hours: replace with the real ones
  hours: [
    ['Monday to Friday', '8:00 AM to 10:00 PM'],
    ['Saturday and Sunday', '8:00 AM to 11:00 PM'],
  ],

  highlights: [
    { title: 'Build your own drink', text: 'Pick espresso, cold brew or matcha, then your milk, size and syrup.' },
    { title: 'Four milk choices', text: 'Regular, oat, coconut or almond, whatever you like best.' },
    { title: 'Earn as you sip', text: 'Collect rewards points on every order and redeem them for money off.' },
  ],

  loyalty: {
    earnEvery: 10,      // 1 point for every \u20B910 spent
    redeemPoints: 100,  // points needed for a reward
    redeemValue: 50,    // reward = \u20B950 off
    welcomeBonus: 25,   // points for joining
    tiers: [['Bronze', 0], ['Silver', 300], ['Gold', 800]], // lifetime points
  },

  // ---------- the drink builder ----------
  builder: {
    bases: [
      { id: 'espresso', name: 'Espresso', emoji: '\u2615', price: 150, color: '#2a160d', hot: true, iced: true, note: 'Rich and bold' },
      { id: 'coldbrew', name: 'Cold Brew', emoji: '\uD83E\uDDCB', price: 200, color: '#4a2c1a', hot: false, iced: true, note: 'Smooth and chilled' },
      { id: 'matcha', name: 'Matcha', emoji: '\uD83C\uDF75', price: 240, color: '#86b452', hot: true, iced: true, note: 'Earthy and fresh' },
      { id: 'milk', name: 'Milk', emoji: '\uD83E\uDD5B', price: 120, color: '#f6ecdb', hot: true, iced: true, note: 'Caffeine free' },
    ],
    milks: [
      { id: 'regular', name: 'Regular', emoji: '\uD83E\uDD5B', price: 0, color: '#f6ecdb' },
      { id: 'oat', name: 'Oat', emoji: '\uD83C\uDF31', price: 40, color: '#e6d3b0' },
      { id: 'coconut', name: 'Coconut', emoji: '\uD83E\uDD65', price: 40, color: '#f8f4ea' },
      { id: 'almond', name: 'Almond', emoji: '\uD83C\uDF3E', price: 50, color: '#ecd8b8' },
    ],
    sizes: [
      { id: 's', name: 'Small', price: -20, scale: 0.88 },
      { id: 'r', name: 'Regular', price: 0, scale: 1 },
      { id: 'l', name: 'Large', price: 40, scale: 1.1 },
    ],
    syrups: [
      { id: 'none', name: 'None', price: 0, color: null },
      { id: 'vanilla', name: 'Vanilla', price: 30, color: '#f0dcb0' },
      { id: 'caramel', name: 'Caramel', price: 30, color: '#c98a3a' },
      { id: 'hazelnut', name: 'Hazelnut', price: 30, color: '#a9743f' },
      { id: 'brownsugar', name: 'Brown sugar', price: 30, color: '#8a5a34' },
    ],
    sweetness: ['No sugar', 'Light', 'Regular', 'Extra sweet'],
    extras: [
      { id: 'shot', name: 'Extra shot', price: 40 },
      { id: 'cream', name: 'Whipped cream', price: 30 },
    ],
  },

  // ---------- the menu (SAMPLE prices in \u20B9) ----------
  // caffeine: 0 none, 1 low, 2 medium, 3 strong. temp: 'hot' or 'cold'. taste tags feed the recommender.
  menuIntro: 'Freshly made, every time. Tap Add to cart, or build your own drink below.',
  menu: [
    { category: 'Hot coffee', items: [
      { id: 'espresso', name: 'Espresso', desc: 'A short, intense shot with golden crema.', price: 140, art: 'espresso', caffeine: 3, temp: 'hot', taste: ['bold'], milk: false },
      { id: 'americano', name: 'Americano', desc: 'Espresso lengthened with hot water. Clean and bold.', price: 160, art: 'americano', caffeine: 3, temp: 'hot', taste: ['bold'], milk: false },
      { id: 'filter', name: 'Filter Coffee', desc: 'South Indian style decoction with frothy milk.', price: 120, art: 'filter', caffeine: 2, temp: 'hot', taste: ['bold', 'creamy'], milk: true },
      { id: 'cappuccino', name: 'Cappuccino', desc: 'Espresso, steamed milk and velvety foam in equal parts.', price: 200, art: 'cappuccino', caffeine: 2, temp: 'hot', taste: ['creamy'], milk: true },
      { id: 'latte', name: 'Café Latte', desc: 'Smooth espresso with plenty of silky steamed milk.', price: 210, art: 'latte', caffeine: 2, temp: 'hot', taste: ['creamy'], milk: true },
      { id: 'flatwhite', name: 'Flat White', desc: 'Double espresso under a thin layer of microfoam.', price: 220, art: 'flat', caffeine: 3, temp: 'hot', taste: ['bold', 'creamy'], milk: true },
      { id: 'mocha', name: 'Café Mocha', desc: 'Espresso, chocolate and steamed milk, topped with cream.', price: 240, art: 'mocha', caffeine: 2, temp: 'hot', taste: ['sweet', 'creamy'], milk: true },
    ] },
    { category: 'Iced and cold brew', items: [
      { id: 'coldbrew', name: 'Cold Brew', desc: 'Steeped slowly for a smooth, low-acid cup. Served over ice.', price: 220, art: 'coldbrew', caffeine: 3, temp: 'cold', taste: ['bold'], milk: false },
      { id: 'tonic', name: 'Cold Brew Tonic', desc: 'Cold brew over ice with sparkling tonic. Crisp and refreshing.', price: 250, art: 'tonic', caffeine: 3, temp: 'cold', taste: ['fresh', 'bold'], milk: false },
      { id: 'icedamericano', name: 'Iced Americano', desc: 'Espresso over ice and water. Simple and bold.', price: 190, art: 'icedamericano', caffeine: 3, temp: 'cold', taste: ['bold'], milk: false },
      { id: 'icedlatte', name: 'Iced Latte', desc: 'Espresso poured over cold milk and ice.', price: 230, art: 'icedlatte', caffeine: 2, temp: 'cold', taste: ['creamy'], milk: true },
      { id: 'caramel', name: 'Iced Caramel Latte', desc: 'Espresso, cold milk and caramel over ice, finished with cream.', price: 250, art: 'caramel', caffeine: 2, temp: 'cold', taste: ['sweet', 'creamy'], milk: true },
    ] },
    { category: 'Matcha and more', items: [
      { id: 'matchalatte', name: 'Matcha Latte', desc: 'Earthy green tea whisked with steamed milk.', price: 260, art: 'matchalatte', caffeine: 1, temp: 'hot', taste: ['earthy', 'creamy'], milk: true },
      { id: 'icedmatcha', name: 'Iced Matcha', desc: 'Matcha and cold milk over ice. Fresh and earthy.', price: 270, art: 'icedmatcha', caffeine: 1, temp: 'cold', taste: ['earthy', 'fresh'], milk: true },
      { id: 'masala', name: 'Masala Chai', desc: 'Spiced tea simmered with milk.', price: 120, art: 'masala', caffeine: 1, temp: 'hot', taste: ['sweet', 'creamy'], milk: true },
      { id: 'hotchoc', name: 'Hot Chocolate', desc: 'Thick, rich and topped with cream.', price: 220, art: 'hotchoc', caffeine: 0, temp: 'hot', taste: ['sweet', 'creamy'], milk: true },
      { id: 'lemontea', name: 'Lemon Iced Tea', desc: 'Chilled black tea with a squeeze of lemon.', price: 160, art: 'lemontea', caffeine: 1, temp: 'cold', taste: ['fresh'], milk: false },
    ] },
    { category: 'Bites', items: [
      { id: 'croissant', name: 'Butter Croissant', desc: 'Flaky, golden and baked fresh.', price: 150, emoji: '\uD83E\uDD50' },
      { id: 'grilled', name: 'Grilled Cheese Sandwich', desc: 'Toasted until golden with melted cheese.', price: 210, emoji: '\uD83E\uDD6A' },
      { id: 'avocado', name: 'Avocado Toast', desc: 'Toasted bread with smashed avocado and seeds.', price: 290, emoji: '\uD83E\uDD51' },
      { id: 'fries', name: 'Peri Peri Fries', desc: 'Crisp fries tossed in peri peri seasoning.', price: 180, emoji: '\uD83C\uDF5F' },
      { id: 'pasta', name: 'White Sauce Pasta', desc: 'Creamy pasta with vegetables and herbs.', price: 280, emoji: '\uD83C\uDF5D' },
    ] },
    { category: 'Desserts', items: [
      { id: 'brownie', name: 'Chocolate Brownie', desc: 'Fudgy and best served warm.', price: 160, emoji: '\uD83C\uDF6B' },
      { id: 'cheesecake', name: 'Blueberry Cheesecake', desc: 'A creamy slice on a buttery base.', price: 240, emoji: '\uD83C\uDF70' },
      { id: 'tiramisu', name: 'Tiramisu', desc: 'Coffee-soaked layers with a light cream.', price: 260, emoji: '\uD83C\uDF68' },
    ] },
  ],

  aboutTitle: 'Our story',
  bandEyebrow: 'Come as you are',
  bandTitle: 'Slow mornings, good coffee, great company.',
  bandText: 'Pull up a chair on Church Street. We will take care of the rest.',
  aboutHeading: 'A café built around one simple idea: really good coffee.',
  about: [
    'Brew & Bloom is a café on Church Street, Bengaluru, for people who love a really good cup. We pour specialty coffee, cold brew and matcha, and we make every drink the way you like it.',
    'Drop in for a quick coffee, a long catch-up or a quiet hour with your laptop. There is always a seat for you.',
  ],

  // REAL PHOTOS (open photos.html to add them by drag and drop):
  //   hero photo (top of the page)   ->  images/hero.jpg
  //   story photo (Our story)        ->  images/story.jpg
  //   menu photo for an item         ->  images/<item id>.jpg   e.g. images/cappuccino.jpg
  //   gallery photos                 ->  images/1.jpg, 2.jpg ... in the order listed below
  // The site shows a real photo when the file exists, and a drawing when it does not.
  photos: { ext: 'jpg', menuDir: 'images/', hero: 'images/hero.jpg', story: 'images/story.jpg', band: 'images/band.jpg', galleryDir: 'images/' },

  // Gallery captions and filters (photos are images/1.jpg, 2.jpg ... in this order). Edit to match your photos.
  gallery: [
    { title: 'Garden seating', cat: 'Café', text: 'Fairy lights and fresh air.' },
    { title: 'Cosy booths', cat: 'Café', text: 'Room for friends and long catch-ups.' },
    { title: 'Latte art', cat: 'Coffee', text: 'Poured fresh to order.' },
    { title: 'Coffee and matcha', cat: 'Coffee', text: 'Something for every mood.' },
    { title: 'Behind the bar', cat: 'Café', text: 'Where every cup begins.' },
    { title: 'Bright corners', cat: 'Café', text: 'Seats for catch-ups and laptops.' },
    { title: 'Sweet treats', cat: 'Bites', text: 'Desserts to share.' },
    { title: 'Dessert for two', cat: 'Bites', text: 'Berries, cream and a fork each.' },
    { title: 'Sandwich and coffee', cat: 'Bites', text: 'A proper lunch pairing.' },
    { title: 'Warm croissants', cat: 'Bites', text: 'Flaky, buttery and golden.' },
    { title: 'Cheesecake', cat: 'Bites', text: 'Creamy with a sweet topping.' },
    { title: 'Iced latte', cat: 'Coffee', text: 'Cold, creamy and layered.' },
  ],

  // Add only REAL customer reviews, with permission: [{ text: '...', name: 'Priya S.' }]
  reviews: [],
  credit: 'Website by Deeksha S',
};
