import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Clock, MapPin, Phone, ShieldCheck, ShoppingBag, Utensils, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderTracker = () => {
  const params = useParams();
  const orderId = params.id;
  const { user } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusStep, setStatusStep] = useState(0); // 0: Placed, 1: Preparing, 2: Out for Delivery, 3: Arrived
  const [eta, setEta] = useState(30); // Estimated minutes remaining

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  // 1. Fetch Order Details from DB on mount
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/payment/order/${orderId}`);
        setOrder(data);
      } catch (err) {
        toast.error('Failed to load order tracking details.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, API_BASE_URL]);

  // 2. Simulated Live Tracking Process using a simple setInterval timer
  useEffect(() => {
    if (statusStep >= 3) return; // Stop timer once order reaches 'Arrived'

    const timer = setInterval(() => {
      setStatusStep((prevStep) => {
        const nextStep = prevStep + 1;
        
        // Show friendly toast notifications as status changes
        if (nextStep === 1) {
          toast('🍳 Chef is preparing your delicious Awadhi meals!', { icon: '👨‍🍳' });
        } else if (nextStep === 2) {
          toast('🛵 Order is out for delivery with Rahul!', { icon: '🏍️' });
        } else if (nextStep === 3) {
          toast.success('🎉 Your order has arrived! Enjoy your food!');
        }

        return nextStep;
      });

      // Decrease the Estimated Time of Arrival (ETA) as order progresses
      setEta((prevEta) => Math.max(0, prevEta - 10));
      
    }, 15000); // Progress to the next step every 15 seconds for demo purposes

    return () => clearInterval(timer);
  }, [statusStep]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center flex-col gap-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold">Connecting to live tracker...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-600">No active tracking found</h2>
        <p className="text-gray-500 mt-2">Make sure your order ID is valid.</p>
        <Link to="/" className="inline-block mt-6 bg-primary-600 text-white px-6 py-2.5 rounded-full font-bold">
          Go Home
        </Link>
      </div>
    );
  }

  // Helper text and descriptions based on current status step
  const steps = [
    { title: 'Order Confirmed', desc: 'Received & verified by restaurant' },
    { title: 'Kitchen Preparing', desc: 'Chef is preparing fresh ingredients' },
    { title: 'Out for Delivery', desc: 'Our rider is delivering to your address' },
    { title: 'Arrived', desc: 'Delicious food is at your doorstep' }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-primary-600 text-white p-8 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="bg-white/20 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full block w-fit mb-3">
              Live Order Tracking
            </span>
            <h1 className="text-3xl font-black tracking-tight">Order #{order._id.slice(-6).toUpperCase()}</h1>
            <p className="opacity-90 mt-1 font-bold text-sm">Payment Method: {order.paymentMethod.toUpperCase()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex items-center gap-4">
            <Clock className="animate-pulse" size={32} />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/70">Estimated Arrival</p>
              <p className="text-2xl font-black">{eta > 0 ? `${eta} Mins` : 'Arrived!'}</p>
            </div>
          </div>
        </div>

        {/* Live Stepper Tracker Section */}
        <div className="p-8 md:p-12 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-8">Delivery Progress</h2>
          
          <div className="relative pl-8 md:pl-0 flex flex-col md:flex-row justify-between items-start gap-8">
            
            {/* Background connection line (Horizontal for desktop, vertical for mobile) */}
            <div className="absolute left-3.5 top-0 bottom-0 w-1 bg-gray-100 md:left-0 md:right-0 md:top-5 md:h-1 md:w-full -z-1">
              <div 
                className="bg-primary-600 h-full md:h-full transition-all duration-1000 ease-in-out" 
                style={{ 
                  height: window.innerWidth < 768 ? `${(statusStep / 3) * 100}%` : '4px',
                  width: window.innerWidth >= 768 ? `${(statusStep / 3) * 100}%` : '4px'
                }}
              />
            </div>

            {/* Steps Rendering */}
            {steps.map((step, index) => {
              const isCompleted = index <= statusStep;
              const isActive = index === statusStep;

              return (
                <div key={index} className="flex md:flex-col items-start md:items-center text-left md:text-center relative flex-1 gap-4 md:gap-2">
                  {/* Step bubble icon */}
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 border-2 z-10 ${
                      isCompleted 
                        ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200' 
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {isCompleted ? <Check size={16} /> : index + 1}
                  </div>

                  {/* Step Labels */}
                  <div className="flex-1 md:mt-2">
                    <p className={`font-black text-sm tracking-tight ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5 leading-normal max-w-[150px]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Partner Details Section */}
        <div className="p-8 md:p-12 bg-gray-50/50 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm border border-primary-100 shrink-0">
              RS
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">Your Delivery Partner</p>
              <h4 className="text-lg font-black text-gray-900">Rahul Sharma</h4>
              <p className="text-xs text-gray-500 font-bold flex items-center mt-1">
                <ShieldCheck size={14} className="text-green-500 mr-1" /> Sanitized & Vaccinated
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto justify-end">
            <a 
              href="tel:9369665818" 
              className="bg-white border border-gray-200 text-gray-700 font-bold px-6 py-3.5 rounded-2xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all flex items-center gap-2 text-sm justify-center w-full md:w-auto"
            >
              <Phone size={16} className="text-primary-600" />
              <span>Call Rahul</span>
            </a>
          </div>
        </div>

        {/* Order Details list */}
        <div className="p-8 md:p-12">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
          <div className="space-y-4">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-400 font-bold">Quantity: {item.qty}</p>
                  </div>
                </div>
                <span className="font-extrabold text-gray-900 text-base">₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Total Bill</p>
              <p className="text-sm font-bold text-gray-500">Includes all taxes & delivery fees</p>
            </div>
            <span className="text-3xl font-black text-primary-600 tracking-tighter">₹{order.totalPrice.toFixed(0)}</span>
          </div>
        </div>

      </div>

      <div className="text-center mt-8">
        <Link to="/" className="inline-flex items-center text-sm font-black text-primary-600 hover:underline uppercase tracking-widest gap-2">
          <ShoppingBag size={16} />
          <span>Back to Home Menu</span>
        </Link>
      </div>
    </div>
  );
};

export default OrderTracker;
