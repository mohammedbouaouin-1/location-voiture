import { motion } from "framer-motion";
import { FaCheckCircle, FaClock, FaShieldAlt, FaThumbsUp, FaMoneyBillWave, FaHeadset, FaCar, FaStar, FaArrowRight, FaSearch, FaCalendarCheck, FaKey } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function WhyChooseUs() {
  const features = [
    { 
      icon: <FaShieldAlt size={32} />, 
      title: "Sécurité maximale", 
      desc: "Toutes nos voitures sont assurées tous risques et vérifiées régulièrement par nos experts avant chaque départ.",
      highlight: "Assurance tous risques"
    },
    { 
      icon: <FaClock size={32} />, 
      title: "Disponibilité 24/7", 
      desc: "Service disponible jour et nuit. Réservez et récupérez votre véhicule à tout moment via notre système automatisé.",
      highlight: "Service non-stop"
    },
    { 
      icon: <FaHeadset size={32} />, 
      title: "Support premium", 
      desc: "Une équipe professionnelle à votre écoute 24h/24. Assistance rapide et solutions personnalisées en cas d'urgence.",
      highlight: "Réponse < 30min"
    },
    { 
      icon: <FaMoneyBillWave size={32} />, 
      title: "Prix compétitifs", 
      desc: "Tarifs transparents et justes sans aucun frais caché. Paiement flexible et sécurisé adapté à votre budget.",
      highlight: "Zéro frais caché"
    },
    { 
      icon: <FaCar size={32} />, 
      title: "Voitures modernes", 
      desc: "Large choix de véhicules récents (moins de 3 ans) et bien entretenus. Citadines, Berlines et SUV haut de gamme.",
      highlight: "Flotte < 3 ans"
    },
    { 
      icon: <FaStar size={32} />, 
      title: "Expérience premium", 
      desc: "Qualité de service irréprochable, propreté garantie et confort absolu pour que chaque trajet soit un plaisir.",
      highlight: "Satisfaction garantie"
    }
  ];

  const stats = [
    { number: "500+", label: "Clients Satisfaits", icon: <FaThumbsUp size={22} /> },
    { number: "4.9/5", label: "Note Moyenne", icon: <FaStar size={22} /> },
    { number: "24/7", label: "Assistance", icon: <FaHeadset size={22} /> }
  ];

  const steps = [
    {
      step: "01",
      icon: <FaSearch size={28} />,
      title: "Explorez & Choisissez",
      desc: "Parcourez notre flotte premium et trouvez le véhicule parfait grâce à nos filtres intelligents."
    },
    {
      step: "02",
      icon: <FaCalendarCheck size={28} />,
      title: "Réservez en ligne",
      desc: "Sélectionnez vos dates, remplissez le formulaire et confirmez en quelques clics. Paiement flexible."
    },
    {
      step: "03",
      icon: <FaKey size={28} />,
      title: "Prenez la route",
      desc: "Récupérez votre véhicule prêt à partir. Profitez de la route en toute sérénité avec LocaFès."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-white">
      <Helmet>
        <title>Pourquoi LocaFès | Location Premium à Fès</title>
        <meta name="description" content="Découvrez pourquoi LocaFès est le choix #1 pour la location de voitures à Fès. Sécurité, transparence, flotte moderne et support 24/7." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-6">

        {}
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-block px-5 py-2 bg-[#F8F5F0] text-[#C4A47C] rounded-full font-extrabold text-[10px] uppercase tracking-[0.3em] mb-4 border border-[#E8DDD0] shadow-sm"
          >
            🌟 L'Excellence LocaFès
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-[#111827] mb-8 tracking-tight"
          >
            Pourquoi nous <span className="text-[#C4A47C]">faire confiance</span> ?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#6B7280] max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Nous redéfinissons les standards de la location automobile au Maroc 
            avec un engagement total sur la sécurité, le confort et la transparence.
          </motion.p>
        </div>

        {/* ========== STATS BAND ========== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-28">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative bg-[#F9FAFB] rounded-[32px] p-8 text-center border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden group"
            >
              {/* Subtle decorative circle */}
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-[#C4A47C]/5 group-hover:scale-150 transition-transform duration-500" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#111827] text-[#C4A47C] rounded-2xl mb-5 shadow-lg shadow-black/10 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-black text-[#111827] mb-2 tracking-tight">{stat.number}</h3>
                <p className="text-[10px] text-[#6B7280] font-extrabold uppercase tracking-widest">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ========== FEATURES GRID ========== */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[#F8F5F0] text-[#C4A47C] rounded-full font-bold text-[10px] uppercase tracking-[0.2em] mb-4 border border-[#E8DDD0]">
              Nos Engagements
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#111827] tracking-tight">
              Ce qui nous rend <span className="text-[#C4A47C]">différents</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group relative bg-white p-10 rounded-[36px] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:-translate-y-2 overflow-hidden"
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#C4A47C]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F8F5F0] text-[#C4A47C] rounded-2xl mb-8 group-hover:bg-[#111827] group-hover:text-[#C4A47C] group-hover:scale-110 transition-all duration-500 border border-[#E8DDD0] group-hover:border-transparent shadow-sm">
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-extrabold text-[#111827] mb-3 group-hover:text-[#C4A47C] transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[#6B7280] leading-relaxed font-medium text-sm mb-6">
                    {feature.desc}
                  </p>

                  {/* Highlight badge */}
                  <div className="flex items-center gap-2">
                    <FaCheckCircle className="text-emerald-500 shrink-0" size={14} />
                    <span className="text-[10px] font-black text-[#111827] uppercase tracking-widest">
                      {feature.highlight}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ========== HOW IT WORKS ========== */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[#F8F5F0] text-[#C4A47C] rounded-full font-bold text-[10px] uppercase tracking-[0.2em] mb-4 border border-[#E8DDD0]">
              Simple & Rapide
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#111827] tracking-tight">
              Comment ça <span className="text-[#C4A47C]">marche</span> ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-[72px] left-[16.5%] right-[16.5%] h-px bg-gradient-to-r from-[#E8DDD0] via-[#C4A47C] to-[#E8DDD0]" />

            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative text-center group"
              >
                {/* Step number circle */}
                <div className="relative inline-flex items-center justify-center w-[88px] h-[88px] bg-white rounded-full border-2 border-[#E8DDD0] group-hover:border-[#C4A47C] shadow-lg shadow-gray-100/50 mb-8 transition-all duration-500 group-hover:shadow-xl z-10">
                  <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center text-[#C4A47C] group-hover:bg-[#C4A47C] group-hover:text-white transition-all duration-500">
                    {step.icon}
                  </div>
                  {/* Step badge */}
                  <span className="absolute -top-1 -right-1 w-7 h-7 bg-[#C4A47C] text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-md">
                    {step.step}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-[#111827] mb-3 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-[#6B7280] font-medium leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ========== CTA SECTION ========== */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-12 md:p-20 bg-[#1C1917] rounded-[48px] text-center relative overflow-hidden"
        >
          {/* Decorative warm glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C4A47C]/8 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#8B7355]/6 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px] pointer-events-none" />
          
          {/* Voiture Fantôme Flottante au Centre */}
          <motion.div 
            animate={{ y: [-10, 10, -10] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.08] pointer-events-none select-none"
          >
            <img 
              src="/images/Hyundai Tucson 2023.webp" 
              alt="Voiture de fond" 
              className="w-[120%] md:w-[80%] max-w-4xl object-contain mix-blend-screen drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            />
          </motion.div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-[#C4A47C]/10 text-[#D4B88C] rounded-full font-bold text-[10px] uppercase tracking-[0.2em] mb-8 border border-[#C4A47C]/20">
              Prêt à rouler ?
            </span>
            <h3 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight">
              L'excellence à portée <br className="hidden md:block" /> de main.
            </h3>
            <p className="text-white/50 text-lg md:text-xl font-medium mb-12 max-w-xl mx-auto">
              Ne nous croyez pas sur parole. Vivez l'expérience LocaFès Premium 
              dès aujourd'hui à des tarifs imbattables.
            </p>
            <div className="flex flex-wrap gap-5 justify-center">
              <Link 
                to="/cars" 
                className="px-10 py-5 bg-[#C4A47C] text-[#111827] rounded-2xl font-black text-lg hover:bg-[#D4B88C] hover:shadow-2xl hover:shadow-[#C4A47C]/20 hover:scale-105 transition-all flex items-center gap-3"
              >
                <FaCar />
                Voir nos voitures
              </Link>
              <Link 
                to="/login" 
                className="px-10 py-5 bg-white/5 backdrop-blur-md text-white border border-white/10 rounded-2xl font-bold text-lg hover:bg-white hover:text-[#111827] transition-all flex items-center gap-3"
              >
                Connexion
                <FaArrowRight size={14} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
