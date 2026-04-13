import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Loader2, Users, Utensils, ShieldCheck, Mail, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'users'
  const [foods, setFoods] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`${API_BASE_URL}/api/food`, config);
      setFoods(data.foods);
    } catch (err) {
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.get(`${API_BASE_URL}/api/users`, config);
      setUsers(data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) {
      if (activeTab === 'menu') fetchFoods();
      else fetchUsers();
    }
  }, [user, activeTab]);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        await axios.delete(`http://localhost:5000/api/food/${id}`, config);
        setFoods(foods.filter((f) => f._id !== id));
        toast.success('Item deleted');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="text-gray-500 mt-2">You must be an admin to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your restaurant operations</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-2xl shadow-inner">
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
              activeTab === 'menu' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Utensils size={18} />
            <span>Menu Items</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
              activeTab === 'users' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users size={18} />
            <span>Users</span>
          </button>
        </div>
      </div>

      {activeTab === 'menu' ? (
        <div className="animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Menu List</h2>
            <button className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-all flex items-center space-x-2 shadow-lg hover:shadow-primary-100">
              <Plus size={20} />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">NAME</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">PRICE</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">CATEGORY</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest leading-none text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-16 text-center">
                      <Loader2 className="animate-spin inline-block text-primary-600" size={32} />
                    </td>
                  </tr>
                ) : foods.map((food) => (
                  <tr key={food._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6 font-bold text-gray-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{food.name}</td>
                    <td className="px-8 py-6 text-gray-900 font-medium">₹{food.price}</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold ring-1 ring-primary-100">
                        {food.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2.5 text-gray-400 hover:text-primary-600 bg-gray-50 rounded-full transition-all">
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => deleteHandler(food._id)}
                          className="p-2.5 text-gray-400 hover:text-red-600 bg-gray-50 rounded-full transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">User Accounts</h2>
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">USER DETAILS</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">ROLE</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">JOINED ON</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="px-8 py-16 text-center">
                      <Loader2 className="animate-spin inline-block text-primary-600" size={32} />
                    </td>
                  </tr>
                ) : users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary-100 text-primary-600 font-bold w-12 h-12 rounded-2xl flex items-center justify-center text-lg uppercase shadow-sm">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-extrabold text-gray-900 group-hover:text-primary-600 transition-colors leading-tight uppercase tracking-tight">{u.name}</div>
                          <div className="text-sm text-gray-400 font-bold flex items-center mt-0.5">
                            <Mail size={12} className="mr-1.5" />
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {u.isAdmin ? (
                        <div className="flex items-center text-red-600 font-bold text-xs uppercase tracking-widest bg-red-50 px-3 py-1 rounded-full ring-1 ring-red-100 w-fit">
                          <ShieldCheck size={14} className="mr-1.5" />
                          Administrator
                        </div>
                      ) : (
                        <div className="text-gray-500 font-bold text-xs uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full ring-1 ring-gray-100 w-fit">
                          Customer
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-gray-500 font-bold text-xs flex items-center">
                        <Calendar size={14} className="mr-1.5 text-gray-300" />
                        {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
