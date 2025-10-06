import { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Book, ChevronRight, ChevronLeft, Loader2, Bookmark } from 'lucide-react';
import { bookChapterCounts, fetchChapter, type BibleChapter } from '@/services/bibleApi';
import { useToast } from '@/hooks/use-toast';
import { useBookmarks } from '@/hooks/useBookmarks';
import { type BibleVersion } from '@/data/bibleData';

interface BibleReaderProps {
  onSelectBook?: (book: string) => void;
  selectedVersion?: BibleVersion;
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

type ViewMode = 'testament' | 'books' | 'chapters' | 'verses';

const BibleReader = ({ onSelectBook, selectedVersion = 'KJV' }: BibleReaderProps) => {
  const [selectedTestament, setSelectedTestament] = useState<'old' | 'new'>('old');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [chapterData, setChapterData] = useState<BibleChapter | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('testament');
  const [previousVersion, setPreviousVersion] = useState<BibleVersion>(selectedVersion);
  const { toast } = useToast();
  const { addBookmark } = useBookmarks();

  // Reload chapter when version changes
  useEffect(() => {
    if (previousVersion !== selectedVersion && selectedBook && selectedChapter) {
      setPreviousVersion(selectedVersion);
      handleChapterSelect(selectedChapter);
    }
  }, [selectedVersion]);

  const currentBooks = selectedTestament === 'old' ? oldTestament : newTestament;

  const handleBookSelect = (book: string) => {
    setSelectedBook(book);
    setViewMode('chapters');
    onSelectBook?.(book);
  };

  const handleChapterSelect = async (chapter: number) => {
    if (!selectedBook) return;
    
    setLoading(true);
    setSelectedChapter(chapter);
    
    try {
      const versionMap: Record<string, string> = {
        'KJV': 'kjv',
        'NKJV': 'kjv',
        'MEV': 'kjv'
      };
      const apiVersion = versionMap[selectedVersion] || 'kjv';
      const data = await fetchChapter(selectedBook, chapter, apiVersion);
      setChapterData(data);
      setViewMode('verses');
    } catch (error) {
      toast({
        title: "Error loading chapter",
        description: "Failed to load Bible chapter. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkVerse = (verse: { verse: number; text: string }) => {
    if (!selectedBook || !selectedChapter) return;

    addBookmark({
      title: `${selectedBook} ${selectedChapter}:${verse.verse}`,
      version: selectedVersion,
      book: selectedBook,
      chapter: String(selectedChapter),
      verses: [String(verse.verse)]
    });
  };

  const handleBack = () => {
    if (viewMode === 'verses') {
      setViewMode('chapters');
      setChapterData(null);
      setSelectedChapter(null);
    } else if (viewMode === 'chapters') {
      setViewMode('books');
      setSelectedBook(null);
    } else if (viewMode === 'books') {
      setViewMode('testament');
    }
  };

  const renderTestamentSelection = () => (
    <>
      <div className="flex gap-2 mb-6">
        <Button
          onClick={() => {
            setSelectedTestament('old');
            setViewMode('books');
          }}
          variant="outline"
          className="flex-1 h-20 border-divine-glow/30 hover:bg-divine-glow/10"
        >
          <div className="text-center">
            <div className="font-bold text-lg">Old Testament</div>
            <div className="text-xs text-muted-foreground">39 Books</div>
          </div>
        </Button>
        <Button
          onClick={() => {
            setSelectedTestament('new');
            setViewMode('books');
          }}
          variant="outline"
          className="flex-1 h-20 border-divine-glow/30 hover:bg-divine-glow/10"
        >
          <div className="text-center">
            <div className="font-bold text-lg">New Testament</div>
            <div className="text-xs text-muted-foreground">27 Books</div>
          </div>
        </Button>
      </div>
    </>
  );

  const renderBooksList = () => (
    <>
      <div className="mb-4 text-center">
        <h3 className="text-xl font-bold text-primary">
          {selectedTestament === 'old' ? 'Old Testament' : 'New Testament'}
        </h3>
        <p className="text-sm text-muted-foreground">Select a book</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-4">
          {currentBooks.map((book, index) => (
            <button
              key={book}
              onClick={() => handleBookSelect(book)}
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
                  <div className="text-xs text-muted-foreground mt-1">
                    {bookChapterCounts[book]} chapters
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-divine-glow opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </>
  );

  const renderChaptersList = () => {
    if (!selectedBook) return null;
    const chapterCount = bookChapterCounts[selectedBook] || 0;

    return (
      <>
        <div className="mb-4 text-center">
          <h3 className="text-xl font-bold text-primary">{selectedBook}</h3>
          <p className="text-sm text-muted-foreground">Select a chapter</p>
        </div>
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pr-4">
            {Array.from({ length: chapterCount }, (_, i) => i + 1).map((chapter) => (
              <button
                key={chapter}
                onClick={() => handleChapterSelect(chapter)}
                className="aspect-square rounded-lg bg-card/20 hover:bg-divine-glow/10 border border-divine-glow/10 hover:border-divine-glow/30 transition-all duration-300 hover:shadow-holy flex items-center justify-center font-bold text-lg hover:text-primary"
              >
                {chapter}
              </button>
            ))}
          </div>
        </ScrollArea>
      </>
    );
  };

  const renderVerses = () => {
    if (!chapterData || !selectedBook || !selectedChapter) return null;

    return (
      <>
        <div className="mb-4 text-center">
          <h3 className="text-xl font-bold text-primary">
            {selectedBook} {selectedChapter}
          </h3>
          <p className="text-sm text-muted-foreground">
            {chapterData.verses.length} verses
          </p>
        </div>
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollArea className="flex-1">
            <div className="space-y-4 pr-4">
              {chapterData.verses.map((verse) => {
                // Simple detection for Jesus's words (quotes)
                const hasQuotes = verse.text.includes('"') || verse.text.includes('"') || verse.text.includes('"');
                
                return (
                  <div
                    key={verse.verse}
                    className="group relative p-4 rounded-lg bg-card/40 hover:bg-card/60 transition-all duration-300 border border-divine-glow/10 hover:border-divine-glow/30"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-divine-glow/20 text-divine-glow font-semibold text-sm">
                        {verse.verse}
                      </span>
                      <p className={`flex-1 leading-relaxed ${hasQuotes ? 'font-serif text-lg' : 'text-foreground/90'}`}>
                        {verse.text.split(/("[^"]*"|"[^"]*"|"[^"]*")/).map((part, i) => {
                          if (part.startsWith('"') || part.startsWith('"') || part.startsWith('"')) {
                            // Words of Jesus - styled elegantly in red letter edition style
                            return (
                              <span 
                                key={i}
                                className="text-red-500 dark:text-red-400 font-semibold italic relative inline-block"
                                style={{ 
                                  textShadow: '0 0 20px rgba(239, 68, 68, 0.3)',
                                }}
                              >
                                {part}
                              </span>
                            );
                          }
                          return <span key={i}>{part}</span>;
                        })}
                      </p>
                      <Button
                        onClick={() => handleBookmarkVerse(verse)}
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </>
    );
  };

  return (
    <div className="h-full flex flex-col bg-card/10 backdrop-blur-sm rounded-2xl border border-divine-glow/20 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {viewMode !== 'testament' && (
              <Button
                onClick={handleBack}
                variant="outline"
                size="sm"
                className="border-divine-glow/30"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            )}
            <h2 className="text-3xl font-bold holy-aura flex items-center gap-2">
              <Book className="w-8 h-8" />
              Bible
            </h2>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'testament' && renderTestamentSelection()}
      {viewMode === 'books' && renderBooksList()}
      {viewMode === 'chapters' && renderChaptersList()}
      {viewMode === 'verses' && renderVerses()}
    </div>
  );
};

export default BibleReader;
