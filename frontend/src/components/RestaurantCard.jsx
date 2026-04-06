import { Link } from 'react-router-dom';
import { Star, Clock, Zap, Tag, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function RestaurantCard({ restaurant }) {
  const { _id, name, cuisine, rating, deliveryTime, minOrder, image, offer, isNew, tags } = restaurant;
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault(); // Prevent navigating to restaurant detail
    addToCart({
      id: _id,
      name: `${name} Signature Dish`,
      price: minOrder + 50, // Mock price based on minOrder
      image: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80`, // High-quality food image
    });
  };

  return (
    <Link to={`/restaurant/${_id}`} className="group block glass-card overflow-hidden cursor-pointer relative">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {offer && (
          <div className="absolute top-4 left-4 bg-brand-500 text-white text-xs font-bold px-2 py-1 rounded">
            {offer}
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
            <Star className="w-3.5 h-3.5" /> {rating}
          </div>
          {isNew && (
            <div className="bg-blue-500/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded">
              NEW
            </div>
          )}
        </div>
      </div>
      
      {/* Info */}
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-base leading-tight truncate group-hover:text-brand-400 transition-colors">
              {name}
            </h3>
            <p className="text-white/40 text-xs mt-0.5 truncate">{cuisine}</p>
          </div>
          <button
            onClick={handleAdd}
            className="flex-shrink-0 w-8 h-8 bg-brand-600/20 hover:bg-brand-600 border border-brand-500/30 rounded-lg flex items-center justify-center text-brand-400 hover:text-white transition-all shadow-lg"
            title="Add Specialty to Cart"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1 text-white/50 text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>{deliveryTime} mins</span>
          </div>
          <div className="text-white/50 text-xs">
            Min ₹{minOrder}
          </div>
        </div>
      </div>
    </Link>
  );
}
