import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Book, ChevronRight } from 'lucide-react';

interface BibleCatalogProps {
  onSelectBook?: (book: string) => void;
}

const oldTestament = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
  "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles",
  "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", 
  "Song of Songs", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel",
  "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk",
  "Zephaniah", "Haggai", "Zechariah", "Malachi"
];

const newTestament = [
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", 
  "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", 
  "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", 
  "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", 
  "1 John", "2 John", "3 John", "Jude", "Revelation"
];

const BibleCatalog = ({ onSelectBook }: BibleCatalogProps) => {
  const [selectedTestament, setSelectedTestament] = useState<'old' | 'new'>('old');

  const currentBooks = selectedTestament === 'old' ? oldTestament : newTestament;

  return (
    <div className="h-full flex flex-col bg-card/10 backdrop-blur-sm rounded-2xl border border-divine-glow/20 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold holy-aura flex items-center gap-2 mb-4">
          <Book className="w-8 h-8" />
          Bible Catalog
        </h2>
        
        {/* Testament Toggle */}
        <div className="flex gap-2">
          <Button
            onClick={() => setSelectedTestament('old')}
            variant={selectedTestament === 'old' ? 'default' : 'outline'}
            className={selectedTestament === 'old' 
              ? 'flex-1 bg-gradient-divine shadow-holy' 
              : 'flex-1 border-divine-glow/30'
            }
          >
            Old Testament
          </Button>
          <Button
            onClick={() => setSelectedTestament('new')}
            variant={selectedTestament === 'new' ? 'default' : 'outline'}
            className={selectedTestament === 'new' 
              ? 'flex-1 bg-gradient-divine shadow-holy' 
              : 'flex-1 border-divine-glow/30'
            }
          >
            New Testament
          </Button>
        </div>
      </div>

      {/* Books List */}
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-4">
          {currentBooks.map((book, index) => (
            <button
              key={book}
              onClick={() => onSelectBook?.(book)}
              className="group text-left px-4 py-3 rounded-lg bg-card/20 hover:bg-divine-glow/10 border border-divine-glow/10 hover:border-divine-glow/30 transition-all duration-300 hover:shadow-holy"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {selectedTestament === 'old' ? 'OT' : 'NT'} {index + 1}
                  </div>
                  <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {book}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-divine-glow opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Stats Footer */}
      <div className="mt-6 pt-4 border-t border-divine-glow/20">
        <div className="text-sm text-muted-foreground text-center">
          {selectedTestament === 'old' ? '39' : '27'} books in {selectedTestament === 'old' ? 'Old' : 'New'} Testament
        </div>
      </div>
    </div>
  );
};

export default BibleCatalog;
