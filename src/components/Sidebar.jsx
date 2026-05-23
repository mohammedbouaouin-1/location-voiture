import { motion } from "framer-motion";
import { FaChartLine, FaCar, FaCalendarAlt, FaUsers, FaCog, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen, pendingBookings = 0, stats = null }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: <FaChartLine /> },
    { id: 'bookings', label: 'Réservations', icon: <FaCalendarAlt />, badge: pendingBookings },
    { id: 'cars', label: 'Gestion Voitures', icon: <FaCar />, badge: stats?.totalCars || null },
    { id: 'users', label: 'Clients', icon: <FaUsers />, badge: stats?.totalUsers || null },
    { id: 'settings', label: 'Paramètres', icon: <FaCog /> },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-100 z-[70] transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col`}>

        {/* Logo Section */}
        <div className="p-8 pb-10 flex items-center justify-between shrink-0">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#111827] flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-110 transition-transform">
              <FaCar className="text-white text-xl" />
            </div>
            <span className="text-xl font-black uppercase tracking-tighter text-[#111827]">
              LOCA<span className="text-[#C4A47C]">FÈS</span>
            </span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-[#6B7280] hover:text-[#111827] transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-2 flex-1">
          {menuItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 group ${
                activeTab === item.id
                  ? 'bg-[#111827] text-white shadow-lg shadow-black/10'
                  : 'text-[#6B7280] hover:text-[#C4A47C] hover:bg-[#F8F5F0]'
              }`}
            >
              <span className={`text-xl transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-black flex-1 text-left">{item.label}</span>

              {/* Badge */}
              {item.badge > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black shrink-0 ${
                  activeTab === item.id
                    ? 'bg-white/20 text-white'
                    : item.id === 'bookings'
                    ? 'bg-rose-100 text-rose-600 animate-pulse'
                    : 'bg-[#F0EBE3] text-[#C4A47C]'
                }`}>
                  {item.badge}
                </span>
              )}
            </motion.button>
          ))}
        </nav>

        {/* Stats summary at bottom of nav */}
        {stats && (
          <div className="mx-4 mb-4 p-5 bg-[#F9FAFB] rounded-3xl border border-gray-100">
            <p className="text-[9px] font-black uppercase tracking-widest text-[#6B7280] mb-3">Résumé</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Revenus', val: `${(stats.totalRevenue || 0).toLocaleString('fr-FR')} DH` },
                { label: 'Réservations', val: stats.totalBookings || 0 },
              ].map(({ label, val }) => (
                <div key={label}>
                  <p className="text-[8px] font-black uppercase tracking-widest text-[#6B7280]">{label}</p>
                  <p className="text-sm font-black text-[#111827]">{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logout Section */}
        <div className="px-4 py-6 border-t border-gray-50 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all group"
          >
            <FaSignOutAlt className="text-xl group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-black">Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
}
