import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/neon-button';

const images = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2081&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop"
];

const quotes = [
  "Muskuraiye, aap Lucknow mein hain... and you're about to eat the best food in town!",
  "Experience the royal Awadhi flavors, straight from the heart of the City of Nawabs.",
  "From melt-in-your-mouth Galouti Kebabs to aromatic Biryanis, taste pure culinary heritage.",
  "Where every bite tells a story of culture, tradition, and absolute culinary perfection."
];

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center border-b border-gray-100">
        <div className="md:w-1/2 text-center md:text-left z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-5 py-2 rounded-full bg-primary-100 text-primary-700 text-xs font-black uppercase tracking-widest mb-6 shadow-sm border border-primary-200">
              Fastest Delivery in Town
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.1] mb-6 tracking-tight">
              Delicious Food <br />
              Delivered to <br className="hidden md:block"/> <span className="text-primary-600 bg-primary-50 px-2 rounded-2xl">Your Door</span>
            </h1>
            <div className="h-[100px] mb-8 max-w-lg relative w-full flex items-center md:justify-start justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentImageIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.6 }}
                  className="absolute text-lg text-gray-500 font-medium leading-relaxed italic md:pr-4"
                >
                  "{quotes[currentImageIndex]}"
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                variant="solid" 
                neon={true} 
                onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
              >
                Order Now
              </Button>
              <Button 
                variant="ghost" 
                neon={false} 
                onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Menu
              </Button>
            </div>
          </motion.div>
        </div>

        <div className="md:w-1/2 mt-16 md:mt-0 relative w-full h-[350px] md:h-[500px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full h-full relative"
          >
            <div className="absolute inset-0 bg-primary-200 rounded-full filter blur-[100px] opacity-40 transform -translate-x-1/4 -translate-y-1/4"></div>
            
            <div className="relative w-full h-full rounded-[2.5rem] shadow-2xl overflow-hidden rotate-2 hover:rotate-0 transition-transform duration-500 border-[8px] border-white z-10 bg-gray-100">
              <AnimatePresence mode="popLayout">
                <motion.img
                  key={currentImageIndex}
                  src={images[currentImageIndex]}
                  alt="Delicious Food"
                  initial={{ opacity: 0, scale: 1.2, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotate: 5 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-3xl shadow-xl z-20 animate-bounce">
              <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">🥗</div>
                 <div>
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Fresh &</p>
                   <p className="text-sm font-black text-gray-900">Healthy!</p>
                 </div>
              </div>
            </div>
            
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
