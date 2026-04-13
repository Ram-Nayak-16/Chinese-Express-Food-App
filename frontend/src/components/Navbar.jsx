import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search, Menu } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { SearchContext } from '../context/SearchContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { totalItems } = useContext(CartContext);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-3xl md:text-[2.5rem] font-black tracking-tighter flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-primary-600 drop-shadow-sm">🥢</span> 
          <span>
            <span className="text-primary-600">Chinese</span> <span className="text-gray-900">Express</span>
          </span>
        </Link>

        <div className="hidden md:flex flex-1 mx-8 max-w-xl">
          <div className="relative w-full group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 group-focus-within:text-primary-500 transition-colors">
              <Search size={18} />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for delicious food..."
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-400 focus:bg-white transition-all duration-300 text-sm text-gray-900 shadow-inner group-hover:shadow-md focus:shadow-lg"
            />
          </div>
        </div>

        <div className="flex items-center space-x-5">
          <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[18px]">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="hidden lg:inline text-sm font-semibold text-gray-600 hover:text-primary-600 transition-colors"
              >
                Home
              </Link>
              <button 
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                className="hidden lg:inline text-sm font-semibold text-gray-600 hover:text-primary-600 transition-colors cursor-pointer"
              >
                Contact Us
              </button>
              <Link to="/profile" className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                <User size={20} />
                <span className="hidden lg:inline">{user.name}</span>
              </Link>
              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="hidden lg:inline text-sm font-semibold text-gray-600 hover:text-primary-600 transition-colors"
              >
                Home
              </Link>
              <button 
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                className="hidden lg:inline text-sm font-semibold text-gray-600 hover:text-primary-600 transition-colors cursor-pointer"
              >
                Contact Us
              </button>
              <Link
                to="/login"
                className="bg-primary-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
              >
                Sign In
              </Link>
            </div>
          )}

          <button className="md:hidden p-2 text-gray-600">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
