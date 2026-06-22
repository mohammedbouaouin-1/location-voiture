import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FaCheckCircle, FaHome, FaList, FaCar, FaDownload } from 'react-icons/fa';
import { generateInvoicePDF } from '../utils/generatePDF';
import { getCarById } from '../services/carService';


function useConfetti() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#C4A47C', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
    const pieces = [];

    for (let i = 0; i < 150; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }

    let frame;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let allDone = true;

      pieces.forEach(p => {
        if (p.opacity <= 0) return;
        allDone = false;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; 
        p.rotation += p.rotSpeed;

        if (p.y > canvas.height - 50) {
          p.opacity -= 0.02;
        }
      });

      if (!allDone) {
        frame = requestAnimationFrame(animate);
      }
    };

    
    const timeout = setTimeout(() => {
      animate();
    }, 400);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return canvasRef;
}

export default function BookingSuccess() {
  const location = useLocation();
  const [car, setCar] = useState(null);
  const confettiRef = useConfetti();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    const carId = searchParams.get('carId');
    if (carId) {
      getCarById(carId)
        .then(setCar)
        .catch((err) => console.error("Erreur fetching car info", err));
    }
  }, [location.search]);

  const handleDownload = () => {
    const searchParams = new URLSearchParams(location.search);
    const fakeBookingForPdf = {
      _id: 'CONFIRMED',
      startDate: searchParams.get('startDate') || new Date(),
      endDate: searchParams.get('endDate') || new Date(),
      totalPrice: searchParams.get('totalPrice') || 0,
      fullName: searchParams.get('fullName'),
      phone: searchParams.get('phone'),
      car: car ? { name: car.name, price: car.price } : { name: 'Véhicule', price: 0 }
    };
    generateInvoicePDF(fakeBookingForPdf, false);
  };

  return (
    <>
    <Helmet><title>Réservation Confirmée | LocaFès</title></Helmet>
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-[#F9FAFB] relative overflow-hidden">
      {}
      <canvas
        ref={confettiRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ width: '100vw', height: '100vh' }}
      />

      <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-[#F0EBE3]/50 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[150px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-2xl z-10">
        <div className="bg-white rounded-[48px] p-10 md:p-16 text-center border border-white shadow-2xl shadow-gray-200/50">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-100 relative"
          >
            <motion.div animate={{ scale: [1, 1.5], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-emerald-400 rounded-full" />
            <FaCheckCircle className="text-emerald-500 relative z-10" size={48} />
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-4xl md:text-5xl font-black tracking-tight text-[#111827] mb-6">
            Réservation <span className="text-emerald-500">Confirmée</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-lg text-[#6B7280] max-w-md mx-auto mb-12 font-medium leading-relaxed">
            Votre demande a été traitée avec succès. Notre équipe LocaFès prépare votre véhicule pour une expérience de conduite premium.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="grid sm:grid-cols-2 gap-4">
            <Link to="/profile" className="px-8 py-5 bg-[#111827] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-xl shadow-black/10 hover:scale-105 transition-all">
              <FaList size={16} /> Mes Réservations
            </Link>
            <Link to="/" className="px-8 py-5 bg-gray-50 text-[#111827] border border-gray-100 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-gray-100 transition-all">
              <FaHome size={16} /> Retour à l'Accueil
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-12 pt-8 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-center gap-8">
            <button onClick={handleDownload} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#6B7280] hover:text-[#C4A47C] transition-colors">
              <FaDownload className="text-[#C4A47C]" size={16} /> Télécharger Reçu
            </button>
            <Link to="/cars" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#6B7280] hover:text-[#C4A47C] transition-colors">
              <FaCar className="text-[#C4A47C]" size={16} /> Voir d'autres Véhicules
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
    </>
  );
}
