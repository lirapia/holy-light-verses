import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Home, BookOpen, Menu, X } from 'lucide-react';

interface NavigationProps {
  currentView: 'home' | 'bookmarks';
  onViewChange: (view: 'home' | 'bookmarks') => void;
}

const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'bookmarks' as const, label: 'Bookmarks', icon: BookOpen },
  ];

  return (
    <nav className="fixed top-6 left-6 z-50">
      {/* Mobile Menu Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="md:hidden bg-card/80 backdrop-blur-sm border-divine-glow/30"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>

      {/* Navigation Menu */}
      <div className={`${
        isOpen ? 'flex' : 'hidden'
      } md:flex flex-col gap-2 mt-2 md:mt-0 p-2 md:p-0 bg-card/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none rounded-lg border md:border-0 border-divine-glow/30`}>
        {navItems.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            onClick={() => {
              onViewChange(id);
              setIsOpen(false);
            }}
            variant={currentView === id ? "default" : "outline"}
            size="sm"
            className={`justify-start w-32 ${
              currentView === id
                ? 'bg-gradient-divine shadow-holy'
                : 'bg-card/60 backdrop-blur-sm border-divine-glow/30 hover:bg-divine-glow/10'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;