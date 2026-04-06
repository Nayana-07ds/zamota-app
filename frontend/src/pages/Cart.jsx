import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Bike, ShieldCheck } from 'lucide-react';

export default function Cart() {
  const { items, updateQty, removeFromCart, clearCart, subtotal, saveOrder } = useCart();
  const [coupon, setCoupon]   = useState('');
  const [discount, setDiscount] = useState(0);
  const [placingOrder, setPlacingOrder] = useState(false);
  const { user } = useAuth();
  const navigate  = useNavigate();

  const deliveryFee  = subtotal === 0 ? 0 : (subtotal > 500 ? 0 : 49);
  const taxes        = Math.round(subtotal * 0.05);
  const total        = subtotal + deliveryFee + taxes - discount;

  const applyCoupon = () => {
    if (subtotal === 0) return toast.error('Cart is empty');
    if (coupon.toUpperCase() === 'ZAMOTA20') {
      setDiscount(Math.round(subtotal * 0.2));
      toast.success('Coupon applied! 20% off 🎉');
    } else if (coupon.toUpperCase() === 'FIRST50') {
      setDiscount(50);
      toast.success('₹50 off applied!');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const placeOrder = async () => {
    if (!user) { toast.error('Please login to place order'); return navigate('/login'); }
    if (items.length === 0) return toast.error('Your cart is empty');
    
    setPlacingOrder(true);
    
    // In a real app, this would be an API call
    await new Promise(r => setTimeout(r, 1500));
    
    const orderDetails = {
      items,
      subtotal,
      deliveryFee,
      taxes,
      total,
      restaurant: items[0]?.name.split(' Signature')[0] || 'Zamota Restaurant',
      rider: { name: 'Rahul Sharma', phone: '+91 90000 12345', rating: 4.8 },
      eta: 25
    };

    try {
      const savedOrder = saveOrder(orderDetails);
      
      toast.success('Order placed successfully! 🎉');
      clearCart();
      navigate(`/order/${savedOrder.id}`);
    } catch (err) {
      toast.error('Failed to place order');
      console.error(err);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center gap-4 pt-20 px-4">
      <div className="text-7xl">🛒</div>
      <h2 className="text-white text-2xl font-bold">Your cart is empty</h2>
      <p className="text-white/40 text-sm">Add items from a restaurant to get started</p>
      <Link to="/" className="btn-primary mt-2">Browse Restaurants</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-brand-500" /> Your Cart
          <span className="text-white/30 text-base font-normal">({items.length} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => (
              <div key={item.id} className="glass-card p-4 flex items-center gap-4 animate-fade-in">
                <div className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-xl shrink-0">
                  {item.image?.startsWith('http') ? <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl" /> : item.image}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{item.name}</p>
                  <p className="text-brand-400 font-semibold mt-0.5">₹{item.price}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => updateQty(item.id, -1)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-white font-semibold w-6 text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    className="w-8 h-8 rounded-lg bg-brand-600/30 hover:bg-brand-600/50 flex items-center justify-center text-brand-400 hover:text-white transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-white font-semibold w-16 text-right shrink-0">
                  ₹{item.price * item.qty}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-white/20 hover:text-red-400 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Coupon */}
            <div className="glass rounded-xl p-4">
              <p className="text-white/60 text-sm font-medium mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-green-400" /> Apply Coupon
              </p>
              <div className="flex gap-2">
                <input
                  id="coupon-input"
                  type="text"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  placeholder="Enter code (ZAMOTA20 / FIRST50)"
                  className="input-field text-sm flex-1"
                />
                <button onClick={applyCoupon} className="btn-primary py-2 px-4 text-sm">Apply</button>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-5 sticky top-24">
              <h2 className="text-white font-semibold mb-4">Bill Details</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span className="flex items-center gap-1">
                    <Bike className="w-3.5 h-3.5" /> Delivery fee
                  </span>
                  {deliveryFee === 0
                    ? <span className="text-green-400 font-medium">FREE</span>
                    : <span>₹{deliveryFee}</span>
                  }
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Taxes & Fees (5%)</span>
                  <span>₹{taxes}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-400 font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                {subtotal <= 500 && (
                  <div className="text-xs text-white/30 bg-white/5 rounded-lg p-2 text-center">
                    Add ₹{500 - subtotal} more for free delivery!
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t border-white/10">
                <span className="text-white font-bold">Total</span>
                <span className="text-brand-400 font-extrabold text-xl">₹{total}</span>
              </div>

              <button
                id="place-order-btn"
                onClick={placeOrder}
                disabled={placingOrder}
                className="btn-primary w-full mt-5 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {placingOrder ? (
                  <span className="flex gap-1">
                    {[0,1,2].map(i => (
                      <span key={i} className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
                    ))}
                  </span>
                ) : (
                  <>Place Order <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 mt-3 text-white/30 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                Safe & Secure Payments
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
