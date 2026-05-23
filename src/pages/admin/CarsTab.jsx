import { useState } from 'react';
import { FaSearch, FaTrash, FaPlus, FaEdit, FaTable, FaTh, FaDownload, FaGasPump, FaCog, FaCalendarAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function exportCSV(cars) {
  const headers = ['Nom', 'Marque', 'Année', 'Carburant', 'Boîte', 'Prix (DH/J)', 'Disponible'];
  const rows = cars.map(c => [
    c.name || '',
    c.brand || '',
    c.year || '',
    c.fuel || '',
    c.gearbox || '',
    c.price || '',
    c.available ? 'Oui' : 'Non',
  ]);
  const csvContent = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `parc_auto_locafes_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function CarsTab({
  cars,
  searchTerm,
  setSearchTerm,
  setShowAddModal,
  handleToggleAvailability,
  handleDeleteCar,
  setEditingCar,
  setShowEditModal,
  page,
  totalPages,
  handlePageChange
}) {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  const filtered = cars.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-[#111827] rounded-full" />
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter">
              Gestion <span className="text-[#C4A47C]">Voitures</span>
            </h2>
            <p className="text-[#6B7280] text-xs font-bold uppercase tracking-widest mt-1">Administration système LocaFès</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Add button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-4 bg-[#111827] text-white rounded-2xl font-black text-[10px] tracking-widest uppercase shadow-lg shadow-black/10 hover:scale-105 transition-all flex items-center gap-3"
          >
            <FaPlus /> Nouveau Véhicule
          </button>

          {/* Export CSV */}
          <button
            onClick={() => exportCSV(cars)}
            className="px-5 py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-emerald-100 transition-all flex items-center gap-2 border border-emerald-100"
          >
            <FaDownload /> CSV
          </button>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-[#F9FAFB] p-1.5 rounded-2xl border border-gray-100">
            <button
              onClick={() => setViewMode('table')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'table' ? 'bg-[#111827] text-white shadow-lg shadow-black/10' : 'text-[#6B7280] hover:text-[#111827]'}`}
              title="Vue tableau"
            >
              <FaTable size={14} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#111827] text-white shadow-lg shadow-black/10' : 'text-[#6B7280] hover:text-[#111827]'}`}
              title="Vue grille"
            >
              <FaTh size={14} />
            </button>
          </div>

          {/* Search */}
          <div className="relative group min-w-[240px]">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm focus:border-[#C4A47C]/40 focus:ring-4 focus:ring-[#F8F5F0] transition-all outline-none font-medium shadow-sm"
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ===== TABLE VIEW ===== */}
        {viewMode === 'table' && (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-[48px] overflow-hidden shadow-xl shadow-gray-200/50 border border-white"
          >
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-gray-50">
                    <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Véhicule</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Config</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Tarif Jour</th>
                    <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Statut</th>
                    <th className="px-10 py-6 text-center text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-10 py-16 text-center text-[#6B7280] font-bold text-sm">
                        Aucun véhicule trouvé.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(car => (
                      <tr key={car._id || car.id} className="hover:bg-[#F9FAFB] transition-colors group">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-6">
                            <div className="w-24 h-16 rounded-xl bg-gray-100 overflow-hidden border border-gray-50">
                              <img src={car.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-extrabold uppercase tracking-tight text-[#111827]">{car.name}</p>
                              <p className="text-[10px] font-black text-[#C4A47C] uppercase tracking-widest">{car.brand || 'Premium'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <p className="text-[9px] font-black text-[#6B7280] uppercase tracking-widest mb-1">Config.</p>
                          <p className="text-xs font-bold text-[#111827]">{car.year} | {car.gearbox}</p>
                        </td>
                        <td className="px-10 py-8 font-black text-xl text-[#C4A47C] italic">
                          {car.price} <span className="text-[10px] not-italic text-[#6B7280]">DH/J</span>
                        </td>
                        <td className="px-10 py-8">
                          <button
                            onClick={() => handleToggleAvailability(car)}
                            className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.11em] border transition-all ${
                              !car.available 
                                ? 'bg-rose-50 text-rose-500 border-rose-100 hover:bg-rose-100' 
                                : !car.isAvailableNow 
                                  ? 'bg-amber-50 text-amber-600 border-amber-100'
                                  : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                            }`}
                          >
                            {!car.available 
                              ? '● Hors Service' 
                              : !car.isAvailableNow 
                                ? '◑ Réservé' 
                                : '● Disponible'}
                          </button>
                        </td>
                        <td className="px-10 py-8 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => { setEditingCar(car); setShowEditModal(true); }}
                              className="p-3 bg-[#F8F5F0] text-[#C4A47C] rounded-xl hover:bg-[#C4A47C] hover:text-white transition-all shadow-sm"
                              title="Modifier"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteCar(car._id || car.id)}
                              className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                              title="Supprimer"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-10 py-6 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#6B7280]">
                  Page <span className="text-[#C4A47C]">{page}</span> sur <span className="text-[#111827]">{totalPages}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-[#C4A47C] hover:text-[#C4A47C] disabled:opacity-50 transition-all">
                    Précédent
                  </button>
                  <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="px-4 py-2 bg-[#111827] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/10 hover:scale-105 disabled:opacity-50 transition-all">
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ===== GRID VIEW ===== */}
        {viewMode === 'grid' && (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {filtered.length === 0 ? (
              <div className="bg-white rounded-[40px] p-16 text-center text-[#6B7280] font-bold shadow-sm">
                Aucun véhicule trouvé.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(car => (
                  <motion.div
                    key={car._id || car.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-white hover:shadow-xl hover:-translate-y-1 transition-all group"
                  >
                    {/* Car Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Status overlay */}
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={() => handleToggleAvailability(car)}
                          className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border transition-all ${
                            car.available
                              ? 'bg-emerald-500/90 text-white border-emerald-400'
                              : 'bg-rose-500/90 text-white border-rose-400'
                          }`}
                        >
                          {car.available ? '● Disponible' : '○ Indisponible'}
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-4">
                        <p className="text-[10px] font-black text-[#C4A47C] uppercase tracking-[0.2em] mb-1">{car.brand}</p>
                        <h4 className="text-lg font-black uppercase tracking-tight text-[#111827]">{car.name}</h4>
                      </div>

                      {/* Specs */}
                      <div className="flex items-center gap-4 mb-5 text-[#6B7280]">
                        <div className="flex items-center gap-1.5">
                          <FaCalendarAlt size={10} />
                          <span className="text-[10px] font-black">{car.year}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FaGasPump size={10} />
                          <span className="text-[10px] font-black">{car.fuel}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <FaCog size={10} />
                          <span className="text-[10px] font-black">{car.gearbox}</span>
                        </div>
                      </div>

                      {/* Price + Actions */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-black text-[#C4A47C] italic">{car.price}</span>
                          <span className="text-[10px] font-black text-[#6B7280] ml-1">DH/j</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setEditingCar(car); setShowEditModal(true); }}
                            className="p-3 bg-[#F8F5F0] text-[#C4A47C] rounded-xl hover:bg-[#C4A47C] hover:text-white transition-all"
                            title="Modifier"
                          >
                            <FaEdit size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteCar(car._id)}
                            className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                            title="Supprimer"
                          >
                            <FaTrash size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 bg-white px-8 py-5 rounded-3xl shadow-sm border border-white">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#6B7280]">
                  Page <span className="text-[#C4A47C]">{page}</span> sur <span className="text-[#111827]">{totalPages}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-[#C4A47C] hover:text-[#C4A47C] disabled:opacity-50 transition-all">
                    Précédent
                  </button>
                  <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="px-4 py-2 bg-[#111827] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/10 hover:scale-105 disabled:opacity-50 transition-all">
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
