import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RestaurantCard from '../components/RestaurantCard';
import { Search, MapPin, ChevronDown, SlidersHorizontal, Flame, Clock, Star, Zap } from 'lucide-react';

const MOCK_RESTAURANTS = [
  { _id:'r1', name:'The Spice Garden', cuisine:'North Indian, Mughlai', rating:4.7, deliveryTime:28, minOrder:199, image:'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80', offer:'20% OFF', isNew:false, tags:['Popular','Trending'] },
  { _id:'r2', name:'Sushi Sakura', cuisine:'Japanese, Asian', rating:4.5, deliveryTime:35, minOrder:299, image:'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80', offer:'Free Delivery', isNew:true, tags:['New'] },
  { _id:'r3', name:'Burger Republic', cuisine:'American, Fast Food', rating:4.3, deliveryTime:22, minOrder:149, image:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', offer:'15% OFF', isNew:false, tags:['Bestseller'] },
  { _id:'r4', name:'Pizza Palazzo', cuisine:'Italian, Pizza', rating:4.6, deliveryTime:30, minOrder:249, image:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80', offer:'', isNew:false, tags:['Popular'] },
  { _id:'r5', name:'Green Bowl', cuisine:'Healthy, Salads, Vegan', rating:4.4, deliveryTime:25, minOrder:179, image:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', offer:'30% OFF', isNew:false, tags:['Healthy'] },
  { _id:'r6', name:'Taco Fiesta', cuisine:'Mexican, Tex-Mex', rating:4.2, deliveryTime:20, minOrder:129, image:'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80', offer:'', isNew:true, tags:['New','Trending'] },
  { _id:'r7', name:'Wok & Roll', cuisine:'Chinese, Thai', rating:4.5, deliveryTime:32, minOrder:199, image:'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80', offer:'25% OFF', isNew:false, tags:['Popular'] },
  { _id:'r8', name:'The Kebab House', cuisine:'Middle Eastern, Kebabs', rating:4.8, deliveryTime:40, minOrder:249, image:'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80', offer:'', isNew:false, tags:['Bestseller','Top Rated'] },
];

const CATEGORIES = [
  { label:'All',     icon:'🍽️' },
  { label:'Indian',  icon:'🍛' },
  { label:'Chinese', icon:'🥡' },
  { label:'Pizza',   icon:'🍕' },
  { label:'Burgers', icon:'🍔' },
  { label:'Sushi',   icon:'🍣' },
  { label:'Healthy', icon:'🥗' },
  { label:'Desserts',icon:'🍰' },
];

const FILTERS = ['Rating 4.0+', 'Fast Delivery', 'Offers', 'Pure Veg', 'New'];

export default function Home() {
  const { user } = useAuth();
  const [query, setQuery]       = useState('');
  const [category, setCategory] = useState('All');
  const [activeFilters, setActiveFilters] = useState([]);
  const [restaurants, setRestaurants]     = useState([]);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setRestaurants(MOCK_RESTAURANTS);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const toggleFilter = (f) =>
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const filtered = restaurants.filter(r => {
    const matchQ = query === '' || r.name.toLowerCase().includes(query.toLowerCase()) || r.cuisine.toLowerCase().includes(query.toLowerCase());
    const matchC = category === 'All' || r.cuisine.toLowerCase().includes(category.toLowerCase());
    return matchQ && matchC;
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-900/60 via-[#1a0a0a] to-[#0f0f0f] pt-24 pb-16 px-4">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:`url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=60')`, backgroundSize:'cover', backgroundPosition:'center'}} />
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-600/20 border border-brand-500/30 rounded-full px-4 py-1.5 text-brand-400 text-sm font-medium mb-5">
            <Zap className="w-3.5 h-3.5" />
            Fastest delivery in your city
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
            Hungry? We&apos;ve got you <span className="text-brand-500">covered</span> 🔥
          </h1>
          <p className="text-white/50 text-lg mb-8">
            Order from top restaurants • Delivered in 30 mins
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              id="home-search"
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for restaurants or cuisines…"
              className="w-full bg-white/8 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-base shadow-2xl"
            />
          </div>

          {/* Location chip */}
          <div className="flex items-center justify-center gap-1.5 mt-4 text-white/40 text-sm cursor-pointer hover:text-white/60 transition-colors">
            <MapPin className="w-4 h-4" />
            <span>Bangalore, Karnataka</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Chips */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-6">
          {CATEGORIES.map(c => (
            <button
              key={c.label}
              onClick={() => setCategory(c.label)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${category === c.label
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                  : 'glass text-white/60 hover:text-white hover:border-white/20'
                }`}
            >
              <span>{c.icon}</span> {c.label}
            </button>
          ))}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
          <SlidersHorizontal className="w-4 h-4 text-white/40 shrink-0" />
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => toggleFilter(f)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200
                ${activeFilters.includes(f)
                  ? 'border-brand-500 bg-brand-600/20 text-brand-400'
                  : 'border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-brand-500" />
              {query || category !== 'All' ? 'Search Results' : 'Restaurants near you'}
            </h2>
            <p className="text-white/40 text-sm mt-1">
              {loading ? 'Loading…' : `${filtered.length} restaurants available`}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-white/40 text-sm">
            <Clock className="w-4 h-4" />
            <span>Sorted by: Relevance</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {loading
            ? Array(8).fill(0).map((_, i) => (
                <div key={i} className="glass-card overflow-hidden">
                  <div className="shimmer h-44 w-full" />
                  <div className="p-4 space-y-3">
                    <div className="shimmer h-5 w-3/4 rounded" />
                    <div className="shimmer h-4 w-1/2 rounded" />
                    <div className="shimmer h-4 w-2/3 rounded" />
                  </div>
                </div>
              ))
            : filtered.map(r => <RestaurantCard key={r._id} restaurant={r} />)
          }
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-white/60 text-xl font-semibold">No restaurants found</h3>
            <p className="text-white/30 mt-2">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
}
