import { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import BibleVersionSelector from '@/components/BibleVersionSelector';
import BookmarkManager from '@/components/BookmarkManager';
import Navigation from '@/components/Navigation';
import { type BibleVersion } from '@/data/bibleData';

const Index = () => {
  const [selectedVersion, setSelectedVersion] = useState<BibleVersion>('KJV');
  const [currentView, setCurrentView] = useState<'home' | 'bookmarks'>('home');

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <BibleVersionSelector 
        selectedVersion={selectedVersion} 
        onVersionChange={setSelectedVersion}
      />
      
      {currentView === 'home' ? (
        <HeroSection selectedVersion={selectedVersion} />
      ) : (
        <BookmarkManager selectedVersion={selectedVersion} />
      )}
    </div>
  );
};

export default Index;
