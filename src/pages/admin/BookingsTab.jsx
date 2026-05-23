import { FaSearch, FaCheck, FaTimes, FaTrash, FaFilePdf, FaDownload } from 'react-icons/fa';
import { generateInvoicePDF } from '../../utils/generatePDF';

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

function exportCSV(bookings) {
  const headers = ['Conducteur', 'Téléphone', 'Véhicule', 'Début', 'Fin', 'Montant (DH)', 'Statut', 'Paiement'];
  const rows = bookings.map(b => [
    b.fullName || '',
    b.phone || '',
    b.car?.name || '',
    b.startDate ? new Date(b.startDate).toLocaleDateString('fr-FR') : '',
    b.endDate ? new Date(b.endDate).toLocaleDateString('fr-FR') : '',
    b.totalPrice || '',
    STATUS_LABELS[b.status] || b.status || '',
    b.paymentMethod === 'card' ? 'Carte' : 'Espèces',
  ]);
  const csvContent = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reservations_locafes_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function BookingsTab({
  bookings,
  searchTerm,
  setSearchTerm,
  setSelectedBooking,
  setShowDetailModal,
  handleUpdateBooking,
  handleDeleteBooking,
  page,
  totalPages,
  handlePageChange
}) {
  const getStatusBadge = (status) => (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );

  const filtered = bookings.filter(b =>
    b.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.car?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-[#111827] rounded-full" />
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter">
              Gestion <span className="text-[#C4A47C]">Réservations</span>
            </h2>
            <p className="text-[#6B7280] text-xs font-bold uppercase tracking-widest mt-1">
              Administration système LocaFès
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Export CSV */}
          <button
            onClick={() => exportCSV(bookings)}
            className="px-5 py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-emerald-100 transition-all flex items-center gap-2 border border-emerald-100"
          >
            <FaDownload /> Export CSV
          </button>

          {/* Search */}
          <div className="relative group min-w-[260px]">
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

      <div className="bg-white rounded-[48px] overflow-hidden shadow-xl shadow-gray-200/50 border border-white">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-[#F9FAFB] border-b border-gray-50">
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Conducteur</th>
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Détails Véhicule</th>
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Période / Montant</th>
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Statut</th>
                <th className="px-10 py-6 text-center text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-16 text-center text-[#6B7280] font-bold text-sm">
                    Aucune réservation trouvée.
                  </td>
                </tr>
              ) : (
                filtered.map(booking => (
                  <tr
                    key={booking._id}
                    className="hover:bg-[#F9FAFB] transition-colors group cursor-pointer"
                  >
                    <td className="px-10 py-8" onClick={() => { setSelectedBooking(booking); setShowDetailModal(true); }}>
                      <p className="font-extrabold uppercase tracking-tight text-[#111827]">{booking.fullName}</p>
                      <p className="text-[10px] font-bold text-[#6B7280]">{booking.phone}</p>
                    </td>
                    <td className="px-10 py-8" onClick={() => { setSelectedBooking(booking); setShowDetailModal(true); }}>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-xl bg-gray-50 overflow-hidden border border-gray-100">
                          <img src={booking.car?.image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-sm font-extrabold text-[#111827]">{booking.car?.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8" onClick={() => { setSelectedBooking(booking); setShowDetailModal(true); }}>
                      <p className="text-xs font-bold text-[#111827] mb-1">
                        {new Date(booking.startDate).toLocaleDateString('fr-FR')} ➔ {new Date(booking.endDate).toLocaleDateString('fr-FR')}
                      </p>
                      <p className="text-sm font-black text-[#C4A47C] italic">{booking.totalPrice} DH</p>
                    </td>
                    <td className="px-10 py-8" onClick={() => { setSelectedBooking(booking); setShowDetailModal(true); }}>
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-10 py-8 text-center">
                      <div className="flex items-center justify-center gap-3">
                        {(booking.status === 'confirmed' || booking.status === 'completed') && (
                          <button
                            onClick={(e) => { e.stopPropagation(); generateInvoicePDF(booking); }}
                            className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-[#111827] hover:text-white transition-all shadow-sm"
                            title="Télécharger Facture PDF"
                          >
                            <FaFilePdf size={14} />
                          </button>
                        )}
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleUpdateBooking(booking._id || booking.id, 'confirmed'); }}
                              className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                              title="Confirmer"
                            >
                              <FaCheck size={14} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleUpdateBooking(booking._id || booking.id, 'cancelled'); }}
                              className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                              title="Annuler"
                            >
                              <FaTimes size={14} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteBooking(booking._id || booking.id); }}
                          className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-rose-500 transition-all"
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
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-[#C4A47C] hover:text-[#C4A47C] disabled:opacity-50 disabled:hover:border-gray-100 disabled:hover:text-[#6B7280] transition-all"
              >
                Précédent
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 bg-[#111827] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/10 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
