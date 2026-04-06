import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-hot-toast';
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Wifi, WifiOff, CheckCircle2, Bike, Star, Phone, FileText, Utensils, Package } from 'lucide-react';

const ORDER_STAGES = [
  { key: 'placed', label: 'Order Confirmed', desc: 'Your order has been received by the restaurant', icon: FileText },
  { key: 'preparing', label: 'Preparing', desc: 'Chef is preparing your food', icon: Utensils },
  { key: 'packed', label: 'Packed', desc: 'Order is packed and ready for pickup', icon: Package },
  { key: 'on-the-way', label: 'On The Way', desc: 'Rider picked up your order', icon: Bike },
  { key: 'delivered', label: 'Delivered', desc: 'Order delivered safely. Enjoy!', icon: CheckCircle2 }
];

const useSocket = (orderId) => {
  const [connected] = useState(true);
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    // Simulating real-time socket events that advance the order progress
    let stage = 0;
    const interval = setInterval(() => {
      stage += 1;
      if (stage < ORDER_STAGES.length) {
        setStageIndex(stage);
      } else {
        clearInterval(interval);
      }
    }, 6000); // Advances order every 6 seconds for demo purposes
    
    return () => clearInterval(interval);
  }, [orderId]);

  return { connected, stageIndex };
};

const MOCK_ORDER = {
  id: 'ORD-TEMPLATE',
  restaurant: 'Zamota Kitchen',
  rider: { name: 'Rahul Sharma', phone: '+91 90000 12345', rating: 4.8 },
  eta: 25,
  items: [],
  total: 0,
};

export default function OrderStatus() {
  const { orderId } = useParams();
  const { lastOrder } = useCart();
  
  // Use lastOrder from context if it matches the ID, or if ID is demo/absent
  const orderData = (lastOrder && (!orderId || lastOrder.id === orderId || orderId === 'demo')) 
    ? lastOrder 
    : MOCK_ORDER;

  const oid = orderId || orderData.id;
  const { connected, stageIndex } = useSocket(oid);
  const [eta, setEta] = useState(orderData.eta);
  const lastToast = useRef(-1);

  useEffect(() => {
    const t = setInterval(() => setEta(e => Math.max(1, e - 1)), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (lastToast.current === stageIndex) return;
    lastToast.current = stageIndex;

    const msgs = [
      'Restaurant confirmed your order! 🎉',
      'Chef started cooking 👨‍🍳',
      'Order is packed and ready! 📦',
      'Rider picked up your order! 🏍️',
      'Order delivered! Enjoy 🎉'
    ];
    // Skip the very first stage toast if jumping from Cart to avoid overlap with "Order placed successfully"
    if (msgs[stageIndex] && stageIndex > 0) {
      toast.success(msgs[stageIndex], { duration: 3000 });
    }
  }, [stageIndex]);

  const completed = stageIndex === ORDER_STAGES.length - 1;

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto animate-fade-in">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="glass rounded-2xl p-6 mb-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-white font-bold text-xl">Order #{oid}</h1>
                <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${connected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  {connected ? 'Live Tracking' : 'Reconnecting…'}
                </span>
              </div>
              <p className="text-white/40 text-sm">{orderData?.restaurant || MOCK_ORDER.restaurant}</p>
            </div>
            {!completed && (
              <div className="text-right">
                <div className="text-3xl font-extrabold text-brand-500">{eta}</div>
                <div className="text-white/40 text-xs">mins away</div>
              </div>
            )}
            {completed && (
              <div className="text-green-400 font-semibold text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" /> Delivered!
              </div>
            )}
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="glass rounded-2xl p-6 mb-5">
          <h2 className="text-white font-semibold mb-6">Order Progress</h2>
          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-white/5" />
            <div
              className="absolute left-5 top-5 w-0.5 bg-brand-600 transition-all duration-1000"
              style={{ height: stageIndex === 0 ? '0%' : `${(stageIndex / (ORDER_STAGES.length - 1)) * 89}%` }}
            />

            <div className="space-y-6">
              {ORDER_STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                const done    = idx < stageIndex;
                const current = idx === stageIndex;
                const pending = idx > stageIndex;

                return (
                  <div key={stage.key} className="flex items-start gap-4 relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 z-10
                      ${done    ? 'bg-brand-600 shadow-lg shadow-brand-600/30'
                      : current ? 'bg-brand-600/30 border-2 border-brand-500 shadow-lg shadow-brand-500/30'
                      : 'bg-white/5 border border-white/10'}`}
                    >
                      {done ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className={`w-5 h-5 ${current ? 'text-brand-400' : 'text-white/20'}`} />
                      )}
                      {current && (
                        <div className="absolute w-10 h-10 rounded-full border-2 border-brand-500 animate-ping opacity-30" />
                      )}
                    </div>
                    <div className={`pt-1 transition-all duration-500 ${pending ? 'opacity-30' : ''}`}>
                      <p className={`font-semibold text-sm ${current ? 'text-brand-400' : done ? 'text-white' : 'text-white/50'}`}>
                        {stage.label}
                      </p>
                      <p className="text-white/40 text-xs mt-0.5">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rider Card */}
        {stageIndex >= 3 && (
          <div className="glass rounded-2xl p-5 mb-5 animate-slide-up">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Bike className="w-5 h-5 text-brand-500" /> Your Rider
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-xl">
                  🏍️
                </div>
                <div>
                  <p className="text-white font-medium">{orderData?.rider?.name || MOCK_ORDER.rider.name}</p>
                  <div className="flex items-center gap-1 text-yellow-400 text-xs mt-0.5">
                    <Star className="w-3 h-3 fill-yellow-400" />
                    {orderData?.rider?.rating || MOCK_ORDER.rider.rating} rating
                  </div>
                </div>
              </div>
              <a
                href={`tel:${orderData?.rider?.phone || MOCK_ORDER.rider.phone}`}
                className="flex items-center gap-2 btn-ghost py-2 px-4 text-sm"
              >
                <Phone className="w-4 h-4" /> Call
              </a>
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="glass rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {(orderData?.items?.length ? orderData.items : MOCK_ORDER.items).map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  {item.image && (
                    <div className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg shrink-0">
                      {item.image?.startsWith('http') ? <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" /> : item.image}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-white/80 font-medium">{item.name}</span>
                    <span className="text-white/40 text-xs mt-0.5">Qty: {item.qty}</span>
                  </div>
                </div>
                <span className="text-white font-medium">₹{item.price * (item.qty || 1)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-5 pt-4 border-t border-white/10">
            <span className="text-white font-semibold text-lg">Total</span>
            <span className="text-brand-400 font-bold text-xl">₹{orderData?.total || 0}</span>
          </div>

          {completed && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
              <p className="text-green-400 font-semibold">🎉 Enjoy your meal!</p>
              <p className="text-white/40 text-xs mt-1">Rate your experience below</p>
              <div className="flex justify-center gap-2 mt-3">
                {[1,2,3,4,5].map(s => (
                  <button key={s} className="text-2xl hover:scale-110 transition-transform">⭐</button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
