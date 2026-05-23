const resolveImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;

 
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  
  return `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
};

module.exports = { resolveImageUrl };
