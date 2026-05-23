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
  
  // Déjà une URL complète (http/https)
  if (imagePath.startsWith('http')) return imagePath;
  
  // Image uploadée via admin → servie par le backend Express
  if (imagePath.startsWith('/uploads/')) {
    return `${BACKEND_URL}${imagePath}`;
  }
  
  // Image statique dans public/ de React (/images/...)
  return imagePath;
};

export default resolveImageUrl;
