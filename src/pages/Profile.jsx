import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getMyBookings, updateBookingStatus } from '../services/bookingService';
import { FaCalendarAlt, FaCar, FaTimes, FaCheck, FaDownload, FaCrown, FaShieldAlt, FaStar, FaTrophy, FaUser, FaEnvelope, FaPhone, FaLock, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { generateInvoicePDF } from '../utils/generatePDF';
import { updateProfile } from '../services/userService';
import { resolveImageUrl } from '../utils/imageUrl';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';


function getLoyaltyTier(bookingsCount) {
  if (bookingsCount >= 20) return { name: 'Platinum', icon: <FaCrown />, color: 'from-purple-500 to-indigo-500', bg: 'bg-purple-100', textColors: 'text-purple-600', ring: 'ring-purple-200', next: null, progress: 100 };
  if (bookingsCount >= 10) return { name: 'Gold', icon: <FaTrophy />, color: 'from-amber-400 to-orange-400', bg: 'bg-amber-100', textColors: 'text-amber-600', ring: 'ring-amber-200', next: 'Platinum', target: 20, progress: (bookingsCount / 20) * 100 };
  if (bookingsCount >= 5) return { name: 'Silver', icon: <FaStar />, color: 'from-slate-300 to-slate-400', bg: 'bg-slate-100', textColors: 'text-slate-600', ring: 'ring-slate-200', next: 'Gold', target: 10, progress: (bookingsCount / 10) * 100 };
  return { name: 'Bronze', icon: <FaShieldAlt />, color: 'from-orange-200 to-orange-300', bg: 'bg-orange-50', textColors: 'text-orange-700', ring: 'ring-orange-100', next: 'Silver', target: 5, progress: (bookingsCount / 5) * 100 };
}

export default function Profile() {
  const { currentUser, logout, updateUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [editFormData, setEditFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    password: ''
  });
  const [updating, setUpdating] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data || []);
    } catch (err) {
      toast.error("Erreur lors de la récupération des réservations.");
    } finally {
      setLoading(false);
    }
  };

  const confirmedBookingsCount = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length;

  const totalSpent = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const tier = getLoyaltyTier(confirmedBookingsCount);

  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status === filterStatus);

  const handleCancel = (id) => {
    setConfirmCancel(id);
  };

  const doCancel = async () => {
    const id = confirmCancel;
    setConfirmCancel(null);
    try {
      await updateBookingStatus(id, 'cancelled');
      setBookings(bookings.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
      toast.success("Réservation annulée avec succès");
    } catch (err) {
      toast.error("Impossible d'annuler la réservation");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    if (!editFormData.name.trim()) {
      toast.error("Le nom est requis");
      setUpdating(false);
      return;
    }
    if (!editFormData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email)) {
      toast.error("Veuillez fournir un email valide");
      setUpdating(false);
      return;
    }
    if (editFormData.phone && !/^\+?[0-9\s-]{8,20}$/.test(editFormData.phone)) {
      toast.error("Veuillez fournir un numéro de téléphone valide");
      setUpdating(false);
      return;
    }
    if (editFormData.password && editFormData.password.length < 6) {
      toast.error("Le mot de passe doit comporter au moins 6 caractères");
      setUpdating(false);
      return;
    }

    try {
      const data = { ...editFormData };
      if (!data.password) delete data.password;
      const updatedUser = await updateProfile(data);
      updateUser(updatedUser);
      toast.success("Profil mis à jour !");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur de mise à jour");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-50 text-amber-600 border-amber-200",
      confirmed: "bg-emerald-50 text-emerald-600 border-emerald-200",
      cancelled: "bg-rose-50 text-rose-500 border-rose-200",
      completed: "bg-[#F8F5F0] text-[#C4A47C] border-[#DDD0C0]",
    };
    const labels = {
      pending: "En attente",
      confirmed: "Confirmée",
      cancelled: "Annulée",
      completed: "Terminée",
    };
    return (
      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <Helmet>
        <title>Mon Profil | LocaFès</title>
        <meta name="description" content="Gérez votre profil et vos réservations LocaFès." />
      </Helmet>

      <div className="max-w-6xl mx-auto px-6">
        
        {}
        <div className="bg-[#F8FAFC] border border-gray-100 rounded-[40px] p-10 md:p-14 mb-12 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden">
          {}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F0EBE3]/50 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-50/50 rounded-full blur-[60px]" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            {}
            <div className="relative group shrink-0">
              <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity`} />
              <div className={`relative w-28 h-28 rounded-[2rem] bg-white border-2 border-white shadow-xl flex items-center justify-center text-4xl font-extrabold ${tier.textColors}`}>
                {currentUser.name?.charAt(0).toUpperCase()}
              </div>
              {}
              <div className={`absolute -bottom-2 -right-2 w-10 h-10 ${tier.bg} ${tier.textColors} rounded-2xl flex items-center justify-center text-sm shadow-md border-4 border-[#F8FAFC]`}>
                {tier.icon}
              </div>
            </div>
            
            {}
            <div className="text-center md:text-left flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#111827] tracking-tight truncate">{currentUser.name}</h1>
                <span className={`inline-flex px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${tier.bg} ${tier.textColors} shadow-sm border border-white/50 w-fit mx-auto md:mx-0`}>
                  {tier.name}
                </span>
              </div>
              <p className="text-sm font-bold text-[#6B7280]">{currentUser.email}</p>
              
              {}
              {tier.next && (
                <div className="mt-6 max-w-sm mx-auto md:mx-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] text-[#9CA3AF] font-bold uppercase tracking-widest">Progression vers {tier.next}</span>
                    <span className="text-[10px] text-[#111827] font-black">{confirmedBookingsCount}/{tier.target} locations</span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden border border-gray-100 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(tier.progress, 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full bg-gradient-to-r ${tier.color} rounded-full`} 
                    />
                  </div>
                </div>
              )}
            </div>
            
            {}
            <div className="flex gap-4 w-full md:w-auto shrink-0 mt-6 md:mt-0">
              <div className="flex-1 md:flex-none text-center p-5 rounded-[24px] bg-white border border-gray-100 shadow-sm shadow-gray-100 min-w-[100px]">
                <p className="text-3xl font-black text-[#111827]">{confirmedBookingsCount}</p>
                <p className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest mt-1">Locations</p>
              </div>
              <div className="flex-1 md:flex-none text-center p-5 rounded-[24px] bg-white border border-gray-100 shadow-sm shadow-gray-100 min-w-[100px]">
                <p className="text-xl md:text-2xl font-black text-[#C4A47C]">{totalSpent}</p>
                <p className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest mt-1">DH Total</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-10">
          
          {}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              
              {}
              <div className="bg-[#F8FAFC] rounded-[32px] p-3 shadow-sm border border-gray-100">
                <button 
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-[20px] font-extrabold text-sm transition-all ${
                    activeTab === 'bookings' 
                      ? 'bg-white text-[#111827] shadow-sm shadow-gray-200 border border-transparent' 
                      : 'text-[#6B7280] hover:bg-white/50 border border-transparent hover:border-gray-100'
                  }`}
                >
                  <FaCalendarAlt size={16} className={activeTab === 'bookings' ? 'text-[#C4A47C]' : 'text-[#9CA3AF]'} />
                  Mes Réservations
                  <span className={`ml-auto text-[10px] font-black px-2 py-1 rounded-lg ${
                     activeTab === 'bookings' ? 'bg-[#F8FAFC] text-[#C4A47C]' : 'bg-gray-100 text-[#6B7280]'
                  }`}>{bookings.length}</span>
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-5 py-4 mt-2 rounded-[20px] font-extrabold text-sm transition-all ${
                    activeTab === 'settings' 
                      ? 'bg-white text-[#111827] shadow-sm shadow-gray-200 border border-transparent' 
                      : 'text-[#6B7280] hover:bg-white/50 border border-transparent hover:border-gray-100'
                  }`}
                >
                  <FaUser size={16} className={activeTab === 'settings' ? 'text-[#C4A47C]' : 'text-[#9CA3AF]'} />
                  Mon Profil
                </button>
              </div>

              {}
              <Link 
                to="/cars"
                className="flex items-center gap-3 w-full px-6 py-4 bg-[#111827] rounded-[24px] text-sm font-black text-white hover:bg-black hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200 transition-all group"
              >
                <FaCar className="text-white/60" />
                Nouvelle réservation
                <FaArrowRight size={12} className="ml-auto group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              
              {}
              {activeTab === 'bookings' && (
                <motion.div key="bookings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  
                  {}
                  <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                      { key: 'all', label: 'Toutes' },
                      { key: 'pending', label: 'En attente' },
                      { key: 'confirmed', label: 'Confirmées' },
                      { key: 'completed', label: 'Terminées' },
                      { key: 'cancelled', label: 'Annulées' },
                    ].map(f => (
                      <button
                        key={f.key}
                        onClick={() => setFilterStatus(f.key)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-extrabold whitespace-nowrap transition-all border ${
                          filterStatus === f.key
                            ? 'bg-[#111827] text-white border-[#111827] shadow-md shadow-gray-300'
                            : 'bg-white text-[#6B7280] border-gray-200 hover:border-gray-300 hover:text-[#111827] bg-[#F8FAFC]'
                        }`}
                      >
                        {f.label}
                        {statusCounts[f.key] > 0 && (
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                            filterStatus === f.key ? 'bg-white/20' : 'bg-gray-200 text-[#4B5563]'
                          }`}>{statusCounts[f.key]}</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-20">
                      <div className="w-10 h-10 border-4 border-[#C4A47C] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : filteredBookings.length === 0 ? (
                    <div className="bg-[#F8FAFC] rounded-[40px] p-16 text-center border border-gray-100">
                      <div className="w-20 h-20 bg-white shadow-sm border border-gray-50 rounded-[28px] flex items-center justify-center mx-auto mb-6">
                        <FaCar className="text-gray-300 text-3xl" />
                      </div>
                      <p className="text-xl font-extrabold text-[#111827] mb-2">
                        {filterStatus === 'all' ? 'Aucune réservation' : `Aucune réservation "${filterStatus}"`}
                      </p>
                      <p className="text-sm font-medium text-[#6B7280] mb-8 max-w-sm mx-auto">
                        {filterStatus === 'all' 
                          ? "Vous n'avez pas encore loué de véhicule chez LocaFès."
                          : "Aucune réservation ne correspond à ce filtre."}
                      </p>
                      {filterStatus === 'all' && (
                        <Link to="/cars" className="inline-flex items-center gap-2 px-8 py-4 bg-[#111827] text-white rounded-2xl font-black text-sm hover:shadow-xl shadow-gray-200 transition-all hover:-translate-y-0.5">
                          Explorer les véhicules <FaArrowRight />
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {filteredBookings.map((booking, idx) => (
                        <motion.div
                          key={booking._id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="bg-white rounded-[32px] p-5 border border-gray-100 shadow-[0_4px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 group"
                        >
                          <div className="flex flex-col md:flex-row gap-6">
                            {}
                            <div className="w-full md:w-48 h-32 bg-[#F8FAFC] rounded-2xl overflow-hidden shrink-0 border border-gray-50 flex items-center justify-center p-2 relative">
                              {booking.car?.image ? (
                                <img 
                                  src={resolveImageUrl(booking.car.image)} 
                                  alt={booking.car?.name} 
                                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
                                />
                              ) : (
                                <div className="text-gray-300 flex flex-col items-center">
                                  <FaCar size={28} />
                                </div>
                              )}
                            </div>

                            {}
                            <div className="flex-1 flex flex-col justify-between py-1">
                              <div>
                                <div className="flex justify-between items-start gap-3 mb-2">
                                  <h4 className="text-xl font-extrabold text-[#111827] tracking-tight">{booking.car?.name || 'Véhicule Premium'}</h4>
                                  {getStatusBadge(booking.status)}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-[#6B7280]">
                                  <FaCalendarAlt className="text-[#9CA3AF] shrink-0" size={12} />
                                  <span>{new Date(booking.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                                  <span className="text-gray-300">→</span>
                                  <span>{new Date(booking.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap items-center justify-between pt-5 mt-auto">
                                <div>
                                  <p className="text-[10px] font-black uppercase text-[#9CA3AF] tracking-widest mb-0.5">Montant Réglé</p>
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-black text-[#111827]">{booking.totalPrice}</span>
                                    <span className="text-[10px] font-bold text-[#6B7280]">DH</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  {booking.status === 'pending' && (
                                    <button 
                                      onClick={() => handleCancel(booking._id)}
                                      className="px-5 py-2.5 bg-rose-50 text-rose-500 rounded-xl text-xs font-black hover:bg-rose-500 hover:text-white transition-all flex items-center gap-1.5"
                                    >
                                      Annuler la location
                                    </button>
                                  )}
                                  
                                  {(booking.status === 'confirmed' || booking.status === 'completed') && (
                                    <button 
                                      onClick={() => generateInvoicePDF(booking, true)}
                                      className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-[#111827] rounded-xl text-xs font-black hover:border-[#111827] transition-all flex items-center gap-2"
                                    >
                                      <FaDownload size={10} className="text-[#6B7280]" /> Reçu PDF
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {}
              {activeTab === 'settings' && (
                <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  
                  <div className="bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-[0_4px_30px_-15px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm">
                        <FaUser className="text-[#C4A47C]" size={20} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-extrabold text-[#111827]">Données Personnelles</h3>
                        <p className="text-sm text-[#6B7280] font-medium">Configurez vos préférences de contact</p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                        
                        {}
                        <div className="space-y-2">
                          <label htmlFor="profile-name" className="block text-[10px] font-black uppercase tracking-widest text-[#6B7280] ml-1">
                            Nom Complet
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <FaUser className="text-gray-400" size={14} />
                            </div>
                            <input 
                              id="profile-name"
                              value={editFormData.name} 
                              onChange={e => setEditFormData({...editFormData, name: e.target.value})} 
                              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#C4A47C] focus:ring-4 focus:ring-[#F8F5F0] outline-none transition-all font-bold text-sm text-[#111827]" 
                            />
                          </div>
                        </div>

                        {}
                        <div className="space-y-2">
                          <label htmlFor="profile-email" className="block text-[10px] font-black uppercase tracking-widest text-[#6B7280] ml-1">
                            Adresse Email
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <FaEnvelope className="text-gray-400" size={14} />
                            </div>
                            <input 
                              id="profile-email"
                              type="email"
                              value={editFormData.email} 
                              onChange={e => setEditFormData({...editFormData, email: e.target.value})} 
                              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#C4A47C] focus:ring-4 focus:ring-[#F8F5F0] outline-none transition-all font-bold text-sm text-[#111827]" 
                            />
                          </div>
                        </div>

                        {}
                        <div className="space-y-2">
                          <label htmlFor="profile-phone" className="block text-[10px] font-black uppercase tracking-widest text-[#6B7280] ml-1">
                            Téléphone
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <FaPhone className="text-gray-400" size={14} />
                            </div>
                            <input 
                              id="profile-phone"
                              type="tel"
                              value={editFormData.phone} 
                              onChange={e => setEditFormData({...editFormData, phone: e.target.value})} 
                              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#C4A47C] focus:ring-4 focus:ring-[#F8F5F0] outline-none transition-all font-bold text-sm text-[#111827]" 
                            />
                          </div>
                        </div>

                        {}
                        <div className="space-y-2">
                          <label htmlFor="profile-password" className="block text-[10px] font-black uppercase tracking-widest text-[#6B7280] ml-1">
                            Nouveau Mot de Passe
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <FaLock className="text-gray-400" size={14} />
                            </div>
                            <input 
                              id="profile-password"
                              type="password"
                              value={editFormData.password} 
                              onChange={e => setEditFormData({...editFormData, password: e.target.value})} 
                              placeholder="Laisser vide pour ne pas changer"
                              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#C4A47C] focus:ring-4 focus:ring-[#F8F5F0] outline-none transition-all font-bold text-sm text-[#111827] placeholder:text-gray-400" 
                            />
                          </div>
                        </div>

                      </div>
                      
                      <div className="pt-8">
                        <button 
                          type="submit" 
                          disabled={updating} 
                          className="w-full md:w-auto px-10 py-4 bg-[#111827] text-white rounded-2xl font-black text-sm shadow-xl shadow-gray-200 hover:bg-black hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                          {updating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Sauvegarde...
                            </>
                          ) : (
                            <>
                              <FaCheck /> Sauvegarder les données
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {}
                  <div className="bg-[#FFF5F5] rounded-[32px] p-8 border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h4 className="text-sm font-extrabold text-rose-600 mb-1">Déconnexion de l'appareil</h4>
                      <p className="text-xs text-rose-500/70 font-medium">Vous devrez vous reconnecter pour gérer vos réservations.</p>
                    </div>
                    <button 
                      onClick={logout}
                      className="w-full md:w-auto px-8 py-3.5 bg-white border border-rose-200 text-rose-500 shadow-sm shadow-rose-100 rounded-xl font-black text-xs hover:border-rose-500 transition-all"
                    >
                      Me déconnecter
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {}
      <AnimatePresence>
        {confirmCancel && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmCancel(null)}
              className="absolute inset-0 bg-[#111827]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-[40px] shadow-2xl p-10 max-w-sm w-full text-center border border-gray-100"
            >
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FaTimes className="text-rose-500 text-2xl" />
              </div>
              <h3 className="text-xl font-extrabold text-[#111827] mb-3">Annuler la réservation ?</h3>
              <p className="text-sm text-[#6B7280] font-medium mb-8 leading-relaxed">Cette action annulera définitivement la réservation sélectionnée.</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setConfirmCancel(null)}
                  className="flex-1 py-3.5 bg-gray-50 text-[#111827] border border-gray-200 rounded-xl font-bold text-sm hover:bg-white transition-all"
                >
                  Garder
                </button>
                <button
                  onClick={doCancel}
                  className="flex-1 py-3.5 bg-[#111827] text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg shadow-gray-200"
                >
                  Oui, annuler
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
