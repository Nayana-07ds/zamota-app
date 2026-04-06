import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Flame, ShoppingCart, User, LogOut, ChevronDown, Menu, X, MapPin } from 'lucide-react';

export default function Navbar() {
  const { user, logout }    = useAuth();
  const { cartCount, lastOrder }       = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDrop, setUserDrop] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserDrop(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAuth = location.pathname === '/login' || location.pathname === '/signup';
  if (isAuth) return null;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled ? 'bg-[#0f0f0f]/95 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-600/40">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">Zamota</span>
          </Link>

          {/* Location chip — desktop */}
          <div className="hidden md:flex items-center gap-1.5 text-white/50 text-sm hover:text-white/80 transition-colors cursor-pointer bg-white/5 hover:bg-white/8 px-3 py-1.5 rounded-full border border-white/8">
            <MapPin className="w-3.5 h-3.5 text-brand-500" />
            <span>Bangalore</span>
            <ChevronDown className="w-3 h-3" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/cart" className="relative btn-ghost py-2 px-4 text-sm flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 rounded-full text-white text-xs flex items-center justify-center font-bold animate-pulse-slow">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDrop(d => !d)}
                  className="flex items-center gap-2 glass rounded-xl px-3 py-2 hover:bg-white/8 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-brand-400 text-sm font-bold">
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-white/80 text-sm font-medium max-w-24 truncate">{user.name || 'User'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform ${userDrop ? 'rotate-180' : ''}`} />
                </button>

                {userDrop && (
                  <div className="absolute right-0 top-12 w-48 glass rounded-xl overflow-hidden shadow-2xl border border-white/8 animate-fade-in">
                    <Link to="/orders" className="flex items-center gap-2 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm">
                      <ShoppingCart className="w-4 h-4" /> My Orders
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <div className="h-px bg-white/5" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all text-sm"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"  className="btn-ghost py-2 px-4 text-sm">Login</Link>
                <Link to="/signup" className="btn-primary py-2 px-4 text-sm">Sign up</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(m => !m)}
            className="md:hidden text-white/60 hover:text-white transition-colors p-2"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-white/5 animate-fade-in px-4 py-4 space-y-2">
          <Link to="/cart" className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-all">
            <div className="flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> Cart</div>
            {cartCount > 0 && <span className="badge bg-brand-600 text-white">{cartCount}</span>}
          </Link>
          {user ? (
            <>
              <Link to="/orders" className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-white/5 text-white/70 hover:text-white transition-all">
                <ShoppingCart className="w-4 h-4" /> My Orders
              </Link>
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-red-500/5 text-red-400 hover:text-red-300 transition-all">
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login"  className="btn-ghost py-2 px-4 text-sm flex-1 text-center">Login</Link>
              <Link to="/signup" className="btn-primary py-2 px-4 text-sm flex-1 text-center">Sign up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
