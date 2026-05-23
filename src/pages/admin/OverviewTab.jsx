import { useState, useEffect } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, Tooltip,
  Sparklines, SparklinesCurve, SparklinesSpots,
} from 'recharts';
import {
  FaUsers, FaCar, FaCalendarAlt, FaMoneyBillWave,
  FaChevronRight, FaArrowUp, FaArrowDown, FaCircle,
} from 'react-icons/fa';

const STATUS_LABELS = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  cancelled: 'Annulé',
  completed: 'Terminé',
};

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-600 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  cancelled: 'bg-rose-50 text-rose-600 border-rose-200',
  completed: 'bg-[#F8F5F0] text-[#C4A47C] border-[#DDD0C0]',
};

const PERIODS = [
  { key: '7j', label: '7 Jours' },
  { key: '30j', label: '30 Jours' },
  { key: '3m', label: '3 Mois' },
  { key: 'annee', label: 'Année' },
];


const SPARKLINES = {
  users:    [3, 5, 4, 7, 6, 9, 11],
  cars:     [18, 18, 19, 20, 20, 20, 20],
  bookings: [4, 7, 5, 9, 11, 8, 13],
  revenue:  [1200, 1800, 1500, 2200, 2600, 2100, 3100],
};



export default function OverviewTab({ stats, setActiveTab, fetchStats }) {
  const [period, setPeriod] = useState('7j');

  useEffect(() => {
    if (fetchStats) fetchStats(period);
  }, [period]); 

  if (!stats) return null;

  const getStatusBadge = (status) => (
    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${STATUS_STYLES[status] || STATUS_STYLES.pending}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );

    const kpiCards = [
    {
      label: 'Utilisateurs',
      val: stats.totalUsers,
      icon: <FaUsers size={20} />,
      color: 'text-[#C4A47C]',
      bg: 'bg-[#F8F5F0]',
      border: 'border-[#E8DDD0]',
      glow: 'shadow-black/8',
      sparkColor: '#C4A47C',
      sparkData: SPARKLINES.users,
      trend: stats.growth?.users || 0,
    },
    {
      label: 'Véhicules',
      val: stats.totalCars,
      icon: <FaCar size={20} />,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      glow: 'shadow-emerald-500/10',
      sparkColor: '#059669',
      sparkData: SPARKLINES.cars,
      trend: stats.growth?.cars || 0,
    },
    {
      label: 'Réservations',
      val: stats.totalBookings,
      icon: <FaCalendarAlt size={20} />,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      glow: 'shadow-amber-500/10',
      sparkColor: '#D97706',
      sparkData: stats?.trends?.map(t => t.count).length > 0 ? stats.trends.map(t => t.count) : SPARKLINES.bookings,
      trend: stats.growth?.bookings || 0,
    },
    {
      label: 'Revenus Totaux',
      val: `${(stats.totalRevenue || 0).toLocaleString('fr-FR')} DH`,
      icon: <FaMoneyBillWave size={20} />,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-100',
      glow: 'shadow-rose-500/10',
      sparkColor: '#E11D48',
      sparkData: stats?.trends?.map(t => t.revenue).length > 0 ? stats.trends.map(t => t.revenue) : SPARKLINES.revenue,
      trend: stats.growth?.revenue || 0,
    },
  ];

  return (
    <div className="space-y-10">

      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-8 bg-[#111827] rounded-full" />
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-0.5">
              Tableau de <span className="text-[#C4A47C]">Bord</span>
            </h2>
            <p className="text-[#6B7280] text-xs font-bold uppercase tracking-widest">
              Performance et Activité Locale
            </p>
          </div>
        </div>


      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, i) => (
          <div
            key={i}
            className={`relative bg-white p-7 rounded-[28px] shadow-lg ${card.glow} border ${card.border} hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group`}
          >
            {}
            <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${card.bg} opacity-60 group-hover:scale-125 transition-transform duration-500`} />

            <div className="relative z-10">
              {}
              <div className={`inline-flex items-center justify-center w-11 h-11 rounded-2xl ${card.bg} ${card.color} mb-5 shadow-sm`}>
                {card.icon}
              </div>

              {}
              <p className="text-[10px] font-black uppercase tracking-widest text-[#6B7280] mb-1">{card.label}</p>

              {}
              <h3 className="text-2xl font-black tracking-tight text-[#111827] mb-3">{card.val}</h3>

              {}
              <div className={`flex items-center gap-1.5 text-[10px] font-black mb-4 ${card.trend >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                {card.trend >= 0 ? <FaArrowUp className="text-[8px]" /> : <FaArrowDown className="text-[8px]" />}
                <span>{Math.abs(card.trend)}% ce mois</span>
              </div>

              {}
              <div className="h-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={card.sparkData.map((v, idx) => ({ v, idx }))}>
                    <defs>
                      <linearGradient id={`spark-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={card.sparkColor} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={card.sparkColor} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke={card.sparkColor}
                      strokeWidth={2}
                      fill={`url(#spark-${i})`}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ))}
      </div>

      {}
      <div className="bg-white rounded-[36px] p-8 shadow-sm border border-gray-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-lg font-black uppercase tracking-widest text-[#111827]">Évolution des Réservations</h3>
            <p className="text-xs text-[#6B7280] font-bold mt-0.5">Activité sur la période sélectionnée</p>
          </div>
          {}
          <div className="flex items-center gap-1.5 bg-[#F9FAFB] p-1.5 rounded-2xl border border-gray-100">
            {PERIODS.map(p => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  period === p.key
                    ? 'bg-[#111827] text-white shadow-lg shadow-black/10'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.trends || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C4A47C" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#C4A47C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                stroke="#9CA3AF"
                tick={{ fontSize: 10, fontWeight: 'bold' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => [`${value} DH`, 'Revenus']}
                contentStyle={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 10px 40px -5px rgba(0,0,0,0.15)',
                  fontWeight: '800',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#C4A47C"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorTotal)"
                dot={{ r: 4, fill: '#C4A47C', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#C4A47C', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {}
      <div className="grid lg:grid-cols-2 gap-8">

        {}
        <div className="bg-white rounded-[36px] p-8 shadow-sm border border-gray-50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black uppercase tracking-widest text-[#111827]">Dernières Réservations</h3>
              <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest mt-0.5">5 plus récentes</p>
            </div>
            <button
              onClick={() => setActiveTab('bookings')}
              className="flex items-center gap-2 px-4 py-2 bg-[#F9FAFB] rounded-xl text-[10px] font-black uppercase tracking-widest text-[#6B7280] hover:bg-[#F8F5F0] hover:text-[#C4A47C] transition-all border border-gray-100"
            >
              Voir tout <FaChevronRight size={9} />
            </button>
          </div>

          {}
          <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-3 mb-3">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#9CA3AF]">Client / Voiture</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#9CA3AF] text-right">Prix</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#9CA3AF] text-right">Statut</span>
          </div>

          {}
          <div className="space-y-2">
            {stats.recentBookings?.map((booking) => {
              const statusBorderColor = {
                pending:   'border-l-amber-400',
                confirmed: 'border-l-emerald-400',
                cancelled: 'border-l-rose-400',
                completed: 'border-l-[#C4A47C]',
              }[booking.status] || 'border-l-gray-200';

              return (
                <div
                  key={booking._id}
                  className={`grid grid-cols-[1fr_auto_auto] gap-3 items-center p-3.5 rounded-2xl bg-[#F9FAFB] border border-gray-50 border-l-4 ${statusBorderColor} hover:bg-white hover:shadow-md transition-all`}
                >
                  {}
                  <div className="flex items-center gap-3 min-w-0">
                    {}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-gray-100 shrink-0 flex items-center justify-center text-slate-400">
                      <FaCar size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-[#111827] truncate">{booking.fullName}</p>
                      <p className="text-[9px] font-bold text-[#6B7280] truncate">{booking.car?.name || 'Véhicule'}</p>
                      {booking.paymentMethod && (
                        <span className={`inline-block text-[8px] font-black px-1.5 py-0.5 rounded-full mt-0.5 ${
                          booking.paymentMethod === 'card'
                            ? 'bg-[#F8F5F0] text-[#C4A47C]'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {booking.paymentMethod === 'card' ? '💳 Carte' : '💵 Cash'}
                        </span>
                      )}
                    </div>
                  </div>

                  {}
                  <p className="text-sm font-extrabold text-[#C4A47C] whitespace-nowrap text-right">
                    {booking.totalPrice} <span className="text-[9px] text-[#6B7280] font-bold">DH</span>
                  </p>

                  {}
                  <div className="flex justify-end">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {}
        <div className="bg-white rounded-[36px] p-8 shadow-sm border border-gray-50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black uppercase tracking-widest text-[#111827]">Nouveaux Inscrits</h3>
              <p className="text-[10px] text-[#6B7280] font-bold uppercase tracking-widest mt-0.5">Comptes récents</p>
            </div>
            <button
              onClick={() => setActiveTab('users')}
              className="flex items-center gap-2 px-4 py-2 bg-[#F9FAFB] rounded-xl text-[10px] font-black uppercase tracking-widest text-[#6B7280] hover:bg-[#F8F5F0] hover:text-[#C4A47C] transition-all border border-gray-100"
            >
              Voir tout <FaChevronRight size={9} />
            </button>
          </div>

          {}
          <div className="grid grid-cols-[1fr_auto] gap-2 px-3 mb-3">
            <span className="text-[9px] font-black uppercase tracking-widest text-[#9CA3AF]">Utilisateur</span>
            <span className="text-[9px] font-black uppercase tracking-widest text-[#9CA3AF] text-right">Inscrit le</span>
          </div>

          <div className="space-y-2">
            {stats.recentUsers?.map((user) => {
              const isAdmin = user.role === 'admin';
              const avatarColors = [
                'from-[#111827] to-[#0a0a1a]',
                'from-purple-500 to-violet-700',
                'from-emerald-500 to-teal-700',
                'from-rose-500 to-pink-700',
                'from-amber-500 to-orange-600',
              ];
              const colorIdx = (user.name?.charCodeAt(0) || 65) % avatarColors.length;

              return (
                <div
                  key={user._id}
                  className="grid grid-cols-[1fr_auto] gap-2 items-center p-3.5 rounded-2xl bg-[#F9FAFB] border border-gray-50 hover:bg-white hover:shadow-md hover:border-gray-100 transition-all"
                >
                  {}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColors[colorIdx]} text-white flex items-center justify-center font-black text-sm shrink-0 shadow-md`}>
                      {(user.name?.charAt(0) || user.email?.charAt(0) || '?').toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-xs font-black text-[#111827] truncate">{user.name || '—'}</p>
                        {isAdmin && (
                          <span className="px-1.5 py-0.5 bg-[#F8F5F0] text-[#C4A47C] text-[8px] font-black uppercase tracking-widest rounded-full border border-[#E8DDD0] shrink-0">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] font-bold text-[#6B7280] truncate">{user.email}</p>
                    </div>
                  </div>

                  {}
                  <span className="text-[10px] font-bold text-[#6B7280] whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
