import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Star, Send, Loader2, MessageSquareQuote } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Feedback = () => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState(user?.name || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/reviews`);
      setReviews(data);
    } catch (err) {
      console.error('Failed to fetch reviews');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (user) setName(user.name);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment) return toast.error('Please add a comment');
    
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/reviews`, {
        name,
        rating,
        comment,
        userId: user?._id
      });
      toast.success('Thank you for your feedback!');
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="feedback" className="py-20 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Customer Feedbacks</h2>
          <div className="w-24 h-1.5 bg-primary-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed italic">
            "Your feedback helps us grow. Share your experience with the Chinese Express community!"
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Submission Form */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-gray-100 animate-in fade-in slide-in-from-left duration-700">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <MessageSquareQuote className="text-primary-600" size={28} />
              Leave a Review
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-gray-900 transition-all font-medium"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700 ml-1">How was your experience?</label>
                <div className="flex gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 w-fit">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-all hover:scale-125 focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={`${
                          (hoverRating || rating) >= star
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        } transition-colors duration-200`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Your Comment</label>
                <textarea
                  required
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-gray-900 transition-all font-medium resize-none"
                  placeholder="The food was amazing! Delivery was fast..."
                ></textarea>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-primary-600 text-white py-5 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-100 flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed group text-lg"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    <span>Submit Feedback</span>
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Reviews Display */}
          <div className="space-y-8 animate-in fade-in slide-in-from-right duration-700">
             <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-gray-900">Recent Ratings</h3>
                <span className="text-sm font-bold text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                  {reviews.length} Feedbacks
                </span>
             </div>

             {fetching ? (
               <div className="flex flex-col gap-6">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="h-32 bg-white rounded-3xl animate-pulse shadow-sm border border-gray-100"></div>
                 ))}
               </div>
             ) : reviews.length === 0 ? (
               <div className="bg-white p-12 rounded-[2.5rem] border border-dashed border-gray-200 text-center">
                 <div className="text-5xl mb-4">🌟</div>
                 <h4 className="text-xl font-bold text-gray-900 mb-2">No reviews yet</h4>
                 <p className="text-gray-500 font-medium italic">Be the first to share your experience!</p>
               </div>
             ) : (
               <div className="flex flex-col gap-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                 {reviews.map((rev) => (
                   <motion.div
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     key={rev._id}
                     className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all border border-gray-100 group"
                   >
                     <div className="flex justify-between items-start mb-4">
                       <div>
                         <h4 className="font-extrabold text-gray-900 text-lg group-hover:text-primary-600 transition-colors uppercase tracking-tight">{rev.name}</h4>
                         <p className="text-xs text-gray-400 font-bold mt-0.5">{new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                       </div>
                       <div className="flex gap-0.5">
                         {[...Array(5)].map((_, i) => (
                           <Star
                             key={i}
                             size={16}
                             className={`${
                               i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                             }`}
                           />
                         ))}
                       </div>
                     </div>
                     <p className="text-gray-600 font-medium leading-relaxed italic relative">
                       <span className="text-3xl text-primary-100 absolute -top-4 -left-2 select-none">"</span>
                       {rev.comment}
                       <span className="text-3xl text-primary-100 absolute -bottom-8 -right-2 select-none">"</span>
                     </p>
                   </motion.div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;
