import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Hero from '../components/Hero';
import Feedback from '../components/Feedback';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { SearchContext } from '../context/SearchContext';
import { Utensils } from 'lucide-react';
import toast from 'react-hot-toast';

const Home = () => {
  const { addToCart, cartItems, decreaseQty } = useContext(CartContext);
  const { searchQuery } = useContext(SearchContext);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeAction, setActiveAction] = useState({ id: null, text: '' });

  const showLocalAction = (foodId, text) => {
    setActiveAction({ id: foodId, text });
    setTimeout(() => {
      setActiveAction((prev) => (prev.id === foodId ? { id: null, text: '' } : prev));
    }, 1500);
  };

  useEffect(() => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
    const fetchFoods = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/food`);
        setFoods(data.foods);
      } catch (err) {
        setError('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, []);

  return (
    <div>
      <Hero />
      
      <div id="menu" className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Dishes</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-4 shadow-sm h-80">
                <div className="bg-gray-200 h-40 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 font-medium bg-red-50 rounded-2xl border border-red-100 italic">
            {error}. Make sure the backend server is running.
          </div>
        ) : (
          <>
            {foods.filter(food => food.name.toLowerCase().includes(searchQuery?.toLowerCase() || '')).length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100 animate-in fade-in duration-300">
                <div className="text-6xl mb-4 opacity-80">🍳</div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Sorry, we couldn't find that!</h3>
                <p className="text-gray-500 font-medium">We don't have any dishes matching <span className="text-primary-600">"{searchQuery}"</span> right now.</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {foods.filter(food => food.name.toLowerCase().includes(searchQuery?.toLowerCase() || '')).map((food) => (
                  <div key={food._id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-gray-100">
                <div className="relative overflow-hidden h-48">
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-600 shadow-sm">
                    ₹{food.price}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {food.name}
                    </h3>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {food.description}
                  </p>
                  
                  <button 
                    onClick={() => {
                      addToCart(food);
                      showLocalAction(food._id, 'Added to Cart!');
                    }}
                    className="w-full bg-gray-50 text-gray-900 py-3 rounded-xl font-bold hover:bg-primary-600 hover:text-white transition-all text-sm border border-gray-100 flex items-center justify-center cursor-pointer"
                  >
                    Add to Cart
                  </button>

                  {cartItems.find((x) => x._id === food._id) && (
                    <div className="w-full mt-3 flex items-center justify-between bg-primary-50 rounded-xl py-2 px-4 border border-primary-100 animate-in fade-in slide-in-from-top-2 duration-300">
                      <button 
                        onClick={() => {
                          decreaseQty(food._id);
                          showLocalAction(food._id, 'Quantity Decreased');
                        }}
                        className="w-8 h-8 rounded-full bg-white text-primary-600 font-bold flex items-center justify-center shadow-sm hover:bg-primary-600 hover:text-white transition-colors"
                      >
                        -
                      </button>
                      <span className="font-bold text-gray-900">{cartItems.find((x) => x._id === food._id).qty} in cart</span>
                      <button 
                        onClick={() => {
                          addToCart(food);
                          showLocalAction(food._id, 'Quantity Increased');
                        }}
                        className="w-8 h-8 rounded-full bg-white text-primary-600 font-bold flex items-center justify-center shadow-sm hover:bg-primary-600 hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                  )}

                  {activeAction.id === food._id && (
                    <div className="text-center font-bold text-sm text-green-600 mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
                      {activeAction.text}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
            )}
          </>
        )}
      </div>

      <Feedback />
    </div>
  );
};

export default Home;
