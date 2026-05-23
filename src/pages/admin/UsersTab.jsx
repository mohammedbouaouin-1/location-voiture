import { FaSearch, FaTrash, FaEdit, FaDownload } from 'react-icons/fa';

const STATUS_ROLE_LABELS = { admin: 'Administrateur', user: 'Utilisateur' };

function exportCSV(users) {
  const headers = ['Nom', 'Email', 'Téléphone', 'Rôle', "Date d'inscription"];
  const rows = users.map(u => [
    u.name || '',
    u.email || '',
    u.phone || '',
    STATUS_ROLE_LABELS[u.role] || u.role || '',
    u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '',
  ]);
  const csvContent = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `clients_locafes_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function UsersTab({
  users,
  searchTerm,
  setSearchTerm,
  handleToggleRole,
  handleDeleteUser,
  setEditingUser,
  setShowUserEditModal,
  page,
  totalPages,
  handlePageChange
}) {
  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-[#111827] rounded-full" />
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter">
              Gestion <span className="text-[#C4A47C]">Clients</span>
            </h2>
            <p className="text-[#6B7280] text-xs font-bold uppercase tracking-widest mt-1">Administration système LocaFès</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {}
          <button
            onClick={() => exportCSV(users)}
            className="px-5 py-4 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-emerald-100 transition-all flex items-center gap-2 border border-emerald-100"
          >
            <FaDownload /> Export CSV
          </button>

          {}
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
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Membre</th>
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Contact</th>
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Téléphone</th>
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Accès</th>
                <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Inscrit le</th>
                <th className="px-10 py-6 text-center text-[10px] font-black uppercase tracking-widest text-[#6B7280]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-10 py-16 text-center text-[#6B7280] font-bold text-sm">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              ) : (
                filtered.map(user => (
                  <tr key={user._id} className="hover:bg-[#F9FAFB] transition-colors group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#111827] to-[#0a0a1a] text-white flex items-center justify-center font-black text-lg shadow-md shadow-black/10">
                          {user.name?.charAt(0) || user.email?.charAt(0)}
                        </div>
                        <span className="font-extrabold uppercase tracking-tight text-[#111827] whitespace-nowrap">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-sm font-medium text-[#6B7280]">{user.email}</td>
                    <td className="px-10 py-8 text-sm font-medium text-[#6B7280]">{user.phone || '—'}</td>
                    <td className="px-10 py-8">
                      <button
                        onClick={() => handleToggleRole(user)}
                        className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                          user.role === 'admin'
                            ? 'bg-[#111827] text-white shadow-lg shadow-black/10'
                            : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'
                        }`}
                      >
                        {STATUS_ROLE_LABELS[user.role] || user.role}
                      </button>
                    </td>
                    <td className="px-10 py-8 text-[11px] font-bold text-[#6B7280]">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-10 py-8 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => { setEditingUser(user); setShowUserEditModal(true); }}
                          className="p-3 bg-[#F8F5F0] text-[#C4A47C] rounded-xl hover:bg-[#C4A47C] hover:text-white transition-all shadow-sm"
                          title="Modifier"
                        >
                          <FaEdit size={14} />
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user._id || user.id)}
                            className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                            title="Supprimer"
                          >
                            <FaTrash size={14} />
                          </button>
                        )}
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
      </div>
    </div>
  );
}
