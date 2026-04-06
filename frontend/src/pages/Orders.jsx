import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Package, Clock, Utensils, ChevronRight } from 'lucide-react';

export default function Orders() {
  const { orders } = useCart();

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center gap-4 pt-20 px-4">
        <div className="text-7xl">📦</div>
        <h2 className="text-white text-2xl font-bold">No orders yet</h2>
        <p className="text-white/40 text-sm">You haven't placed any orders. Hungry?</p>
        <Link to="/" className="btn-primary mt-2">Browse Restaurants</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Package className="w-6 h-6 text-brand-500" /> My Orders History
        </h1>

        <div className="space-y-4">
          {orders.map(order => (
            <Link 
              to={`/order/${order.id}`} 
              key={order.id} 
              className="block glass-card p-5 hover:bg-white/5 transition-colors group animate-fade-in relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-bold">{order.restaurant || 'Zamota Kitchen'}</span>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold">
                      Delivered
                    </span>
                  </div>
                  <div className="text-white/40 text-xs flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(order.timestamp).toLocaleString()} • #{order.id}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-white/60 text-sm">Total Amount</div>
                  <div className="text-brand-400 font-bold text-lg">₹{order.total}</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                  <Utensils className="w-4 h-4 text-white/30 shrink-0" />
                  <p className="text-white/70 text-sm truncate">
                    {order.items?.map(i => `${i.qty}x ${i.name}`).join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-brand-500 font-medium text-sm shrink-0 pl-4 group-hover:translate-x-1 transition-transform">
                  View Tracker <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
