import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, CheckCircle, ShieldCheck, Loader2, QrCode, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

const Checkout = () => {
  const { 
    cartItems, 
    itemsPrice, 
    clearCart,
    deliveryPrice,
    gstPrice,
    handlingPrice,
    gatewayPrice,
    discountPrice,
    totalPrice 
  } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online'); // Default to online
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  // Load Razorpay Script
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login?redirect=/checkout');
    }
    if (cartItems.length === 0 && !success) {
      navigate('/');
    }
  }, [user, cartItems, navigate, success]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (paymentMethod === 'cod') {
      try {
        // Create Cash on Delivery Order in Database
        const { data } = await axios.post(`${API_BASE_URL}/api/payment/order`, {
          amount: Math.round(totalPrice),
          cartItems: cartItems,
          userId: user._id,
          paymentMethod: 'cod',
          billing: {
            itemsPrice,
            gstPrice,
            handlingPrice,
            gatewayPrice,
            deliveryPrice,
            discountPrice
          }
        });

        if (!data.success) {
          throw new Error(data.message);
        }

        setLoading(false);
        setSuccess(true);
        toast.success('Order placed successfully (Cash on Delivery)');
        
        setTimeout(() => {
          clearCart();
          navigate(`/order-tracker/${data.dbOrderId}`);
        }, 3000);
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'Failed to place order';
        toast.error(errorMsg);
        setLoading(false);
      }
      return;
    }

    // Handle Online Payment (Razorpay)
    const res = await loadRazorpay();
    if (!res) {
      toast.error('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    try {
      // 1. Create Order on Backend (Persistent record)
      const { data } = await axios.post(`${API_BASE_URL}/api/payment/order`, {
        amount: Math.round(totalPrice),
        cartItems: cartItems,
        userId: user._id,
        paymentMethod: 'online',
        billing: {
          itemsPrice,
          gstPrice,
          handlingPrice,
          gatewayPrice,
          deliveryPrice,
          discountPrice
        }
      });

      if (!data.success) {
        throw new Error(data.message);
      }

      // 2. Open Razorpay Modal
      const options = {
        key: data.key_id,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Chinese Express",
        description: "Food Delivery Order",
        image: "https://cdn-icons-png.flaticon.com/512/3443/3443338.png",
        order_id: data.order.id,
        handler: async (response) => {
          // 3. Verify Payment on Backend
          try {
            const verifyRes = await axios.post(`${API_BASE_URL}/api/payment/verify`, {
              ...response,
              dbOrderId: data.dbOrderId
            });
            if (verifyRes.data.success) {
              setSuccess(true);
              toast.success('Payment Successful! Order Placed.');
              setTimeout(() => {
                clearCart();
                navigate(`/order-tracker/${data.dbOrderId}`);
              }, 3000);
            }
          } catch (err) {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#dc2626",
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Payment initiation failed';
      toast.error(errorMsg);
      console.error("Checkout Error:", error);
      setLoading(false);
    }
  };

  if (!user || (cartItems.length === 0 && !success)) return null;

  if (success) {
    return (
      <div className="flex-grow flex items-center justify-center p-4 py-16">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 max-w-md w-full text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Order Confirmed!</h2>
          <p className="text-gray-500 mb-8 font-medium italic">Thank you for your purchase. The restaurant has started preparing your food.</p>
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 shadow-inner">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
            <p className="text-4xl font-black text-primary-600 tracking-tighter">₹{totalPrice.toFixed(0)}</p>
          </div>
          <p className="text-sm text-gray-400 font-bold animate-pulse">Redirecting you home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-4xl font-black text-gray-900 mb-10 tracking-tight">Secure Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Payment Form */}
        <div className="space-y-8 animate-in slide-in-from-left duration-500">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center tracking-tight">
              <ShieldCheck className="mr-3 text-green-500" size={32} />
              Payment Details
            </h2>

            <div className="flex gap-4 mb-10 bg-gray-50 p-1.5 rounded-2xl shadow-inner overflow-x-auto">
              <button 
                type="button" 
                onClick={() => setPaymentMethod('online')}
                className={`flex-1 min-w-[120px] py-4 rounded-xl font-black flex items-center justify-center space-x-2 transition-all uppercase tracking-widest text-xs ${paymentMethod === 'online' ? 'bg-white shadow-md text-primary-600' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'}`}
              >
                <QrCode size={18} />
                <span>UPI / Online</span>
              </button>
              <button 
                type="button" 
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 min-w-[120px] py-4 rounded-xl font-black flex items-center justify-center space-x-2 transition-all uppercase tracking-widest text-xs ${paymentMethod === 'card' ? 'bg-white shadow-md text-primary-600' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'}`}
              >
                <CreditCard size={18} />
                <span>Card</span>
              </button>
              <button 
                type="button" 
                onClick={() => setPaymentMethod('cod')}
                className={`flex-1 min-w-[120px] py-4 rounded-xl font-black flex items-center justify-center space-x-2 transition-all uppercase tracking-widest text-xs ${paymentMethod === 'cod' ? 'bg-white shadow-md text-primary-600' : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'}`}
              >
                <span>COD</span>
              </button>
            </div>

            <form onSubmit={handleCheckout} className="space-y-8">
              {paymentMethod === 'online' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                   {/* QR Code Section */}
                   <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center shadow-inner">
                      <div className="bg-white p-4 rounded-2xl shadow-lg mb-6 border border-gray-50">
                        <QRCodeSVG 
                          value={`upi://pay?pa=ramnayak778800-1@okicici&pn=ChineseExpress&am=${Math.round(totalPrice)}&cu=INR`} 
                          size={180}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                      <h4 className="text-lg font-black text-gray-900 mb-2">Scan for Fast Payment</h4>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6 px-4">
                        Supports GPay, PhonePe, BharatPe & All UPI Apps
                      </p>
                      
                      <div className="flex gap-6 justify-center items-center h-8">
                        <img src="/images/gpay.png" alt="GPay" className="h-full object-contain hover:scale-110 transition-transform cursor-pointer" />
                        <img src="/images/phonepe.png" alt="PhonePe" className="h-full object-contain hover:scale-110 transition-transform cursor-pointer" />
                        <img src="/images/upi.png" alt="UPI" className="h-6 object-contain hover:scale-110 transition-transform cursor-pointer" />
                      </div>
                   </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      placeholder={user.name}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Card Number</label>
                    <div className="relative">
                      <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        required
                        maxLength="19"
                        placeholder="0000 0000 0000 0000"
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 font-medium tracking-widest"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Expiry Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        maxLength="5"
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 font-medium text-center"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">CVV</label>
                      <input
                        type="password"
                        required
                        placeholder="123"
                        maxLength="4"
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 font-medium text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="bg-blue-50 text-blue-800 p-6 rounded-[2rem] border border-blue-100 animate-in face-in slide-in-from-top-4 duration-500 shadow-inner">
                  <p className="text-sm font-bold italic leading-relaxed">You will pay <span className="text-2xl font-black block mt-2 mb-1">₹{totalPrice.toFixed(0)}</span> in cash when the food is delivered. Please keep exact change ready!</p>
                </div>
              )}

              <div className="pt-6 border-t border-gray-50">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl hover:bg-black transition-all shadow-2xl flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed group text-xl active:scale-95"
                >
                  {loading ? (
                    <Loader2 className="animate-spin text-white" size={28} />
                  ) : (
                    <>
                      <span>Pay ₹{totalPrice.toFixed(0)} Now</span>
                      <CheckCircle size={22} className="group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
                <div className="text-center mt-6">
                   <p className="text-xs text-gray-400 font-bold flex items-center justify-center uppercase tracking-widest">
                     <ShieldCheck size={14} className="mr-2 text-green-500" /> Secure SSL Encryption Active
                   </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="animate-in slide-in-from-right duration-300">
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
            
            <div className="space-y-4 max-h-72 overflow-y-auto mb-6 pr-2 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-gray-500 font-bold text-xs uppercase tracking-wider">
                <span>Subtotal</span>
                <span className="text-gray-900">₹{itemsPrice}</span>
              </div>
              
              <div className="flex justify-between text-gray-500 font-bold text-xs uppercase tracking-wider">
                <span>GST (5%)</span>
                <span className="text-gray-900">₹{gstPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-500 font-bold text-xs uppercase tracking-wider">
                <span>Handling</span>
                <span className="text-gray-900">₹{handlingPrice}</span>
              </div>

              <div className="flex justify-between text-gray-500 font-bold text-xs uppercase tracking-wider">
                <span>Gateway</span>
                <span className="text-gray-900">₹{gatewayPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-500 font-bold text-xs uppercase tracking-wider">
                <span>Delivery</span>
                {deliveryPrice === 0 ? (
                  <span className="text-green-500 font-black">FREE</span>
                ) : (
                  <span className="text-gray-900">₹{deliveryPrice}</span>
                )}
              </div>

              {discountPrice > 0 && (
                <div className="flex justify-between text-green-600 font-black text-xs uppercase tracking-wider bg-green-50 p-2 rounded-lg border border-green-100">
                  <span>Discount</span>
                  <span>-₹{discountPrice}</span>
                </div>
              )}

              <div className="flex justify-between items-end pt-5 border-t border-gray-200 mt-4">
                <span className="text-lg font-black text-gray-900">Grand Total</span>
                <span className="text-3xl font-black text-primary-600 tracking-tighter">₹{totalPrice.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
