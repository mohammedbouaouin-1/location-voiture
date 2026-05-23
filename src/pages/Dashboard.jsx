import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboardStats, getUsers, deleteUser, updateUser } from '../services/dashboardService';
import { getAllBookings, updateBookingStatus, deleteBooking } from '../services/bookingService';
import { getCars, createCar, deleteCar, updateCar } from '../services/carService';
import { FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import OverviewTab from './admin/OverviewTab';
import UsersTab from './admin/UsersTab';
import BookingsTab from './admin/BookingsTab';
import CarsTab from './admin/CarsTab';
import SettingsTab from './admin/SettingsTab';




function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-[#111827]/60 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="relative bg-white rounded-[40px] p-12 max-w-sm w-full shadow-2xl text-center"
      >
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center text-3xl mx-auto mb-6">
          <FaExclamationTriangle />
        </div>
        <h3 className="text-xl font-black uppercase tracking-tight text-[#111827] mb-3">Confirmer la suppression</h3>
        <p className="text-sm text-[#6B7280] font-medium mb-8">{message}</p>
        <div className="flex gap-4">
          <button
            onClick={onConfirm}
            className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-500/30 hover:scale-105 transition-all"
          >
            Supprimer
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-4 bg-gray-50 text-[#6B7280] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all"
          >
            Annuler
          </button>
        </div>
      </motion.div>
    </div>
  );
}




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




function SkeletonRow({ cols = 5 }) {
  return (
    <tr className="border-b border-gray-50">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-10 py-7">
          <div className="h-4 bg-gray-100 rounded-full animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
    </tr>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-white">
      <div className="w-12 h-12 rounded-2xl bg-gray-100 animate-pulse mb-6" />
      <div className="h-3 bg-gray-100 rounded-full animate-pulse w-20 mb-3" />
      <div className="h-8 bg-gray-100 rounded-full animate-pulse w-32 mb-3" />
      <div className="h-3 bg-gray-100 rounded-full animate-pulse w-16" />
    </div>
  );
}

function SkeletonOverview() {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
      </div>
      <div className="bg-white rounded-[40px] p-10 shadow-sm border border-white h-80 animate-pulse" />
    </div>
  );
}

function SkeletonTable({ cols = 5 }) {
  return (
    <div className="bg-white rounded-[48px] overflow-hidden shadow-xl shadow-gray-200/50 border border-white">
      <table className="w-full min-w-[800px]">
        <tbody>
          {[1, 2, 3, 4, 5].map(i => <SkeletonRow key={i} cols={cols} />)}
        </tbody>
      </table>
    </div>
  );
}




