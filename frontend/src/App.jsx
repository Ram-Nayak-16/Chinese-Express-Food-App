import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Mail, Phone, Utensils, MapPin } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracker from './pages/OrderTracker';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <SearchProvider>
            <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-tracker/:id" element={<OrderTracker />} />
              </Routes>
            </main>
            <footer id="contact" className="bg-white border-t border-gray-100 pt-16 pb-8 mt-12 bg-[url('https://www.transparenttextures.com/patterns/food.png')] bg-opacity-5">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-12 gap-12 text-center md:text-left">
                  <div className="max-w-sm md:flex-1">
                    <h3 className="text-3xl font-extrabold text-primary-600 tracking-tight mb-4">
                      Chinese <span className="text-gray-900">Express</span>
                    </h3>
                    <p className="text-gray-500 leading-relaxed font-medium">
                      Authentic flavors delivered straight to your door. Hot, fresh, and irresistibly delicious. Experience the best dining without leaving your home.
                    </p>
                  </div>

                  {/* Centered Decorative Divider */}
                  <div className="hidden lg:flex flex-col items-center justify-center opacity-10 select-none pointer-events-none md:flex-1">
                    <div className="flex items-center gap-4 translate-y-3">
                       <div className="w-12 h-px bg-gray-900"></div>
                       <Utensils size={32} className="text-gray-900" />
                       <div className="w-12 h-px bg-gray-900"></div>
                    </div>
                    <div className="w-32 h-32 border-2 border-gray-900 rounded-full mt-[-16px] flex items-center justify-center">
                       <div className="w-24 h-24 border border-gray-900 rounded-full opacity-50"></div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center md:items-end md:flex-1">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 bg-primary-50 px-4 py-1 rounded-full text-primary-700 inline-block">Support & Contact</h4>
                    <p className="text-gray-500 mb-4 text-sm">Have a question or looking to order in bulk? Reach out to us!</p>
                    <div className="flex flex-col space-y-3 w-full sm:w-auto">
                      <a 
                        href="mailto:ramnayak778800@gmail.com" 
                        className="group flex items-center space-x-3 text-gray-700 hover:text-primary-700 transition-all duration-300 bg-white shadow-sm hover:shadow-md px-6 py-3 rounded-full border border-gray-200 hover:border-primary-300 w-full"
                      >
                        <div className="bg-primary-100 p-2 rounded-full group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                          <Mail size={18} className="text-primary-600 group-hover:text-white" />
                        </div>
                        <span className="font-bold text-[15px]">ramnayak778800@gmail.com</span>
                      </a>
                      
                      <a 
                        href="tel:9369665818" 
                        className="group flex items-center space-x-3 text-gray-700 hover:text-green-700 transition-all duration-300 bg-white shadow-sm hover:shadow-md px-6 py-3 rounded-full border border-gray-200 hover:border-green-300 w-full"
                      >
                        <div className="bg-green-100 p-2 rounded-full group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                          <Phone size={18} className="text-green-600 group-hover:text-white" />
                        </div>
                        <span className="font-bold text-[15px]">9369665818,9026840369</span>
                      </a>

                      <div className="group flex items-start space-x-3 text-gray-700 bg-white shadow-sm px-6 py-4 rounded-3xl border border-gray-200 w-full max-w-sm">
                        <div className="bg-orange-100 p-2 rounded-full text-orange-600 shrink-0">
                          <MapPin size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Our Location</span>
                          <span className="font-bold text-sm leading-snug">
                            Shop Number- 501, Lekhraj Dollar Building, Near Spencer Shopping Mall, Faizabaad Road, Indira Nagar, Lucknow-226016, Uttar Pradesh
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm border-t border-gray-100 pt-8 mt-4">
                  <div className="flex flex-col items-center md:items-start">
                    <p>&copy; {new Date().getFullYear()} Chinese Express. All rights reserved.</p>
                    <p className="mt-1">Designed & Developed by <span className="font-bold text-gray-600">RAM NAYAK</span></p>
                  </div>
                  <div className="flex space-x-6 mt-4 md:mt-0 font-medium text-gray-500">
                     <a href="#" className="hover:text-primary-600 transition-colors">Privacy Policy</a>
                     <a href="#" className="hover:text-primary-600 transition-colors">Terms of Service</a>
                  </div>
                </div>
              </div>
            </footer>
            </div>
            <Toaster position="bottom-right" />
          </SearchProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
