import { useEffect, useRef, useState } from 'react';
import { bibleData, rotatingVerses, type BibleVersion } from '@/data/bibleData';
import BibleReader from './BibleReader';

// Simple animation helper instead of anime.js for now
const animateElement = (element: HTMLElement, animations: any[], duration: number = 1000) => {
  element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
  animations.forEach(anim => {
    Object.keys(anim).forEach(prop => {
      if (prop === 'opacity') element.style.opacity = anim[prop];
      if (prop === 'transform') element.style.transform = anim[prop];
    });
  });
};

interface HeroSectionProps {
  selectedVersion: BibleVersion;
}

const HeroSection = ({ selectedVersion }: HeroSectionProps) => {
  const [currentVerse, setCurrentVerse] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const verseRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if it's the first load
    const isFirstLoad = !localStorage.getItem('bible-app-visited');
    
    if (isFirstLoad) {
      // Set John 6:29 as first verse
      setCurrentVerse(0);
      localStorage.setItem('bible-app-visited', 'true');
      localStorage.setItem('last-verse-time', Date.now().toString());
    } else {
      // Check hourly rotation
      const lastVerseTime = localStorage.getItem('last-verse-time');
      const currentTime = Date.now();
      const oneHour = 60 * 60 * 1000;

      if (!lastVerseTime || (currentTime - parseInt(lastVerseTime)) >= oneHour) {
        const hoursSinceStart = Math.floor((currentTime - parseInt(lastVerseTime || '0')) / oneHour);
        const newVerseIndex = (parseInt(localStorage.getItem('current-verse-index') || '0') + hoursSinceStart) % rotatingVerses.length;
        setCurrentVerse(newVerseIndex);
        localStorage.setItem('current-verse-index', newVerseIndex.toString());
        localStorage.setItem('last-verse-time', currentTime.toString());
      } else {
        setCurrentVerse(parseInt(localStorage.getItem('current-verse-index') || '0'));
      }
    }
  }, []);

  useEffect(() => {
    // Animate hero section on mount
    if (heroRef.current && verseRef.current) {
      setTimeout(() => {
        if (heroRef.current) {
          heroRef.current.style.opacity = '1';
          heroRef.current.style.transform = 'translateY(0)';
        }
      }, 100);

      setTimeout(() => {
        if (verseRef.current) {
          verseRef.current.style.opacity = '1';
          verseRef.current.style.transform = 'scale(1)';
          verseRef.current.classList.add('divine-glow');
        }
      }, 600);
    }

    // Create floating particles
    createParticles();
  }, [currentVerse]);

  const createParticles = () => {
    if (!particlesRef.current) return;

    // Clear existing particles
    particlesRef.current.innerHTML = '';

    // Create 12 particles
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = (4 + Math.random() * 4) + 's';
      particlesRef.current.appendChild(particle);
    }
  };

  const verse = rotatingVerses[currentVerse];
  const verseText = bibleData[selectedVersion]?.[verse.book]?.[verse.chapter]?.[verse.verse] || '';

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Animated background */}
      <div className="absolute inset-0 blessed-container">
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none" />
      </div>

      {/* Two Column Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-start">
        {/* Left Column - Bible Reader */}
        <div className="h-[600px] md:h-[700px]">
          <BibleReader selectedVersion={selectedVersion} />
        </div>

        {/* Right Column - Verse Display */}
        <div 
          ref={heroRef}
          className="flex flex-col justify-center opacity-0 transition-all duration-1000 translate-y-12"
        >
          {/* Divine title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 holy-aura text-center">
            Holy Bible
          </h1>

          {/* Verse container */}
          <div 
            ref={verseRef}
            className="rounded-2xl p-6 md:p-10 bg-card/10 backdrop-blur-sm border border-divine-glow/20 opacity-0 transition-all duration-800 scale-90"
          >
            {/* Verse text */}
            <blockquote className="text-lg md:text-2xl font-medium leading-relaxed verse-glow mb-6 text-center">
              "{verseText}"
            </blockquote>

            {/* Verse reference */}
            <cite className="text-base md:text-lg font-semibold text-divine-aura block mb-4 text-center">
              ({verse.book} {verse.chapter}:{verse.verse})
            </cite>

            {/* Blessing message */}
            <div className="text-xl md:text-2xl font-bold holy-aura text-center">
              😆 JESUS LOVES YOU
            </div>
          </div>

          {/* Version indicator */}
          <div className="mt-6 text-sm text-muted-foreground text-center">
            Reading from {selectedVersion}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-divine-glow/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-divine-aura/5 rounded-full blur-2xl animate-pulse delay-1000" />
    </div>
  );
};

export default HeroSection;