export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCar, setNewCar] = useState({ name: '', brand: '', price: '', imageFile: null, fuel: 'Diesel', gearbox: 'Automatique', year: 2024, available: true });
  const [imagePreview, setImagePreview] = useState(null);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  
  const [confirmModal, setConfirmModal] = useState(null); 

  const showConfirm = (message, onConfirm) => {
    setConfirmModal({ message, onConfirm });
  };

  
  const pendingCount = activeTab === 'bookings' 
    ? bookings.filter(b => b.status === 'pending').length 
    : (stats?.pendingBookingsCount || 0);
  
  const pendingList = activeTab === 'bookings' 
    ? bookings.filter(b => b.status === 'pending')
    : (stats?.recentBookings?.filter(b => b.status === 'pending') || []);

  useEffect(() => {
    fetchStats();
  }, []); 

  useEffect(() => {
    setPage(1);
    fetchData(1);
  }, [activeTab]); 

  useEffect(() => {
    if (activeTab === 'overview') return;
    const timer = setTimeout(() => {
      setPage(1);
      fetchData(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]); 

  const fetchStats = async (period = '7j') => {
    try {
      const data = await getDashboardStats(period);
      setStats(data);
    } catch (err) {
      toast.error('Erreur chargement stats');
    }
  };

  const fetchData = async (pageNum = page) => {
    setLoading(true);
    try {
      const params = { page: pageNum, limit, search: searchTerm };
      if (activeTab === 'overview') {
        await fetchStats();
      } else if (activeTab === 'users') {
        const data = await getUsers(params);
        if (data.users) { setUsers(data.users); setTotalPages(data.totalPages); }
        else { setUsers(data); setTotalPages(1); }
      } else if (activeTab === 'bookings') {
        const data = await getAllBookings(params);
        if (data.bookings) { setBookings(data.bookings); setTotalPages(data.totalPages); }
        else { setBookings(data); setTotalPages(1); }
      } else if (activeTab === 'cars') {
        const data = await getCars(params);
        if (data.cars) { setCars(data.cars); setTotalPages(data.totalPages); }
        else { setCars(data); setTotalPages(1); }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchData(newPage);
  };

  const handleDeleteUser = async (id) => {
    showConfirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.', async () => {
      setConfirmModal(null);
      try {
        await deleteUser(id);
        setUsers(users.filter(u => u._id !== id));
        toast.success('Utilisateur supprimé');
      } catch (err) {
        toast.error('Erreur lors de la suppression');
      }
    });
  };

  const handleUpdateBooking = async (id, status) => {
    try {
      const updated = await updateBookingStatus(id, status);
      if (activeTab === 'bookings') {
        setBookings(bookings.map(b => (b._id || b.id) === id ? updated : b));
      } else if (activeTab === 'overview') {
        setStats(prev => ({
          ...prev,
          recentBookings: prev.recentBookings.map(b => (b._id || b.id) === id ? updated : b)
        }));
      }
      await fetchData(page); 
      fetchStats(); 
      toast.success(`Statut mis à jour : ${STATUS_LABELS[status] || status}`);
    } catch (err) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteBooking = async (id) => {
    showConfirm('Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.', async () => {
      setConfirmModal(null);
      try {
        await deleteBooking(id);
        setBookings(bookings.filter(b => b._id !== id));
        await fetchData(page); 
        fetchStats(); 
        toast.success('Réservation supprimée');
      } catch (err) {
        toast.error('Erreur suppression');
      }
    });
  };

  const handleCreateCar = async (e) => {
    e.preventDefault();
    if (!newCar.imageFile) { toast.error('Veuillez sélectionner une image !'); return; }
    try {
      const formData = new FormData();
      formData.append('name', newCar.name);
      formData.append('brand', newCar.brand);
      formData.append('price', newCar.price);
      formData.append('fuel', newCar.fuel);
      formData.append('gearbox', newCar.gearbox);
      formData.append('year', newCar.year);
      formData.append('available', newCar.available);
      formData.append('image', newCar.imageFile);
      const created = await createCar(formData);
      setCars([...cars, created]);
      setShowAddModal(false);
      setNewCar({ name: '', brand: '', price: '', imageFile: null, fuel: 'Diesel', gearbox: 'Automatique', year: 2024, available: true });
      setImagePreview(null);
      toast.success('Véhicule ajouté avec succès !');
    } catch (err) {
      toast.error("Erreur lors de l'ajout du véhicule");
    }
  };

  const handleDeleteCar = async (id) => {
    showConfirm('Êtes-vous sûr de vouloir retirer ce véhicule de la flotte ? Cette action est irréversible.', async () => {
      setConfirmModal(null);
      try {
        await deleteCar(id);
        setCars(cars.filter(c => c._id !== id));
        toast.success('Véhicule retiré');
      } catch (err) {
        toast.error('Erreur suppression');
      }
    });
  };

  const handleToggleRole = async (user) => {
    try {
      const newRole = user.role === 'admin' ? 'user' : 'admin';
      const userId = user._id || user.id;
      const updated = await updateUser(userId, { role: newRole });
      setUsers(users.map(u => (u._id || u.id) === userId ? updated : u));
      toast.success(`Rôle mis à jour pour ${user.name}`);
    } catch (err) {
      toast.error('Erreur lors du changement de rôle');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const userId = editingUser._id || editingUser.id;
      const updated = await updateUser(userId, {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        phone: editingUser.phone
      });
      setUsers(users.map(u => (u._id || u.id) === userId ? updated : u));
      setShowUserEditModal(false);
      toast.success('Utilisateur mis à jour !');
    } catch (err) {
      toast.error('Erreur de mise à jour');
    }
  };

  const handleToggleAvailability = async (car) => {
    try {
      const carId = car._id || car.id;
      const updated = await updateCar(carId, { available: !car.available });
      setCars(cars.map(c => (c._id || c.id) === carId ? updated : c));
      toast.success('Statut du véhicule mis à jour');
    } catch (err) {
      toast.error('Erreur de mise à jour');
    }
  };

  const handleUpdateCar = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      const editableFields = ['name', 'brand', 'price', 'fuel', 'gearbox', 'year', 'available'];
      editableFields.forEach(field => {
        if (editingCar[field] !== undefined) {
          formData.append(field, editingCar[field]);
        }
      });
      if (editingCar.imageFile) {
        formData.append('image', editingCar.imageFile);
      }
      const carId = editingCar._id || editingCar.id;
      const updated = await updateCar(carId, formData);
      setCars(cars.map(c => (c._id || c.id) === carId ? updated : c));
      setShowEditModal(false);
      setEditImagePreview(null);
      toast.success('Véhicule mis à jour !');
    } catch (err) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getStatusBadge = (status) => (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );

  
  const renderSkeleton = () => {
    if (activeTab === 'overview') return <SkeletonOverview />;
    if (activeTab === 'bookings') return <SkeletonTable cols={5} />;
    if (activeTab === 'cars') return <SkeletonTable cols={5} />;
    if (activeTab === 'users') return <SkeletonTable cols={6} />;
    return <div className="flex justify-center py-32"><div className="w-16 h-16 border-4 border-[#C4A47C] border-t-transparent rounded-full animate-spin" /></div>;
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        pendingBookings={pendingCount}
        stats={stats}
      />

      <main className="flex-1 min-w-0 w-full overflow-x-hidden lg:ml-72 min-h-screen relative">
        <Topbar
          setIsOpen={setSidebarOpen}
          pendingBookings={pendingList}
        />

        <div className="p-8 lg:p-12 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {renderSkeleton()}
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {activeTab === 'overview' && stats && (
                  <OverviewTab stats={stats} setActiveTab={setActiveTab} fetchStats={fetchStats} />
                )}
                {activeTab === 'users' && (
                  <UsersTab
                    users={users}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    handleToggleRole={handleToggleRole}
                    handleDeleteUser={handleDeleteUser}
                    setEditingUser={setEditingUser}
                    setShowUserEditModal={setShowUserEditModal}
                    page={page}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                  />
                )}
                {activeTab === 'bookings' && (
                  <BookingsTab
                    bookings={bookings}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    setSelectedBooking={setSelectedBooking}
                    setShowDetailModal={setShowDetailModal}
                    handleUpdateBooking={handleUpdateBooking}
                    handleDeleteBooking={handleDeleteBooking}
                    page={page}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                  />
                )}
                {activeTab === 'cars' && (
                  <CarsTab
                    cars={cars}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    setShowAddModal={setShowAddModal}
                    handleToggleAvailability={handleToggleAvailability}
                    handleDeleteCar={handleDeleteCar}
                    setEditingCar={setEditingCar}
                    setShowEditModal={setShowEditModal}
                    page={page}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                  />
                )}
                {activeTab === 'settings' && <SettingsTab />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {}
      <AnimatePresence>
        {confirmModal && (
          <ConfirmModal
            message={confirmModal.message}
            onConfirm={confirmModal.onConfirm}
            onCancel={() => setConfirmModal(null)}
          />
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-[#111827]/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-white p-12 rounded-[48px] shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-hide text-left">
              <h3 className="text-3xl font-black uppercase tracking-tight mb-10 border-l-4 border-[#C4A47C] pl-6 text-[#111827]">
                Nouveau <span className="text-[#C4A47C]">Véhicule</span>
              </h3>

              <form onSubmit={handleCreateCar} className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest ml-1">Modèle</label>
                  <input required value={newCar.name} onChange={e => setNewCar({ ...newCar, name: e.target.value })} className="w-full px-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C]/40 outline-none transition-all font-medium" placeholder="ex: Range Rover Sport" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest ml-1">Marque</label>
                  <input required value={newCar.brand} onChange={e => setNewCar({ ...newCar, brand: e.target.value })} className="w-full px-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C]/40 outline-none transition-all font-medium" placeholder="ex: Land Rover" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest ml-1">Tarif DH/Jour</label>
                  <input required type="number" value={newCar.price} onChange={e => setNewCar({ ...newCar, price: e.target.value })} className="w-full px-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C]/40 outline-none transition-all font-medium" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest ml-1">Année</label>
                  <input required type="number" value={newCar.year} onChange={e => setNewCar({ ...newCar, year: e.target.value })} className="w-full px-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C]/40 outline-none transition-all font-medium" />
                </div>
                <div className="sm:col-span-2 space-y-3">
                  <label className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest ml-1">Photo du Véhicule</label>
                  <input
                    required
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files[0];
                      setNewCar({ ...newCar, imageFile: file });
                      if (file) setImagePreview(URL.createObjectURL(file));
                    }}
                    className="w-full px-6 py-3 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C]/40 outline-none transition-all font-medium file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#F8F5F0] file:text-[#A68B5B] hover:file:bg-[#F0EBE3] cursor-pointer"
                  />
                  {imagePreview && (
                    <div className="relative mt-3 rounded-2xl overflow-hidden h-40 border border-gray-100 shadow-sm">
                      <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <span className="absolute bottom-3 left-3 text-white text-[10px] font-black uppercase tracking-widest">Aperçu</span>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 sm:col-span-2">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest ml-1">Énergie</label>
                    <select value={newCar.fuel} onChange={e => setNewCar({ ...newCar, fuel: e.target.value })} className="w-full px-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C]/40 outline-none transition-all font-bold text-[#C4A47C] uppercase text-xs">
                      <option>Diesel</option><option>Essence</option><option>Hybride</option><option>Électrique</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest ml-1">Boîte</label>
                    <select value={newCar.gearbox} onChange={e => setNewCar({ ...newCar, gearbox: e.target.value })} className="w-full px-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C]/40 outline-none transition-all font-bold text-[#C4A47C] uppercase text-xs">
                      <option>Automatique</option><option>Manuelle</option>
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-2 pt-4 flex gap-6">
                  <button type="submit" className="flex-1 py-5 bg-[#111827] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-black/15 hover:scale-105 transition-all">Enregistrer</button>
                  <button type="button" onClick={() => { setShowAddModal(false); setImagePreview(null); }} className="px-10 bg-gray-50 text-[#6B7280] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all">Annuler</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {showDetailModal && selectedBooking && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDetailModal(false)} className="absolute inset-0 bg-[#111827]/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-xl bg-white p-12 rounded-[48px] shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-hide text-left">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-3xl font-black uppercase tracking-tight border-l-4 border-[#C4A47C] pl-6 text-[#111827]">
                  Détails <span className="text-[#C4A47C]">Réservation</span>
                </h3>
                <button onClick={() => setShowDetailModal(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <div className="w-24 h-16 rounded-xl overflow-hidden shadow-sm">
                    <img src={selectedBooking.car?.image ? encodeURI(selectedBooking.car.image) : ''} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black uppercase tracking-tight">{selectedBooking.car?.name}</h4>
                    <p className="text-[10px] font-black text-[#C4A47C] uppercase tracking-[0.2em]">{selectedBooking.car?.brand || 'Premium'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#6B7280]">Locataire</p>
                    <p className="font-extrabold text-[#111827]">{selectedBooking.fullName}</p>
                    <p className="text-xs font-bold text-[#6B7280]">{selectedBooking.phone}</p>
                  </div>
                  <div className="space-y-2 text-right">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#6B7280]">Période</p>
                    <p className="font-extrabold text-[#111827]">{new Date(selectedBooking.startDate).toLocaleDateString('fr-FR')}</p>
                    <p className="text-[10px] font-bold text-[#6B7280]">au {new Date(selectedBooking.endDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>

                <div className="p-8 bg-[#111827] rounded-[32px] text-white flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Montant Total</p>
                    <p className="text-3xl font-black italic">{selectedBooking.totalPrice} <span className="text-sm not-italic opacity-60">DH</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-2">Méthode</p>
                    <span className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {selectedBooking.paymentMethod === 'card' ? 'Carte' : 'Espèces'}
                    </span>
                  </div>
                </div>

                {}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest">Statut actuel</span>
                  {getStatusBadge(selectedBooking.status)}
                </div>

                <div className="flex gap-4">
                  {selectedBooking.status === 'pending' && (
                    <>
                      <button onClick={() => { handleUpdateBooking(selectedBooking._id, 'confirmed'); setShowDetailModal(false); }} className="flex-1 py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2">
                        <FaCheck /> Accepter
                      </button>
                      <button onClick={() => { handleUpdateBooking(selectedBooking._id, 'cancelled'); setShowDetailModal(false); }} className="flex-1 py-5 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-rose-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2">
                        <FaTimes /> Annuler
                      </button>
                    </>
                  )}
                  {selectedBooking.status === 'confirmed' && (
                    <button onClick={() => { handleUpdateBooking(selectedBooking._id, 'completed'); setShowDetailModal(false); }} className="flex-1 py-5 bg-[#111827] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-black/10 hover:scale-105 transition-all">
                      Marquer comme Terminé
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {showEditModal && editingCar && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditModal(false)} className="absolute inset-0 bg-[#111827]/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-2xl bg-white p-12 rounded-[48px] shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-hide text-left">
              <h3 className="text-3xl font-black uppercase tracking-tight mb-10 border-l-4 border-[#C4A47C] pl-6 text-[#111827]">
                Modifier <span className="text-[#C4A47C]">Véhicule</span>
              </h3>

              <form onSubmit={handleUpdateCar} className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest ml-1">Modèle</label>
                  <input required value={editingCar.name} onChange={e => setEditingCar({ ...editingCar, name: e.target.value })} className="w-full px-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C]/40 outline-none transition-all font-medium" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest ml-1">Marque</label>
                  <input required value={editingCar.brand} onChange={e => setEditingCar({ ...editingCar, brand: e.target.value })} className="w-full px-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C]/40 outline-none transition-all font-medium" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest ml-1">Tarif DH/Jour</label>
                  <input required type="number" value={editingCar.price} onChange={e => setEditingCar({ ...editingCar, price: e.target.value })} className="w-full px-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C]/40 outline-none transition-all font-medium" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest ml-1">Année</label>
                  <input type="number" value={editingCar.year} onChange={e => setEditingCar({ ...editingCar, year: e.target.value })} className="w-full px-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C]/40 outline-none transition-all font-medium" />
                </div>
                <div className="sm:col-span-2 space-y-3">
                  <label className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest ml-1">Photo (optionnel)</label>
                  {}
                  {(editImagePreview || editingCar.image) && (
                    <div className="relative rounded-2xl overflow-hidden h-40 border border-gray-100 shadow-sm mb-3">
                      <img src={editImagePreview || editingCar.image} alt="Aperçu" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <span className="absolute bottom-3 left-3 text-white text-[10px] font-black uppercase tracking-widest">
                        {editImagePreview ? 'Nouvelle image' : 'Image actuelle'}
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files[0];
                      setEditingCar({ ...editingCar, imageFile: file });
                      if (file) setEditImagePreview(URL.createObjectURL(file));
                    }}
                    className="w-full px-4 py-3 text-xs border border-gray-100 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#F8F5F0] file:text-[#A68B5B] hover:file:bg-[#F0EBE3] cursor-pointer"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 sm:col-span-2">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest ml-1">Énergie</label>
                    <select value={editingCar.fuel} onChange={e => setEditingCar({ ...editingCar, fuel: e.target.value })} className="w-full px-6 py-4 bg-[#F9FAFB] border rounded-2xl font-bold text-[#C4A47C] uppercase text-xs">
                      <option>Diesel</option><option>Essence</option><option>Hybride</option><option>Électrique</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest ml-1">Boîte</label>
                    <select value={editingCar.gearbox} onChange={e => setEditingCar({ ...editingCar, gearbox: e.target.value })} className="w-full px-6 py-4 bg-[#F9FAFB] border rounded-2xl font-bold text-[#C4A47C] uppercase text-xs">
                      <option>Automatique</option><option>Manuelle</option>
                    </select>
                  </div>
                </div>
                <div className="sm:col-span-2 pt-4 flex gap-6">
                  <button type="submit" className="flex-1 py-5 bg-[#111827] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-black/15 hover:scale-105 transition-all">Enregistrer les modifications</button>
                  <button type="button" onClick={() => { setShowEditModal(false); setEditImagePreview(null); }} className="px-10 bg-gray-50 text-[#6B7280] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all">Annuler</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {}
      <AnimatePresence>
        {showUserEditModal && editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUserEditModal(false)} className="absolute inset-0 bg-[#111827]/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg bg-white p-12 rounded-[48px] shadow-2xl text-left">
              <h3 className="text-3xl font-black uppercase tracking-tight mb-8 border-l-4 border-[#C4A47C] pl-6 text-[#111827]">
                Modifier <span className="text-[#C4A47C]">Utilisateur</span>
              </h3>
              <form onSubmit={handleUpdateUser} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest ml-1">Nom Complet</label>
                  <input required value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="w-full px-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-[#C4A47C]/40 font-medium mt-2" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest ml-1">Email</label>
                  <input required value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className="w-full px-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-[#C4A47C]/40 font-medium mt-2" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest ml-1">Téléphone</label>
                  <input value={editingUser.phone || ''} onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })} className="w-full px-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl outline-none focus:bg-white focus:border-[#C4A47C]/40 font-medium mt-2" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest ml-1">Rôle</label>
                  <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })} className="w-full px-6 py-4 bg-[#F9FAFB] border rounded-2xl font-bold text-[#C4A47C] uppercase text-xs mt-2">
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-4">
                  <button type="submit" className="flex-1 py-4 bg-[#111827] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-black/10 hover:scale-105 transition-all">Sauvegarder</button>
                  <button type="button" onClick={() => setShowUserEditModal(false)} className="px-8 bg-gray-50 text-[#6B7280] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all">Annuler</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
