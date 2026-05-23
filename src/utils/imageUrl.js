/**
 * Utilitaire pour résoudre les URLs d'images.
 * 
 * - Les voitures seedées utilisent /images/... → servies par React (public/)
 * - Les voitures uploadées en admin utilisent /uploads/... → servies par Express (port 5000)
 * 
 * Si l'URL commence par /uploads/, on la préfixe avec l'URL du backend.
 */
const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const resolveImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-car.jpg';
  
  let resolvedPath = imagePath;
  
  // Si le chemin contient "/images/", c'est une image statique du frontend.
  // On force le chargement relatif depuis Vercel (l'hébergeur frontend) au lieu de Railway !
  if (imagePath.includes('/images/')) {
    const parts = imagePath.split('/images/');
    resolvedPath = `/images/${parts[parts.length - 1]}`;
  }
  
  // Image uploadée via admin → servie par le backend Express
  else if (imagePath.startsWith('/uploads/')) {
    resolvedPath = `${BACKEND_URL}${imagePath}`;
  }
  
  // Déjà une URL complète (http/https)
  else if (imagePath.startsWith('http')) {
    resolvedPath = imagePath;
  }
  
  // Encoder les espaces pour assurer la compatibilité mobile (Safari/Chrome iOS)
  return encodeURI(resolvedPath);
};

export default resolveImageUrl;
