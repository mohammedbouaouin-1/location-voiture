import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { differenceInDays } from 'date-fns';
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '../contexts/AuthContext';
import { getCarById } from "../services/carService";
import { createBooking, createPaymentIntent } from "../services/bookingService";
import { FaCalendarAlt, FaCreditCard, FaMoneyBillWave, FaUser, FaCheckCircle, FaCar, FaPhone, FaArrowLeft, FaInfoCircle, FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '../components/StripePaymentForm';

const stripePromise = process.env.REACT_APP_STRIPE_PUBLIC_KEY 
  ? loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)
  : null;

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    phone: '',
    startDate: '',
    endDate: ''
  });

  const [payment, setPayment] = useState('cash');
  const [total, setTotal] = useState(0);
  const [days, setDays] = useState(0);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const data = await getCarById(id);
        setCar(data);
      } catch (err) {
        toast.error("Erreur chargement véhicule");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  useEffect(() => {
    if (formData.startDate && formData.endDate && car) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end >= start) {
        const diff = differenceInDays(end, start) || 1;
        setDays(diff);
        setTotal(diff * car.price);
      } else {
        setDays(0);
        setTotal(0);
      }
    }
  }, [formData.startDate, formData.endDate, car]);

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.fullName || !formData.phone) {
        toast.error("Veuillez remplir vos informations");
        return;
      }
    }
    if (currentStep === 2) {
      if (days <= 0) {
        toast.error("Veuillez sélectionner des dates valides");
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };



  
  const handleOpenConfirm = async () => {
    if (days <= 0) {
      toast.error("La date de fin doit être après la date de début");
      return;
    }

    if (payment === 'card') {
      
      try {
        setSubmitting(true);
        const response = await createPaymentIntent({
          carId: car._id || car.id,
          startDate: formData.startDate,
          endDate: formData.endDate,
          fullName: formData.fullName,
          phone: formData.phone
        });
        setClientSecret(response.clientSecret);
        setShowConfirmModal(true);
      } catch (err) {
        toast.error(err.response?.data?.message || "Erreur Stripe. Vérifiez votre configuration.");
      } finally {
        setSubmitting(false);
      }
    } else {
      
      setShowConfirmModal(true);
    }
  };

  
  const finalConfirm = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);
    try {
      await createBooking({
        car: car._id || car.id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalPrice: total,
        totalDays: days,
        fullName: formData.fullName,
        paymentMethod: 'cash',
        phone: formData.phone
      });
      toast.success("Réservation effectuée avec succès !");
      const params = new URLSearchParams({
        carId: car._id || car.id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalPrice: total,
        fullName: formData.fullName,
        phone: formData.phone,
      });
      navigate(`/booking-success?${params.toString()}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la réservation");
    } finally {
      setSubmitting(false);
    }
  };

  
  
  
  const onStripeSuccess = async () => {
    setShowConfirmModal(false);
    
    
    try {
      await createBooking({
        car: car._id || car.id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalPrice: total,
        totalDays: days,
        fullName: formData.fullName,
        paymentMethod: 'card', 
        phone: formData.phone
      });
      toast.success("Paiement validé ! Réservation enregistrée avec succès.");
      
      
      const params = new URLSearchParams({
        carId: car._id || car.id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalPrice: total,
        fullName: formData.fullName,
        phone: formData.phone,
      });
      navigate(`/booking-success?${params.toString()}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement de la réservation");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-16 h-16 border-4 border-[#F8F5F0] border-t-[#C4A47C] rounded-full animate-spin"></div>
    </div>
  );


  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#F9FAFB]">
      <div className="max-w-6xl mx-auto px-6">

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#6B7280] hover:text-[#C4A47C] font-bold mb-10 transition-colors">
          <FaArrowLeft /> Retour
        </button>

        <div className="grid lg:grid-cols-3 gap-10">

          {}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 p-10 border border-white"
            >
              {}
              <div className="mb-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-[#F8F5F0] rounded-2xl flex items-center justify-center">
                    <FaCar className="text-[#C4A47C]" size={28} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-extrabold text-[#111827]">Réservation Directe</h1>
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.2em]">{car.name}</p>
                  </div>
                </div>

                {}
                <div className="relative pt-4">
                  <div className="flex justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${currentStep >= 1 ? 'text-[#C4A47C]' : 'text-gray-400'}`}>1. Conducteur</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${currentStep >= 2 ? 'text-[#C4A47C]' : 'text-gray-400'}`}>2. Période</span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${currentStep >= 3 ? 'text-[#C4A47C]' : 'text-gray-400'}`}>3. Paiement</span>
                  </div>
                  <div className="h-2 w-full bg-[#F8F5F0] rounded-full overflow-hidden flex">
                    <motion.div
                      className="h-full bg-[#111827]"
                      initial={{ width: "33%" }}
                      animate={{ width: `${(currentStep / 3) * 100}%` }}
                      transition={{ type: "spring", stiffness: 100 }}
                    ></motion.div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">

                {}
                {currentStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h3 className="text-sm font-extrabold text-[#111827] uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-4 bg-[#111827] rounded-full"></div>
                      Informations Conducteur
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="relative">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input
                          type="text"
                          placeholder="Nom complet"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C] outline-none transition-all font-medium text-sm"
                          required
                        />
                      </div>
                      <div className="relative">
                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input
                          type="tel"
                          placeholder="Numéro de téléphone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-12 pr-4 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C] outline-none transition-all font-medium text-sm"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {}
                {currentStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h3 className="text-sm font-extrabold text-[#111827] uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-4 bg-[#111827] rounded-full"></div>
                      Période de Location
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-2 ml-4">Prise en charge</label>
                        <div className="relative">
                          <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                          <input
                            type="date"
                            value={formData.startDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="w-full pl-12 pr-4 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C] outline-none transition-all font-medium text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-2 ml-4">Restitution</label>
                        <div className="relative">
                          <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                          <input
                            type="date"
                            value={formData.endDate}
                            min={formData.startDate || new Date().toISOString().split('T')[0]}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            className="w-full pl-12 pr-4 py-4 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:bg-white focus:border-[#C4A47C] outline-none transition-all font-medium text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {}
                {currentStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <h3 className="text-sm font-extrabold text-[#111827] uppercase tracking-widest flex items-center gap-2">
                      <div className="w-1 h-4 bg-[#111827] rounded-full"></div>
                      Méthode de Paiement
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {}
                      <button
                        type="button"
                        onClick={() => setPayment('cash')}
                        className={`relative flex flex-col items-start gap-3 p-6 border-2 rounded-[20px] cursor-pointer transition-all text-left ${
                          payment === 'cash'
                            ? 'border-emerald-500 bg-emerald-50/80 shadow-lg shadow-emerald-500/10'
                            : 'border-gray-100 bg-[#F9FAFB] hover:border-gray-200'
                        }`}
                      >
                        {payment === 'cash' && (
                          <div className="absolute top-3 right-3 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentWidth" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </div>
                        )}
                        <div className={`p-3 rounded-2xl ${payment === 'cash' ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                          <FaMoneyBillWave className={`text-xl ${payment === 'cash' ? 'text-emerald-600' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <p className={`font-black text-sm mb-1 ${payment === 'cash' ? 'text-emerald-700' : 'text-[#111827]'}`}>Paiement sur place</p>
                          <p className={`text-[11px] font-medium ${payment === 'cash' ? 'text-emerald-600' : 'text-[#6B7280]'}`}>Espèces à la remise des clés</p>
                        </div>
                      </button>

                      {}
                      <button
                        type="button"
                        onClick={() => setPayment('card')}
                        className={`relative flex flex-col items-start gap-3 p-6 border-2 rounded-[20px] cursor-pointer transition-all text-left ${
                          payment === 'card'
                            ? 'border-[#C4A47C] bg-[#F8F5F0]/80 shadow-lg shadow-black/8'
                            : 'border-gray-100 bg-[#F9FAFB] hover:border-gray-200'
                        }`}
                      >
                        {payment === 'card' && (
                          <div className="absolute top-3 right-3 w-5 h-5 bg-[#111827] rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </div>
                        )}
                        <div className={`p-3 rounded-2xl ${payment === 'card' ? 'bg-[#F0EBE3]' : 'bg-gray-100'}`}>
                          <FaCreditCard className={`text-xl ${payment === 'card' ? 'text-[#C4A47C]' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <p className={`font-black text-sm mb-1 ${payment === 'card' ? 'text-[#C4A47C]' : 'text-[#111827]'}`}>Carte Bancaire</p>
                          <p className={`text-[11px] font-medium ${payment === 'card' ? 'text-[#C4A47C]' : 'text-[#6B7280]'}`}>Paiement sécurisé via Stripe</p>
                        </div>
                      </button>
                    </div>

                    {}
                    <motion.div
                      key={payment}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-2xl flex items-start gap-3 ${payment === 'card' ? 'bg-[#F8F5F0] border border-[#E8DDD0]' : 'bg-emerald-50 border border-emerald-100'}`}
                    >
                      <FaInfoCircle className={`mt-0.5 shrink-0 ${payment === 'card' ? 'text-[#C4A47C]' : 'text-emerald-600'}`} />
                      <p className={`text-xs font-bold leading-relaxed ${payment === 'card' ? 'text-[#C4A47C]' : 'text-emerald-700'}`}>
                        {payment === 'card'
                          ? 'Votre paiement est sécurisé par Stripe. Vous serez redirigé vers le formulaire de carte après confirmation.'
                          : 'Vous réglez en espèces directement auprès de notre équipe lors de la remise des clés. Aucun prépaiement requis.'}
                      </p>
                    </motion.div>
                  </motion.div>
                )}

                {}
                <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-50">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-8 py-5 bg-gray-50 text-[#111827] rounded-[20px] font-extrabold hover:bg-gray-100 transition-all active:scale-[0.98]"
                    >
                      Retour
                    </button>
                  )}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 py-5 bg-[#111827] text-white rounded-[20px] font-extrabold hover:bg-black hover:shadow-2xl hover:shadow-black/30 transition-all active:scale-[0.98]"
                    >
                      Continuer
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleOpenConfirm}
                      disabled={submitting}
                      className="flex-1 py-5 bg-[#111827] text-white rounded-[20px] font-extrabold text-lg hover:bg-[#0D1321] hover:shadow-2xl hover:shadow-black/15 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-black/8"
                    >
                      {submitting ? "Traitement..." : "Finaliser la Réservation"}
                      {!submitting && <FaArrowRight />}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 p-8 sticky top-32 border border-white"
            >
              <h3 className="text-sm font-extrabold text-[#111827] uppercase tracking-[0.2em] mb-8 border-b border-gray-50 pb-4">Récapitulatif</h3>

              <div className="relative h-40 rounded-2xl overflow-hidden mb-6 bg-[#F9FAFB]">
                <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#111827] to-transparent h-20 opacity-40"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-0.5">{car.brand || 'Class Lux'}</p>
                  <p className="font-extrabold text-sm line-clamp-1">{car.name}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280] font-medium">Prix journalier</span>
                  <span className="text-[#111827] font-bold">{car.price} DH</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280] font-medium">Jours de location</span>
                  <span className="text-[#111827] font-bold">{days || 0}</span>
                </div>
                <div className="border-t border-dashed border-gray-100 pt-4 flex justify-between items-center mt-6">
                  <span className="text-[#111827] font-extrabold">Total à payer</span>
                  <span className="text-2xl font-black text-[#C4A47C]">{total} DH</span>
                </div>
              </div>

              <div className="bg-[#F8F5F0] rounded-2xl p-5 border border-[#E8DDD0] flex gap-3">
                <FaInfoCircle className="text-[#C4A47C] mt-1 shrink-0" size={16} />
                <p className="text-[11px] text-[#C4A47C] font-bold leading-relaxed uppercase tracking-wider">
                  Assurance premium et assistance incluses. Aucuns frais de dossier.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="absolute inset-0 bg-[#111827]/80 backdrop-blur-md"
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-xl max-h-[90vh] rounded-[32px] shadow-2xl p-8 overflow-y-auto scrollbar-hide"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F8F5F0] rounded-bl-[100px] -z-10"></div>
              
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-[#111827]">Vérification Finale</h2>
                <button onClick={() => setShowConfirmModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all cursor-pointer">×</button>
              </div>
              
              <div className="space-y-4 mb-8">
                {}
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#C4A47C] mb-1">{car.brand || 'Premium'}</p>
                     <h4 className="font-bold text-sm text-[#111827]">{car.name}</h4>
                   </div>
                   <img src={car.image} alt={car.name} className="w-20 h-12 object-cover rounded-lg shadow-sm" />
                </div>
                
                {}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-1">Prise en charge</p>
                    <p className="font-bold text-[#111827] text-sm">{new Date(formData.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] mb-1">Restitution</p>
                    <p className="font-bold text-[#111827] text-sm">{new Date(formData.endDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</p>
                  </div>
                </div>

                {}
                <div className="p-5 bg-[#111827] rounded-2xl text-white flex justify-between items-center shadow-lg shadow-black/8">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{days} jour{days > 1 ? 's' : ''} de location</p>
                    <p className="text-xs font-medium">Total TTC</p>
                  </div>
                  <p className="text-3xl font-black text-[#C4A47C] tracking-tighter">{total} DH</p>
                </div>
              </div>

              {}
              {payment === 'card' ? (
                <div>
                  <div className="flex items-center gap-2 mb-5 px-4 py-3 bg-[#F8F5F0] rounded-2xl border border-[#E8DDD0]">
                    <FaCreditCard className="text-[#C4A47C] shrink-0" size={14} />
                    <p className="text-xs text-[#C4A47C] font-bold">Paiement sécurisé — Entrez vos coordonnées bancaires</p>
                  </div>
                  {stripePromise && clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <StripePaymentForm onPaymentSuccess={onStripeSuccess} />
                    </Elements>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-sm text-red-500 font-bold mb-2">Configuration Stripe manquante</p>
                      <p className="text-xs text-[#6B7280]">Veuillez configurer REACT_APP_STRIPE_PUBLIC_KEY dans le fichier .env</p>
                    </div>
                  )}
                  {}
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-6 px-4 py-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <FaMoneyBillWave className="text-emerald-600 shrink-0" size={14} />
                    <p className="text-xs text-emerald-700 font-bold">Règlement en espèces à la remise des clés — aucun prépaiement</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setShowConfirmModal(false)}
                      className="py-5 bg-gray-50 text-[#111827] rounded-2xl font-black hover:bg-gray-100 transition-all border border-gray-100"
                    >
                      Retour
                    </button>
                    <button
                      onClick={finalConfirm}
                      className="py-5 bg-emerald-500 text-white rounded-2xl font-black hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
                    >
                      Confirmer & Réserver
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
