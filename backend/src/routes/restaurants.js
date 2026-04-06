const router      = require('express').Router();
const { createClient } = require('redis');

// Redis client (optional — gracefully skips if not available)
let redisClient = null;
(async () => {
  try {
    redisClient = createClient({ url: process.env.REDIS_URL || 'redis://redis:6379' });
    redisClient.on('error', () => { redisClient = null; });
    await redisClient.connect();
    console.log('[Redis] Connected');
  } catch {
    console.warn('[Redis] Not available — running without cache');
    redisClient = null;
  }
})();

const CACHE_TTL = 300; // 5 minutes
const CACHE_KEY = 'restaurants:all';

// Mock restaurant data (replace with DB queries in production)
const RESTAURANTS = [
  { _id:'r1', name:'The Spice Garden',  cuisine:'North Indian, Mughlai', rating:4.7, deliveryTime:28, minOrder:199, isOpen:true,  tags:['Popular','Trending'], offer:'20% OFF' },
  { _id:'r2', name:'Sushi Sakura',      cuisine:'Japanese, Asian',       rating:4.5, deliveryTime:35, minOrder:299, isOpen:true,  tags:['New'],                offer:'Free Delivery' },
  { _id:'r3', name:'Burger Republic',   cuisine:'American, Fast Food',   rating:4.3, deliveryTime:22, minOrder:149, isOpen:true,  tags:['Bestseller'],         offer:'15% OFF' },
  { _id:'r4', name:'Pizza Palazzo',     cuisine:'Italian, Pizza',        rating:4.6, deliveryTime:30, minOrder:249, isOpen:true,  tags:['Popular'],            offer:'' },
  { _id:'r5', name:'Green Bowl',        cuisine:'Healthy, Salads, Vegan',rating:4.4, deliveryTime:25, minOrder:179, isOpen:true,  tags:['Healthy'],            offer:'30% OFF' },
  { _id:'r6', name:'Taco Fiesta',       cuisine:'Mexican, Tex-Mex',      rating:4.2, deliveryTime:20, minOrder:129, isOpen:false, tags:['New','Trending'],     offer:'' },
  { _id:'r7', name:'Wok & Roll',        cuisine:'Chinese, Thai',         rating:4.5, deliveryTime:32, minOrder:199, isOpen:true,  tags:['Popular'],            offer:'25% OFF' },
  { _id:'r8', name:'The Kebab House',   cuisine:'Middle Eastern, Kebabs',rating:4.8, deliveryTime:40, minOrder:249, isOpen:true,  tags:['Bestseller','Top Rated'], offer:'' },
];

// GET /api/restaurants
router.get('/', async (req, res) => {
  try {
    const { q, cuisine, sort } = req.query;

    // Try cache first
    if (redisClient) {
      const cached = await redisClient.get(CACHE_KEY).catch(() => null);
      if (cached) {
        console.log('[Cache] HIT — restaurants');
        return res.json({ source: 'cache', data: JSON.parse(cached) });
      }
    }

    let data = [...RESTAURANTS];

    // Filter
    if (q) data = data.filter(r =>
      r.name.toLowerCase().includes(q.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(q.toLowerCase())
    );
    if (cuisine) data = data.filter(r =>
      r.cuisine.toLowerCase().includes(cuisine.toLowerCase())
    );

    // Sort
    if (sort === 'rating')   data.sort((a, b) => b.rating - a.rating);
    if (sort === 'delivery') data.sort((a, b) => a.deliveryTime - b.deliveryTime);

    // Cache result
    if (redisClient && !q && !cuisine) {
      await redisClient.setEx(CACHE_KEY, CACHE_TTL, JSON.stringify(data)).catch(() => {});
    }

    res.json({ source: 'db', count: data.length, data });
  } catch (err) {
    console.error('[Restaurants] Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/restaurants/:id
router.get('/:id', async (req, res) => {
  const restaurant = RESTAURANTS.find(r => r._id === req.params.id);
  if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
  res.json({ data: restaurant });
});

module.exports = router;
