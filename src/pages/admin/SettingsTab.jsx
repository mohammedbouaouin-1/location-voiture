import { useState } from 'react';
import { FaSave, FaBuilding, FaPhone, FaMapMarkerAlt, FaEnvelope, FaGlobe, FaMoon, FaSun, FaDownload, FaKey } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function SettingsTab() {
  const [agency, setAgency] = useState({
    name: 'LocaFès',
    phone: '+212 5XX-XXXXXX',
    email: 'contact@locafes.ma',
    address: 'Fès, Maroc',
    currency: 'DH',
    website: 'www.locafes.ma',
  });
  const [theme, setTheme] = useState('light');

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Paramètres enregistrés avec succès !');
  };

  return (
    <div className="space-y-10 text-left">
      {}
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-10 bg-[#111827] rounded-full" />
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter">
            Paramètres <span className="text-[#C4A47C]">Système</span>
          </h2>
          <p className="text-[#6B7280] text-xs font-bold uppercase tracking-widest mt-1">
            Configuration de l'agence LocaFès
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Agency Info */}
        <form onSubmit={handleSave} className="bg-white rounded-[40px] p-10 shadow-sm border border-white space-y-7">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#F8F5F0] text-[#C4A47C] flex items-center justify-center text-lg">
              <FaBuilding />
            </div>
            <h3 className="text-lg font-black uppercase tracking-widest">Infos Agence</h3>
          </div>

          {[
            { label: "Nom de l'agence", key: 'name', icon: <FaBuilding />, type: 'text' },
            { label: 'Téléphone', key: 'phone', icon: <FaPhone />, type: 'tel' },
            { label: 'Email', key: 'email', icon: <FaEnvelope />, type: 'email' },
            { label: 'Adresse', key: 'address', icon: <FaMapMarkerAlt />, type: 'text' },
            { label: 'Site web', key: 'website', icon: <FaGlobe />, type: 'text' },
          ].map(({ label, key, icon, type }) => (
            <div key={key} className="space-y-2">
              <label className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest ml-1">{label}</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C4A47C] text-sm">{icon}</span>
                <input
                  type={type}
                  value={agency[key]}
                  onChange={e => setAgency({ ...agency, [key]: e.target.value })}
                  className="w-full pl-11 pr-5 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C]/40 focus:ring-4 focus:ring-[#F8F5F0] outline-none transition-all font-medium text-sm"
                />
              </div>
            </div>
          ))}

          {/* Currency */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-[#6B7280] tracking-widest ml-1">Devise</label>
            <select
              value={agency.currency}
              onChange={e => setAgency({ ...agency, currency: e.target.value })}
              className="w-full px-5 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C]/40 outline-none transition-all font-bold text-[#C4A47C] uppercase text-xs"
            >
              <option value="DH">DH — Dirham Marocain</option>
              <option value="EUR">EUR — Euro</option>
              <option value="USD">USD — Dollar</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-[#111827] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-black/15 hover:scale-105 transition-all flex items-center justify-center gap-3"
          >
            <FaSave /> Enregistrer les modifications
          </button>
        </form>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Theme */}
          <div className="bg-white rounded-[40px] p-10 shadow-sm border border-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-lg">
                {theme === 'light' ? <FaSun /> : <FaMoon />}
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest">Apparence</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'light', label: 'Clair', icon: <FaSun />, bg: 'bg-white', border: 'border-[#C4A47C]' },
                { id: 'dark', label: 'Sombre', icon: <FaMoon />, bg: 'bg-[#111827]', border: 'border-gray-600' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => { setTheme(t.id); toast.success(`Thème ${t.label} activé`); }}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                    theme === t.id ? `${t.border} shadow-lg` : 'border-gray-100 hover:border-gray-200'
                  } ${t.bg}`}
                >
                  <span className={`text-2xl ${t.id === 'dark' ? 'text-white' : 'text-amber-500'}`}>{t.icon}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${t.id === 'dark' ? 'text-white' : 'text-[#111827]'}`}>{t.label}</span>
                  {theme === t.id && (
                    <span className="text-[8px] font-black uppercase tracking-widest text-[#C4A47C]">● Actif</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Export Data */}
          <div className="bg-white rounded-[40px] p-10 shadow-sm border border-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                <FaDownload />
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest">Export Données</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Exporter les Réservations', color: 'blue', key: 'bookings' },
                { label: 'Exporter les Clients', color: 'emerald', key: 'users' },
                { label: 'Exporter le Parc Auto', color: 'amber', key: 'cars' },
              ].map(({ label, color, key }) => (
                <button
                  key={key}
                  onClick={() => toast.success(`Export ${label} lancé !`)}
                  className={`w-full py-4 px-6 rounded-2xl border-2 border-${color}-100 bg-${color}-50 text-${color}-700 font-black uppercase tracking-widest text-[10px] hover:shadow-lg transition-all flex items-center justify-between`}
                >
                  <span>{label}</span>
                  <FaDownload />
                </button>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-[40px] p-10 shadow-sm border border-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center text-lg">
                <FaKey />
              </div>
              <h3 className="text-lg font-black uppercase tracking-widest">Sécurité</h3>
            </div>
            <p className="text-xs text-[#6B7280] font-medium mb-6">
              Gérez l'accès et la sécurité de votre compte administrateur.
            </p>
            <button
              onClick={() => toast.success('Un lien de réinitialisation a été envoyé.')}
              className="w-full py-4 bg-rose-50 text-rose-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-100 transition-all flex items-center justify-center gap-3"
            >
              <FaKey /> Modifier le mot de passe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
