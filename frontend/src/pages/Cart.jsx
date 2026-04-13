import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    addToCart, 
    decreaseQty, 
    clearCart, 
    itemsPrice,
    deliveryPrice,
    gstPrice,
    handlingPrice,
    gatewayPrice,
    discountPrice,
    totalPrice
  } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-4xl font-black text-gray-900 mb-8 flex items-center tracking-tight">
        <ShoppingBag className="mr-4 text-primary-600" size={40} />
        Your Cart
      </h1>
      
      {cartItems.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] shadow-xl p-16 text-center border border-gray-100 animate-in fade-in zoom-in duration-500">
          <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <ShoppingBag size={64} className="text-gray-200" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-10 max-w-md mx-auto font-medium">Looks like you haven't added anything to your cart yet. Explore our delicious menu to find your next favorite meal!</p>
          <Link to="/" className="inline-flex items-center bg-primary-600 text-white font-black py-5 px-10 rounded-2xl hover:bg-primary-700 transition shadow-2xl hover:shadow-primary-200 active:scale-95 group">
            Browse Menu
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-white rounded-[2rem] shadow-sm p-6 border border-gray-100 flex flex-col sm:flex-row items-center gap-8 relative group hover:shadow-lg transition-all duration-300">
                <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden shadow-md">
                   <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-extrabold text-gray-900 mb-1 tracking-tight">{item.name}</h3>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-3">{item.category}</p>
                  <p className="text-2xl font-black text-primary-600">₹{item.price}</p>
                </div>
                
                <div className="flex items-center gap-5 bg-gray-50 rounded-2xl p-2 mx-auto sm:mx-0 border border-gray-100 shadow-inner">
                  <button onClick={() => decreaseQty(item._id)} className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 shadow-sm transition-all active:scale-90">
                    <Minus size={20} />
                  </button>
                  <span className="font-black w-6 text-center text-gray-900 text-xl">{item.qty}</span>
                  <button onClick={() => addToCart(item, 1)} className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-md hover:bg-primary-700 transition-all active:scale-90">
                    <Plus size={20} />
                  </button>
                </div>
                
                <button onClick={() => removeFromCart(item._id)} className="absolute -top-3 -right-3 w-10 h-10 bg-white text-gray-400 border border-gray-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:bg-red-500 hover:text-white hover:scale-110">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            
            <div className="flex justify-between items-center pt-4">
               <button onClick={clearCart} className="text-sm text-red-400 font-black hover:text-red-600 flex items-center transition-colors uppercase tracking-widest">
                <Trash2 size={16} className="mr-2" />
                Clear Cart
              </button>
              <Link to="/" className="text-sm font-black text-primary-600 hover:underline uppercase tracking-widest">
                + Add more items
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 sticky top-24">
              <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight border-b border-gray-50 pb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500 font-bold text-sm uppercase tracking-wider">
                  <span>Subtotal</span>
                  <span className="text-gray-900">₹{itemsPrice}</span>
                </div>
                
                <div className="flex justify-between text-gray-500 font-bold text-sm uppercase tracking-wider">
                  <span>GST (5%)</span>
                  <span className="text-gray-900">₹{gstPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-500 font-bold text-sm uppercase tracking-wider">
                  <span>Handling Fee</span>
                  <span className="text-gray-900">₹{handlingPrice}</span>
                </div>

                <div className="flex justify-between text-gray-500 font-bold text-sm uppercase tracking-wider">
                  <span>Gateway Fee</span>
                  <span className="text-gray-900">₹{gatewayPrice.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-500 font-bold text-sm uppercase tracking-wider">
                  <span>Delivery</span>
                  {deliveryPrice === 0 ? (
                    <span className="text-green-500 font-black">FREE</span>
                  ) : (
                    <span className="text-gray-900">₹{deliveryPrice}</span>
                  )}
                </div>

                {discountPrice > 0 && (
                  <div className="flex justify-between text-green-600 font-black text-sm uppercase tracking-wider bg-green-50 p-3 rounded-xl border border-green-100">
                    <span>Discount Applied</span>
                    <span>-₹{discountPrice}</span>
                  </div>
                )}

                <div className="pt-6 mt-6 border-t border-gray-100 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Payable</span>
                    <span className="text-lg font-black text-gray-900">Grand Total</span>
                  </div>
                  <span className="text-4xl font-black text-primary-600 tracking-tighter">₹{totalPrice.toFixed(0)}</span>
                </div>
              </div>
              
              <Link 
                to="/checkout"
                className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl flex items-center justify-center group hover:bg-black transition-all shadow-xl active:scale-95 text-xl tracking-tight"
              >
                Checkout Now
                <ArrowRight size={24} className="ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>

              {itemsPrice < 300 && (
                <p className="mt-6 text-xs text-center text-gray-400 font-bold bg-gray-50 p-3 rounded-xl border border-gray-100">
                  Add <span className="text-primary-600">₹{300 - itemsPrice}</span> more for <span className="text-green-500 uppercase">Free Delivery!</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
