import { useState, useEffect, useRef } from 'react';
import { FaBell, FaBars, FaChevronDown, FaUserShield, FaClock, FaCalendarDay, FaBookmark } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  cancelled: 'Annulé',
  completed: 'Terminé',
};

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-600 border-amber-100',
  confirmed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  cancelled: 'bg-rose-50 text-rose-600 border-rose-100',
  completed: 'bg-[#F8F5F0] text-[#C4A47C] border-[#E8DDD0]',
};

export default function Topbar({ setIsOpen, pendingBookings = [], recentBookings = [] }) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [showNotif, setShowNotif] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef(null);
  const profileMenuRef = useRef(null);

  
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatNotifTime = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const pendingCount = pendingBookings.length;

  const formatDate = (d) => {
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (d) => {
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <header className="sticky top-0 z-50 w-full px-8 py-5 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between">

      {}
      <div className="flex items-center gap-6 flex-1">
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-3 bg-white border border-gray-100 rounded-xl text-[#C4A47C] hover:shadow-lg transition-all"
        >
          <FaBars size={20} />
        </button>

        {}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2 text-[#6B7280]">
            <FaCalendarDay className="text-[#C4A47C]" size={13} />
            <span className="text-xs font-bold capitalize">{formatDate(time)}</span>
          </div>
          <div className="h-4 w-[1px] bg-gray-200" />
          <div className="flex items-center gap-2 text-[#6B7280]">
            <FaClock className="text-[#C4A47C]" size={13} />
            <span className="text-xs font-black tracking-widest tabular-nums">{formatTime(time)}</span>
          </div>
        </div>
      </div>

      {}
      <div className="flex items-center gap-4">
        {}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotif(v => !v)}
            aria-haspopup="menu"
            aria-expanded={showNotif}
            className="relative p-3 bg-[#F9FAFB] border border-gray-100 rounded-2xl text-[#6B7280] hover:text-[#C4A47C] transition-all group"
          >
            <FaBell size={20} className="group-hover:rotate-12 transition-transform" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-rose-500/40 animate-pulse">
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotif && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-14 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[200]"
              >
                <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaBell className="text-[#C4A47C]" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#111827]">Notifications</span>
                  </div>
                  {pendingCount > 0 && (
                    <span className="px-2 py-0.5 bg-rose-50 text-rose-500 text-[9px] font-black uppercase tracking-widest rounded-full">
                      {pendingCount} en attente
                    </span>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {pendingBookings.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                      <FaBookmark className="text-gray-200 text-3xl mx-auto mb-3" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Aucune notification</p>
                    </div>
                  ) : (
                    pendingBookings.slice(0, 5).map((b) => (
                      <div key={b._id} className="px-6 py-4 hover:bg-[#F9FAFB] transition-colors border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-black text-xs shrink-0">
                            {b.fullName?.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black uppercase tracking-tight text-[#111827] truncate">{b.fullName}</p>
                            <p className="text-[10px] font-bold text-[#6B7280] truncate">{b.car?.name} — {b.totalPrice} DH</p>
                            {b.createdAt && (
                              <p className="text-[8px] text-gray-400 mt-0.5">{formatNotifTime(b.createdAt)}</p>
                            )}
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${STATUS_STYLES[b.status]}`}>
                            {STATUS_LABELS[b.status]}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-10 w-[1px] bg-gray-100 mx-2" />

        {}
        {/* Profile */}
        <div className="relative" ref={profileMenuRef}>
          <div 
            onClick={() => setShowProfileMenu(v => !v)}
            className="flex items-center gap-4 pl-2 cursor-pointer group"
          >
            <div className="hidden text-right md:block">
              <p className="text-sm font-black uppercase tracking-tight text-[#111827]">{currentUser?.name || 'Administrateur'}</p>
              <p className="text-[9px] font-black text-[#C4A47C] uppercase tracking-[0.2em]">{currentUser?.role || 'Manager'}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#111827] to-[#1d4ed8] p-[1px] shadow-lg shadow-black/10 hover:scale-105 transition-all">
              <div className="w-full h-full bg-white rounded-[15px] flex items-center justify-center font-black text-[#C4A47C]">
                {currentUser?.name?.charAt(0) || <FaUserShield />}
              </div>
            </div>
            <FaChevronDown className={`text-[#6B7280] group-hover:text-[#C4A47C] transition-transform text-xs ${showProfileMenu ? 'rotate-180' : ''}`} />
          </div>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-14 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[200] py-2"
              >
                <Link
                  to="/"
                  className="block px-5 py-3 text-xs font-bold text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB] transition-colors"
                >
                  Retour au site
                </Link>
                <Link
                  to="/profile"
                  className="block px-5 py-3 text-xs font-bold text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB] transition-colors"
                >
                  Mon profil
                </Link>
                <div className="h-[1px] bg-gray-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-5 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  Déconnexion
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
