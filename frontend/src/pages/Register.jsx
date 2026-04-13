import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { register, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Frontend validations
    if (!name) {
      return toast.error('Please enter your full name');
    }
    if (!email) {
      return toast.error('Please enter your email address');
    }
    if (!password) {
      return toast.error('Please choose a password');
    }
    if (password.length < 6) {
      return toast.error('Password must be at least 6 characters long');
    }
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    const result = await register(name, email, password);
    if (result.success) {
      toast.success('Account created successfully! Welcome!');
      
      // If we came from the Checkout redirect, navigate back to Checkout
      const redirectPath = new URLSearchParams(window.location.search).get('redirect') || '/';
      navigate(redirectPath);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-500">
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="bg-primary-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-1 ring-primary-100">
                <ShieldCheck size={44} className="text-primary-600" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Join Us</h1>
            <p className="text-gray-500 font-medium">Create your Chinese Express account</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-gray-400">
                  <User size={20} />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-gray-900 transition-all font-medium"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-gray-400">
                  <Mail size={20} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-gray-900 transition-all font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-gray-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-gray-900 transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1 uppercase tracking-wider">Confirm</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-5 flex items-center text-gray-400">
                    <Lock size={18} />
                  </span>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-gray-900 transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-primary-600 text-white py-5 rounded-2xl font-black hover:bg-primary-700 transition-all shadow-xl hover:shadow-primary-100 flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed group text-lg mt-4 active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 font-bold">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-black hover:underline ml-1">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
