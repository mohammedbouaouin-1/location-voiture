import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import CarCard from "../components/CarCard";
import SkeletonCard from "../components/SkeletonCard";
import { getCars } from "../services/carService";
import { FaClock, FaShieldAlt, FaStar, FaUsers, FaCar, FaMoneyBillWave, FaHeadset, FaArrowRight, FaCheckCircle, FaPhoneAlt } from "react-icons/fa";


const ROTATING_WORDS = [
  { text: "l'Émotion", color: "text-[#C4A47C]" },
  { text: "le Luxe", color: "text-amber-400" },
  { text: "le Confort", color: "text-emerald-400" },
  { text: "l'Aventure", color: "text-amber-400" },
];


const HERO_CARS = [
  { src: "/images/Hyundai Tucson 2023.webp",  name: "Hyundai Tucson",    year: 2023, price: 600, tag: "SUV Premium" },
  { src: "/images/Toyota Yaris 2022.png",       name: "Toyota Yaris",     year: 2022, price: 420, tag: "Citadine Sport" },
  { src: "/images/Skoda Octavia 2022.webp",   name: "Skoda Octavia",    year: 2022, price: 500, tag: "Berline" },
  { src: "/images/Dacia Duster 2021.webp",    name: "Dacia Duster",     year: 2021, price: 450, tag: "4x4 Aventure" },
  { src: "/images/peugeot-208 2021.png",      name: "Peugeot 208",      year: 2021, price: 400, tag: "Citadine" },
];

const CAROUSEL_INTERVAL = 4000; 

function RotatingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % ROTATING_WORDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block relative overflow-hidden" style={{ height: '1.15em', verticalAlign: 'bottom' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={ROTATING_WORDS[index].text}
          initial={{ opacity: 0, y: 40, rotateX: -80 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -40, rotateX: 80 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block whitespace-nowrap ${ROTATING_WORDS[index].color}`}
          style={{ perspective: '600px' }}
        >
          {ROTATING_WORDS[index].text}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}


function useCountUp(target, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnView) { setStarted(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started, startOnView]);

  useEffect(() => {
    if (!started) return;
    const isFloat = String(target).includes('.');
    const numTarget = parseFloat(target);
    if (isNaN(numTarget)) { setCount(target); return; }
    
    let start = 0;
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (numTarget - start) * easeOut;
      setCount(isFloat ? current.toFixed(1) : Math.round(current));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, target, duration]);

  return { count, ref };
}

export default function Home() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await getCars();
        setCars(data.cars || []);
      } catch (err) {
        console.error("Erreur chargement voitures", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);



  const featuredCars = cars.slice(0, 6);
  
  
  const topReviews = useMemo(() => {
    let allReviews = [];
    cars.forEach(car => {
      if (car.reviews && car.reviews.length > 0) {
        car.reviews.forEach(review => {
          allReviews.push({ ...review, carName: car.name });
        });
      }
    });
    
    return allReviews
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3);
  }, [cars]);

  
  const features = [
    { 
      icon: <FaShieldAlt size={32} />, 
      title: "Sécurité maximale", 
      desc: "Toutes nos voitures sont assurées tous risques et vérifiées régulièrement par nos experts."
    },
    { 
      icon: <FaClock size={32} />, 
      title: "Disponibilité 24/7", 
      desc: "Service disponible jour et nuit. Réservez et récupérez votre véhicule à tout moment."
    },
    { 
      icon: <FaHeadset size={32} />, 
      title: "Support premium", 
      desc: "Équipe professionnelle à votre écoute. Assistance rapide et solutions personnalisées."
    },
    { 
      icon: <FaMoneyBillWave size={32} />, 
      title: "Prix compétitifs", 
      desc: "Tarifs transparents et justes. Aucun frais caché, paiement flexible et sécurisé."
    }
  ];

  const stats = [
    { icon: <FaCar size={32} />, value: "20", suffix: "+", label: "Véhicules" },
    { icon: <FaUsers size={32} />, value: "500", suffix: "+", label: "Clients" },
    { icon: <FaStar size={32} />, value: "4.9", suffix: "/5", label: "Note" },
  ];

  return (
    <div className="bg-white">
      <Helmet>
        <title>LocaFès | Location de Voitures Premium à Fès</title>
        <meta name="description" content="Louez les meilleurs véhicules premium à Fès avec LocaFès. Meilleur prix, service exceptionnel et voitures de luxe." />
        <meta property="og:title" content="LocaFès - Location de Voitures Premium" />
        <meta property="og:description" content="Découvrez notre flotte exclusive à Fès." />
      </Helmet>
      {}
      <section className="relative min-h-[100vh] bg-midnight pt-20 overflow-hidden flex items-center">

        {}
        <div className="absolute inset-0 opacity-[0.12]" style={{
          backgroundImage: 'radial-gradient(circle, #4B5563 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />

        {}
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-[#C4A47C]/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#8B7355]/12 blur-[140px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#C4A47C]/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-white/[0.02] rounded-full pointer-events-none" />

        {}
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear', delay: 2 }}
          className="absolute top-[35%] left-0 w-[30%] h-px bg-gradient-to-r from-transparent via-[#C4A47C]/30 to-transparent"
        />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 py-20 lg:py-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2 text-center lg:text-left"
            >
              {}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 glass-morphism rounded-full text-[#D4B88C] text-xs font-bold uppercase tracking-[0.2em] mb-8"
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                Disponible maintenant à Fès
              </motion.div>

              {}
              <h1 className="text-5xl md:text-7xl lg:text-7xl font-black mb-6 leading-[1.05] tracking-tighter text-white">
                Louez <RotatingText />,<br />
                Conduisez le{" "}
                <span className="relative inline-block">
                  <span className="italic font-serif">Prestige</span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
                    className="absolute bottom-0 left-0 w-full h-1 bg-[#C4A47C] rounded-full origin-left"
                  />
                </span>.
              </h1>

              <p className="text-lg text-slate-400 mb-10 max-w-lg leading-relaxed">
                Location de voitures premium à Fès — service sur-mesure, flotte irréprochable, disponibilité immédiate.
              </p>

              {}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
                <Link
                  to="/cars"
                  className="shimmer-btn px-8 py-4 bg-[#111827] text-white rounded-2xl font-black text-base hover:bg-[#C4A47C] hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(196,164,124,0.25)] flex items-center gap-3 group"
                >
                  Explorer la Flotte
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" size={14} />
                </Link>
                <button
                  onClick={() => document.getElementById('why-choose-us').scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 glass-morphism text-white rounded-2xl font-black text-base hover:bg-white/10 transition-all border border-white/10"
                >
                  Notre Vision
                </button>
              </div>

              {}
              <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <FaCheckCircle className="text-emerald-400" size={14} />
                  <span className="font-medium">20+ véhicules</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <FaStar className="text-amber-400" size={14} />
                  <span className="font-medium">Note 4.9/5</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <FaPhoneAlt className="text-[#D4B88C]" size={14} />
                  <span className="font-medium">Support 24/7</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <FaShieldAlt className="text-[#C4A47C]" size={14} />
                  <span className="font-medium">Assurance incluse</span>
                </div>
              </div>
            </motion.div>

            {}
            <HeroCarousel />
          </div>


        </div>
      </section>



      {}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, idx) => (
              <AnimatedStat key={idx} stat={stat} delay={idx * 200} />
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[#F8F5F0] text-[#C4A47C] rounded-full font-bold text-xs uppercase tracking-widest mb-4 border border-[#E8DDD0]">
              Notre Sélection
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] mb-6 tracking-tight">Nos véhicules premium</h2>
            <div className="h-1.5 w-24 bg-[#C4A47C] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading ? (
               Array(3).fill(0).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            ) : (
              featuredCars.map((car, idx) => (
                <motion.div 
                  key={car._id || car.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <CarCard car={car} />
                </motion.div>
              ))
            )}
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              to="/cars" 
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#F9FAFB] text-[#111827] border border-gray-200 rounded-xl font-bold text-lg hover:bg-white hover:border-[#C4A47C] hover:text-[#C4A47C] hover:shadow-lg transition-all"
            >
              Voir tous les véhicules
              <FaCar />
            </Link>
          </div>
        </div>
      </section>

      {}
      <section className="py-24 bg-[#F9FAFB] scroll-mt-20" id="why-choose-us">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 bg-[#F8F5F0] text-[#C4A47C] rounded-full font-bold text-xs uppercase tracking-widest mb-4 border border-[#E8DDD0]">
              Pourquoi nous choisir
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] mb-6 tracking-tight">Pourquoi choisir <span className="text-[#C4A47C]">LocaFès</span> ?</h2>
            <p className="text-xl text-[#6B7280] max-w-2xl mx-auto font-medium text-center">
              Une expérience de location simplifiée, sécurisée et adaptée à tous vos projets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#111827] text-[#C4A47C] rounded-2xl mb-8 group-hover:scale-110 transition-transform shadow-lg shadow-black/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-4 group-hover:text-[#C4A47C] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-[#6B7280] leading-relaxed text-sm font-medium">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[#F8F5F0] text-[#C4A47C] rounded-full font-bold text-xs uppercase tracking-widest mb-4 border border-[#E8DDD0]">
              ✨ Témoignages
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#111827] mb-6 tracking-tight">Ce que disent nos <span className="text-[#C4A47C]">clients</span></h2>
            <div className="h-1.5 w-24 bg-[#C4A47C] mx-auto rounded-full"></div>
          </div>

          {topReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topReviews.map((review, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="p-8 bg-[#F9FAFB] rounded-[32px] border border-gray-50 text-left relative group hover:shadow-xl transition-all duration-500 flex flex-col"
                >
                  <div className="text-[#C4A47C] flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < review.rating ? "text-[#C4A47C]" : "text-gray-200"} />
                    ))}
                  </div>
                  <p className="text-[#6B7280] font-medium leading-relaxed mb-8 italic flex-1">"{review.comment}"</p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 shrink-0 bg-gradient-to-br from-[#C4A47C] to-[#A68B5B] rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-[#C4A47C]/20 uppercase">
                      {review.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#111827] line-clamp-1">{review.name}</h4>
                      <p className="text-[10px] text-[#C4A47C] font-bold uppercase tracking-widest line-clamp-1">Sur {review.carName}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-[#F9FAFB] rounded-[32px] border border-gray-50">
              <FaStar className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-[#6B7280] font-medium text-lg">Soyez le premier à partager votre expérience LocaFès !</p>
            </div>
          )}
        </div>
      </section>

      {}
      <section className="relative py-32 lg:py-48 bg-midnight overflow-hidden">
        {}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-[#C4A47C]/10 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1.1, 0.9, 1.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] bg-[#8B7355]/8 blur-[120px] rounded-full"
        />
        {}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-[#C4A47C]/10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-[#C4A47C]/5 rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-morphism p-12 lg:p-24 rounded-[48px] border border-white/10 text-center relative overflow-hidden"
          >
            {}
            <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-[#C4A47C]/8 blur-[100px] rounded-full"></div>

            {}
            <motion.div 
              animate={{ y: [-10, 10, -10] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.08] pointer-events-none select-none"
            >
              <img 
                src="/images/Hyundai Tucson 2023.webp" 
                alt="Voiture de fond" 
                className="w-[120%] md:w-[80%] max-w-4xl object-contain mix-blend-screen drop-shadow-2xl"
              />
            </motion.div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <span className="inline-block px-4 py-1.5 bg-[#C4A47C]/10 text-[#D4B88C] rounded-full font-bold text-xs uppercase tracking-[0.3em] mb-8 border border-[#C4A47C]/20">
                Prêt pour l'aventure ?
              </span>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-10 tracking-tighter leading-tight">
                Votre voyage <span className="text-[#C4A47C]">Premium</span> <br /> commence ici.
              </h2>
              <p className="text-xl text-slate-400 mb-12 font-medium">
                Rejoignez le cercle des clients privilégiés de LocaFès et profitez d'une expérience de conduite sans compromis.
              </p>

              <div className="flex flex-wrap gap-6 justify-center">
                <Link
                  to="/cars"
                  className="shimmer-btn px-12 py-5 bg-[#C4A47C] text-[#111827] rounded-2xl font-black text-lg hover:bg-[#D4B88C] hover:scale-105 transition-all shadow-xl shadow-[#C4A47C]/20 active:scale-95"
                >
                  Réserver Immédiatement
                </Link>
                <Link
                  to="/login"
                  className="px-12 py-5 glass-morphism text-white rounded-2xl font-black text-lg hover:bg-white/10 transition-all border border-white/20 active:scale-95"
                >
                  Créer un compte
                </Link>
              </div>
            </div>
            
            {}
            <div className="absolute bottom-10 left-10 text-left hidden md:block">
              <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest mb-1">Support 24/7</p>
              <p className="text-white/80 font-bold">+212 6 XX XX XX XX</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


function AnimatedStat({ stat, delay }) {
  const { count, ref } = useCountUp(stat.value, 2000 + delay);
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay / 1000 }}
      className="text-center p-8 rounded-2xl bg-[#F9FAFB] border border-gray-50 hover:shadow-xl transition-all group"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 bg-[#111827] text-[#C4A47C] rounded-2xl mb-5 shadow-lg shadow-black/10 group-hover:scale-110 transition-transform">
        {stat.icon}
      </div>
      <h3 className="text-4xl font-extrabold text-[#111827] mb-2 tabular-nums">
        {count}{stat.suffix}
      </h3>
      <p className="text-[#6B7280] font-bold uppercase tracking-widest text-xs">{stat.label}</p>
    </motion.div>
  );
}


function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); 
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);

  const goTo = (idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
    setProgress(0);
  };

  const next = useCallback(() => {
    setDirection(1);
    setCurrent(current => (current + 1) % HERO_CARS.length);
    setProgress(0);
  }, []);

  
  useEffect(() => {
    
    progressRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) return 100;
        return p + (40 / CAROUSEL_INTERVAL) * 100;
      });
    }, 40);

    
    intervalRef.current = setInterval(next, CAROUSEL_INTERVAL);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(progressRef.current);
    };
    
  }, [current, next]);

  const car = HERO_CARS[current];

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 120 : -120, opacity: 0, scale: 0.92 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -120 : 120, opacity: 0, scale: 0.92 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, x: 50 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
      className="w-full lg:w-1/2 relative select-none"
    >
      {}
      <div className="relative z-10 animate-float overflow-visible">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <img
              src={car.src}
              alt={car.name}
              className="w-full drop-shadow-[0_35px_60px_rgba(0,0,0,0.7)]"
            />
          </motion.div>
        </AnimatePresence>

        {}
        <div className="absolute bottom-[-8%] left-1/2 -translate-x-1/2 w-[70%] h-10 bg-[#0a0a0a]/40 blur-[50px] rounded-full scale-y-50" />
      </div>

      {}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-2 right-0 glass-morphism px-5 py-4 rounded-2xl border border-white/10 z-20 hidden md:block min-w-[160px]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current + '-badge'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-[9px] text-[#D4B88C] font-bold uppercase tracking-widest mb-0.5">{car.tag}</p>
            <p className="text-white font-black text-base leading-tight">{car.name}</p>
            <p className="text-slate-500 text-[10px] font-bold mt-0.5">{car.year}</p>
            <div className="flex items-center gap-1 mt-1.5">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-amber-400" size={9} />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
        className="absolute bottom-16 -left-4 glass-morphism px-5 py-4 rounded-2xl border border-white/10 z-20 hidden md:flex items-center gap-3"
      >
        <div className="w-10 h-10 bg-[#111827]/20 rounded-xl flex items-center justify-center">
          <FaMoneyBillWave className="text-[#D4B88C]" size={16} />
        </div>
        <div>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">À partir de</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={car.price}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
              className="text-white font-black text-lg leading-none"
            >
              {car.price} <span className="text-xs font-bold text-slate-400">DH/J</span>
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.div>

      {}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
        className="absolute top-1/3 -left-6 glass-morphism px-4 py-3 rounded-2xl border border-emerald-500/20 z-20 hidden md:flex items-center gap-2"
      >
        <FaShieldAlt className="text-emerald-400" size={14} />
        <p className="text-white font-bold text-xs">Tous risques</p>
      </motion.div>

      {}
      <div className="absolute -bottom-8 left-0 right-0 flex flex-col items-center gap-2 z-20">
        {}
        <div className="w-2/3 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#C4A47C] rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ type: 'tween', ease: 'linear' }}
          />
        </div>
        {}
        <div className="flex items-center gap-2">
          {HERO_CARS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 h-2 bg-[#C4A47C]'
                  : 'w-2 h-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
