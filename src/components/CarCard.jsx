import { Link } from "react-router-dom";
import { FaGasPump, FaCog, FaCalendarAlt, FaArrowRight, FaCar } from "react-icons/fa";
import { resolveImageUrl } from "../utils/imageUrl";
import Tilt from "react-parallax-tilt";

export default function CarCard({ car }) {
  if (!car) return null;

  const isAvailable = car.isAvailableNow !== false;

  return (
    <Tilt
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      scale={1.02}
      transitionSpeed={400}
      glareEnable={true}
      glareMaxOpacity={0.08}
      glareColor="#C4A47C"
      glarePosition="all"
      glareBorderRadius="16px"
    >
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
        {}
        <div className="relative h-56 overflow-hidden bg-[#F9FAFB] flex items-center justify-center">
          {car.image ? (
            <img 
              src={resolveImageUrl(car.image)}
              alt={car.name} 
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          
          {}
          <div className="absolute top-4 left-4">
            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-lg ${
              isAvailable 
                ? 'bg-emerald-500 text-white border-emerald-400' 
                : 'bg-rose-500 text-white border-rose-400'
            }`}>
              {isAvailable ? 'Disponible' : 'Indisponible'}
            </span>
          </div>

          {}
          <div className="absolute top-4 right-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-[#111827] uppercase tracking-widest border border-white shadow-lg">
            {car.gearbox === 'Automatique' ? 'Auto' : 'Bvm'}
          </div>

          {}
          <div style={{display: !car.image ? 'flex' : 'none'}} className="flex-col items-center justify-center gap-2 text-gray-400 absolute inset-0 bg-[#F9FAFB]">
            <FaCar size={40} className="opacity-20" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#6B7280]">Image indisponible</span>
          </div>

          {}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
        </div>

        {}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-[#111827] group-hover:text-[#C4A47C] transition-colors line-clamp-1">
              {car.name}
            </h3>
            <p className="text-[#6B7280] text-[11px] font-bold uppercase tracking-widest mt-1">
              {car.brand || 'Luxury Edition'}
            </p>
            {car.rating > 0 && (
              <div className="flex items-center gap-1 text-xs text-[#C4A47C]">
                <span>★</span>
                <span className="font-bold">{car.rating.toFixed(1)}</span>
                <span className="text-gray-400">({car.numReviews})</span>
              </div>
            )}
          </div>

          {}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="flex flex-col items-center p-2.5 bg-[#F9FAFB] rounded-xl border border-gray-50 group-hover:bg-[#F8F5F0]/50 transition-colors">
              <FaCalendarAlt className="text-[#C4A47C] mb-1" size={14} />
              <span className="text-[10px] text-[#111827] font-bold">{car.year}</span>
            </div>

            <div className="flex flex-col items-center p-2.5 bg-[#F9FAFB] rounded-xl border border-gray-50 group-hover:bg-[#F8F5F0]/50 transition-colors">
              <FaGasPump className="text-[#C4A47C] mb-1" size={14} />
              <span className="text-[10px] text-[#111827] font-bold">{car.fuel}</span>
            </div>

            <div className="flex flex-col items-center p-2.5 bg-[#F9FAFB] rounded-xl border border-gray-50 group-hover:bg-[#F8F5F0]/50 transition-colors">
              <FaCog className="text-[#C4A47C] mb-1" size={14} />
              <span className="text-[10px] text-[#111827] font-bold">{car.gearbox === 'Automatique' ? 'Auto' : 'Manuelle'}</span>
            </div>
          </div>

          {}
          <div className="flex items-center justify-between pt-5 border-t border-gray-100">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Tarif / Jour</p>
              <p className="text-2xl font-extrabold text-[#C4A47C]">
                {car.price} <span className="text-xs font-bold text-gray-700 uppercase">DH</span>
              </p>
            </div>
            
            <Link 
              to={`/cars/${car._id || car.id}`} 
              className="flex items-center gap-2 px-5 py-3 bg-[#111827] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#C4A47C] hover:shadow-lg hover:shadow-black/10 transition-all active:scale-95 group/btn"
            >
              Détails
              <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={12} />
            </Link>
          </div>
        </div>
      </div>
    </Tilt>
  );
}
