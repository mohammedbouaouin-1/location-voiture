import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCar, FaPaperPlane } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from 'react-hot-toast';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const quickLinks = [
    { path: "/", label: "Accueil" },
    { path: "/cars", label: "Voitures" },
    { path: "/WhyChooseUs", label: "Pourquoi nous choisir" },
    { path: "/login", label: "Connexion" }
  ];

  const contactInfo = [
    { icon: <FaPhone />, text: "+212 535 00 00 00", href: "tel:+212535000000" },
    { icon: <FaEnvelope />, text: "contact@locafes.ma", href: "mailto:contact@locafes.ma" },
    { icon: <FaMapMarkerAlt />, text: "Avenue Hassan II, Fès, Maroc", href: "#" }
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, url: "#", bg: "hover:bg-[#111827]", label: "Facebook" },
    { icon: <FaInstagram />, url: "#", bg: "hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-red-500 hover:to-purple-600", label: "Instagram" },
    { icon: <FaTwitter />, url: "#", bg: "hover:bg-sky-400", label: "Twitter" },
    { icon: <FaLinkedinIn />, url: "#", bg: "hover:bg-[#0D1321]", label: "LinkedIn" }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast.success("Merci ! Vous êtes inscrit à notre newsletter 🎉");
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#111827] text-gray-400 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold">
              <div className="bg-[#111827] p-2 rounded-xl shadow-lg shadow-black/10">
                <FaCar className="text-white" size={24} />
              </div>
              <span className="text-white">LOCA<span className="text-[#C4A47C]">FÈS</span></span>
            </Link>
            <p className="leading-relaxed">
              L'excellence de la location automobile à Fès. Performance, confort et service premium pour tous vos déplacements.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, idx) => (
                <a 
                  key={idx}
                  href={social.url} 
                  className={`w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-white transition-all ${social.bg} hover:scale-110`}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-4">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link 
                    to={link.path} 
                    className="hover:text-[#C4A47C] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-[#C4A47C] transition-all"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-5">
              {contactInfo.map((info, idx) => (
                <li key={idx}>
                  <a 
                    href={info.href}
                    className="flex items-start gap-3 hover:text-white transition-colors"
                  >
                    <span className="text-[#C4A47C] mt-1">{info.icon}</span>
                    <span>{info.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Newsletter</h4>
            <p className="text-sm mb-4">Inscrivez-vous pour recevoir nos meilleures offres et les dernières nouveautés.</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="Votre email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 pr-12 bg-gray-800/80 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#C4A47C] focus:ring-1 focus:ring-[#C4A47C]/20 transition-all"
                  required
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#111827] text-white rounded-lg flex items-center justify-center hover:bg-[#0D1321] transition-all active:scale-90"
                  aria-label="S'abonner"
                >
                  <FaPaperPlane size={14} />
                </button>
              </div>
              <p className="text-[10px] text-gray-600 font-medium">Pas de spam. Désabonnement à tout moment.</p>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium">
          <p>© {currentYear} LocaFès. Tous droits réservés.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-[#C4A47C] transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-[#C4A47C] transition-colors">Conditions</a>
            <a href="#" className="hover:text-[#C4A47C] transition-colors">Mentions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
