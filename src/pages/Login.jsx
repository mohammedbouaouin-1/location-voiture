import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser, FaPhone, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isRegister) {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Les mots de passe ne correspondent pas");
          setLoading(false);
          return;
        }
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        });
        toast.success("Compte créé avec succès !");
      } else {
        const user = await login(formData.email, formData.password);
        toast.success("Ravi de vous revoir !");
        
        // Redirection basée sur le rôle
        if (user.role === 'admin') {
          navigate('/dashboard', { replace: true });
          return;
        }
      }
      navigate(from === '/' ? '/profile' : from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      <Helmet>
        <title>{isRegister ? 'Inscription | LocaFès' : 'Connexion | LocaFès'}</title>
        <meta name="description" content="Connectez-vous à votre compte LocaFès pour gérer vos réservations." />
      </Helmet>

      {/* Côté Gauche - Image & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-[#0A0A0A]">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          src="https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2069&auto=format&fit=crop" 
          alt="Premium Car" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 via-transparent to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-16 h-full w-full">
          <div>
            <Link to="/" className="text-3xl font-black text-white tracking-tighter hover:opacity-80 transition-opacity">
              LOCA<span className="text-[#C4A47C]">FÈS</span>
            </Link>
          </div>
          
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em]"
            >
              Accès Membre
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight"
            >
              Votre portail vers l'élégance <br/><span className="text-[#C4A47C]">Automobile.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 text-lg font-medium leading-relaxed max-w-md"
            >
              Gérez vos réservations premium, consultez votre historique et accédez à notre flotte exclusive en quelques clics.
            </motion.p>
          </div>

          <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">
            © 2024 LocaFès. Tous droits réservés.
          </div>
        </div>
      </div>

      {/* Côté Droit - Formulaire */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-8 md:p-16 bg-[#F9FAFB] shadow-[-20px_0_40px_rgba(0,0,0,0.05)] z-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <div className="lg:hidden mb-12 text-center">
            <Link to="/" className="text-3xl font-black text-[#111827] tracking-tighter">
              LOCA<span className="text-[#C4A47C]">FÈS</span>
            </Link>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black text-[#111827] mb-3">
              {isRegister ? 'Créer un compte' : 'Bon retour !'}
            </h1>
            <p className="text-[#6B7280] font-medium">
              {isRegister ? 'Commencez votre aventure LocaFès dès aujourd\'hui.' : 'Veuillez entrer vos identifiants pour continuer.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {isRegister && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-3 ml-1">Nom Complet</label>
                      <div className="relative group">
                        <FaUser className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C4A47C] transition-colors" />
                        <input
                          name="name"
                          type="text"
                          placeholder="Mohammed"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-14 pr-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C]/30 focus:ring-4 focus:ring-[#C4A47C]/10 outline-none transition-all font-bold text-[#111827] placeholder:text-gray-300"
                          required={isRegister}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-3 ml-1">Téléphone</label>
                      <div className="relative group">
                        <FaPhone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C4A47C] transition-colors" />
                        <input
                          name="phone"
                          type="tel"
                          placeholder="06 XX XX XX XX"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-14 pr-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C]/30 focus:ring-4 focus:ring-[#C4A47C]/10 outline-none transition-all font-bold text-[#111827] placeholder:text-gray-300"
                          required={isRegister}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-3 ml-1">Email</label>
              <div className="relative group">
                <FaEnvelope className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C4A47C] transition-colors" />
                <input
                  name="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C]/30 focus:ring-4 focus:ring-[#C4A47C]/10 outline-none transition-all font-bold text-[#111827] placeholder:text-gray-300"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3 ml-1">
                <label className="block text-[10px] font-black text-[#6B7280] uppercase tracking-widest">Mot de passe</label>
                {!isRegister && (
                  <button type="button" className="text-[10px] font-black text-[#C4A47C] uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Oublié ?</button>
                )}
              </div>
              <div className="relative group">
                <FaLock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C4A47C] transition-colors" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-14 pr-16 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C]/30 focus:ring-4 focus:ring-[#C4A47C]/10 outline-none transition-all font-bold text-[#111827] placeholder:text-gray-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C4A47C]"
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {isRegister && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <label className="block text-[10px] font-black text-[#6B7280] uppercase tracking-widest mb-3 ml-1">Confirmer mot de passe</label>
                <div className="relative group">
                  <FaLock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#C4A47C] transition-colors" />
                  <input
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-14 pr-16 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C]/30 focus:ring-4 focus:ring-[#C4A47C]/10 outline-none transition-all font-bold text-[#111827] placeholder:text-gray-300"
                    required
                  />
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 mt-4 bg-[#111827] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#C4A47C] hover:scale-[1.02] shadow-xl shadow-gray-200 hover:shadow-black/15 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-[#111827]"
            >
              {loading ? "Traitement..." : isRegister ? "S'inscrire" : "Se connecter"}
              {!loading && <FaArrowRight />}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-[11px] uppercase tracking-widest font-bold text-[#6B7280]">
              {isRegister ? 'Vous avez déjà un compte ?' : 'Nouveau membre ?'}
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="ml-2 text-[#C4A47C] font-black hover:underline decoration-2 underline-offset-4"
              >
                {isRegister ? 'Connexion' : 'Créer un compte'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
