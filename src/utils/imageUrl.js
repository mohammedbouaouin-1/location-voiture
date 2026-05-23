
const BACKEND_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const resolveImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-car.jpg';
  
  let resolvedPath = imagePath;
  
  
  
  if (imagePath.includes('/images/')) {
    const parts = imagePath.split('/images/');
    resolvedPath = `/images/${parts[parts.length - 1]}`;
  }
  
  
  else if (imagePath.startsWith('/uploads/')) {
    resolvedPath = `${BACKEND_URL}${imagePath}`;
  }
  
  
  else if (imagePath.startsWith('http')) {
    resolvedPath = imagePath;
  }
  
  
  return encodeURI(resolvedPath);
};

export default resolveImageUrl;
