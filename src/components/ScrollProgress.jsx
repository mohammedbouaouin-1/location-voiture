import { useState, useEffect } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / totalHeight) * 100;
      setProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[100] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#A68B5B] via-[#C4A47C] to-[#D4B88C] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(196,164,124,0.4)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
